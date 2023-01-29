import { Test, TestingModule } from '@nestjs/testing';
import { SeoulService } from './seoul.service';

describe('SeoulService', () => {
  let service: SeoulService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeoulService],
    }).compile();

    service = module.get<SeoulService>(SeoulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
