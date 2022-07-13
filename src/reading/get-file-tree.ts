import * as fs from 'node:fs'
import * as path from 'node:path'
import tsFileStruct = require('ts-file-parser')

interface FileDescriptor {
  name: string;
  location: string;
}

export const getFileTree = (directory: string) => {
  let foundFiles: any = []

  const files = fs.readdirSync(directory)
  foundFiles = files.flatMap(file => {
    if (!file.includes('.ts')) {
      const subFileDirectory = path.join(directory, file)
      const subFiles = getFileTree(subFileDirectory)
      return subFiles
    }

    return {name: file, location: `${directory}/${file}`} as FileDescriptor
  })

  return foundFiles
}

export const getModuleInfo = (directory: string) => {
  let foundPath = false
  let modulePath = ''
  let workingDirectory = directory

  const maxLevels = 6
  let currentLevels = 0

  while (!foundPath && currentLevels < maxLevels) {
    const files = fs.readdirSync(workingDirectory)
    // eslint-disable-next-line array-callback-return
    files.map(file => {
      if (file.includes('.module.ts')) {
        foundPath = true
        modulePath = file
        // eslint-disable-next-line no-useless-return
        return
      }
    })

    if (!modulePath) {
      workingDirectory = path.join(workingDirectory, '..')
      currentLevels++
    }
  }

  const resolvedPath = path.join(workingDirectory, modulePath)

  const moduleContents = fs.readFileSync(resolvedPath).toString()

  const moduleName = moduleContents.match('(?<=export class )(.*)(?= {})')[0]

  return {
    name: moduleName,
    path: resolvedPath,
    service: '',
  }
}
