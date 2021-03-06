'use strict';

import * as cp from 'child_process';
import * as path from 'path';
import { format } from 'util';
import { Readable, Writable } from 'stream';

let adapterPath = path.join(__dirname, '..', '..', 'adapter')

let params: any = {};

if (process.env.ADAPTER_LOG) {
    params.logFile = process.env.ADAPTER_LOG;
    params.logLevel = 0;
}
let params_b64 = new Buffer(JSON.stringify(params)).toString('base64');
let lldb = cp.spawn('lldb', ['-b', '-Q',
            '-O', format('command script import \'%s\'', adapterPath),
            '-O', format('script adapter.main.run_pipe_session(3,4,\'%s\')', params_b64)
        ], {
            stdio: ['ignore', 'ignore', 'ignore', 'pipe', process.stdout],
            cwd: path.join(__dirname, '..', '..')
        }
    );
process.stdin.pipe(<Writable>lldb.stdio[3]);
