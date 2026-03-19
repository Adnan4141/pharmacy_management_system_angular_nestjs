import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto, UpdateMedicineDto } from './dto/medicine.dto';

@Controller('api/medicines')
export class MedicineController {
  constructor(private readonly service: MedicineService) {}

  @Get()
  findAll(@Query('q') query?: string) {
    if (query) return this.service.search(query);
    return this.service.findAll();
  }

  @Get('seed')
  seed() {
    return this.service.seed();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMedicineDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedicineDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
