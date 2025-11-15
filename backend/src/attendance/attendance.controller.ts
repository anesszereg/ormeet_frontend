import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, UpdateAttendanceDto, CheckInDto } from './dto';
import { CheckInResponseDto, ValidateTicketResponseDto } from './dto/check-in-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '🎫 Check-in attendee by ticket',
    description: `
**Check-in attendee using ticket code or ticket ID**

This endpoint validates the ticket and creates an attendance record if valid.

**Input Options:**
- **ticketCode** - 12-character code from QR scan (e.g., "A3K9L2M4P7Q1")
- **ticketId** - UUID of the ticket (e.g., from database)
- **eventId** - Optional, automatically determined from ticket if not provided

**Note:** You only need to provide either \`ticketCode\` OR \`ticketId\`. The event is automatically determined from the ticket, so \`eventId\` is optional.

**Validation Checks:**
- ✅ Ticket exists (by code or ID)
- ✅ Ticket is not cancelled
- ✅ Ticket not already checked in
- ✅ Event exists
- ✅ Event matches ticket (if eventId provided)

**Success Response:**
Returns attendee information and creates attendance record.

**Error Responses:**
- Invalid ticket code/ID
- Already checked in (with timestamp)
- Wrong event (if eventId provided)
- Ticket cancelled
- Event not found

**Use Cases:**
- QR code scanner at entrance (use ticketCode)
- Mobile check-in app (use ticketCode)
- Manual ticket verification (use ticketCode)
- Database-driven check-in (use ticketId)
- NFC tap check-in (use ticketId)
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Check-in processed (success or failure with reason)',
    type: CheckInResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Valid JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Organizer or Admin role required' })
  checkIn(@Body() checkInDto: CheckInDto): Promise<CheckInResponseDto> {
    return this.attendanceService.checkIn(checkInDto);
  }

  @Get('validate/:ticketCode/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '🔍 Validate ticket (preview mode)',
    description: `
**Preview ticket information without actually checking in**

This endpoint allows you to verify ticket validity and view attendee details before performing the actual check-in.

**Validation Checks:**
- ✅ Ticket code exists
- ✅ Ticket belongs to this event
- ✅ Ticket is not cancelled
- ✅ Ticket not already used

**Returns:**
- Ticket validity status
- Attendee name
- Ticket type
- Seat information (if assigned)
- Order reference

**Use Cases:**
- Preview attendee info before check-in
- Verify ticket authenticity
- Check seat assignments
- Validate VIP/special access
- Staff verification at entrance
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ticket validation result',
    type: ValidateTicketResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Valid JWT token required' })
  @ApiResponse({ status: 403, description: 'Forbidden - Organizer or Admin role required' })
  validateTicket(
    @Param('ticketCode') ticketCode: string,
    @Param('eventId') eventId: string,
  ): Promise<ValidateTicketResponseDto> {
    return this.attendanceService.validateTicket(ticketCode, eventId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create attendance record manually (Organizer/Admin only)' })
  @ApiResponse({ status: 201, description: 'Attendee checked in successfully' })
  @ApiResponse({ status: 400, description: 'Ticket already checked in or invalid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiQuery({ name: 'eventId', required: false })
  @ApiQuery({ name: 'ticketId', required: false })
  @ApiResponse({ status: 200, description: 'Return all attendance records' })
  findAll(
    @Query('eventId') eventId?: string,
    @Query('ticketId') ticketId?: string,
  ) {
    return this.attendanceService.findAll({ eventId, ticketId });
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '📋 Get all check-ins for an event',
    description: `
**Retrieve complete list of attendees who have checked in**

Returns all attendance records for a specific event, including:
- Check-in timestamps
- Attendee information
- Ticket details
- Check-in method used

**Sorted by:** Most recent check-ins first

**Use Cases:**
- Real-time attendance dashboard
- Export attendee list
- Monitor check-in progress
- Verify specific attendee presence
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all check-ins for the event',
    schema: {
      type: 'array',
      example: [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        ticketId: '123e4567-e89b-12d3-a456-426614174000',
        eventId: '123e4567-e89b-12d3-a456-426614174000',
        checkedInAt: '2025-06-15T09:30:00Z',
        method: 'qr',
        ticket: {
          code: 'A3K9L2M4P7Q1',
          owner: {
            name: 'John Doe',
            email: 'john@example.com'
          }
        }
      }]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByEvent(@Param('eventId') eventId: string) {
    return this.attendanceService.findByEvent(eventId);
  }

  @Get('event/:eventId/count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '🔢 Get total check-in count',
    description: `
**Get the total number of attendees who have checked in**

Returns a simple count of all check-ins for the event.

**Use Cases:**
- Display on dashboard
- Monitor attendance rate
- Real-time counter
- Capacity tracking
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Total number of check-ins',
    schema: {
      type: 'number',
      example: 245
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getEventAttendanceCount(@Param('eventId') eventId: string) {
    return this.attendanceService.getEventAttendanceCount(eventId);
  }

  @Get('event/:eventId/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: '📊 Get attendance statistics',
    description: `
**Get detailed attendance analytics for an event**

Returns statistical data about check-ins including:
- Total check-ins
- Average check-in time
- Check-in rate
- Peak hours

**Use Cases:**
- Event analytics dashboard
- Performance reports
- Attendance trends
- Capacity planning
    `
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Attendance statistics',
    schema: {
      example: {
        totalCheckIns: 245,
        averageCheckInTime: 'N/A'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  getEventAttendanceStats(@Param('eventId') eventId: string) {
    return this.attendanceService.getEventAttendanceStats(eventId);
  }

  @Get('ticket/:ticketId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get attendance records for a ticket' })
  @ApiResponse({ status: 200, description: 'Return ticket attendance' })
  findByTicket(@Param('ticketId') ticketId: string) {
    return this.attendanceService.findByTicket(ticketId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get attendance record by ID' })
  @ApiResponse({ status: 200, description: 'Return attendance details' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ORGANIZER, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update attendance record' })
  @ApiResponse({ status: 200, description: 'Attendance updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete attendance record (Admin only)' })
  @ApiResponse({ status: 200, description: 'Attendance deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Attendance not found' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
