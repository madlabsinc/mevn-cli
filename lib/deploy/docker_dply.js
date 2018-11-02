const fs = require('fs');
const shell = require('shelljs');

const showBanner = require('../external/banner');

let dplyfn = () => {

  showBanner();

  let data = fs.readFileSync('./mevn.json', 'utf8');
  let appname = JSON.parse(data);
  shell.cd(appname.project_name);

  setTimeout(() => {

    console.log('\nlogin to your Heroku account\n');
    shell.exec('sudo heroku container:login', (err) => {
      if(err) {
        throw err;
      }
      
      shell.exec('heroku create', (err) => {
        if(err) {
          throw err;
        }

        shell.exec('sudo heroku container:push web', (err) => {
          if(err) {
            throw err;
          }

          shell.exec('sudo heroku container:release web', (err) => {
            if(err) {
              throw err;
            }
            
            shell.exec('heroku open',(err) => {
              if(err) {
                throw err;
              }
            
            })
          
          })
        
        })
     
      })
    
    }) 
       
  }, 100);


}
module.exports = dplyfn;