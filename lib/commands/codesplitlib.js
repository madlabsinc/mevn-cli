const fs = require('fs');
const chalk = require('chalk');
const shell = require('shelljs');

const showBanner = require('../external/banner');

let codesplitfn = (componentName) => {
    showBanner();

    if(!fs.existsSync('./mevn.json')){
      console.log(chalk.red.bold('\n Make sure that you are having a valid MEVN stack project in path'));
      process.exit(1);
    }

    let data = fs.readFileSync('./mevn.json', 'utf8');
    let appname = JSON.parse(data);
    shell.cd(appname.project_name);
    shell.cd('client');
    shell.cd('src');
    shell.cd('router');

    let componentNotFound = true;
    let routerFile = fs.readFileSync('./index.js', 'utf8').toString().split('\n');

    setTimeout(() => {

        for(let index = 0; index < routerFile.length; index++){
            // Checking whether the routes file already has the respective component
            if(routerFile[index].includes(`${componentName}`)){
                //  Validating whether the respective component is already imported dynamically
                if(routerFile[index].includes(`import ${componentName}`)){
                    routerFile[index] = `const ${componentName} = () => import('@/components/${componentName}')`;
                    componentNotFound = false;
                    break;
                } else{
                    console.log(chalk.redBright(`\n ${componentName} component is already imported dynamically!`));
                    process.exit(1);
                }
            }
        }
        if(!componentNotFound){
            fs.writeFile('./index.js', routerFile.join('\n'), (err) => {
                if(err){
                    throw err;
                }
            });
        } else{
            console.log(chalk.yellowBright('\n Make sure that the component exists!'));
            process.exit(1);
        }
    }, 100);
}

module.exports = codesplitfn;
