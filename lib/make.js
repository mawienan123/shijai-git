const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const ora = require("ora");
const simpleGit = require("simple-git");
const signale = require("signale");
const chalk = require("chalk");
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
  console.log(options);
  const { baseBranch = "master" } = options;
  // 当前命令行选择的目录
  const cwd = process.cwd();
  const targetAir = path.join(cwd, targetBranch);
  const updateLoading = ora("fetch 分支中...").start();
  //  --quiet 静默执行 不打印任何
  await exec("git fetch -p --quiet");
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

  //下面几步是为了怕本地有目标分支的
  isLocalExist && (await exec(`git branch -D ${targetBranch}`));
  await exec(
    `git checkout ${isRemoteExist ? "" : "-b"} ${targetBranch} >/dev/null 2>&1`
  );
  const devRemoteBranchNameList = remoteList.map(
    (remoteName) => `${remoteName}/${baseBranch}`
  );
  const isDevRemoteExist = await hasRemoteBranch(devRemoteBranchNameList);

  isDevRemoteExist && signale.log(`合并 origin/${baseBranch}`);
  isDevRemoteExist && (await exec(`git merge origin/${baseBranch}`));
  console.info(
    chalk.bgGreenBright.black("当前分支") + "：" + chalk.greenBright(curBranch)
  );
  console.info(
    chalk.bgRedBright.black("目标分支") + "：" + chalk.redBright(targetBranch)
  );
  console.info(
    chalk.bgYellowBright.black("稳定的支") +
      "：" +
      chalk.greenBright(baseBranch)
  );
  console.log("\n");
  await exec(`git merge ${curBranch}`);
  signale.log(`推送到 ${targetBranch} 的远程分支`);
  await exec("git push --porcelain 1> /dev/null");
  isPublish = true;
};
