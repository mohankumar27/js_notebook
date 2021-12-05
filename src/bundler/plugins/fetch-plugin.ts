import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

// Store already fetched modules in IndexedDB cache
const FILE_CACHE = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ }, (args: any) => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      /**
       * If cached result is not present the onLoad does
       * not return anything and hence esbuild proceeds to
       * the next matched onLoad function
       */
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //check to see if moudle has already been fetched
        //if fetched, then return from IndxedDB
        const cachedResult = await FILE_CACHE.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");
        const contents = `
              const style = document.createElement('style')
              style.innerText = '${escaped}';
              document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //store result in cached IndexedDB
        await FILE_CACHE.setItem(args.path, result);

        return result;
      });
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //store result in cached IndexedDB
        await FILE_CACHE.setItem(args.path, result);

        return result;
      });
    },
  };
};
