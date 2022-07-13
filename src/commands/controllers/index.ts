import {Command, Flags} from '@oclif/core'
import {parseFile} from '../../transformers/typescript-to-test-structure'
import {getFileTree, getModuleInfo} from '../../reading/get-file-tree'
import {parseSchema} from '../../transformers/schema-to-test-parameters'
import * as path from 'node:path'
import {generateTests} from '../../transformers/test-structure-to-tests'

export default class GenerateControllerValidationTestsCommand extends Command {
  static description = 'Say hello';

  static examples = [
    '$ nest-unit-gen controllers ./src/controllers .controller.ts service-core',
  ];

  static flags = {
    overwrite: Flags.string({
      char: 'o',
      description: 'Overwrite existing spec files',
      required: false,
    }),
  };

  static args = [
    {
      name: 'directory',
      description: 'Directory containing files to create unit tests for',
      required: true,
    },
    {
      name: 'extension',
      description: 'Extension to create unit tests for',
      required: true,
    },
    {
      name: 'service',
      description: 'Service name when starting up the app for tests',
      required: true,
    },
  ];

  async run(): Promise<void> {
    const {args, flags} = await this.parse(GenerateControllerValidationTestsCommand)

    const directory = path.join(process.cwd(), args.directory)
    const extension = args.extension ?? '.controller.ts'
    const service = args.service
    // const overwrite = args.overwrite ?? false

    const files = await getFileTree(directory)

    const filteredFiles = files.filter(file => file.name.includes(extension))

    const declarations = await Promise.all(filteredFiles.map(file => parseFile(file)))

    const declarationsWithSchemas = await Promise.all(declarations.map(declaration => parseSchema(declaration)))

    const moduleInfo = getModuleInfo(directory)
    moduleInfo.service = service

    await Promise.all(declarationsWithSchemas.map(testStruct => generateTests(testStruct, moduleInfo)))
  }
}
