const chalk = require('chalk');
var beep = require('beepbeep');
 
const arrColors = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
    'blackBright',
    'redBright',
    'greenBright',
    'yellowBright',
    'blueBright',
    'magentaBright',
    'cyanBright',
    'whiteBright'
];

const randomColors = () => (
    arrColors[Math.floor(Math.random() * arrColors.length)]
);
 

setInterval(() => {
    console.clear();
    console.log(chalk[randomColors()](new Date()));
    beep(); // звук только в консоле, в VScode не работает
}, 1000);