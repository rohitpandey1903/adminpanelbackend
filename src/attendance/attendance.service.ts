import { Injectable } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance, AttendanceDocument } from './entities/attendance.entity';
import { Model } from 'mongoose';
import { Employee } from 'src/employee/entities/employee.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Employee.name) private employeeModel: Model<any>
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto) {
    const { eid, status } = createAttendanceDto;
    const employee = await this.employeeModel.findOne({ eid }).exec();
    if (!employee) {
      throw new Error('Employee not found');
    }
    const newAttendaceRecord = new this.attendanceModel({
      employee,
      ...createAttendanceDto
    });
    newAttendaceRecord.date = new Date();
    await newAttendaceRecord.save();
    if(status === 'Absent'){
      employee.leaves.taken += 1;
      employee.leaves.remaining -= 1;
      await employee.save();
    }
    return newAttendaceRecord;
  }

  async findAll() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.attendanceModel.find({ date: { $gte: today, $lt: tomorrow } }).populate('employee').exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} attendance`;
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return `This action updates a #${id} attendance`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }
}
