#! /usr/bin/env node
const program = require("commander");
const make = require("../lib/make");
const chalk = require("chalk");
const figlet = require("figlet");
const { preCheck, getConflictFiles, checkUpdate } = require("../utils");

program
  // 定义命令和参数
  .command("make <branch>")
  .alias("mk")
  .description(`${chalk.cyan("合并到测试分支")}`)
  .action(async (name, options) => {
    await preCheck();
    // 打印执行结果
    make(name, options);
  });

program
  // 配置版本号信息
  .version(`v${require("../package.json").version}`)
  .usage("<command> [option]");

program
  // 监听 --help 执行
  .on("--help", () => {
    // 新增说明信息
    console.log(
      `\r\nRun ${chalk.cyan(
        `sjg <command> --help`
      )} for detailed usage of given command\r\n`
    );
    console.log(
      "\r\n" +
        figlet.textSync("shijia-git", {
          // font: "Ghost",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 80,
          whitespaceBreak: true,
        })
    );
  });

// 解析用户执行命令传入参数
program.parse(process.argv);
