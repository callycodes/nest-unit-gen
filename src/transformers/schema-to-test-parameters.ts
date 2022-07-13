import {TestStructure} from './typescript-to-test-structure'
import tsFileStruct = require('ts-file-parser');
import * as fs from 'node:fs'
import * as path from 'node:path'
import {EOL} from 'node:os'

export const parseSchema = async (testStruct: TestStructure) => {
  const imports = testStruct.imports.map(testImport => {
    const schemaLines = fs
    .readFileSync(testImport.location)
    .toString()
    .split(EOL)
    .filter(Boolean)

    const schemaName = testImport.name
    let schemaFound = false
    const brackets = []

    let end = false
    const fields = schemaLines
    .map(line => {
      // Have we already parsed the schema or come to the end of the schema?
      if (end || (schemaFound && brackets.length === 0)) {
        end = true
        return
      }

      // Is the line a field declaration? We are traversing inside the schema now
      if (line.includes(schemaName)) {
        schemaFound = true
      }

      // Schema still not found? Let's not continue
      if (!schemaFound) {
        return
      }

      // If we found a { bracket, we have entered a fields type, let's keep track of this
      if (line.includes('{')) {
        brackets.push('{')
      }

      // } bracket found, pop from the queue, we can use this to find out when we've reached
      // the end of our contract definition
      if (line.includes('}')) {
        brackets.pop()
      }

      // If the schema has been found, and this is a field declaration line, let's pull our info
      if (
        schemaFound &&
          (!line.includes('@') && (line.includes('!:') || line.includes('?:')))
      ) {
        const split = line.split(':')
        const name = split[0]
        .replace(' ', '')
        .replace('!', '')
        .replace('?', '')
        const isArray = line.includes('[]')
        const parsedType = ['string', 'number', 'null'].find(type =>
          line.includes(`${type}`),
        )

        return {
          name: name,
          type: parsedType ?? 'object',
        }
      }
    })
    .filter(Boolean)

    return {
      ...testImport,
      schemaDestructed: fields,
    }
  })
  testStruct.imports = imports
  return testStruct
}
