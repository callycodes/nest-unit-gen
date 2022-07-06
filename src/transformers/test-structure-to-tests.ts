import {TestStructure} from './typescript-to-test-structure';
import * as fs from 'fs';
import * as path from 'path';
import { testTemplate } from '../templates/test.template';
var Mustache = require('mustache');

interface ValidationError {
  statusCode: number;
  error: 'Bad Request';
  message: 'There is 1 validation error';
  details: ['mcrUserId must be a string'];
}

export const generateTestFile = async (testStruct: TestStructure, tests: string) => {
    const testPath = path.join(testStruct.location.location.replace(testStruct.location.name, ''), `${testStruct.location.name.replace('.ts', '.validation.spec.ts')}`)

    const template = testTemplate()
    const output = template.replace('{{ name }}', testStruct.name).replace('{{ tests }}', tests)
    return fs.writeFileSync(testPath, output);
}

export const generateTests = async (testStruct: TestStructure) => {
  const tests = testStruct.methods.map((method) => {
    const testString = `
    describe('${method.requestType.toUpperCase()} ${method.name}', () => {
      it('should reject a missing venue id', () => {
        return request(app.getHttpServer())
          .${method.requestType.toLowerCase()}('/api/1${testStruct.controllerEndpoint}${method.methodPath}')
          .expect(HttpStatus.BAD_REQUEST)
          .then((res) => {
            expect(res.body.message).toBe(
              'The value passed as UUID is not a string'
            );
          });
      });
    });`

    return testString
  })
  await generateTestFile(testStruct, tests.join('\n'))
};
