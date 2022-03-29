import * as esbuild from 'esbuild-wasm';
import * as ts from 'typescript';

function compile(fileNames: string[], options: ts.CompilerOptions): void {
  let program = ts.createProgram(fileNames, options);
  let emitResult = program.emit();

  let allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  allDiagnostics.forEach((diagnostic) => {
    if (diagnostic.file) {
      let { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start!
      );
      let message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
      );
    }
  });

  let exitCode = emitResult.emitSkipped ? 1 : 0;
  console.log(`Process exiting with code '${exitCode}'.`);
  process.exit(exitCode);
}

export const typecheckPlugin = (inputCode: string) => {
  return {
    name: 'typecheck-plugin',
    setup(build: esbuild.PluginBuild) {
      const source = "let x: string  = 'string'";
      let result = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ES2015 },
      });
      console.log(JSON.stringify(result));

      const source2 = `
      interface A {
      b: 'c' }
      
      const e : A = { b: 123 };
      show(e.b);`;

      console.log(
        '##############################PLUGIN###########################'
      );
      let result2 = ts.transpileModule(source2, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      });
      console.log(JSON.stringify(result2));

      compile(process.argv.slice(2), {
        noEmitOnError: true,
        noImplicitAny: true,
        target: ts.ScriptTarget.ES5,
        module: ts.ModuleKind.CommonJS,
      });

      build.onLoad(
        { filter: /(^index\.js$)/ },
        async (args: esbuild.OnLoadArgs) => {
          const source = "let x: string  = 'string'";
          console.log(
            '##############################PLUGIN###########################'
          );

          let result = ts.transpileModule(source, {
            compilerOptions: { module: ts.ModuleKind.CommonJS },
          });

          console.log(JSON.stringify(result));
          return undefined;
        }
      );
    },
  };
};
