const fs = require('fs');
const shell = require('shelljs');
const inquirer = require('inquirer');

const showBanner = require('../external/banner');

let dplyfn = () => {

  showBanner();

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);
  let appdir = process.cwd() + '';
  shell.cd('client')

  setTimeout(() => {

    shell.exec('npm install', (err) => {
      if(err) {
        throw err;
      }

      shell.exec('npm run build', (err) => {
        if(err) {
          throw err;
        }
  
        shell.exec('sudo cp -a /' + process.cwd() + '/dist /' + appdir + '/server', (err) => {
          if(err) {
            throw err;
          }
  
          shell.exec('cd ' + appdir + '/server', (err) => {
            if(err) {
              throw err;
            }
  
            shell.exec('sudo docker login --username=_ --password=$(heroku auth:token) registry.heroku.com', (err) => {
              if(err) {
                throw err;
              }
              console.log('\n\ncreating a heroku app\n')
              shell.exec('heroku create', (err) => {
                if(err) {
                  throw err;
                }

                inquirer.prompt([{
                  name: 'urlname',
                  type: 'input',
                  message: 'Please enter the name of heroku app(url)',
              
                }]).then((answers) => {
              
                  shell.exec('sudo heroku container:push web -a ' + answers.urlname, (err) => {
                    if(err) {
                      throw err;
                    }
              
                    shell.exec('sudo heroku container:release web -a ' + answers.urlname, (err) => {
                      if(err) {
                        throw err;
                      }
                                    
                      shell.exec('heroku open -a' + answers.urlname,(err) => {
                        if(err) {
                          throw err;
                        }
                      
                      })
                    
                    })
                  
                  })
              
                })  
          
              })
            
            }) 
          
          });
  
        })
      
      })
    
    })
    
  }, 100); 

}
module.exports = dplyfn;