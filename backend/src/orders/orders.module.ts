import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PdfTicketService } from './pdf-ticket.service';
import { Order, TicketType, Promotion, Ticket, Event } from '../entities';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, TicketType, Promotion, Ticket, Event]),
    EmailModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, PdfTicketService],
  exports: [OrdersService],
})
export class OrdersModule {}
