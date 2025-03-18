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
    
    // Find employee
    const employee = await this.employeeModel.findOne({ eid }).exec();
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Check for existing attendance record in the last 24 hours
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingRecord = await this.attendanceModel.findOne({ 
      eid,
      date: { $gte: today, $lt: tomorrow }
    }).exec();
    
    let attendanceRecord;
    
    if (existingRecord) {
      // Update existing record
      const oldStatus = existingRecord.status;
      existingRecord.status = status;
      existingRecord.time = createAttendanceDto.time || existingRecord.time;
      existingRecord.remarks = createAttendanceDto.remarks || existingRecord.remarks;
      
      attendanceRecord = await existingRecord.save();
      
      // Handle leave accounting if status changed
      if (status === 'Absent' && oldStatus !== 'Absent') {
        employee.leaves.taken += 1;
        employee.leaves.remaining -= 1;
        await employee.save();
      } else if (status !== 'Absent' && oldStatus === 'Absent') {
        // If changing from Absent to something else, restore the leave
        employee.leaves.taken -= 1;
        employee.leaves.remaining += 1;
        await employee.save();
      }
    } else {
      // Create new record (unlikely if startTheDay was called)
      const newAttendanceRecord = new this.attendanceModel({
        employee,
        ...createAttendanceDto,
        date: new Date()
      });
      
      attendanceRecord = await newAttendanceRecord.save();
      
      // Handle leaves if new record is created with Absent status
      if (status === 'Absent') {
        employee.leaves.taken += 1;
        employee.leaves.remaining -= 1;
        await employee.save();
      }
    }
    
    return attendanceRecord;
  }
  async startTheDay() {
    const employees = await this.employeeModel.find().exec();

    const attendanceRecords = await Promise.all(
      employees.map( async (employee) => {
        const newRecord = new this.attendanceModel({
          date : new Date(),
          eid : employee.eid,
          employee,
        });
        return newRecord.save();
      })
    );

    return attendanceRecords;
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
