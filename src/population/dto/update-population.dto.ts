import { PartialType } from '@nestjs/mapped-types';
import { CreatePopulationDto } from './create-population.dto';

export class UpdatePopulationDto extends PartialType(CreatePopulationDto) {}
