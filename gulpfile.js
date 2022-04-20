const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const { exec } = require("child_process");
const clean = require("gulp-clean");
const typedoc = require("gulp-typedoc");
const pkg = require("./package.json");
const conventionalChangelog = require("conventional-changelog");
const { resolve } = require("path");
/** 需要编译的文件名（不带后缀名） */
let inputFileNameNoExtList = pkg._need_handle_files;
const paths = {
  root: path.join(__dirname, "/"),
  src: path.join(__dirname, "src"),
  dist: path.join(__dirname, "/dist"),
};
/**
 * 首字母变大写
 *
 * @example
 *  firstCharUpperCase( 'utils' ) // 'Utils'
 *  firstCharUpperCase( 'utils.query' ) // 'UtilsQuery'
 *
 * @param {string} str 字符串
 *
 * @returns {string} 首字母变大写后字符串
 */
let firstCharUpperCase = (str) => {
  return str
    .split(".")
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
    .join("");
};
let addEsmMiddle = (str) => {
  return str.split(".").join(".esm.");
};

function sh(commend, cwd = "./") {
  return new Promise(function (resolve, reject) {
    const work = exec(commend, { cwd: cwd }, function (err, stdout, stderr) {
      // console.log(err, stderr)
      if (err) {
        // console.log(err);
        resolve({
          code: -1,
          msg: JSON.stringify(err),
        });
      } else {
        // console.log(`stdout: ${stdout}`);
        resolve({
          code: 1,
          stdout,
        });
      }
    });

    work.stdout.on("data", function (data) {
      console.log("stdout: " + data);
    });

    work.stderr.on("data", function (data) {
      console.log("stderr: " + data);
    });
  });
}

/** 清除 types 文件 */
const taskCleanTypes = () =>
  gulp.src("types", { allowEmpty: true }).pipe(clean());

/** 使用 tsc 输出 .d.ts */
const taskOutputTypes = () => {
  const cmdStr = `${path.resolve(
    "./node_modules/.bin/tsc"
  )} ${inputFileNameNoExtList
    .filter((name) => !/\./.test(name))
    .map((name) => `./src/${name}.ts`)
    .join(" ")} --declaration --declarationDir ./types --outDir ./types `;
  return new Promise((resolve, reject) => {
    exec(cmdStr, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        console.warn(new Date(), " 打包ts命令执行失败");
        reject(err);
      } else {
        console.log(stdout);
        console.warn(new Date(), " 打包ts命令执行成功");
        resolve();
      }
    });
  }).then(() => {
    // exec(
    //   `del ${path.resolve(paths.root, "types/*.js")}`,
    //   (err, stdout, stderr) => {
    //     if (err) {
    //       console.log(err);
    //       console.warn(new Date(), " 清除js命令执行失败");
    //     } else {
    //       console.log(stdout);
    //       console.warn(new Date(), " 清除js命令执行成功");
    //     }
    //   }
    // );
  });
};

/** 清除 types 文件 */
const taskCleanTypesDirUnuseFile = (done) => {
  gulp.src("types/*.js", { allowEmpty: true }).pipe(clean());
  done();
};
// const taskCleanDistJs = () => {
//   gulp.src("dist/*.js", { allowEmpty: true }).pipe(clean());
//   gulp.src("dist/*.esm.js", { allowEmpty: true }).pipe(clean());
// };
/** 使用 rollup 构建 ts 项目 */
// const taskBuildTsProject = () =>
//   exec(`${path.resolve("./node_modules/.bin/rollup")} -c`);

/** 使用 parcel 构建 umd 项目 */
const taskBuildUmdEsm = () =>
  Promise.all(
    inputFileNameNoExtList.map((name) => {
      //输出common.js模块
      exec(
        `${path.resolve(
          "./node_modules/.bin/parcel"
        )} build ./src/${name}.ts -d ./dist/umd --global singsutils${firstCharUpperCase(
          name
        )}`
      );
      exec(
        `${path.resolve(
          "./node_modules/.bin/parcel"
        )} build ./src/${name}.ts -d ./dist/esm --global singsutils${firstCharUpperCase(
          addEsmMiddle(name)
        )}`
      );
    })
  );
/** 输出 README.md */
const taskOutputReadme = () => {
  return new Promise((resolve) => {
    console.log(`输出 README.md`);

    let d_tmpl = fs.readFileSync("./README.tmpl.md", { encoding: "utf8" }),
      d_change_log = fs.readFileSync("./CHANGELOG.md", { encoding: "utf8" }),
      d_readme = "",
      d_typedoc_file = fs.readFileSync("./typedoc.file.json", {
        encoding: "utf8",
      }),
      d_typedoc_json = JSON.parse(d_typedoc_file);

    /**
     * 获取对应的函数范式文本，如果不是函数的节点数据，则返回空文本
     *
     * @param {object} data 数据
     *
     * @returns {string} 对应的函数范式文本
     */
    let f_get_func_normal_form = (data) => {
      let d_res = "";

      if (data.kindString === "Function") {
        let d_signatures = data.signatures[0];

        let d_func_params_txt = "";

        if (d_signatures && d_signatures.parameters) {
          let d_func_params = [];

          d_signatures.parameters.forEach((parameter) => {
            let d_type_name = "";

            if (parameter.type.name) {
              // 暴露的类

              d_type_name = parameter.type.name;
            } else if (parameter.type.declaration) {
              // 内置的类

              if (parameter.type.declaration.children) {
                d_type_name = parameter.type.declaration.children
                  .map(
                    (declaration) =>
                      `${declaration.name}${
                        declaration.flags.isOptional ? "?" : ""
                      }: ${declaration.type.name}`
                  )
                  .join(", ");

                if (d_type_name) {
                  d_type_name = "{ " + d_type_name + " }";
                }
              } else if (parameter.type.declaration.signatures) {
                // 参数为函数类型

                // TODO : 有异常，需要修复

                // let d_d_signatures = parameter.type.declaration.signatures[ 0 ];

                // let d_d_func_params_txt = '';

                // if ( d_d_signatures && d_d_signatures.parameters ) {

                //     d_d_func_params_txt = d_d_signatures.parameters.map( ppp => `${ppp.name}: ${ppp.type.types ? ppp.type.types.map( ttt => ttt.value ).join( ' | ' ) : ppp.type.name}` );
                // }

                // if ( d_d_func_params_txt ) {

                //     d_d_func_params_txt = ` ${d_d_func_params_txt} `;
                // }

                // d_type_name = `(${d_d_func_params_txt}) => ${d_d_signatures.type.name}`;

                d_type_name = `Function`;
              }
            } else if (parameter.type.type && parameter.type.type === "array") {
              // 内置的类-函数数组参数

              if (parameter.type.elementType.declaration) {
                d_type_name = parameter.type.elementType.declaration.children
                  .map(
                    (declaration) =>
                      `${declaration.name}${
                        declaration.flags.isOptional ? "?" : ""
                      }: ${declaration.type.name}`
                  )
                  .join(", ");
              }

              if (d_type_name) {
                d_type_name = "{ " + d_type_name + " }[]";
              }
            }

            d_func_params.push(
              `${parameter.name}${
                parameter.flags.isOptional ? "?" : ""
              }: ${d_type_name}`
            );
          });

          d_func_params_txt = ` ${d_func_params.join(", ")} `;
        }

        d_res = `${data.name}(${d_func_params_txt})`;
      }

      return d_res;
    };

    d_readme = d_tmpl
      // 接口文档
      .replace(
        "<TYPEDOC />",
        [`| 路径 | 解释 | 包含 |`]
          .concat([`| :----- | :----- | :----- |`])
          .concat(
            d_typedoc_json.children &&
              d_typedoc_json.children.map(
                (d) =>
                  `| [dist/${d.name}.js](docs/modules/${d.name.replace(
                    /\./g,
                    "_"
                  )}.md) | ${
                    d.comment && d.comment.shortText
                      ? d.comment.shortText
                      : "暂无解释"
                  } | ${
                    d.children &&
                    d.children
                      .filter(
                        (dd) =>
                          dd.kindString === "Property" ||
                          dd.kindString === "Function" ||
                          dd.kindString === "Variable" ||
                          dd.kindString === "Reference"
                      )
                      .map(
                        (dd) =>
                          `[${
                            f_get_func_normal_form(dd) || dd.name
                          }](docs/modules/${d.name.replace(/\./g, "_")}.md#${
                            dd.name
                          })`
                      )
                      .join("<br /> ")
                  } |`
              )
          )
          .join("\n")
      )
      // 修改记录
      .replace("<CHANGELOG />", d_change_log);

    fs.writeFileSync("./README.md", d_readme, { encoding: "utf8" });

    resolve();
  });
};
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

/** 清除 typedoc 文件 */
const taskCleanTypedoc = () =>
  gulp.src("docs", { allowEmpty: true }).pipe(clean());

/** 生成接口文档 */
const taskOutputTypedoc = () => {
  return gulp.src(["src/*.ts"]).pipe(
    typedoc({
      // Output options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
      // NOTE: the out option and the json option cannot share the same directory
      out: "./docs/",
      json: "./typedoc.file.json",
      // exclude: ["node_modules", "**/*+(index|.worker|.e2e).ts"],
      // TypeScript options (see typescript docs)
      // Output options (see typedoc docs)
      // TypeDoc options (see typedoc docs)
      // version: true,

      // // TypeDoc options (see TypeDoc docs http://typedoc.org/api/interfaces/typedocoptionmap.html)
      // name: 'my-project',
      // theme: '/path/to/my/theme',
      // plugin: [ 'my', 'plugins' ],
      // version: true,
    })
  );
};
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
const taskJestTest = () => {
  return new Promise(function (resolve, reject) {
    const cmdStr = `${path.resolve(
      "./node_modules/.bin/jest"
    )} --verbose -u --coverage --colors`;
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
const taskUpdateVersion = () => {
  return new Promise(function (resolve, reject) {
    //更新版本
    exec(`npm version patch`, (err, stdout, stderr) => {
      if (err) {
        reject(err);
        console.error(new Date(), "请检查文件是否为最新");
        throw new Error(" 更新版本命令执行失败");
      } else {
        console.log(stdout);
        console.warn(new Date(), " 更新版本命令执行成功");
      }
    });
    resolve();
  });
};
//发布版本
const taskPublish = async (done) => {
  // 升级版本号
  console.log("--------------------开发发布包到npm");
  const versionFlag = await sh("npm publish");
  if (versionFlag.code === 1) {
    console.log("------------------发布版本成功");
    resolve();
  } else {
    console.log(versionFlag.msg);
    return;
  }
  done();
};
const taskAddTag = async (done) => {
  // 自动打 tag
  // const addTagFlag = await sh(
  //   `git tag -a ${pkg.version} -m 'version ${pkg.version}'`,
  //   path.join(__dirname, "..")
  // );
  // if (addTagFlag.code === 1) {
  //   console.log("..........................打 tag 成功");
  // } else {
  //   console.log(addTagFlag.msg);
  //   return;
  // }
  const pkg = require("./package.json");
  const pushTagFlag = await sh(
    "git push origin " + pkg.version,
    path.join(__dirname, "..")
  );
  if (pushTagFlag.code === 1) {
    console.log("..........................tag 推送远程成功");
  } else {
    console.log(pushTagFlag.msg);
    return;
  }
  done();
};
/** type doc 任务 */
const taskTypedoc = gulp.series(taskCleanTypedoc, taskOutputTypedoc); //taskOutputTypedoc

/** 调试 */
const taskDev = () => gulp.watch(["./src/*.ts"], taskBuildUmdEsm);

exports.doc = gulp.series(taskTypedoc, taskOutputReadme);
exports.buildTypes = gulp.series(
  taskCleanTypes,
  taskOutputTypes,
  taskCleanTypesDirUnuseFile,
  exports.doc
);
exports.build = gulp.parallel(
  taskJestTest,
  taskeslint,
  // taskBuildTsProject,
  taskchangelog,
  exports.buildTypes,
  taskBuildUmdEsm
  // gulp.series(taskBuildUmdEsm, taskCleanDistJs)
);
exports.taskBuildUmdEsm = taskBuildUmdEsm;
exports.taskOutputTypes = taskOutputTypes;
// exports.taskBuildTsProject = taskBuildTsProject;
exports.publish = gulp.series(taskUpdateVersion, taskPublish, taskAddTag);
exports.taskUpdateVersion = taskUpdateVersion;
exports.taskJestTest = taskJestTest;
exports.taskOutputTypes = taskOutputTypes;
exports.taskCleanTypesDirUnuseFile = taskCleanTypesDirUnuseFile;
exports.changelog = taskchangelog;
exports.dev = taskDev;
exports.default = (cb) => cb();
