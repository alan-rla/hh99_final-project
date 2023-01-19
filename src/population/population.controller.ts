import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PopulationService } from './population.service';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PopulationDto } from './dto/findall-population.dto';

@ApiTags('POPULATION')
@Controller('population')
export class PopulationController {
  constructor(private readonly populationService: PopulationService) {}

  @ApiResponse({
    type: PopulationDto,
    status: 200,
    description: '인구 정보 조회',
  })
  @ApiOperation({ summary: '인구 정보 전체 조회' })
  @Get('/place/:placeId')
  async find(@Param('placeId') placeId: string) {
    console.log('placeId: ', placeId);
    return await this.populationService.find(placeId);
  }
}

// @Get(':id')
// findOne(@Param('id') id: string) {
//   return this.populationService.findOne(+id);
// }
// @Post()
// create(@Body() createPopulationDto: CreatePopulationDto) {
//   return this.populationService.create(createPopulationDto);
// }
// @Patch(':id')
// update(@Param('id') id: string, @Body() updatePopulationDto: UpdatePopulationDto) {
//   return this.populationService.update(+id, updatePopulationDto);
// }

// @Delete(':id')
// remove(@Param('id') id: string) {
//   return this.populationService.remove(+id);
// }
