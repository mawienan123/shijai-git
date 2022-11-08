const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");

module.exports = async function (name, options) {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);
};
