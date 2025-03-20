import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingService.create(createBookingDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Booking created successfully',
      data: booking
    };
  }

  @Get()
  async findAll() {
    const bookings = await this.bookingService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Bookings retrieved successfully',
      data: bookings,
      count: bookings.length
    };
  }
}
