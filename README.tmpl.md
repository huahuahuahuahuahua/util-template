# util-template

使用模板公共库

模板提供给的命令行地址：

[winkcli-main](https://github.com/huahuahuahuahuahua/winkcli-main/tree/master/)

实现的需求：🤔

- 支持编辑器的快速补全和提示
- 自动化构建
- 支持自动生成 changlog
- 代码通过 lint 和测试后才能提交、发布

## 涉及的库

- eslint + @typescript-eslint/parser 检测 ts
- typescript ts 库
- @rollup ts 打包工具
- jest 测试工具
- @microsoft/api-extractor .d.ts 打包
- gulp 打包
- husky+lint-staged 预编译
- typedoc 生成文档

## 目录结构

```shell

├───.husky
│   └───_
├───src   工具开发
├───README.md 文档
├───README.tmpl.md 公共文档（可生成README.md）
├───test  测试
└───...配置文件

```

## 示例代码

如需直接使用

```shell
npm run build --文件打包
npm run dev  --监听ts文件
npm run doc --生成文档
npm run lint--测试
npm run release--npm发布
```

## 整体实现

### 初始化项目

```shell
mkdir util-template 新建文件夹
cd util-template
npm init 初始化
```

### 安装 [TypeScript](https://link.juejin.cn/?target=https%3A%2F%2Fwww.tslang.cn%2Fdocs%2Fhome.html)

```
npm i -D typescript
```

创建 `src` 目录，入口文件，以及 ts 的配置文件

```
util-template
 |
 |- src
 	 |- main.ts
 |- test
 	 |- main.test.ts
 |- tsconfig.json
```

### tsconfig.json 文件配置

```shell
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */
    /* Basic Options */
    // "incremental": true,                         /* Enable incremental compilation */
    "target": "es5", /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', 'ES2021', or 'ESNEXT'. */
    "module": "commonjs", /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": ["es6"],
    "allowJs": true, /* Allow javascript files to be compiled. */
    // "checkJs": true,                             /* Report errors in .js files. */
    // "jsx": "preserve",                           /* Specify JSX code generation: 'preserve', 'react-native', 'react', 'react-jsx' or 'react-jsxdev'. */
    "declaration": true, /* Generates corresponding '.d.ts' file. */
    "declarationDir": "./types",
    // "declarationMap": true,                      /* Generates a sourcemap for each corresponding '.d.ts' file. */
    // "sourceMap": true,                           /* Generates corresponding '.map' file. */
    // "outFile": "./",                             /* Concatenate and emit output to single file. */
    // "outDir": "./",                              /* Redirect output structure to the directory. */
    // "rootDir": "./",                             /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                           /* Enable project compilation */
    // "tsBuildInfoFile": "./",                     /* Specify file to store incremental compilation information */
    // "removeComments": true,                      /* Do not emit comments to output. */
    // "noEmit": true,                              /* Do not emit outputs. */
    // "importHelpers": true,                       /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,                  /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,                     /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */
    /* Strict Type-Checking Options */
    "strict": true, /* Enable all strict type-checking options. */
    "noImplicitAny": false, /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                    /* Enable strict null checks. */
    // "strictFunctionTypes": true,                 /* Enable strict checking of function types. */
    // "strictBindCallApply": true,                 /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,        /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                      /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                        /* Parse in strict mode and emit "use strict" for each source file. */
    /* Additional Checks */
    // "noUnusedLocals": true,                      /* Report errors on unused locals. */
    // "noUnusedParameters": true,                  /* Report errors on unused parameters. */
    // "noImplicitReturns": true,                   /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,          /* Report errors for fallthrough cases in switch statement. */
    // "noUncheckedIndexedAccess": true,            /* Include 'undefined' in index signature results */
    // "noImplicitOverride": true,                  /* Ensure overriding members in derived classes are marked with an 'override' modifier. */
    // "noPropertyAccessFromIndexSignature": true,  /* Require undeclared properties from index signatures to use element accesses. */
    /* Module Resolution Options */
    "moduleResolution": "node", /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                             /* Base directory to resolve non-absolute module names. */
    // "paths": {},                                 /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. */
    // "rootDirs": [],                              /* List of root folders whose combined content represents the structure of the project at runtime. */
    "typeRoots": [
      "node_modules/@types",
      "@types"
    ], /* List of folders to include type definitions from. */
    // "types": [],                                 /* Type declaration files to be included in compilation. */
    "allowSyntheticDefaultImports": true, /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true, /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,                    /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,                /* Allow accessing UMD globals from modules. */
    /* Source Map Options */
    // "sourceRoot": "",                            /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                               /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                     /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                       /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */
    /* Experimental Options */
    // "experimentalDecorators": true,              /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,               /* Enables experimental support for emitting type metadata for decorators. */
    /* Advanced Options */
    "skipLibCheck": true, /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true /* Disallow inconsistently-cased references to the same file. */
  },
  "exclude": [
    "node_modules",
    "dist",
    "gulpfile.js",
    "jest.config.js",
    "rollup.config.js",
  ],
  "include": [
    "src",
    "*.js",
    "test",
    "types",
    "gulpfile.ts",
  ],
}
```

### 配置 tsconfig.eslint.json

```shell
/* tsconfig.eslint.json */
{
    "compilerOptions": {
        "baseUrl": ".",
        "resolveJsonModule": true,
        "forceConsistentCasingInFileNames":true,
        "strict": true
    },
    "include": [
        "**/*.ts",
        "**/*.js"
    ],
}
```

### 配置 .eslintrc.js

```shell
// .eslintrc.js
const eslintrc = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension

      // As mentioned in the comments, you should extend TypeScript plugins here,
      // instead of extending them outside the `overrides`.
      // If you don't want to extend any rules, you don't need an `extends` attribute.
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],

      parserOptions: {
        project: ["./tsconfig.json"], // Specify it only for TypeScript files
      },
    },
  ],
  extends: [
    // "eslint:recommended", // eslint 推荐规则
    // "plugin:@typescript-eslint/recommended", // ts 推荐规则
    // "plugin:@typescript-eslint/eslint-recommended",
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    project: "./tsconfig.eslint.json",
    ecmaVersion: 2019,
    sourceType: "module",
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
  },
  rules: {}, // 自定义
};

module.exports = eslintrc;
```

### 配置 rollup(安装请看 package.json)

### 配置 .babelrc

```shell
/* .babelrc */
{
  "presets": [
    [
      "@babel/preset-env",
      {
        /* Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS，导致 Rollup 的一些处理失败 */
        "modules": false
      }
    ]
  ]
}
```

### 配置 rollup.config.js

```shell
/*
 * @Author: t_winkjqzhang
 * @Date: 2022-03-31 14:34:38
 * @LastEditTime: 2022-04-08 00:11:18
 * @Description: Do not edit
 */
import resolve from "@rollup/plugin-node-resolve";
import path from "path";
import commonjs from "rollup-plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import replace from "@rollup/plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import clear from "rollup-plugin-clear";
import nodePolyfills from "rollup-plugin-polyfill-node";
import pkg from "./package.json";
const production = process.env.NODE_ENV === "production";
const development = process.env.NODE_ENV === "development";
const ext = production ? "min.js" : "js";
/** 输入的文件夹 */
let g_d_input_path = "src";

/** 输出的文件夹 */
let g_d_ouput_path = "dist";
/** 需要编译的文件名（不带后缀名） */
let g_d_input_file_name_no_ext_list = pkg._need_handle_files;
//插件配置
let g_d_plugins_01 = [
  //清除dist打包文件
  clear({
    targets: ["dist"],
  }),
  // ts 的功能只在于编译出声明文件，所以 target 为 ESNext，编译交给 babel 来做
  typescript({
    tsconfig: "./tsconfig.json",
  }),
  //Allows the node builtins to be d/ed.requireimport
  nodePolyfills(),
  resolve({
    // 将自定义选项传递给解析插件
    customResolveOptions: {
      moduleDirectory: "node_modules",
    },
  }),
  commonjs(), // 配合 commnjs 解析第三方模块
  babel({
    babelHelpers: "runtime",
    // 只转换源代码，不运行外部依赖
    exclude: "node_modules/**",
    // babel 默认不支持 ts 需要手动添加
    extensions: [...DEFAULT_EXTENSIONS, ".ts"],
  }),
  //一个汇总插件，可将 .json 文件转换为 ES6 模块。
  json(),
];
//添加丑化插件
let g_d_plugins_02 = g_d_plugins_01.concat([uglify()]);
let g_d_3rd_lib_dep = ["axios"];
let g_d_tasks_list = [].concat(
  // 打包成无依赖、有压缩的 umd 文件，适用于页面通过 amd、cmd、直接引入的方式使用
  // （因为要能独立使用，所以依赖必须打包进去，文件也必须压缩）
  g_d_input_file_name_no_ext_list.map((name) => {
    let d_replace_obj = {};
    g_d_input_file_name_no_ext_list.forEach((n) => {
      d_replace_obj[`${n}.ts`] = n;
    });
    return {
      //amd为AMD标准，cjs为CommonJS标准，esm\es为ES模块标准，iife为立即调用函数， umd同时支持amd、cjs和iife。
      input: `${g_d_input_path}/${name}.ts`,
      output: [
        // 输出 commonjs 规范的代码
        {
          file: ` ${g_d_ouput_path}/${name}.js`,
          format: "cjs",
          name: pkg.name,
        },
        // 输出 es 规范的代码
        {
          file: `${g_d_ouput_path}/${name}.esm.js`,
          format: "esm",
        },
      ],
      external: g_d_3rd_lib_dep.concat(
        g_d_input_file_name_no_ext_list
          .filter((n) => n !== name)
          .map((n) => path.resolve(`./src/${n}.ts`))
      ),
      plugins: g_d_plugins_02.concat(
        replace({
          values: d_replace_obj,
          preventAssign: true,
        })
      ),
    };
  })
);

export default g_d_tasks_list;
```

### 配置 jest

工具库需要写测试

### 安装

```
yarn add -D @types/jest eslint-plugin-jest jest ts-jest
```

### 配置 jest.config.js

```shell
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
}
```

### main.ts

```shell
"use strict";

// 静态加载

export function main() {
  console.log("hello world");
}
export default main;
```

### main.test.ts

```shell
import main from "../src/main";
describe("Name of the group", () => {
  test("should ", () => {
    console.log = jest.fn();
    main();
    // The first argument of the first call to the function was 'hello'
    expect(console.log).toHaveBeenCalledWith("hello world");
  });
});
```

### 增加 package.json scripts

```shell
"test": "jest --coverage --verbose -u"
```

- coverage 输出测试覆盖率
- verbose 层次显示测试套件中每个测试的结果，会看着更加直观啦

### 配置 gulpfile

构建流程 🤔

1. eslint 检测代码--taskeslint
2. 删除 dist 文件，Rollup 重新打包 --taskBuildTsProject
3. 读取 commit，写到日志--taskchangelog
4. 构建文档 --exports.buildTypes
5. api-extractor 生成统一的声明文件，然后 删除多余的声明文件
6. 生成 umd 和 esm 的模块代码 --taskBuildUmdEsm
7. 完成

```shell
//eslint检测代码--jest测试
const taskeslint = () => {
  return new Promise(function (resolve, reject) {
    const cmdStr = `${path.resolve(
      "./node_modules/.bin/eslint"
    )} --fix --ext .js,.ts  ${paths.src}`;
    exec(cmdStr, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.warn(new Date(), " eslint编译命令执行失败");
      } else {
        console.log(stdout);
        console.warn(new Date(), " eslint编译命令执行成功");
      }
    });

    resolve();
  });
};
```

```shell
/** 删除 dist文件，Rollup 重新打包 */
const taskBuildTsProject = (done) => {
  const cmdStr = `${path.resolve("./node_modules/.bin/rollup")} -c`;
  exec(cmdStr, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      console.warn(new Date(), " 打包执行失败");
    } else {
      console.log(stdout);
      console.warn(new Date(), " 打包执行成功");
    }
  });
  done();
};
```

```shell
读取commit，写到日志
//读取commit 修改CHANGELOG.md
const taskchangelog = async (cb) => {
  const changelogPath = path.join(paths.root, "CHANGELOG.md");
  // 对命令 conventional-changelog -p angular -i CHANGELOG.md -w -r 0
  const changelogPipe = await conventionalChangelog({
    preset: "angular",
    releaseCount: 0,
  });
  changelogPipe.setEncoding("utf8");

  const resultArray = ["# 工具库更新日志\n\n"];
  changelogPipe.on("data", (chunk) => {
    // 原来的 commits 路径是进入提交列表
    chunk = chunk.replace(/\/commits\//g, "/commit/");
    resultArray.push(chunk);
  });
  changelogPipe.on("end", async () => {
    await fs.createWriteStream(changelogPath).write(resultArray.join(""));
    cb();
  });
};
```

```shell
构建文档(代码过多不展示)
exports.buildTypes = gulp.series(
  taskCleanTypes,--清除 types 文件
  taskOutputTypes,--使用 tsc 输出 .d.ts
  taskCleanTypesDirUnuseFile,--清除 types 文件
  exports.doc --type doc 任务
  apiExtractorGenerate
);

```

### 优化开发流程

### 安装

```
yarn add -D husky lint-staged
```

### package.json

```
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged & jest -u"
    }
  },
  "lint-staged": {
    "*.{.ts,.js}": [
      "eslint",
      "git add"
    ]
  }

```

之后提交代码都会先 lint 验证，再 jest 测试通过，才可以提交。规范团队协作的代码规范

### 仓库地址

[huahuahuahuahuahua/util-template: 提供给 winkcli-main 的模板库 (github.com)](https://github.com/huahuahuahuahuahua/util-template)

## 参考

[TypeScript、Rollup 搭建工具库 - 掘金 (juejin.cn)](https://juejin.cn/post/6844904035309322254#heading-36)

[gulp](https://link.juejin.cn/?target=https%3A%2F%2Fwww.gulpjs.com.cn%2Fdocs%2Fgetting-started%2Fquick-start%2F)

[Commit message 和 Change log 编写指南](https://link.juejin.cn/?target=https%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2016%2F01%2Fcommit_message_change_log.html)

#### 本文章链接：

[学习用 ts+gulp+rollup 写一个工具库 - 掘金 (juejin.cn)](https://juejin.cn/post/7083911355509506055/)

## Support

Tested in Chrome 74-75, Firefox 66-67, IE 11, Edge 18, Safari 11-12, & Node.js 8-12.

## 文件（模块）说明

<TYPEDOC />

## 版本更新

<CHANGELOG />

## LICENSE

MIT
