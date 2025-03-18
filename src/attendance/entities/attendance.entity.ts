import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Employee } from "src/employee/entities/employee.entity";

export type AttendanceDocument = Attendance & Document;

@Schema()
export class Attendance {
    @Prop({type :MongooseSchema.Types.ObjectId, ref : 'Employee', required : true})
    employee : Employee;

    @Prop({required : true})
    eid : number;

    @Prop({required : true})
    date : Date;

    @Prop({required : true, enum : ['Present', 'Absent', 'Leave', 'Not Marked'], default : 'Not Marked'})
    status : string;

    @Prop()
    time : string;

    @Prop({default : 'No Remarks'})
    remarks : string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
