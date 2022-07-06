import tsFileStruct = require("ts-file-parser")
import * as fs from 'fs';
const path = require('path');

interface TestMethodParameter {
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

interface TestImport {
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
    var decls = await fs.readFileSync(file.location).toString();
    var jsonStructure = tsFileStruct.parseStruct(decls, {}, file.location);

    if (jsonStructure.classes.length === 0) {
        throw new Error('')
    }

    const controllerDecoratorArguements = jsonStructure.classes[0].decorators.filter((decorator) => decorator.name === 'Controller')[0].arguments

    const controllerEndpoint = controllerDecoratorArguements[0] as string

    const testStructure: TestStructure = {
        name: jsonStructure.classes[0].name,
        location: file,
        controllerEndpoint,
        methods: [],
        imports: [],
    }

    await parseImports(jsonStructure, testStructure)
    await parseMethods(jsonStructure.classes[0], testStructure)

    return testStructure
}

/* Get all contract schema imports in a file, save the name and location of the schema to be parsed later */
export const parseImports = async (parsedModule: tsFileStruct.Module, struct: TestStructure) => {
    const schemaImports = parsedModule._imports.map((importNode) => {
        if (importNode.absPathString.includes('.contract')) {
            return {
                name: importNode.clauses.find((clause) => clause.includes('Contract')),
                location: `${path.join(process.cwd(), importNode.absPathString).replace('.ts', '')}.ts`,
            }

        }
    }).filter(Boolean)

    struct.imports = schemaImports
}

export const parseMethods = async (parsedClass: tsFileStruct.ClassModel, struct: TestStructure) => {
    const methods: TestMethod[] = parsedClass.methods.map((method) => {
        // Does the method have a Get/Post/Put/Patch/Delete decorator? If so, let's write a validation test for it
        const httpDecorator = ['@Post', '@Get', '@Patch', '@Delete', '@Put'].filter(type => method.text.includes(`${type}`))[0]

        if (!httpDecorator) {
            return undefined
        }

        const regexPath = method.text.match(`${httpDecorator}\\('[^']*'\\)`)[0]

        const methodPath = regexPath.replace(httpDecorator, '').replace('(\'', '').replace('\')', '')

        const methodParameters = method.arguments.map((arguement) => {
            const isBodyParam = arguement.text.includes('@Body')
            if (isBodyParam) {
                return {
                    name: arguement.name,
                    schema: arguement.type['typeName']
                }
            } else {
                const arguementType = arguement.type['options'] ? arguement.type['options'][0]['typeName'] : arguement.type['typeName']
                return {
                    name: arguement.name,
                    type: arguementType
                }
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