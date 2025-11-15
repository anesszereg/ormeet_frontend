import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TicketInfoDto {
  @ApiProperty({
    description: 'Type of ticket (e.g., General Admission, VIP, Early Bird)',
    example: 'General Admission',
  })
  ticketType: string;

  @ApiProperty({
    description: 'Name of the ticket owner/attendee',
    example: 'John Doe',
  })
  ownerName: string;

  @ApiProperty({
    description: 'Title of the event',
    example: 'Tech Conference 2025',
  })
  eventTitle: string;

  @ApiPropertyOptional({
    description: 'Seat information if assigned seating',
    example: 'Section A - Row 5 - Seat 12',
    nullable: true,
  })
  seatInfo?: string;

  @ApiPropertyOptional({
    description: 'Order reference number',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  orderNumber?: string;
}

export class CheckInResponseDto {
  @ApiProperty({
    description: 'Whether the check-in was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable message about the check-in result',
    examples: {
      success: 'Check-in successful',
      duplicate: 'Already checked in at 6/15/2025, 9:30:00 AM',
      invalid: 'Invalid ticket code',
      cancelled: 'This ticket has been cancelled',
      wrongEvent: 'This ticket is not valid for this event',
    },
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Attendance record created (only present on successful check-in)',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      ticketId: '123e4567-e89b-12d3-a456-426614174000',
      eventId: '123e4567-e89b-12d3-a456-426614174000',
      checkedInAt: '2025-06-15T09:30:00Z',
      method: 'qr',
      checkedInBy: '123e4567-e89b-12d3-a456-426614174000',
    },
  })
  attendance?: any;

  @ApiPropertyOptional({
    description: 'Information about the ticket and attendee (only present on successful check-in)',
    type: TicketInfoDto,
  })
  ticketInfo?: TicketInfoDto;
}

export class ValidateTicketResponseDto {
  @ApiProperty({
    description: 'Whether the ticket is valid for check-in',
    example: true,
  })
  valid: boolean;

  @ApiProperty({
    description: 'Human-readable validation message',
    examples: {
      valid: 'Ticket is valid',
      invalid: 'Invalid ticket code',
      used: 'Already checked in at 6/15/2025, 9:30:00 AM',
      cancelled: 'Ticket has been cancelled',
      wrongEvent: 'Ticket not valid for this event',
    },
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Detailed ticket information (only present if ticket exists)',
    type: TicketInfoDto,
  })
  ticketInfo?: TicketInfoDto;
}
