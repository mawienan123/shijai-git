const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const ora = require("ora");
const simpleGit = require("simple-git");
const signale = require("signale");
const {
  exec,
  getCurBranchName,
  exitFailure,
  hasLocalBranch,
  getRemoteList,
  hasRemoteBranch,
} = require("../utils");
const Git = simpleGit();
module.exports = async function (targetBranch, options) {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  const targetAir = path.join(cwd, targetBranch);
  const updateLoading = ora("fetch 分支中...").start();
  //  --quiet 静默执行 不打印任何
  // await exec("git fetch -p --quiet");
  updateLoading.succeed("fetch 分支成功");
  // 当前分支
  const curBranch = await getCurBranchName();
  if (curBranch === targetBranch) {
    signale.error(`当前已位于分支 ${targetBranch}，目标分支与当前分支不能相同`);
    exitFailure();
  }
  const remoteList = await getRemoteList();
  const remoteBranchNameList = remoteList.map(
    (remoteName) => `${remoteName}/${targetBranch}`
  );

  // 远程分支是否存在
  const isRemoteExist = await hasRemoteBranch(remoteBranchNameList);

  // 本地分支是否存在
  const isLocalExist = await hasLocalBranch(targetBranch);

  isLocalExist && (await exec(`git branch -D ${targetBranch}`));
};
