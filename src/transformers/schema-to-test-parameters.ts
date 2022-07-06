import {TestStructure} from './typescript-to-test-structure';
import tsFileStruct = require('ts-file-parser');
import * as fs from 'fs';
import * as path from 'path';
import {EOL} from 'os';

export const parseSchema = async (testStruct: TestStructure) => {
  const imports = testStruct.imports.map(testImport => {
  
    var schemaLines = fs
      .readFileSync(testImport.location)
      .toString()
      .split(EOL)
      .filter(Boolean);

    const schemaName = testImport.name;
    let schemaFound = false;
    let brackets = [];

    let end = false;
    const fields = schemaLines
      .map(line => {
        // Have we already parsed the schema or come to the end of the schema?
        if (end || (schemaFound && brackets.length === 0)) {
          end = true;
          return undefined;
        }

        // Is the line a field declaration? We are traversing inside the schema now
        if (line.includes(schemaName)) {
          schemaFound = true;
        }

        // Schema still not found? Let's not continue
        if (!schemaFound) {
            return undefined
        }

        // If we found a { bracket, we have entered a fields type, let's keep track of this
        if (line.includes('{')) {
          brackets.push('{');
        }

        // } bracket found, pop from the queue, we can use this to find out when we've reached
        // the end of our contract definition
        if (line.includes('}')) {
          brackets.pop();
        }

        // If the schema has been found, and this is a field declaration line, let's pull our info
        if (
          schemaFound &&
          (!line.includes('@') && (line.includes('!:') || line.includes('?:')))
        ) {
          const split = line.split(':');
          const name = split[0]
            .replace(' ', '')
            .replace('!', '')
            .replace('?', '');
          const isArray = line.includes('[]');
          const parsedType = ['string', 'number', 'null'].filter(type =>
            line.includes(`${type}`)
          );

          return {
            name: name,
            type: parsedType[0] ?? 'object',
          };
        }
      })
      .filter(Boolean);

      return {
        ...testImport,
        schemaDestructed: fields,
      }
  });
  testStruct.imports = imports
  return testStruct
};
