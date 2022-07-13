import tsFileStruct = require('ts-file-parser')
import * as fs from 'node:fs'
const path = require('path')

export interface TestMethodParameter {
    name: string
    type?: any
    schema?: any
}

type HttpDecorator = 'Post' | 'Get' | 'Put' | 'Delete' | 'Patch'

interface TestMethod {
    name: string
    requestType: HttpDecorator
    methodPath: string
    params: TestMethodParameter[]
}

export interface TestImport {
    name: string
    location: string
    schemaDestructed?: {
        name: string
        type: any
    }[]
}

export interface TestStructure {
    name: string
    controllerEndpoint: string
    location: {
        name: string
        location: string
    }
    methods: TestMethod[]
    imports: TestImport[]
}

export const parseFile = async (file: any) => {
  const decls = await fs.readFileSync(file.location).toString()
  const jsonStructure = tsFileStruct.parseStruct(decls, {}, file.location)

  if (jsonStructure.classes.length === 0) {
    throw new Error('Error no classes')
  }

  let controllerDecoratorArguements
  const controllerClass = jsonStructure.classes.find(classImport => classImport.name.includes('Controller'))
  try {
    controllerDecoratorArguements = controllerClass.decorators.find(decorator => decorator.name === 'Controller').arguments
  } catch {}

  const controllerEndpoint = controllerDecoratorArguements[0] ?? '' as string

  const testStructure: TestStructure = {
    name: controllerClass.name,
    location: file,
    controllerEndpoint,
    methods: [],
    imports: [],
  }

  await parseImports(jsonStructure, testStructure)
  await parseMethods(controllerClass, testStructure)

  return testStructure
}

/* Get all contract schema imports in a file, save the name and location of the schema to be parsed later */
export const parseImports = async (parsedModule: tsFileStruct.Module, struct: TestStructure) => {
  const schemaImports = parsedModule._imports.map(importNode => {
    if (importNode.absPathString.includes('.contract')) {
      return {
        name: importNode.clauses.find(clause => clause.includes('Contract')),
        location: `${path.join(process.cwd(), importNode.absPathString).replace('.ts', '')}.ts`,
      }
    }
  }).filter(Boolean)

  struct.imports = schemaImports
}

export const parseMethods = async (parsedClass: tsFileStruct.ClassModel, struct: TestStructure) => {
  const methods: TestMethod[] = parsedClass.methods.map(method => {
    // Does the method have a Get/Post/Put/Patch/Delete decorator? If so, let's write a validation test for it
    const httpDecorator = ['@Post', '@Get', '@Patch', '@Delete', '@Put'].find(type => method.text.includes(`${type}`))

    if (!httpDecorator) {
      return
    }

    let regexPath
    try {
      regexPath = method.text.match(`${httpDecorator}\\((.*?)\\)`)[0]
    } catch {
      regexPath = method.text.split(`${httpDecorator}(`)[1].split(')')[0].trim()
    }

    const methodPath = regexPath.replace(httpDecorator, '').replace('(\'', '').replace('\')', '').replace('\'', '').replace('\'', '')

    const methodParameters = method.arguments.map(arguement => {
      const isBodyParam = arguement.text.includes('@Body')
      if (isBodyParam) {
        return {
          name: arguement.name,
          // eslint-disable-next-line dot-notation
          schema: arguement.type['typeName'],
        }
      }

      let arguementType = 'string'
      // eslint-disable-next-line dot-notation
      try {
        // eslint-disable-next-line dot-notation
        arguementType = arguement.type['options'] ? arguement.type['options'][0].typeName : arguement.type['typeName']
      } catch {
        console.log('Arguement has no type, defaulted to string')
      }

      return {
        name: arguement.name,
        type: arguementType,
      }
    })

    return {
      name: method.name,
      methodPath,
      requestType: httpDecorator.replace('@', '') as HttpDecorator,
      params: methodParameters,
    }
  }).filter(Boolean)
  struct.methods = methods
}
