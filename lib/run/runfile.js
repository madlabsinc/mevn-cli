
const robot = require('robotjs')
const process = require('process')

let runfunction = () => {
 
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
 
}


exports.runfunction = runfunction