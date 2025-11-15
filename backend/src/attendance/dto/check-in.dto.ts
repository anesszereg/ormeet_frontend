import { IsString, IsEnum, IsOptional, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CheckInMethod } from '../../entities/attendance.entity';

export class CheckInDto {
  @ApiPropertyOptional({
    description: 'Ticket code extracted from QR code scan or entered manually. This is the unique 12-character code printed on each ticket. Either ticketCode or ticketId must be provided.',
    example: 'A3K9L2M4P7Q1',
    minLength: 12,
    maxLength: 12,
  })
  @IsString()
  @IsOptional()
  ticketCode?: string;

  @ApiPropertyOptional({
    description: 'UUID of the ticket. Either ticketCode or ticketId must be provided. The event will be automatically determined from the ticket.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  ticketId?: string;

  @ApiPropertyOptional({
    description: 'UUID of the event where check-in is taking place. Optional - will be automatically determined from the ticket if not provided.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  eventId?: string;

  @ApiPropertyOptional({
    description: 'Method used for check-in: QR code scan (recommended), NFC tap, or manual entry',
    enum: CheckInMethod,
    default: CheckInMethod.QR,
    example: 'qr',
  })
  @IsEnum(CheckInMethod)
  @IsOptional()
  method?: CheckInMethod;

  @ApiPropertyOptional({
    description: 'UUID of the staff member or organizer performing the check-in. Used for audit trail.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  @IsOptional()
  checkedInBy?: string;

  @ApiPropertyOptional({
    description: 'Additional contextual information about the check-in (entrance location, scanner device, notes, etc.)',
    example: { 
      location: 'Main Entrance', 
      device: 'Scanner #1',
      gate: 'A',
      notes: 'VIP fast track'
    },
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
