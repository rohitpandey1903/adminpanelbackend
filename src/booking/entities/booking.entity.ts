import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema()
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ enum: ['Passport', 'Driver\'s License', 'Aadhar Card', 'Voter ID'], default: 'Passport' })
  idProofType: string;

  @Prop()
  idProofNumber: string;
}

@Schema()
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ['Paid', 'Pending', 'Partial', 'Refunded'], default: 'Pending' })
  status: string;

  @Prop({ enum: ['Credit Card', 'Cash', 'Bank Transfer', 'PayPal', 'To Be Paid'], default: 'To Be Paid' })
  method: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  transactionId: string;
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true })
  roomNumber: string;

  @Prop({ required: true })
  roomType: string;

  @Prop({ required: true, type: Customer })
  customer: Customer;

  @Prop({ required: true, type: Date })
  checkIn: Date;

  @Prop({ required: true, type: Date })
  checkOut: Date;

  @Prop({ required: true, min: 1 })
  nights: number;

  @Prop({ required: true, min: 1, max: 4, default: 1 })
  guests: number;

  @Prop({ required: true, type: Payment })
  payment: Payment;

  @Prop({ type: [String], default: [] })
  addOns: string[];

  @Prop({ 
    enum: ['Reserved', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'], 
    default: 'Reserved'
  })
  status: string;

  @Prop()
  specialRequests: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Employee' })
  assignedEmployee: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room' })
  room: MongooseSchema.Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
export const PaymentSchema = SchemaFactory.createForClass(Payment);
export const BookingSchema = SchemaFactory.createForClass(Booking);