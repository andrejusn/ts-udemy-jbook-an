import * as esbuild from 'esbuild-wasm';
import * as ts from 'typescript';

import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({ name: 'fileCache' });

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, async (args: any) => {
        console.log(inputCode);

        let result = ts.transpileModule(inputCode, {
          compilerOptions: { module: ts.ModuleKind.CommonJS },
        });
        console.log(JSON.stringify(result));

        return {
          loader: 'tsx',
          contents: inputCode,
        };
      });

      // get library from cache, if present
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);
        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'tsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // cache the library
        await fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await axios.get(args.path);
        console.log(data);

        const result: esbuild.OnLoadResult = {
          loader: 'tsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });
    },
  };
};
