import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendWelcomeEmail(email: string, name: string, verificationToken: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    try {
      this.logger.log(`📧 Sending welcome email to: ${email}`);
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Ormeet - Verify Your Email',
        template: 'welcome',
        context: {
          name,
          verificationUrl,
          appName: 'Ormeet',
        },
      });

      this.logger.log(`✅ Welcome email sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send welcome email to: ${email}`, error.stack);
      throw error;
    }
  }

  async sendEmailVerification(email: string, name: string, verificationToken: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    try {
      this.logger.log(`📧 Sending verification email to: ${email}`);
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verify Your Email - Ormeet',
        template: 'verify-email',
        context: {
          name,
          verificationUrl,
          appName: 'Ormeet',
        },
      });

      this.logger.log(`✅ Verification email sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send verification email to: ${email}`, error.stack);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    try {
      this.logger.log(`📧 Sending password reset email to: ${email}`);
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password - Ormeet',
        template: 'reset-password',
        context: {
          name,
          resetUrl,
          appName: 'Ormeet',
          expirationTime: '1 hour',
        },
      });

      this.logger.log(`✅ Password reset email sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send password reset email to: ${email}`, error.stack);
      throw error;
    }
  }

  async sendPasswordChangedEmail(email: string, name: string) {
    try {
      this.logger.log(`📧 Sending password changed confirmation to: ${email}`);
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Changed Successfully - Ormeet',
        template: 'password-changed',
        context: {
          name,
          appName: 'Ormeet',
          supportEmail: this.configService.get('EMAIL_USER'),
        },
      });

      this.logger.log(`✅ Password changed email sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send password changed email to: ${email}`, error.stack);
      throw error;
    }
  }

  async sendLoginNotification(email: string, name: string, ipAddress: string, userAgent: string) {
    try {
      this.logger.log(`📧 Sending login notification to: ${email} (IP: ${ipAddress})`);
      
      await this.mailerService.sendMail({
        to: email,
        subject: 'New Login to Your Account - Ormeet',
        template: 'login-notification',
        context: {
          name,
          ipAddress,
          userAgent,
          loginTime: new Date().toLocaleString(),
          appName: 'Ormeet',
        },
      });

      this.logger.log(`✅ Login notification sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send login notification to: ${email}`, error.stack);
      throw error;
    }
  }

  async sendVerificationCode(email: string, code: string, purpose: string) {
    try {
      this.logger.log(`📧 Sending verification code to: ${email} (Purpose: ${purpose})`);

      const subjectMap = {
        login: 'Your Login Code - Ormeet',
        registration: 'Complete Your Registration - Ormeet',
        email_verification: 'Verify Your Email - Ormeet',
        phone_verification: 'Verify Your Phone - Ormeet',
        password_reset: 'Reset Your Password - Ormeet',
      };

      const subject = subjectMap[purpose] || 'Your Verification Code - Ormeet';
      
      await this.mailerService.sendMail({
        to: email,
        subject,
        template: 'verification-code',
        context: {
          code,
          purpose,
          expiresIn: '10 minutes',
          appName: 'Ormeet',
        },
      });

      this.logger.log(`✅ Verification code sent successfully to: ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send verification code to: ${email}`, error.stack);
      throw error;
    }
  }

  async sendOrderConfirmation(orderData: {
    email: string;
    customerName: string;
    orderId: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    tickets: Array<{
      id: string;
      code: string;
      ticketType: string;
      price: number;
      qrCodeBuffer: Buffer;
    }>;
    subtotal: number;
    discount: number;
    serviceFee: number;
    processingFee: number;
    total: number;
    currency: string;
    pdfTicket?: Buffer;
  }) {
    try {
      this.logger.log(`📧 Sending order confirmation to: ${orderData.email}`);

      // Prepare attachments for QR codes
      const attachments = orderData.tickets.map((ticket, index) => ({
        filename: `qr-${ticket.code}.png`,
        content: ticket.qrCodeBuffer,
        cid: `qr-${ticket.code}`, // Content ID for embedding in HTML
      }));

      // Add PDF ticket as attachment if provided
      if (orderData.pdfTicket) {
        attachments.push({
          filename: `Tickets-${orderData.orderId}.pdf`,
          content: orderData.pdfTicket,
          contentType: 'application/pdf',
        } as any);
      }

      // Prepare tickets with CID references for template
      const ticketsForTemplate = orderData.tickets.map((ticket) => ({
        id: ticket.id,
        code: ticket.code,
        ticketType: ticket.ticketType,
        price: ticket.price,
        qrCodeCid: `qr-${ticket.code}`, // CID reference
      }));

      await this.mailerService.sendMail({
        to: orderData.email,
        subject: `Order Confirmation - ${orderData.eventTitle}`,
        template: 'order-confirmation',
        context: {
          customerName: orderData.customerName,
          orderId: orderData.orderId,
          eventTitle: orderData.eventTitle,
          eventDate: orderData.eventDate,
          eventLocation: orderData.eventLocation,
          tickets: ticketsForTemplate,
          ticketCount: orderData.tickets.length,
          subtotal: orderData.subtotal.toFixed(2),
          discount: orderData.discount.toFixed(2),
          serviceFee: orderData.serviceFee.toFixed(2),
          processingFee: orderData.processingFee.toFixed(2),
          total: orderData.total.toFixed(2),
          currency: orderData.currency,
          appName: 'Ormeet',
          supportEmail: this.configService.get('SUPPORT_EMAIL') || 'support@ormeet.com',
        },
        attachments,
      });

      this.logger.log(`✅ Order confirmation sent successfully to: ${orderData.email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send order confirmation to: ${orderData.email}`, error.stack);
      // Don't throw - we don't want to fail the order if email fails
      console.error('Email error:', error);
    }
  }

  async sendCheckInConfirmation(checkInData: {
    email: string;
    attendeeName: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    ticketCode: string;
    ticketType: string;
    checkInTime: string;
    checkInMethod: string;
    seatInfo?: string;
  }) {
    try {
      this.logger.log(`📧 Sending check-in confirmation to: ${checkInData.email}`);

      await this.mailerService.sendMail({
        to: checkInData.email,
        subject: `✓ Check-In Confirmed - ${checkInData.eventTitle}`,
        template: 'check-in-confirmation',
        context: {
          attendeeName: checkInData.attendeeName,
          eventTitle: checkInData.eventTitle,
          eventDate: checkInData.eventDate,
          eventLocation: checkInData.eventLocation,
          ticketCode: checkInData.ticketCode,
          ticketType: checkInData.ticketType,
          checkInTime: checkInData.checkInTime,
          checkInMethod: checkInData.checkInMethod.toUpperCase(),
          seatInfo: checkInData.seatInfo,
          appName: 'Ormeet',
          supportEmail: this.configService.get('SUPPORT_EMAIL') || 'support@ormeet.com',
        },
      });

      this.logger.log(`✅ Check-in confirmation sent successfully to: ${checkInData.email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send check-in confirmation to: ${checkInData.email}`, error.stack);
      // Don't throw - we don't want to fail the check-in if email fails
      console.error('Email error:', error);
    }
  }
}
