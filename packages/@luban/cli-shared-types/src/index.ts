export type RawPlugin = {
  "@luban-cli/cli-plugin-babel"?: Record<string, unknown>;
  "@luban-cli/cli-plugin-eslint"?: Record<string, unknown>;
  "@luban-cli/cli-plugin-stylelint"?: Record<string, unknown>;
  "@luban-cli/cli-plugin-unit-test"?: Record<string, unknown>;
  "@luban-cli/cli-plugin-fetch"?: Record<string, unknown>;
  "@luban-cli/cli-plugin-commit"?: Record<string, unknown>;
  "@luban-cli/cli-plugin-service"?: { projectName: string } & Record<string, unknown>;
  "@luban-cli/cli-lib-service"?: { projectName: string } & Record<string, unknown>;
};

export type ESLinterConfig = "leap" | "airbnb" | "standard";

export type AppType = "lib" | "web";
/**
 *
 * @description preset config and plugin options after created project
 */
export type Preset = {
  eslint?: ESLinterConfig;
  stylelint?: boolean;
  unitTest?: boolean;
  fetch?: boolean;
  commit?: boolean;
  type?: AppType;
  plugins: RawPlugin;
};

export type RootOptions = Preset & { projectName: string };

/**
 * @description package.json fields, name and version must required
 *
 * @see https://docs.npmjs.com/creating-a-package-json-file
 */
export type BasePkgFields = {
  name: string;
  description?: string;
  version: string;
  main?: string;
  scripts?: Record<string, string>;
  repository?: Record<string, string>;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
  keywords?: string[];
  author?: string;
  browserslist?: string[];
  homepage?: string;
  ["__luban_config__"]?: Required<RootOptions>;
} & Record<string, unknown>;

export type TypeScriptConfigurationFile = CompilerOptionsDefinition &
  CompileOnSaveDefinition &
  TypeAcquisitionDefinition &
  ExtendsDefinition &
  TsNodeDefinition &
  (FilesDefinition | ExcludeDefinition | IncludeDefinition | ReferencesDefinition);

export interface CompilerOptionsDefinition {
  /**
   * Instructs the TypeScript compiler how to compile .ts files.
   */
  compilerOptions?: {
    /**
     * The character set of the input files. This setting is deprecated.
     */
    charset?: string;
    /**
     * Enables building for project references. Requires TypeScript version 3.0 or later.
     */
    composite?: boolean;
    /**
     * Generates corresponding d.ts files.
     */
    declaration?: boolean;
    /**
     * Specify output directory for generated declaration files. Requires TypeScript version 2.0 or later.
     */
    declarationDir?: string | null;
    /**
     * Show diagnostic information. This setting is deprecated. See `extendedDiagnostics.`
     */
    diagnostics?: boolean;
    /**
     * Recommend IDE's to load referenced composite projects dynamically instead of loading them all immediately. Requires TypeScript version 4.0 or later.
     */
    disableReferencedProjectLoad?: boolean;
    /**
     * Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
     */
    emitBOM?: boolean;
    /**
     * Only emit '.d.ts' declaration files. Requires TypeScript version 2.8 or later.
     */
    emitDeclarationOnly?: boolean;
    /**
     * Enable incremental compilation. Requires TypeScript version 3.4 or later.
     */
    incremental?: boolean;
    /**
     * Specify file to store incremental compilation information. Requires TypeScript version 3.4 or later.
     */
    tsBuildInfoFile?: string;
    /**
     * Emit a single file with source maps instead of having a separate file. Requires TypeScript version 1.5 or later.
     */
    inlineSourceMap?: boolean;
    /**
     * Emit the source alongside the sourcemaps within a single file; requires --inlineSourceMap to be set. Requires TypeScript version 1.5 or later.
     */
    inlineSources?: boolean;
    /**
     * Specify JSX code generation: 'preserve', 'react', 'react-jsx', 'react-jsxdev' or'react-native'. Requires TypeScript version 2.2 or later.
     */
    jsx?: "preserve" | "react" | "react-jsx" | "react-jsxdev" | "react-native";
    /**
     * Specify the object invoked for createElement and __spread when targeting 'react' JSX emit.
     */
    reactNamespace?: string;
    /**
     * Specify the JSX factory function to use when targeting react JSX emit, e.g. 'React.createElement' or 'h'. Requires TypeScript version 2.1 or later.
     */
    jsxFactory?: string;
    /**
     * Specify the JSX Fragment reference to use for fragements when targeting react JSX emit, e.g. 'React.Fragment' or 'Fragment'. Requires TypeScript version 4.0 or later.
     */
    jsxFragmentFactory?: string;
    /**
     * Declare the module specifier to be used for importing the `jsx` and `jsxs` factory functions when using jsx as "react-jsx" or "react-jsxdev". Requires TypeScript version 4.1 or later.
     */
    jsxImportSource?: string;
    /**
     * Print names of files part of the compilation.
     */
    listFiles?: boolean;
    /**
     * Specify the location where debugger should locate map files instead of generated locations
     */
    mapRoot?: string;
    /**
     * Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015', 'ES2020' or 'ESNext'. Only 'AMD' and 'System' can be used in conjunction with --outFile.
     */
    module?: (
      | ("CommonJS" | "AMD" | "System" | "UMD" | "ES6" | "ES2015" | "ES2020" | "ESNext" | "None")
      | {
          [k: string]: unknown;
        }
    ) &
      string;
    /**
     * Specifies module resolution strategy: 'node' (Node) or 'classic' (TypeScript pre 1.6) .
     */
    moduleResolution?: (
      | ("Classic" | "Node")
      | {
          [k: string]: unknown;
        }
    ) &
      string;
    /**
     * Specifies the end of line sequence to be used when emitting files: 'crlf' (Windows) or 'lf' (Unix). Requires TypeScript version 1.5 or later.
     */
    newLine?: (
      | ("crlf" | "lf")
      | {
          [k: string]: unknown;
        }
    ) &
      string;
    /**
     * Do not emit output.
     */
    noEmit?: boolean;
    /**
     * Do not generate custom helper functions like __extends in compiled output. Requires TypeScript version 1.5 or later.
     */
    noEmitHelpers?: boolean;
    /**
     * Do not emit outputs if any type checking errors were reported. Requires TypeScript version 1.4 or later.
     */
    noEmitOnError?: boolean;
    /**
     * Warn on expressions and declarations with an implied 'any' type. Enabling this setting is recommended.
     */
    noImplicitAny?: boolean;
    /**
     * Raise error on 'this' expressions with an implied any type. Enabling this setting is recommended. Requires TypeScript version 2.0 or later.
     */
    noImplicitThis?: boolean;
    /**
     * Report errors on unused locals. Requires TypeScript version 2.0 or later.
     */
    noUnusedLocals?: boolean;
    /**
     * Report errors on unused parameters. Requires TypeScript version 2.0 or later.
     */
    noUnusedParameters?: boolean;
    /**
     * Do not include the default library file (lib.d.ts).
     */
    noLib?: boolean;
    /**
     * Do not add triple-slash references or module import targets to the list of compiled files.
     */
    noResolve?: boolean;
    /**
     * Disable strict checking of generic signatures in function types. Requires TypeScript version 2.4 or later.
     */
    noStrictGenericChecks?: boolean;
    /**
     * Use `skipLibCheck` instead. Skip type checking of default library declaration files.
     */
    skipDefaultLibCheck?: boolean;
    /**
     * Skip type checking of declaration files. Enabling this setting is recommended. Requires TypeScript version 2.0 or later.
     */
    skipLibCheck?: boolean;
    /**
     * Concatenate and emit output to single file.
     */
    outFile?: string;
    /**
     * Redirect output structure to the directory.
     */
    outDir?: string;
    /**
     * Do not erase const enum declarations in generated code.
     */
    preserveConstEnums?: boolean;
    /**
     * Do not resolve symlinks to their real path; treat a symlinked file like a real one.
     */
    preserveSymlinks?: boolean;
    /**
     * Keep outdated console output in watch mode instead of clearing the screen.
     */
    preserveWatchOutput?: boolean;
    /**
     * Stylize errors and messages using color and context (experimental).
     */
    pretty?: boolean;
    /**
     * Do not emit comments to output.
     */
    removeComments?: boolean;
    /**
     * Specifies the root directory of input files. Use to control the output directory structure with --outDir.
     */
    rootDir?: string;
    /**
     * Unconditionally emit imports for unresolved files.
     */
    isolatedModules?: boolean;
    /**
     * Generates corresponding '.map' file.
     */
    sourceMap?: boolean;
    /**
     * Specifies the location where debugger should locate TypeScript files instead of source locations.
     */
    sourceRoot?: string;
    /**
     * Suppress excess property checks for object literals. It is recommended to use @ts-ignore comments instead of enabling this setting.
     */
    suppressExcessPropertyErrors?: boolean;
    /**
     * Suppress noImplicitAny errors for indexing objects lacking index signatures. It is recommended to use @ts-ignore comments instead of enabling this setting.
     */
    suppressImplicitAnyIndexErrors?: boolean;
    /**
     * Do not emit declarations for code that has an '@internal' annotation.
     */
    stripInternal?: boolean;
    /**
     * Specify ECMAScript target version: 'ES3', 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ESNext'
     */
    target?: (
      | (
          | "ES3"
          | "ES5"
          | "ES6"
          | "ES2015"
          | "ES2016"
          | "ES2017"
          | "ES2018"
          | "ES2019"
          | "ES2020"
          | "ESNext"
        )
      | {
          [k: string]: unknown;
        }
    ) &
      string;
    /**
     * Watch input files.
     */
    watch?: boolean;
    /**
     * Specify the polling strategy to use when the system runs out of or doesn't support native file watchers. Requires TypeScript version 3.8 or later.
     */
    fallbackPolling?: "fixedPollingInterval" | "priorityPollingInterval" | "dynamicPriorityPolling";
    /**
     * Specify the strategy for watching directories under systems that lack recursive file-watching functionality. Requires TypeScript version 3.8 or later.
     */
    watchDirectory?: "useFsEvents" | "fixedPollingInterval" | "dynamicPriorityPolling";
    /**
     * Specify the strategy for watching individual files. Requires TypeScript version 3.8 or later.
     */
    watchFile?:
      | "fixedPollingInterval"
      | "priorityPollingInterval"
      | "dynamicPriorityPolling"
      | "useFsEvents"
      | "useFsEventsOnParentDirectory";
    /**
     * Enables experimental support for ES7 decorators.
     */
    experimentalDecorators?: boolean;
    /**
     * Emit design-type metadata for decorated declarations in source.
     */
    emitDecoratorMetadata?: boolean;
    /**
     * Do not report errors on unused labels. Requires TypeScript version 1.8 or later.
     */
    allowUnusedLabels?: boolean;
    /**
     * Report error when not all code paths in function return a value. Requires TypeScript version 1.8 or later.
     */
    noImplicitReturns?: boolean;
    /**
     * Add `undefined` to an un-declared field in a type. Requires TypeScript version 4.1 or later.
     */
    noUncheckedIndexedAccess?: boolean;
    /**
     * Report errors for fallthrough cases in switch statement. Requires TypeScript version 1.8 or later.
     */
    noFallthroughCasesInSwitch?: boolean;
    /**
     * Do not report errors on unreachable code. Requires TypeScript version 1.8 or later.
     */
    allowUnreachableCode?: boolean;
    /**
     * Disallow inconsistently-cased references to the same file. Enabling this setting is recommended.
     */
    forceConsistentCasingInFileNames?: boolean;
    /**
     * Emit a v8 CPI profile during the compiler run, which may provide insight into slow builds. Requires TypeScript version 3.7 or later.
     */
    generateCpuProfile?: string;
    /**
     * Base directory to resolve non-relative module names.
     */
    baseUrl?: string;
    /**
     * Specify path mapping to be computed relative to baseUrl option.
     */
    paths?: {
      [k: string]: string[];
    };
    /**
     * List of TypeScript language server plugins to load. Requires TypeScript version 2.3 or later.
     */
    plugins?: {
      /**
       * Plugin name.
       */
      name?: string;
      [k: string]: unknown;
    }[];
    /**
     * Specify list of root directories to be used when resolving modules. Requires TypeScript version 2.0 or later.
     */
    rootDirs?: string[];
    /**
     * Specify list of directories for type definition files to be included. Requires TypeScript version 2.0 or later.
     */
    typeRoots?: string[];
    /**
     * Type declaration files to be included in compilation. Requires TypeScript version 2.0 or later.
     */
    types?: string[];
    /**
     * Enable tracing of the name resolution process. Requires TypeScript version 2.0 or later.
     */
    traceResolution?: boolean;
    /**
     * Allow javascript files to be compiled. Requires TypeScript version 1.8 or later.
     */
    allowJs?: boolean;
    /**
     * Do not truncate error messages. This setting is deprecated.
     */
    noErrorTruncation?: boolean;
    /**
     * Allow default imports from modules with no default export. This does not affect code emit, just typechecking. Requires TypeScript version 1.8 or later.
     */
    allowSyntheticDefaultImports?: boolean;
    /**
     * Do not emit 'use strict' directives in module output.
     */
    noImplicitUseStrict?: boolean;
    /**
     * Enable to list all emitted files. Requires TypeScript version 2.0 or later.
     */
    listEmittedFiles?: boolean;
    /**
     * Disable size limit for JavaScript project. Requires TypeScript version 2.0 or later.
     */
    disableSizeLimit?: boolean;
    /**
     * List of library files to be included in the compilation. Possible values are: 'ES5', 'ES6', 'ES2015', 'ES7', 'ES2016', 'ES2017', 'ES2018', 'ESNext', 'DOM', 'DOM.Iterable', 'WebWorker', 'ScriptHost', 'ES2015.Core', 'ES2015.Collection', 'ES2015.Generator', 'ES2015.Iterable', 'ES2015.Promise', 'ES2015.Proxy', 'ES2015.Reflect', 'ES2015.Symbol', 'ES2015.Symbol.WellKnown', 'ES2016.Array.Include', 'ES2017.object', 'ES2017.Intl', 'ES2017.SharedMemory', 'ES2017.String', 'ES2017.TypedArrays', 'ES2018.Intl', 'ES2018.Promise', 'ES2018.RegExp', 'ESNext.AsyncIterable', 'ESNext.Array', 'ESNext.Intl', 'ESNext.Symbol'. Requires TypeScript version 2.0 or later.
     */
    lib?: ((
      | (
          | "ES5"
          | "ES6"
          | "ES2015"
          | "ES2015.Collection"
          | "ES2015.Core"
          | "ES2015.Generator"
          | "ES2015.Iterable"
          | "ES2015.Promise"
          | "ES2015.Proxy"
          | "ES2015.Reflect"
          | "ES2015.Symbol.WellKnown"
          | "ES2015.Symbol"
          | "ES2016"
          | "ES2016.Array.Include"
          | "ES2017"
          | "ES2017.Intl"
          | "ES2017.Object"
          | "ES2017.SharedMemory"
          | "ES2017.String"
          | "ES2017.TypedArrays"
          | "ES2018"
          | "ES2018.AsyncGenerator"
          | "ES2018.AsyncIterable"
          | "ES2018.Intl"
          | "ES2018.Promise"
          | "ES2018.Regexp"
          | "ES2019"
          | "ES2019.Array"
          | "ES2019.Object"
          | "ES2019.String"
          | "ES2019.Symbol"
          | "ES2020"
          | "ES2020.BigInt"
          | "ES2020.Promise"
          | "ES2020.String"
          | "ES2020.Symbol.WellKnown"
          | "ESNext"
          | "ESNext.Array"
          | "ESNext.AsyncIterable"
          | "ESNext.BigInt"
          | "ESNext.Intl"
          | "ESNext.Promise"
          | "ESNext.String"
          | "ESNext.Symbol"
          | "DOM"
          | "DOM.Iterable"
          | "ScriptHost"
          | "WebWorker"
          | "WebWorker.ImportScripts"
        )
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
      | {
          [k: string]: unknown;
        }
    ) &
      string)[];
    /**
     * Enable strict null checks. Enabling this setting is recommended. Requires TypeScript version 2.0 or later.
     */
    strictNullChecks?: boolean;
    /**
     * The maximum dependency depth to search under node_modules and load JavaScript files. Only applicable with --allowJs.
     */
    maxNodeModuleJsDepth?: number;
    /**
     * Import emit helpers (e.g. '__extends', '__rest', etc..) from tslib. Requires TypeScript version 2.1 or later.
     */
    importHelpers?: boolean;
    /**
     * This flag controls how imports work. When set to `remove`, imports that only reference types are dropped. When set to `preserve`, imports are never dropped. When set to `error`, imports that can be replaced with `import type` will result in a compiler error. Requires TypeScript version 3.8 or later.
     */
    importsNotUsedAsValues?: "remove" | "preserve" | "error";
    /**
     * Parse in strict mode and emit 'use strict' for each source file. Requires TypeScript version 2.1 or later.
     */
    alwaysStrict?: boolean;
    /**
     * Enable all strict type checking options. Enabling this setting is recommended. Requires TypeScript version 2.3 or later.
     */
    strict?: boolean;
    /**
     * Enable stricter checking of of the `bind`, `call`, and `apply` methods on functions. Enabling this setting is recommended. Requires TypeScript version 3.2 or later.
     */
    strictBindCallApply?: boolean;
    /**
     * Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. Requires TypeScript version 2.3 or later.
     */
    downlevelIteration?: boolean;
    /**
     * Report errors in .js files. Requires TypeScript version 2.3 or later.
     */
    checkJs?: boolean;
    /**
     * Disable bivariant parameter checking for function types. Enabling this setting is recommended. Requires TypeScript version 2.6 or later.
     */
    strictFunctionTypes?: boolean;
    /**
     * Ensure non-undefined class properties are initialized in the constructor. Enabling this setting is recommended. Requires TypeScript version 2.7 or later.
     */
    strictPropertyInitialization?: boolean;
    /**
     * Emit '__importStar' and '__importDefault' helpers for runtime babel ecosystem compatibility and enable '--allowSyntheticDefaultImports' for typesystem compatibility. Enabling this setting is recommended. Requires TypeScript version 2.7 or later.
     */
    esModuleInterop?: boolean;
    /**
     * Allow accessing UMD globals from modules. Requires TypeScript version 3.5 or later.
     */
    allowUmdGlobalAccess?: boolean;
    /**
     * Resolve 'keyof' to string valued property names only (no numbers or symbols). This setting is deprecated. Requires TypeScript version 2.9 or later.
     */
    keyofStringsOnly?: boolean;
    /**
     * Emit ECMAScript standard class fields. Requires TypeScript version 3.7 or later.
     */
    useDefineForClassFields?: boolean;
    /**
     * Generates a sourcemap for each corresponding '.d.ts' file. Requires TypeScript version 2.9 or later.
     */
    declarationMap?: boolean;
    /**
     * Include modules imported with '.json' extension. Requires TypeScript version 2.9 or later.
     */
    resolveJsonModule?: boolean;
    /**
     * Have recompiles in '--incremental' and '--watch' assume that changes within a file will only affect files directly depending on it. Requires TypeScript version 3.8 or later.
     */
    assumeChangesOnlyAffectDirectDependencies?: boolean;
    /**
     * Show verbose diagnostic information.
     */
    extendedDiagnostics?: boolean;
    /**
     * Print names of files that are part of the compilation and then stop processing.
     */
    listFilesOnly?: boolean;
    /**
     * Disable use of source files instead of declaration files from referenced projects. Requires TypeScript version 3.7 or later.
     */
    disableSourceOfProjectReferenceRedirect?: boolean;
    /**
     * Disable solution searching for this project. Requires TypeScript version 3.8 or later.
     */
    disableSolutionSearching?: boolean;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface CompileOnSaveDefinition {
  /**
   * Enable Compile-on-Save for this project.
   */
  compileOnSave?: boolean;
  [k: string]: unknown;
}
export interface TypeAcquisitionDefinition {
  /**
   * Auto type (.d.ts) acquisition options for this project. Requires TypeScript version 2.1 or later.
   */
  typeAcquisition?: {
    /**
     * Enable auto type acquisition
     */
    enable?: boolean;
    /**
     * Specifies a list of type declarations to be included in auto type acquisition. Ex. ["jquery", "lodash"]
     */
    include?: string[];
    /**
     * Specifies a list of type declarations to be excluded from auto type acquisition. Ex. ["jquery", "lodash"]
     */
    exclude?: string[];
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface ExtendsDefinition {
  /**
   * Path to base configuration file to inherit from. Requires TypeScript version 2.1 or later.
   */
  extends?: string;
  [k: string]: unknown;
}
export interface TsNodeDefinition {
  /**
   * ts-node options.  See also: https://github.com/TypeStrong/ts-node#configuration-options
   *
   * ts-node offers TypeScript execution and REPL for node.js, with source map support.
   */
  "ts-node"?: {
    /**
     * Specify a custom TypeScript compiler.
     */
    compiler?: string;
    /**
     * Use TypeScript's compiler host API.
     */
    compilerHost?: boolean;
    /**
     * JSON object to merge with compiler options.
     */
    compilerOptions?: {
      /**
       * The character set of the input files. This setting is deprecated.
       */
      charset?: string;
      /**
       * Enables building for project references. Requires TypeScript version 3.0 or later.
       */
      composite?: boolean;
      /**
       * Generates corresponding d.ts files.
       */
      declaration?: boolean;
      /**
       * Specify output directory for generated declaration files. Requires TypeScript version 2.0 or later.
       */
      declarationDir?: string | null;
      /**
       * Show diagnostic information. This setting is deprecated. See `extendedDiagnostics.`
       */
      diagnostics?: boolean;
      /**
       * Recommend IDE's to load referenced composite projects dynamically instead of loading them all immediately. Requires TypeScript version 4.0 or later.
       */
      disableReferencedProjectLoad?: boolean;
      /**
       * Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files.
       */
      emitBOM?: boolean;
      /**
       * Only emit '.d.ts' declaration files. Requires TypeScript version 2.8 or later.
       */
      emitDeclarationOnly?: boolean;
      /**
       * Enable incremental compilation. Requires TypeScript version 3.4 or later.
       */
      incremental?: boolean;
      /**
       * Specify file to store incremental compilation information. Requires TypeScript version 3.4 or later.
       */
      tsBuildInfoFile?: string;
      /**
       * Emit a single file with source maps instead of having a separate file. Requires TypeScript version 1.5 or later.
       */
      inlineSourceMap?: boolean;
      /**
       * Emit the source alongside the sourcemaps within a single file; requires --inlineSourceMap to be set. Requires TypeScript version 1.5 or later.
       */
      inlineSources?: boolean;
      /**
       * Specify JSX code generation: 'preserve', 'react', 'react-jsx', 'react-jsxdev' or'react-native'. Requires TypeScript version 2.2 or later.
       */
      jsx?: "preserve" | "react" | "react-jsx" | "react-jsxdev" | "react-native";
      /**
       * Specify the object invoked for createElement and __spread when targeting 'react' JSX emit.
       */
      reactNamespace?: string;
      /**
       * Specify the JSX factory function to use when targeting react JSX emit, e.g. 'React.createElement' or 'h'. Requires TypeScript version 2.1 or later.
       */
      jsxFactory?: string;
      /**
       * Specify the JSX Fragment reference to use for fragements when targeting react JSX emit, e.g. 'React.Fragment' or 'Fragment'. Requires TypeScript version 4.0 or later.
       */
      jsxFragmentFactory?: string;
      /**
       * Declare the module specifier to be used for importing the `jsx` and `jsxs` factory functions when using jsx as "react-jsx" or "react-jsxdev". Requires TypeScript version 4.1 or later.
       */
      jsxImportSource?: string;
      /**
       * Print names of files part of the compilation.
       */
      listFiles?: boolean;
      /**
       * Specify the location where debugger should locate map files instead of generated locations
       */
      mapRoot?: string;
      /**
       * Specify module code generation: 'None', 'CommonJS', 'AMD', 'System', 'UMD', 'ES6', 'ES2015', 'ES2020' or 'ESNext'. Only 'AMD' and 'System' can be used in conjunction with --outFile.
       */
      module?: (
        | ("CommonJS" | "AMD" | "System" | "UMD" | "ES6" | "ES2015" | "ES2020" | "ESNext" | "None")
        | {
            [k: string]: unknown;
          }
      ) &
        string;
      /**
       * Specifies module resolution strategy: 'node' (Node) or 'classic' (TypeScript pre 1.6) .
       */
      moduleResolution?: (
        | ("Classic" | "Node")
        | {
            [k: string]: unknown;
          }
      ) &
        string;
      /**
       * Specifies the end of line sequence to be used when emitting files: 'crlf' (Windows) or 'lf' (Unix). Requires TypeScript version 1.5 or later.
       */
      newLine?: (
        | ("crlf" | "lf")
        | {
            [k: string]: unknown;
          }
      ) &
        string;
      /**
       * Do not emit output.
       */
      noEmit?: boolean;
      /**
       * Do not generate custom helper functions like __extends in compiled output. Requires TypeScript version 1.5 or later.
       */
      noEmitHelpers?: boolean;
      /**
       * Do not emit outputs if any type checking errors were reported. Requires TypeScript version 1.4 or later.
       */
      noEmitOnError?: boolean;
      /**
       * Warn on expressions and declarations with an implied 'any' type. Enabling this setting is recommended.
       */
      noImplicitAny?: boolean;
      /**
       * Raise error on 'this' expressions with an implied any type. Enabling this setting is recommended. Requires TypeScript version 2.0 or later.
       */
      noImplicitThis?: boolean;
      /**
       * Report errors on unused locals. Requires TypeScript version 2.0 or later.
       */
      noUnusedLocals?: boolean;
      /**
       * Report errors on unused parameters. Requires TypeScript version 2.0 or later.
       */
      noUnusedParameters?: boolean;
      /**
       * Do not include the default library file (lib.d.ts).
       */
      noLib?: boolean;
      /**
       * Do not add triple-slash references or module import targets to the list of compiled files.
       */
      noResolve?: boolean;
      /**
       * Disable strict checking of generic signatures in function types. Requires TypeScript version 2.4 or later.
       */
      noStrictGenericChecks?: boolean;
      /**
       * Use `skipLibCheck` instead. Skip type checking of default library declaration files.
       */
      skipDefaultLibCheck?: boolean;
      /**
       * Skip type checking of declaration files. Enabling this setting is recommended. Requires TypeScript version 2.0 or later.
       */
      skipLibCheck?: boolean;
      /**
       * Concatenate and emit output to single file.
       */
      outFile?: string;
      /**
       * Redirect output structure to the directory.
       */
      outDir?: string;
      /**
       * Do not erase const enum declarations in generated code.
       */
      preserveConstEnums?: boolean;
      /**
       * Do not resolve symlinks to their real path; treat a symlinked file like a real one.
       */
      preserveSymlinks?: boolean;
      /**
       * Keep outdated console output in watch mode instead of clearing the screen.
       */
      preserveWatchOutput?: boolean;
      /**
       * Stylize errors and messages using color and context (experimental).
       */
      pretty?: boolean;
      /**
       * Do not emit comments to output.
       */
      removeComments?: boolean;
      /**
       * Specifies the root directory of input files. Use to control the output directory structure with --outDir.
       */
      rootDir?: string;
      /**
       * Unconditionally emit imports for unresolved files.
       */
      isolatedModules?: boolean;
      /**
       * Generates corresponding '.map' file.
       */
      sourceMap?: boolean;
      /**
       * Specifies the location where debugger should locate TypeScript files instead of source locations.
       */
      sourceRoot?: string;
      /**
       * Suppress excess property checks for object literals. It is recommended to use @ts-ignore comments instead of enabling this setting.
       */
      suppressExcessPropertyErrors?: boolean;
      /**
       * Suppress noImplicitAny errors for indexing objects lacking index signatures. It is recommended to use @ts-ignore comments instead of enabling this setting.
       */
      suppressImplicitAnyIndexErrors?: boolean;
      /**
       * Do not emit declarations for code that has an '@internal' annotation.
       */
      stripInternal?: boolean;
      /**
       * Specify ECMAScript target version: 'ES3', 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ESNext'
       */
      target?: (
        | (
            | "ES3"
            | "ES5"
            | "ES6"
            | "ES2015"
            | "ES2016"
            | "ES2017"
            | "ES2018"
            | "ES2019"
            | "ES2020"
            | "ESNext"
          )
        | {
            [k: string]: unknown;
          }
      ) &
        string;
      /**
       * Watch input files.
       */
      watch?: boolean;
      /**
       * Specify the polling strategy to use when the system runs out of or doesn't support native file watchers. Requires TypeScript version 3.8 or later.
       */
      fallbackPolling?:
        | "fixedPollingInterval"
        | "priorityPollingInterval"
        | "dynamicPriorityPolling";
      /**
       * Specify the strategy for watching directories under systems that lack recursive file-watching functionality. Requires TypeScript version 3.8 or later.
       */
      watchDirectory?: "useFsEvents" | "fixedPollingInterval" | "dynamicPriorityPolling";
      /**
       * Specify the strategy for watching individual files. Requires TypeScript version 3.8 or later.
       */
      watchFile?:
        | "fixedPollingInterval"
        | "priorityPollingInterval"
        | "dynamicPriorityPolling"
        | "useFsEvents"
        | "useFsEventsOnParentDirectory";
      /**
       * Enables experimental support for ES7 decorators.
       */
      experimentalDecorators?: boolean;
      /**
       * Emit design-type metadata for decorated declarations in source.
       */
      emitDecoratorMetadata?: boolean;
      /**
       * Do not report errors on unused labels. Requires TypeScript version 1.8 or later.
       */
      allowUnusedLabels?: boolean;
      /**
       * Report error when not all code paths in function return a value. Requires TypeScript version 1.8 or later.
       */
      noImplicitReturns?: boolean;
      /**
       * Add `undefined` to an un-declared field in a type. Requires TypeScript version 4.1 or later.
       */
      noUncheckedIndexedAccess?: boolean;
      /**
       * Report errors for fallthrough cases in switch statement. Requires TypeScript version 1.8 or later.
       */
      noFallthroughCasesInSwitch?: boolean;
      /**
       * Do not report errors on unreachable code. Requires TypeScript version 1.8 or later.
       */
      allowUnreachableCode?: boolean;
      /**
       * Disallow inconsistently-cased references to the same file. Enabling this setting is recommended.
       */
      forceConsistentCasingInFileNames?: boolean;
      /**
       * Emit a v8 CPI profile during the compiler run, which may provide insight into slow builds. Requires TypeScript version 3.7 or later.
       */
      generateCpuProfile?: string;
      /**
       * Base directory to resolve non-relative module names.
       */
      baseUrl?: string;
      /**
       * Specify path mapping to be computed relative to baseUrl option.
       */
      paths?: {
        [k: string]: string[];
      };
      /**
       * List of TypeScript language server plugins to load. Requires TypeScript version 2.3 or later.
       */
      plugins?: {
        /**
         * Plugin name.
         */
        name?: string;
        [k: string]: unknown;
      }[];
      /**
       * Specify list of root directories to be used when resolving modules. Requires TypeScript version 2.0 or later.
       */
      rootDirs?: string[];
      /**
       * Specify list of directories for type definition files to be included. Requires TypeScript version 2.0 or later.
       */
      typeRoots?: string[];
      /**
       * Type declaration files to be included in compilation. Requires TypeScript version 2.0 or later.
       */
      types?: string[];
      /**
       * Enable tracing of the name resolution process. Requires TypeScript version 2.0 or later.
       */
      traceResolution?: boolean;
      /**
       * Allow javascript files to be compiled. Requires TypeScript version 1.8 or later.
       */
      allowJs?: boolean;
      /**
       * Do not truncate error messages. This setting is deprecated.
       */
      noErrorTruncation?: boolean;
      /**
       * Allow default imports from modules with no default export. This does not affect code emit, just typechecking. Requires TypeScript version 1.8 or later.
       */
      allowSyntheticDefaultImports?: boolean;
      /**
       * Do not emit 'use strict' directives in module output.
       */
      noImplicitUseStrict?: boolean;
      /**
       * Enable to list all emitted files. Requires TypeScript version 2.0 or later.
       */
      listEmittedFiles?: boolean;
      /**
       * Disable size limit for JavaScript project. Requires TypeScript version 2.0 or later.
       */
      disableSizeLimit?: boolean;
      /**
       * List of library files to be included in the compilation. Possible values are: 'ES5', 'ES6', 'ES2015', 'ES7', 'ES2016', 'ES2017', 'ES2018', 'ESNext', 'DOM', 'DOM.Iterable', 'WebWorker', 'ScriptHost', 'ES2015.Core', 'ES2015.Collection', 'ES2015.Generator', 'ES2015.Iterable', 'ES2015.Promise', 'ES2015.Proxy', 'ES2015.Reflect', 'ES2015.Symbol', 'ES2015.Symbol.WellKnown', 'ES2016.Array.Include', 'ES2017.object', 'ES2017.Intl', 'ES2017.SharedMemory', 'ES2017.String', 'ES2017.TypedArrays', 'ES2018.Intl', 'ES2018.Promise', 'ES2018.RegExp', 'ESNext.AsyncIterable', 'ESNext.Array', 'ESNext.Intl', 'ESNext.Symbol'. Requires TypeScript version 2.0 or later.
       */
      lib?: ((
        | (
            | "ES5"
            | "ES6"
            | "ES2015"
            | "ES2015.Collection"
            | "ES2015.Core"
            | "ES2015.Generator"
            | "ES2015.Iterable"
            | "ES2015.Promise"
            | "ES2015.Proxy"
            | "ES2015.Reflect"
            | "ES2015.Symbol.WellKnown"
            | "ES2015.Symbol"
            | "ES2016"
            | "ES2016.Array.Include"
            | "ES2017"
            | "ES2017.Intl"
            | "ES2017.Object"
            | "ES2017.SharedMemory"
            | "ES2017.String"
            | "ES2017.TypedArrays"
            | "ES2018"
            | "ES2018.AsyncGenerator"
            | "ES2018.AsyncIterable"
            | "ES2018.Intl"
            | "ES2018.Promise"
            | "ES2018.Regexp"
            | "ES2019"
            | "ES2019.Array"
            | "ES2019.Object"
            | "ES2019.String"
            | "ES2019.Symbol"
            | "ES2020"
            | "ES2020.BigInt"
            | "ES2020.Promise"
            | "ES2020.String"
            | "ES2020.Symbol.WellKnown"
            | "ESNext"
            | "ESNext.Array"
            | "ESNext.AsyncIterable"
            | "ESNext.BigInt"
            | "ESNext.Intl"
            | "ESNext.Promise"
            | "ESNext.String"
            | "ESNext.Symbol"
            | "DOM"
            | "DOM.Iterable"
            | "ScriptHost"
            | "WebWorker"
            | "WebWorker.ImportScripts"
          )
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
        | {
            [k: string]: unknown;
          }
      ) &
        string)[];
      /**
       * Enable strict null checks. Enabling this setting is recommended. Requires TypeScript version 2.0 or later.
       */
      strictNullChecks?: boolean;
      /**
       * The maximum dependency depth to search under node_modules and load JavaScript files. Only applicable with --allowJs.
       */
      maxNodeModuleJsDepth?: number;
      /**
       * Import emit helpers (e.g. '__extends', '__rest', etc..) from tslib. Requires TypeScript version 2.1 or later.
       */
      importHelpers?: boolean;
      /**
       * This flag controls how imports work. When set to `remove`, imports that only reference types are dropped. When set to `preserve`, imports are never dropped. When set to `error`, imports that can be replaced with `import type` will result in a compiler error. Requires TypeScript version 3.8 or later.
       */
      importsNotUsedAsValues?: "remove" | "preserve" | "error";
      /**
       * Parse in strict mode and emit 'use strict' for each source file. Requires TypeScript version 2.1 or later.
       */
      alwaysStrict?: boolean;
      /**
       * Enable all strict type checking options. Enabling this setting is recommended. Requires TypeScript version 2.3 or later.
       */
      strict?: boolean;
      /**
       * Enable stricter checking of of the `bind`, `call`, and `apply` methods on functions. Enabling this setting is recommended. Requires TypeScript version 3.2 or later.
       */
      strictBindCallApply?: boolean;
      /**
       * Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. Requires TypeScript version 2.3 or later.
       */
      downlevelIteration?: boolean;
      /**
       * Report errors in .js files. Requires TypeScript version 2.3 or later.
       */
      checkJs?: boolean;
      /**
       * Disable bivariant parameter checking for function types. Enabling this setting is recommended. Requires TypeScript version 2.6 or later.
       */
      strictFunctionTypes?: boolean;
      /**
       * Ensure non-undefined class properties are initialized in the constructor. Enabling this setting is recommended. Requires TypeScript version 2.7 or later.
       */
      strictPropertyInitialization?: boolean;
      /**
       * Emit '__importStar' and '__importDefault' helpers for runtime babel ecosystem compatibility and enable '--allowSyntheticDefaultImports' for typesystem compatibility. Enabling this setting is recommended. Requires TypeScript version 2.7 or later.
       */
      esModuleInterop?: boolean;
      /**
       * Allow accessing UMD globals from modules. Requires TypeScript version 3.5 or later.
       */
      allowUmdGlobalAccess?: boolean;
      /**
       * Resolve 'keyof' to string valued property names only (no numbers or symbols). This setting is deprecated. Requires TypeScript version 2.9 or later.
       */
      keyofStringsOnly?: boolean;
      /**
       * Emit ECMAScript standard class fields. Requires TypeScript version 3.7 or later.
       */
      useDefineForClassFields?: boolean;
      /**
       * Generates a sourcemap for each corresponding '.d.ts' file. Requires TypeScript version 2.9 or later.
       */
      declarationMap?: boolean;
      /**
       * Include modules imported with '.json' extension. Requires TypeScript version 2.9 or later.
       */
      resolveJsonModule?: boolean;
      /**
       * Have recompiles in '--incremental' and '--watch' assume that changes within a file will only affect files directly depending on it. Requires TypeScript version 3.8 or later.
       */
      assumeChangesOnlyAffectDirectDependencies?: boolean;
      /**
       * Show verbose diagnostic information.
       */
      extendedDiagnostics?: boolean;
      /**
       * Print names of files that are part of the compilation and then stop processing.
       */
      listFilesOnly?: boolean;
      /**
       * Disable use of source files instead of declaration files from referenced projects. Requires TypeScript version 3.7 or later.
       */
      disableSourceOfProjectReferenceRedirect?: boolean;
      /**
       * Disable solution searching for this project. Requires TypeScript version 3.8 or later.
       */
      disableSolutionSearching?: boolean;
      [k: string]: unknown;
    };
    /**
     * Emit output files into `.ts-node` directory.
     */
    emit?: boolean;
    /**
     * Load files from `tsconfig.json` on startup.
     */
    files?: boolean;
    /**
     * Override the path patterns to skip compilation.
     */
    ignore?: string & string[];
    /**
     * Ignore TypeScript warnings by diagnostic code.
     */
    ignoreDiagnostics?: (string | number)[];
    /**
     * Logs TypeScript errors to stderr instead of throwing exceptions.
     */
    logError?: boolean;
    /**
     * Re-order file extensions so that TypeScript imports are preferred.
     */
    preferTsExts?: boolean;
    /**
     * Use pretty diagnostic formatter.
     */
    pretty?: boolean;
    /**
     * Modules to require, like node's `--require` flag.
     *
     * If specified in tsconfig.json, the modules will be resolved relative to the tsconfig.json file.
     *
     * If specified programmatically, each input string should be pre-resolved to an absolute path for
     * best results.
     */
    require?: string[];
    /**
     * Scope compiler to files within `cwd`.
     */
    scope?: boolean;
    /**
     * Skip ignore check.
     */
    skipIgnore?: boolean;
    /**
     * Use TypeScript's faster `transpileModule`.
     */
    transpileOnly?: boolean;
    /**
     * **DEPRECATED** Specify type-check is enabled (e.g. `transpileOnly == false`).
     */
    typeCheck?: boolean;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
export interface FilesDefinition {
  /**
   * If no 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to including all files in the containing directory and subdirectories except those specified by 'exclude'. When a 'files' property is specified, only those files and those specified by 'include' are included.
   */
  files?: string[];
  [k: string]: unknown;
}
export interface ExcludeDefinition {
  /**
   * Specifies a list of files to be excluded from compilation. The 'exclude' property only affects the files included via the 'include' property and not the 'files' property. Glob patterns require TypeScript version 2.0 or later.
   */
  exclude?: string[];
  [k: string]: unknown;
}
export interface IncludeDefinition {
  /**
   * Specifies a list of glob patterns that match files to be included in compilation. If no 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to including all files in the containing directory and subdirectories except those specified by 'exclude'. Requires TypeScript version 2.0 or later.
   */
  include?: string[];
  [k: string]: unknown;
}
export interface ReferencesDefinition {
  /**
   * Referenced projects. Requires TypeScript version 3.0 or later.
   */
  references?: {
    /**
     * Path to referenced tsconfig or to folder containing tsconfig.
     */
    path?: string;
    [k: string]: unknown;
  }[];
  [k: string]: unknown;
}
