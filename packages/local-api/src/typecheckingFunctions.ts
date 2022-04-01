import * as ts from 'typescript';

export interface CustomDiagnostic {
  message: string;
  location: string;
}
export function checkCode(...path: string[]): CustomDiagnostic[] {
  const program = ts.createProgram(path, {});
  const diagnostics = ts.getPreEmitDiagnostics(program);

  const customDiagnostics: CustomDiagnostic[] = [];
  for (const diagnostic of diagnostics) {
    const message =
      typeof diagnostic.messageText === 'string'
        ? diagnostic.messageText
        : diagnostic.messageText.messageText;
    const file = diagnostic.file;
    const filename = file?.fileName;

    const lineAndChar = file?.getLineAndCharacterOfPosition(diagnostic.start!!);

    const line = lineAndChar!!.line + 1;
    const character = lineAndChar!!.character + 1;

    const info = {
      message: message,
      location: `(${filename}:${line}:${character})`,
    };
    console.log(info);

    customDiagnostics.push(info);
  }

  return customDiagnostics;
}

// /* ################################################################################################################################################## */
// /* TRYING TO TYPECHECK 1 */
// /* https://convincedcoder.com/2019/01/19/Processing-TypeScript-using-TypeScript/#getting-diagnostics */
// const program = ts.createProgram(['../../components/add-cell.tsx'], {});
// const diagnostics = ts.getPreEmitDiagnostics(program);

// for (const diagnostic of diagnostics) {
//   const message = diagnostic.messageText;
//   const file = diagnostic.file;
//   const filename = file?.fileName;

//   const lineAndChar = file?.getLineAndCharacterOfPosition(
//     diagnostic.start!!
//   );

//   const line = lineAndChar!!.line + 1;
//   const character = lineAndChar!!.character + 1;

//   console.log(message);
//   console.log(`(${filename}:${line}:${character})`);
// }
// // OUTPUT:
// // > error: system is undefined 88dc327b-fc00-4c69-8102-24c861d03dfd:8:24
// // 1 error 88dc327b-fc00-4c69-8102-24c861d03dfd:8:24

// /* ################################################################################################################################################## */
// /* TRYING TO TYPECHECK 2 */
// /* https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-minimal-compiler */
// function compile(fileNames: string[], options: ts.CompilerOptions): void {
//   let program = ts.createProgram(fileNames, options);
//   let emitResult = program.emit();

//   let allDiagnostics = ts
//     .getPreEmitDiagnostics(program)
//     .concat(emitResult.diagnostics);

//   allDiagnostics.forEach((diagnostic) => {
//     if (diagnostic.file) {
//       let { line, character } = ts.getLineAndCharacterOfPosition(
//         diagnostic.file,
//         diagnostic.start!
//       );
//       let message = ts.flattenDiagnosticMessageText(
//         diagnostic.messageText,
//         '\n'
//       );
//       console.log(
//         `${diagnostic.file.fileName} (${line + 1},${
//           character + 1
//         }): ${message}`
//       );
//     } else {
//       console.log(
//         ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
//       );
//     }
//   });

//   let exitCode = emitResult.emitSkipped ? 1 : 0;
//   console.log(`Process exiting with code '${exitCode}'.`);
//   process.exit(exitCode);
// }

// // process.argv.slice(2) - empty array at runtime? replacing with a relative path to an existing file changes nothing
// compile(process.argv.slice(2), {
//   noEmitOnError: true,
//   noImplicitAny: true,
//   target: ts.ScriptTarget.ES5,
//   module: ts.ModuleKind.CommonJS,
// });
// // OUTPUT:
// // > error: system is undefined fb9746b8-7ae6-4d9f-9820-c0beb7080297:8:24
// // 1 error fb9746b8-7ae6-4d9f-9820-c0beb7080297:8:24

// /* ################################################################################################################################################## */
// /* TRYING TO TYPECHECK 3 */
// /* https://stackoverflow.com/questions/52969177/typescript-createprogram-throwing-ts-sys-is-undefined */
// /* https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#customizing-module-resolution */
// /* create compilerHost manually so that the default implementation is not used */

// function createCompilerHost(
//   options: ts.CompilerOptions,
//   moduleSearchLocations: string[]
// ): ts.CompilerHost {
//   return {
//     getSourceFile,
//     getDefaultLibFileName: () => 'lib.d.ts',
//     writeFile: (fileName, content) => ts.sys.writeFile(fileName, content),
//     getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
//     getDirectories: (path) => ts.sys.getDirectories(path),
//     getCanonicalFileName: (fileName) =>
//       ts.sys.useCaseSensitiveFileNames
//         ? fileName
//         : fileName.toLowerCase(),
//     getNewLine: () => ts.sys.newLine,
//     useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
//     fileExists,
//     readFile,
//     resolveModuleNames,
//   };

//   function fileExists(fileName: string): boolean {
//     return ts.sys.fileExists(fileName);
//   }

//   function readFile(fileName: string): string | undefined {
//     return ts.sys.readFile(fileName);
//   }

//   function getSourceFile(
//     fileName: string,
//     languageVersion: ts.ScriptTarget,
//     onError?: (message: string) => void
//   ) {
//     const sourceText = ts.sys.readFile(fileName);
//     return sourceText !== undefined
//       ? ts.createSourceFile(fileName, sourceText, languageVersion)
//       : undefined;
//   }

//   function resolveModuleNames(
//     moduleNames: string[],
//     containingFile: string
//   ): ts.ResolvedModule[] {
//     const resolvedModules: ts.ResolvedModule[] = [];
//     for (const moduleName of moduleNames) {
//       // try to use standard resolution
//       let result = ts.resolveModuleName(
//         moduleName,
//         containingFile,
//         options,
//         {
//           fileExists,
//           readFile,
//         }
//       );
//       if (result.resolvedModule) {
//         resolvedModules.push(result.resolvedModule);
//       } else {
//         // check fallback locations, for simplicity assume that module at location
//         // should be represented by '.d.ts' file
//         for (const location of moduleSearchLocations) {
//           const modulePath = path.join(location, moduleName + '.d.ts');
//           if (fileExists(modulePath)) {
//             resolvedModules.push({ resolvedFileName: modulePath });
//           }
//         }
//       }
//     }
//     return resolvedModules;
//   }
// }

// function compile(
//   sourceFiles: string[],
//   moduleSearchLocations: string[]
// ): void {
//   const options: ts.CompilerOptions = {
//     module: ts.ModuleKind.AMD,
//     target: ts.ScriptTarget.ES5,
//   };
//   const host = createCompilerHost(options, moduleSearchLocations);
//   const program = ts.createProgram(sourceFiles, options, host);

//   /// do something with program...
// }

// compile(process.argv.slice(2), []);
// // OUTPUT:
// // > error: system is undefined f83f150f-1d53-48e7-b54e-81738cf60696:8:24
// // 1 error f83f150f-1d53-48e7-b54e-81738cf60696:8:24

// /* ################################################################################################################################################## */
// /* TRYING TO TYPECHECK 4 */
// /* https://github.com/microsoft/TypeScript/issues/29226#issuecomment-450965141 */
// /* using an example that works??? */

// interface File {
//   fileName: string;
//   content: string;
//   sourceFile?: ts.SourceFile;
// }

// const options = {
//   module: ts.ModuleKind.CommonJS,
//   target: ts.ScriptTarget.ES2015,
//   strict: true,
//   suppressOutputPathCheck: false,
// };
// const file: File = { fileName: 'test.ts', content: "let test = 'aa';" };

// const compilerHost = ts.createCompilerHost(options);
// const originalGetSourceFile = compilerHost.getSourceFile;
// compilerHost.getSourceFile = (fileName) => {
//   console.log(fileName);
//   if (fileName === file.fileName) {
//     file.sourceFile =
//       file.sourceFile ||
//       ts.createSourceFile(
//         fileName,
//         file.content,
//         ts.ScriptTarget.ES2015,
//         true
//       );
//     return file.sourceFile;
//   } else return originalGetSourceFile.call(compilerHost, fileName, 6);
// };
// compilerHost.writeFile = (
//   fileName,
//   data,
//   writeByteOrderMark,
//   onError,
//   sourceFiles
// ) => {
//   console.log('writeFile =====> fileName: ', fileName, ', data: ', data);
// };

// const program = ts.createProgram([file.fileName], options, compilerHost);
// let emitResult = program.emit();

// // OUTPUT:
// // error: system is undefined 1564df11-1a08-421a-8b33-b0495f16c55c:8:24
// // 1 error 1564df11-1a08-421a-8b33-b0495f16c55c:8:24

// /* ################################################################################################################################################## */
// /* TRYING TO TYPECHECK 5 */
// /* https://github.com/AlCalzone/virtual-tsc */
// /* using an example that works??? */
