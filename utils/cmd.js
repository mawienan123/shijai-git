const { promisify } = require("util");
const _exec = promisify(require("child_process").exec);
// const { execSync: _execSync } = require("child_process");

/**
 * 异步执行命令
 * @param {string} cmd 命令
 * @returns {Promise} 执行结果
 */
async function exec(cmd) {
  return _exec(cmd, { encoding: "utf-8" });
}
/*
 * 进程失败退出
 * @param {number} code 错误码 默认为 1
 */
function exitFailure(code = 1) {
  process.exit(code);
}

module.exports = {
  // execSync,
  exec,
  // execSyncStdio,
  // exitSuccess,
  exitFailure,
};
