const { spawn } = require('child_process');
const child = spawn('npx.cmd', ['firebase', 'emulators:start', '--project', 'default'], { stdio: 'inherit', shell: true });
child.on('error', console.error);
