import { CreateCustomerDto } from "./create-customer.dto";
import { CreatePaymentDto } from "./create-payment.dto";

export class CreateBookingDto {
    roomNumber: string;
    roomType: string;
    customer: CreateCustomerDto;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
    payment: CreatePaymentDto;
    addOns: string[];
    status: 'Reserved' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';
    specialRequests?: string;
  }