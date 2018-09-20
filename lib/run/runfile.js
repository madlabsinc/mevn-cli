
const robot = require('robotjs')
const os = require('os')

let runfunction = () => {

  if(os.type() + toString() == 'linux') {

    robot.keyToggle('control', 'down')
    robot.keyToggle('alt', 'down')
    robot.keyToggle('t', 'down')
  
    setTimeout(() => {
  
      robot.keyToggle('control', 'up')
      robot.keyToggle('alt', 'up')
      robot.keyToggle('t', 'up')
      robot.typeStringDelayed('mevn-cli client')
      robot.keyTap('enter')

    }, 100)
  
    setTimeout(() => {
  
      robot.keyToggle('control', 'down')
      robot.keyToggle('alt', 'down')
      robot.keyToggle('t', 'down')
    }, 200)
    
    setTimeout(() => {
  
      robot.keyToggle('control', 'up')
      robot.keyToggle('alt', 'up')
      robot.keyToggle('t', 'up')
      robot.typeStringDelayed('              mevn-cli server')
      robot.keyTap('enter')
    }, 400)

  } else if(os.type == 'win32') {

    robot.keyToggle('control', 'down')
    robot.keyToggle('escape', 'down')
    robot.keyToggle('r', 'down')

    setTimeout(() => {

      robot.keyToggle('control', 'up')
      robot.keyToggle('escape', 'up')
      robot.keyToggle('r', 'up')
      robot.typeStringDelayed('mevn-cli client')
      robot.keyTap('enter')
    
    }, 100)

    setTimeout(() => {
  
      robot.keyToggle('control', 'down')
      robot.keyToggle('escape', 'down')
      robot.keyToggle('r', 'down')
    }, 200)  

    setTimeout(() => {
  
      robot.keyToggle('control', 'up')
      robot.keyToggle('escape', 'up')
      robot.keyToggle('r', 'up')
      robot.typeStringDelayed('              mevn-cli server')
      robot.keyTap('enter')

    }, 400)

  } else {
      // for mac
  }
 

 
}


exports.runfunction = runfunction