import {TestStructure, TestMethodParameter, TestImport} from './typescript-to-test-structure'
import * as fs from 'node:fs'
import * as path from 'node:path'
import {testTemplate} from '../templates/test.template'
const Mustache = require('mustache')

interface ValidationError {
  statusCode: number;
  error: 'Bad Request';
  message: 'There is 1 validation error';
  details: ['mcrUserId must be a string'];
}

export const generateTestFile = async (testStruct: TestStructure, tests: string, moduleInfo) => {
  const testPath = path.join(testStruct.location.location.replace(testStruct.location.name, ''), `${testStruct.location.name.replace('.ts', '.validation.spec.ts')}`)

  const template = testTemplate()
  const output = template
  .replace('{{ name }}', testStruct.name)
  .replace('{{ tests }}', tests)
  .replace('{{ import }}', path.relative(testPath, moduleInfo.path).replace('.ts', '').replace('../', ''))
  .replace('{{ test_import }}', moduleInfo.name)
  .replace('{{ module_name }}', moduleInfo.name)
  .replace('{{ service_name }}', moduleInfo.service)

  return fs.writeFileSync(testPath, output)
}

/** Generates the body payload to send when pinging an endpoint */
export const generateBodyParameter = (params: TestMethodParameter[], imports: TestImport[]): any => {
  const payload = {}
  // eslint-disable-next-line array-callback-return
  params.filter(param => param.schema).map(param => {
    const schema = imports.find(i => i.name === param.schema)

    let alternativeVal
    try {
    // eslint-disable-next-line array-callback-return
      schema.schemaDestructed.map(v => {
        switch (v.type) {
        case 'string':
          alternativeVal = 1
          break
        case 'number':
          alternativeVal = 'test'
          break
        case 'object':
          alternativeVal = null
          break
        }

        payload[v.name.trim()] = alternativeVal
      })
    } catch {
      switch (param.type) {
      case 'string':
        alternativeVal = 1
        break
      case 'number':
        alternativeVal = 'test'
        break
      default:
        alternativeVal = null
        break
      }

      payload[param.name.trim()] = alternativeVal
    }
  })
  return payload
}

export const generateTests = async (testStruct: TestStructure, moduleInfo: { name: string, path: string, service: string }) => {
  const tests = testStruct.methods.map(method => {
    const bodyParam = generateBodyParameter(method.params, testStruct.imports)
    const bodyParamLength = Object.keys(bodyParam).length

    if (!bodyParamLength) {
      return ''
    }

    const testString = `
    describe('${method.requestType.toUpperCase()} ${method.name}', () => {
      it('should reject the request with ${bodyParamLength} validation error${bodyParamLength > 1 ? 's' : ''}', () => {
        return request(app.getHttpServer())
          .${method.requestType.toLowerCase()}('/api/1${testStruct.controllerEndpoint}${method.methodPath}')
          ${`.send(${JSON.stringify(bodyParam)})`}
          .expect(HttpStatus.BAD_REQUEST)
          .then((res) => {
            expect(res.body.message).toBe(
              ${`'There ${bodyParamLength > 1 ? 'are' : 'is'} ${bodyParamLength} validation error${bodyParamLength > 1 ? 's' : ''}'`}
            );
          });
      });
    });`

    return testString
  })

  if (tests.length === 0) {
    return
  }

  await generateTestFile(testStruct, tests.join('\n'), moduleInfo)
}
