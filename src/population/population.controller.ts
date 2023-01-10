import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PopulationService } from './population.service';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';

@Controller('population')
export class PopulationController {
  constructor(private readonly populationService: PopulationService) {}

  @Post()
  create(@Body() createPopulationDto: CreatePopulationDto) {
    return this.populationService.create(createPopulationDto);
  }

  @Get()
  findAll() {
    return this.populationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.populationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePopulationDto: UpdatePopulationDto) {
    return this.populationService.update(+id, updatePopulationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.populationService.remove(+id);
  }
}
