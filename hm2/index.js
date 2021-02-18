const fs = require('fs');
const readline = require('readline');
const util = require('util');
const chalk = require('chalk');
const readFilePromise = util.promisify(fs.readFile);
const writeFilePromise = util.promisify(fs.writeFile);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const random = () => Math.round(Math.random());

const statsRound = {
    numberGame: 0,
    rightAnswer: null,
    userAnswer: null
}

let logStats = [];


const getStats = (file) => {
    readFilePromise(file, 'utf8')
    .then((data) => {
        const result = JSON.parse(data);
        let loseStrick = 0;
        let winStrick = 0;
        const stats = result.reduce((acc, item, i) => {
            acc['countGame'] = item.numberGame;
            if (item.rightAnswer == item.userAnswer) {
                acc['winGame'] = +acc['winGame']+1;
                winStrick++;
                loseStrick = 0
            } else {
                acc['loseGame'] = +acc['loseGame']+1;
                loseStrick++;
                winStrick = 0;
            }
            acc['winRate'] = Math.round(acc['winGame']/acc['countGame'] * 100) + '%';
            if (acc['winStrick'] < winStrick) {
                acc['winStrick'] = winStrick
            } 

            if (acc['loseStrick'] < loseStrick) {
                acc['loseStrick'] = loseStrick
            } 

            return acc
        }, {
            countGame: 0,
            winGame: 0,
            loseGame: 0,
            winStrick: 0,
            loseStrick: 0
        })
        console.log(stats);
        return newGame();
    })
    .catch((err) => {
        console.log('error:', err);
    });
};

const game = (file) => {
    const rightAnswer = random();

    rl.question(chalk.yellow('Орел или решка?(Орел-1 Решка-0 Выйти-2) \n'), (answer) => {
        if(answer.trim().length === 0) {
            console.log(chalk.redBright('Введите 1 или 2 \n'));
            return game(file)
        };
        if (+answer < 0 || +answer > 2 || isNaN(+answer)) {
            console.log(chalk.redBright('Введите корректное значениe \n'));
            return game(file);
        } else if (+answer === 2) {
            return newGame()
        };
        statsRound.numberGame++;
        statsRound.rightAnswer = rightAnswer;
        statsRound.userAnswer = +answer;
        if (rightAnswer === +answer && rightAnswer === 1) {
            console.log(chalk.green('Победа \nОрел'));
        } else if (rightAnswer === +answer && rightAnswer === 0) {
            console.log(chalk.green('Победа \nРешка'));
        } else if (rightAnswer === 0 && +answer === 1) {
            console.log(chalk.red('Проигрыш \nРешка'));
        } else {
            console.log(chalk.red('Проигрыш \nОрел'));
        };

        logStats.push({...statsRound})
        writeFilePromise(file, JSON.stringify(logStats), (err) => {
            if (err) throw err
        });
        return game(file);
    });
};

const newGame = () => {
    rl.question(chalk.yellowBright('Хотите сыграть?(1-да, 0-нет, 2-смотреть статистику) \n'), (answer) => {
        switch (+answer) {
            case 0:
                console.log(chalk.blue('До встречи!')); 
                rl.close()
                break;
            case 1:
                game('round-log.json');
                break;
            case 2: 
                getStats('round-log.json');
                break;
            default:
                return newGame() 
        };
    });
};

newGame();


