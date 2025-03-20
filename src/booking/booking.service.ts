import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from "./entities/booking.entity"
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    try {
      // Check if room exists and is available
      // const room = await this.roomModel.findOne({ 
      //   roomNumber: createBookingDto.roomNumber,
      //   status: 'Available'
      // });

      // if (!room) {
      //   throw new BadRequestException(`Room ${createBookingDto.roomNumber} is not available for booking`);
      // }

      // Check if there are overlapping bookings for this room
      const overlappingBookings = await this.bookingModel.findOne({
        roomNumber: createBookingDto.roomNumber,
        status: { $nin: ['Checked Out', 'Cancelled'] },
        $or: [
          {
            checkIn: { $lte: new Date(createBookingDto.checkIn) },
            checkOut: { $gt: new Date(createBookingDto.checkIn) }
          },
          {
            checkIn: { $lt: new Date(createBookingDto.checkOut) },
            checkOut: { $gte: new Date(createBookingDto.checkOut) }
          },
          {
            checkIn: { $gte: new Date(createBookingDto.checkIn) },
            checkOut: { $lte: new Date(createBookingDto.checkOut) }
          }
        ]
      });

      if (overlappingBookings) {
        throw new BadRequestException(`Room ${createBookingDto.roomNumber} is already booked for the selected dates`);
      }

      // Create the booking
      const newBooking = new this.bookingModel(createBookingDto);
      const savedBooking = await newBooking.save();

      // Update room status if booking is confirmed
      // if (createBookingDto.status === 'Confirmed' || createBookingDto.status === 'Checked In') {
      //   await this.roomModel.findOneAndUpdate(
      //     { roomNumber: createBookingDto.roomNumber },
      //     { status: 'Occupied' }
      //   );
      // } else if (createBookingDto.status === 'Reserved') {
      //   await this.roomModel.findOneAndUpdate(
      //     { roomNumber: createBookingDto.roomNumber },
      //     { status: 'Reserved' }
      //   );
      // }

      return savedBooking;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to create booking: ${error.message}`);
    }
  }

  async findAll(): Promise<Booking[]> {
    try {
      // Get all bookings with applied filters
      const bookings = await this.bookingModel.find().exec();
      return bookings;
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve bookings: ${error.message}`);
    }
  }
}