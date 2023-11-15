const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../dist');
const destDir = path.resolve(__dirname, '../demo');

console.log(`copying from ${srcDir} to ${destDir} ...`);

// copy from dist the following files: wortal-core.*, wortal-common.*, analytics.*, debug.*
fs.readdir(srcDir, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }

    files.forEach(file => {
        if (file.startsWith('wortal-core.js') || file.startsWith('wortal-common.js') || file.startsWith('analytics.js') || file.startsWith('debug.js')) {
            console.log(`copying ${file} ...`)
            fs.copyFile(path.join(srcDir, file), path.join(destDir, file), err => {
                if (err) {
                    console.log(err);
                    return;
                }
            });
        }
    });
});
