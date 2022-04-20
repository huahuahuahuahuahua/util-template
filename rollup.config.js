/*
 * @Author: t_winkjqzhang
 * @Date: 2022-03-31 14:34:38
 * @LastEditTime: 2022-04-09 01:39:23
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
