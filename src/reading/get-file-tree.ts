import * as fs from 'fs';
import * as path from 'path';

interface FileDescriptor {
  name: string;
  location: string;
}

export const getFileTree = (directory: string) => {
  let foundFiles: any = [];

  const files = fs.readdirSync(directory)
  foundFiles = files.map(file => {

    if (!file.includes('.ts')) {
      const subFileDirectory = path.join(directory, file)
      const subFiles = getFileTree(subFileDirectory)
      return subFiles
    } else {
      return {name: file, location: `${directory}/${file}`} as FileDescriptor;
    }
  }).flat();

  return foundFiles;
};
