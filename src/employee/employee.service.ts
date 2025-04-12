import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './entities/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const newEmployee = new this.employeeModel(createEmployeeDto);
    return newEmployee.save();
  }

  async findAll() {
    return this.employeeModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async update(eid: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const updatedEmployee = await this.employeeModel.findOneAndUpdate(
      { eid }, // Find by eid field instead of _id
      { $set: updateEmployeeDto },
      { new: true, runValidators: true }
    ).exec();
    
    if (!updatedEmployee) {
      throw new Error(`Employee with EID ${eid} not found`);
    }
    
    return updatedEmployee;
  }

  async remove(eid: number): Promise<Employee> {
    const deletedEmployee = await this.employeeModel.findOneAndDelete(
      { eid } // Find by eid field instead of _id
    ).exec();
    
    if (!deletedEmployee) {
      throw new Error(`Employee with EID ${eid} not found`);
    }
    
    return deletedEmployee;
  }
}