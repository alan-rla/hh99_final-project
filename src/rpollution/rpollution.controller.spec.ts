import { Test, TestingModule } from '@nestjs/testing';
import { RpollutionController } from './rpollution.controller';

describe('RpollutionController', () => {
  let controller: RpollutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RpollutionController],
    }).compile();

    controller = module.get<RpollutionController>(RpollutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
