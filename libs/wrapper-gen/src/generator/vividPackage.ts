/**
 * Gets the path to the corresponding .d.ts file from original file path.
 */
export const getTypescriptDefinitionPath = (originalFilePath: string) =>
  originalFilePath.replace(/^libs\/components\/src\//, '../../dist/libs/components/').replace(/\.ts$/, '.d.ts');

/**
 * Gets the import path for a component from original file path.
 */
export const getImportPath = (originalFilePath: string) =>
  originalFilePath.replace(/^libs\/components\/src\//, '@vonage/vivid/').replace(/\.ts$/, '');
