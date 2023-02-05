import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoutesInfo } from 'src/entities/routesinfo';
import { Repository } from 'typeorm';
@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(RoutesInfo)
    private routesinfoRepository: Repository<RoutesInfo>,
  ) {}
}
