import { Test, TestingModule } from '@nestjs/testing';
import { SeoulController } from './seoul.controller';
import { SeoulService } from './seoul.service';

describe('SeoulController', () => {
  let controller: SeoulController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeoulController],
      providers: [SeoulService],
    }).compile();

    controller = module.get<SeoulController>(SeoulController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
