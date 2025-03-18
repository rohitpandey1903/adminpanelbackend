import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true, unique: true })
  eid: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  department: string;

  @Prop({required : true})
  position: string;

  @Prop({default : 0})
  monthlyPay: number;

  // Afterwards all the properties are mutable via endpoints not required true then
  @Prop({
    type: {
      taken: { type: Number, default: 0 },
      remaining: { type: Number, default: 12 }
    },
    default: { taken: 0, remaining: 12 }
  })
  leaves: {
    taken: number;
    remaining: number;
  };

  @Prop({ enum : ['Regular', 'Rotating', 'Flexible'], default : 'Regular'})
  shift : string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);