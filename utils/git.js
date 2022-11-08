const { exec } = require("./cmd");
const chalk = require("chalk");
const { exitFailure } = require("./cmd");
//错误提示signale更好
const signale = require("signale");
const { EOL } = require("os");

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

/**
 * 获取当前分支名
 * @returns {Promise<string>} 分支名
 */
async function getCurBranchName() {
  // 获取当前分支    stdout stderr  正确错误打印
  const { stdout } = await exec("git symbolic-ref -q --short HEAD");
  const branchName = stdout.replace(new RegExp(`${EOL}$`), "");
  return branchName;
}

/**
 * 检查本地分支是否存在
 * @param {string} branchName 本地分支名
 * @returns {Promise<Boolean>} 检查本地分支是否存在
 */
async function hasLocalBranch(branchName) {
  try {
    await exec(`git show-ref --verify --quiet refs/heads/${branchName}`);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 获取远程名称列表
 * @returns {Promise<String[]>} 远程名称列表
 */
async function getRemoteList() {
  const { stdout } = await exec("git remote show");
  const remoteList = stdout.split(EOL).filter(Boolean);
  return remoteList;
}

/**
 * 是否包含远程分支
 * @param {String[]} branchList
 * @returns {Promise<Boolean>} 远程名称列表
 */
async function hasRemoteBranch(branchList) {
  try {
    //git branch -r   查看远程分支，r是remote的简写
    // grep -E 选项可以用来扩展选项为正则表达式。 如果使用了grep 命令的选项-E，则应该使用 | 来分割多个pattern，以此实现OR操作。
    await exec(`git branch -r | grep -E "${branchList.join("|")}"`);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  preCheck,
  getCurBranchName,
  hasLocalBranch,
  getRemoteList,
  hasRemoteBranch,
};
