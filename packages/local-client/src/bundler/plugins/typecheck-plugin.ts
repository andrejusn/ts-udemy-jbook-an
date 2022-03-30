import * as esbuild from 'esbuild-wasm';
import * as ts from 'typescript';

const tsValid = "let x: string  = 'string'";
const tsUnvalid = `interface A { b: 'c' };
const e : A = { b: 123 };`;

export const typecheckPlugin = (inputCode: string) => {
  return {
    name: 'typecheck-plugin',
    setup(build: esbuild.PluginBuild) {
      /* ################################################################################################################################################## */
      /* SIMPLY TRANSPILING - RETURNS NO DIAGNOSTICS INFO */
      /* https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API#a-simple-transform-function */
      let resultValid = ts.transpileModule(tsValid, {
        compilerOptions: { module: ts.ModuleKind.ES2015 },
      });
      console.log('valid ts code', JSON.stringify(resultValid));
      // OUTPUT:
      // valid ts code {"outputText":"var x = 'string';\r\n","diagnostics":[]}

      let resultInvalid = ts.transpileModule(tsUnvalid, {
        compilerOptions: { module: ts.ModuleKind.CommonJS },
      });
      console.log('invalid ts code with error', JSON.stringify(resultInvalid));
      // OUTPUT:
      // invalid ts code with error {"outputText":";\r\nvar e = { b: 123 };\r\n","diagnostics":[]}

      /* ################################################################################################################################################## */
      /* TRYING TO TYPECHECK 1 */
      /* https://convincedcoder.com/2019/01/19/Processing-TypeScript-using-TypeScript/#getting-diagnostics */
      const program = ts.createProgram(['../../components/add-cell.tsx'], {});
      const diagnostics = ts.getPreEmitDiagnostics(program);

      for (const diagnostic of diagnostics) {
        const message = diagnostic.messageText;
        const file = diagnostic.file;
        const filename = file?.fileName;

        const lineAndChar = file?.getLineAndCharacterOfPosition(
          diagnostic.start!!
        );

        const line = lineAndChar!!.line + 1;
        const character = lineAndChar!!.character + 1;

        console.log(message);
        console.log(`(${filename}:${line}:${character})`);
      }
      // OUTPUT:
      // > error: system is undefined 88dc327b-fc00-4c69-8102-24c861d03dfd:8:24
      // 1 error 88dc327b-fc00-4c69-8102-24c861d03dfd:8:24

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

      build.onLoad(
        { filter: /(^index\.js$)/ },
        async (args: esbuild.OnLoadArgs) => {
          return undefined;
        }
      );
    },
  };
};
