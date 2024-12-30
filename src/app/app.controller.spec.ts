import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Logger } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('helloWorld', () => {
    it('should return "Hello Margiet Auth"', () => {
      const loggerSpy = jest.spyOn(Logger, 'log');
      const result = appController.helloWorld('test-id');
      expect(result).toBe('Hello Margiet Auth');
      expect(loggerSpy).toHaveBeenCalledWith('test-id');
    });
  });
});