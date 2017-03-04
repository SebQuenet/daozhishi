'use strict';

const util = require('util');
const os = require('os');

const abstractDZSModule = require('./abstractDZSModule');

const MODULEID = 'DZS-LOGGER';
const MODULENAME = 'DaoZhiShi logger module';

module.exports = class logger extends abstractDZSModule {
    constructor(di) {
        super(di, MODULEID, MODULENAME);
        const config = di.get('DZS-CONF').get(this.moduleId);
        this.mode = config.mode;
        this.colorized = config.environment === 'develop';
        this.loglevels = {
            verbose: 0,
            debug: 1,
            info: 2,
            input: 2,
            output: 2,
            warn: 3,
            error: 4,
            none: 5,
        };

        this.ignoreObjIds = config.ignoreObjIds;

        this.appLogLevel = this.loglevels[this.mode];

        this.pid = process.pid;
        this.hostname = os.hostname();
    }

    log(ltype, params) {
        if (!params) {
            params = {};
        }

        let msg = params.msg;
        const requestId = params.requestId;
        const obj = params.obj;

        const logLevel = this.loglevels[ltype];
        const appLogLevel = this.loglevels[this.mode];

        if (logLevel < appLogLevel) {
            return;
        }

        let colorizedStart = '';
        let colorizedEnd = '';
        if (this.colorized) {
            switch (ltype) {
                case 'verbose' :
                    colorizedStart = '\x1b[36m';
                    colorizedEnd = '\x1b[0m';
                    break;
                case 'debug' :
                    colorizedStart = '\x1b[36m';
                    colorizedEnd = '\x1b[0m';
                    break;
                case 'error' :
                    colorizedStart = '\x1b[91m';
                    colorizedEnd = '\x1b[0m';
                    break;
                case 'input' :
                    colorizedStart = '\x1b[96m';
                    colorizedEnd = '\x1b[0m';
                    break;
                case 'warn' :
                    colorizedStart = '\x1b[93m';
                    colorizedEnd = '\x1b[0m';
                    break;
                case 'output' :
                    colorizedStart = '\x1b[92m';
                    colorizedEnd = '\x1b[0m';
                    break;
            }
        }
        const timeStamp = new Date();
        process.stdout.write(`${timeStamp} [${colorizedStart}${ltype.toUpperCase()}${colorizedEnd}] #${this.pid}@${this.hostname} `);
        if (requestId) {
            process.stdout.write(`<${requestId}> `);
        }

        if (params.dateStart) {
            let ds = `${new Date().getTime() - params.dateStart}ms`;

            if (this.colorized) {
                ds = `\x1b[92m${ds}\x1b[0m`;
            }
            process.stdout.write(`${ds} `);
        }

        if (params.objID) {
            let sid = params.objID;

            if (this.colorized) {
                sid = `\x1b[96m${sid}\x1b[0m`;
            }
            process.stdout.write(`${sid} `);
        }
        if (params.objName) {
            let sname = params.objName;

            if (this.colorized) {
                sname = `\x1b[95m${sname}\x1b[0m`;
            }
            process.stdout.write(`${sname} `);
        }

        if (ltype === 'error') {
            msg = colorizedStart + msg + colorizedEnd;
        }
        process.stdout.write(`${msg}`);
        if (obj) {
            if (params.objID && this.ignoreObjIds[params.objID]) {
                const objStr = '<hidden object by config>';
                process.stdout.write(` ${objStr}`);
            }
            else {
                const objStr = util.inspect(obj, { depth: 99, colors: this.colorized }).replace(/(\r\n|\n|\r)|\s+/gm, ' ');
                    process.stdout.write(` ${objStr}`);
            }
        }
        process.stdout.write('\n');
    }

    info(msg, params = {}) {
        params.msg = msg;
        this.log('info', params);
    }

    warn(msg, params = {}) {
        params.msg = msg;
        this.log('warn', params);
    }

    verbose(msg, params = {}) {
        params.msg = msg;
        this.log('verbose', params);
    }

    debug(msg, params = {}) {
        params.msg = msg;
        this.log('debug', params);
    }
    input(msg, params = {}) {
        params.msg = msg;
        this.log('input', params);
    }
    output(msg, params = {}) {
        params.msg = msg;
        this.log('output', params);
    }
    error(msg, params = {}) {
        params.msg = msg;
        this.log('error', params);
        if (params.stack) {
            params.stack.split('\n').forEach((item) => {
                params.msg = item;
                this.log('error', params);
            });
        }
    }
};

