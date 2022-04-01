import * as ts from 'typescript';

export interface CustomDiagnostic {
  message: string;
  location: string;
}

export interface File {
  fileName: string;
  content: string;
  sourceFile?: ts.SourceFile;
}

function diagnosticsToCustomFormat(
  diagnostics: readonly ts.Diagnostic[]
): CustomDiagnostic[] {
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

export function checkCode(code: string): CustomDiagnostic[] {
  const file: File = {
    fileName: 'test.ts',
    content: code,
  };

  const options = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2015,
    strict: true,
    suppressOutputPathCheck: false,
  };

  const compilerHost = ts.createCompilerHost(options);
  const originalGetSourceFile = compilerHost.getSourceFile;
  compilerHost.getSourceFile = (fileName) => {
    if (fileName === file.fileName) {
      file.sourceFile =
        file.sourceFile ||
        ts.createSourceFile(
          fileName,
          file.content,
          ts.ScriptTarget.ES2015,
          true
        );
      return file.sourceFile;
    } else return originalGetSourceFile.call(compilerHost, fileName, 6);
  };

  const program = ts.createProgram([file.fileName], options, compilerHost);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  return diagnosticsToCustomFormat(diagnostics);
}
