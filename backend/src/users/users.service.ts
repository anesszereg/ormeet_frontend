import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities';
import {
  UpdateProfileDto,
  UpdateEmailDto,
  UpdatePhoneDto,
  ChangePasswordDto,
  UpdateLocationDto,
} from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;
    if (dto.locale !== undefined) user.locale = dto.locale;

    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }

  async updateEmail(userId: string, dto: UpdateEmailDto): Promise<User> {
    const user = await this.findById(userId);

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Check if email is already taken
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.newEmail },
    });
    if (existingUser && existingUser.id !== userId) {
      throw new BadRequestException('Email is already in use');
    }

    user.email = dto.newEmail;
    user.emailVerified = false; // Require re-verification

    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }

  async updatePhone(userId: string, dto: UpdatePhoneDto): Promise<User> {
    const user = await this.findById(userId);

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    user.phone = dto.newPhone;
    user.phoneVerified = false; // Require re-verification

    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.findById(userId);

    // Verify current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.userRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async updateLocation(userId: string, dto: UpdateLocationDto): Promise<User> {
    const user = await this.findById(userId);

    // Store location in metadata
    const metadata = user.metadata || {};
    metadata.location = {
      country: dto.country,
      city: dto.city,
      address: dto.address,
    };
    user.metadata = metadata;

    await this.userRepository.save(user);
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User): User {
    const sanitized = { ...user };
    delete (sanitized as any).passwordHash;
    delete (sanitized as any).emailVerificationToken;
    delete (sanitized as any).passwordResetToken;
    delete (sanitized as any).passwordResetExpires;
    return sanitized;
  }
}
