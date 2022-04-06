/*
 * @Author: t_winkjqzhang
 * @Date: 2022-03-31 14:34:38
 * @LastEditTime: 2022-04-02 14:38:35
 * @Description: Do not edit
 */
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import path from "path";
import { RollupOptions } from "rollup";
import rollupTypescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import clear from "rollup-plugin-clear";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { eslint } from "rollup-plugin-eslint";

import pkg from "./package.json";

const jsName = "main";
const production = process.env.NODE_ENV === "production";
const development = process.env.NODE_ENV === "development";
const ext = production ? "min.js" : "js";
/** 输入的文件夹 */
let g_d_input_path = "src";

/** 输出的文件夹 */
let g_d_ouput_path = "dist";
/** 需要编译的文件名（不带后缀名） */
let g_d_input_file_name_no_ext_list = pkg._need_handle_files;

let g_d_plugins_01 = [
  clear({
    targets: ["dist"],
  }),
  ,
  // 验证导入的文件
  // eslint({
  //   throwOnError: false, // lint 结果有错误将会抛出异常
  //   throwOnWarning: false,
  //   include: ['src/*.ts'],
  //   exclude: ['node_modules/**', 'dist/**', '*.js'],
  // }),
  nodePolyfills(),
  typescript(),
  commonjs(), // 配合 commnjs 解析第三方模块
  resolve({
    // 将自定义选项传递给解析插件
    customResolveOptions: {
      moduleDirectory: "node_modules",
    },
  }),
  json(),
];
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
      input: `${g_d_input_path}/${name}.ts`,
      output: [
        {
          file: `${g_d_ouput_path}/${name}.js`,
          format: "esm",
        },
      ],
      external: g_d_3rd_lib_dep.concat(
        g_d_input_file_name_no_ext_list
          .filter((n) => n !== name)
          .map((n) => path.resolve(`./src/${n}.ts`))
      ),
      plugins: g_d_plugins_01.concat(
        replace({
          values: d_replace_obj,
          preventAssign: true,
        })
      ),
    };
  })
);

export default g_d_tasks_list;
