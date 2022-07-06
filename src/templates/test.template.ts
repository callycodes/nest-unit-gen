/* eslint-disable */
/* eslint-disable */
// @ts-nocheck
export const testTemplate =  () => `
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { configureNestExpressApplication } from '@orderpay/shared/server';
import * as request from 'supertest';

// import { ImportModule } from '../../something-here.module';

describe('{{ name }} Validation Tests', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      // imports: [MarketingModule],
    }).compile();

    app = testModule.createNestApplication();
    // await configureNestExpressApplication(app, 'service-name-here');

    await app.init();
  });

  afterAll(async () => {
    // In CI, the close service
    // command times out, so just skip it!
    if (process.env['CI'] !== undefined) {
      return;
    }
    await app.close();
  });

  {{ tests }}

});`
