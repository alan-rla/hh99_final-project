import { Test, TestingModule } from '@nestjs/testing';
import { RpollutionService } from './rpollution.service';

describe('RpollutionService', () => {
  let service: RpollutionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpollutionService],
    }).compile();

    service = module.get<RpollutionService>(RpollutionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
