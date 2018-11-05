const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');

let codesplitfn = (componentName) => {
    let data = fs.readFileSync('./mevn.json', 'utf8');
    let appname = JSON.parse(data);
    shell.cd(appname.project_name);
    shell.cd('client');
    shell.cd('src');
    shell.cd('router');

    let routerFile = fs.readFileSync('./index.js', 'utf8').toString().split('\n');
    console.log(routerFile);
    for(let index = 0; index < routerFile.length; index++){
        if(routerFile[index] === `import ${componentName} from '@/components/${componentName}'`){
            console.log('Hey!');
        }
    }
    console.log(routerFile);
    fs.writeFile('./index.js', routerFile.join('\n'), (err) => {
        if(err){
          throw err;
        }
      });
}

module.exports = codesplitfn;