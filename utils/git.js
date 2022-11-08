const { exec } = require("./cmd");
const chalk = require("chalk");
const { exitFailure } = require("./cmd");
//错误提示signale更好
const signale = require("signale");
const error = chalk.bold.red;
/**
 * 检查是否是 git 仓库，若不是则退出进程
 */
async function preCheck() {
  const isGitRepo = await checkGitRepo();
  if (!isGitRepo) {
    signale.error("当前非 git 仓库");
    exitFailure();
  }
}

/**
 * 检查是否是 git 仓库
 * @returns {Boolean} 是否是 git 仓库
 */
async function checkGitRepo() {
  try {
    await exec("git rev-parse --is-inside-work-tree  > /dev/null 2>&1");
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = {
  preCheck,
};
