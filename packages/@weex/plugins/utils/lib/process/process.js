"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Help manage process
 */
const childProcess = require('child_process');
function runAndGetOutput(cmdString, options = {}) {
    try {
        return childProcess.execSync(cmdString, Object.assign({ encoding: 'utf8' }, options)).toString();
    }
    catch (e) {
        return '';
    }
}
exports.runAndGetOutput = runAndGetOutput;
/**
 * Convert a object to cmd string for `exec` use
 * @param cmdName
 * @param params
 */
function createCmdString(cmdName, params) {
    let cmdString = `${cmdName} `;
    const keys = Object.keys(params);
    keys.forEach(key => {
        cmdString = `${cmdString} ${key} ${params[key]}`;
    });
    return cmdString;
}
exports.createCmdString = createCmdString;
function exec(cmdString, options, nativeExecOptions) {
    const { onOutCallback, onErrorCallback, onCloseCallback, handleChildProcess } = options || {};
    return new Promise((resolve, reject) => {
        try {
            const child = childProcess.exec(cmdString, Object.assign({
                encoding: 'utf8',
                maxBuffer: 102400 * 1024,
                wraning: false,
            }, nativeExecOptions), error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
            if (handleChildProcess) {
                handleChildProcess(child);
            }
            if (onOutCallback) {
                child.stdout.on('data', data => {
                    const buf = Buffer.from(data);
                    const bufStr = buf.toString().trim();
                    onOutCallback(bufStr);
                });
            }
            if (onErrorCallback) {
                child.stderr.on('data', data => {
                    const bufStr = Buffer.from(data).toString();
                    onErrorCallback(bufStr);
                });
            }
            if (onCloseCallback) {
                child.on('close', (code, signal) => {
                    onCloseCallback(code, signal);
                });
            }
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.exec = exec;
function runAsync(command, args = []) {
    return new Promise((resolve, reject) => {
        let result;
        try {
            result = childProcess.spawnSync(command, args);
            resolve(result);
        }
        catch (e) {
            reject(`Exit code ${result.status} from: ${command}:\n${result}`);
        }
    });
}
exports.runAsync = runAsync;
function which(execName, args = []) {
    const spawnArgs = [execName, ...args];
    const result = childProcess.spawnSync('which', spawnArgs);
    if (result.status !== 0) {
        return [];
    }
    const lines = result.stdout
        .toString()
        .trim()
        .split('\n');
    return lines;
}
exports.which = which;
//# sourceMappingURL=process.js.map