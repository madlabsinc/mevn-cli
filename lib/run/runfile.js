
const robot = require('robotjs');
const os = require('os');
const childProcess = require('child_process');

let runfunction = () => {

  if(os.type() === 'Linux') {

    robot.keyToggle('control', 'down');
    robot.keyToggle('alt', 'down');
    robot.keyToggle('t', 'down');
  
    setTimeout(() => {
  
      robot.keyToggle('control', 'up');
      robot.keyToggle('alt', 'up');
      robot.keyToggle('t', 'up');
      robot.typeStringDelayed('mevn-cli client');
      robot.keyTap('enter');
    }, 100);
  
    setTimeout(() => {
  
      robot.keyToggle('control', 'down');
      robot.keyToggle('alt', 'down');
      robot.keyToggle('t', 'down');
    }, 200);
    
    setTimeout(() => {
  
      robot.keyToggle('control', 'up');
      robot.keyToggle('alt', 'up');
      robot.keyToggle('t', 'up');
      robot.typeStringDelayed('\tmevn-cli server');
      robot.keyTap('enter');
    }, 400);

  } else if(os.type() === 'win32') {

    /* robot.keyToggle('control', 'down')
    robot.keyToggle('escape', 'down')
    robot.keyToggle('r', 'down') */
    childProcess.execSync('start cmd.exe'); 
    setTimeout(() => {

      /* robot.keyToggle('control', 'up')
      robot.keyToggle('escape', 'up')
      robot.keyToggle('r', 'up')
      robot.typeStringDelayed('mevn-cli client')
      robot.keyTap('enter') */
      childProcess.execSync('start cmd.exe /K mevn-cli client');
    }, 100);

    setTimeout(() => {
  
      /* robot.keyToggle('control', 'down')
      robot.keyToggle('escape', 'down')
      robot.keyToggle('r', 'down') */
      childProcess.execSync('start cmd.exe');
    }, 200);   

    setTimeout(() => {
  
      /* robot.keyToggle('control', 'up')
      robot.keyToggle('escape', 'up')
      robot.keyToggle('r', 'up')
      robot.typeStringDelayed('              mevn-cli server')
      robot.keyTap('enter') */
      childProcess.execSync('start cmd.exe /K mevn-cli server');
    }, 400);

  } else {
      // For mac
  }
 

 
}


exports.runfunction = runfunction;