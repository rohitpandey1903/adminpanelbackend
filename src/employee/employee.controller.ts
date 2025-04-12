import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('create')
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get('getAll')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(+id);
  }

  @Put('update/:eid')
  update(@Param('eid') eid: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+eid, updateEmployeeDto);
  }

  @Delete('delete/:eid')
  remove(@Param('eid') eid: number) {
    return this.employeeService.remove(+eid);
  }
}
