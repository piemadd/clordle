#!/usr/bin/env node

const clordle = require('./clordle').lib;
const { Snippet } = require('enquirer');
const c = require('ansi-colors');

const prettyPrintRemaining = ((clordleGameSession) => {
    let originalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    let final = '';

    for (let i = 0; i < originalLetters.length; i++) {
        if (clordleGameSession.existingLetters.includes(originalLetters[i])) {
            final += c.bgGreen(originalLetters[i]) + " ";
        } else if (clordleGameSession.remainingLetters.includes(originalLetters[i])) {
            final += originalLetters[i] + " ";
        } else {
            final += c.bgRed(originalLetters[i]) + " ";
        }
    }

    return final;
})

let clordleGame = new clordle();

//console.log(clordleGame);

console.log("Today's date: " + new Date().toLocaleDateString())
console.log('')

for (let i = 0; i < 5; i++) {
    let readableGuessNum = i + 1;
}

const promptThingy = ((guessNum = 0) => {

    if (guessNum >= 5) {
        console.log(c.red('GAME OVER! Better luck next time (or right now, I can\'t stop you)...'));
        return
    }

    new Snippet({
        name: 'game',
        message: `Guess ${guessNum + 1}:\nLetters: ${prettyPrintRemaining(clordleGame)}\nMake a guess`,
        required: true,
        fields: [
            {
                name: 'guess',
                message: '_____',
                validate(value, state, item, index) {
                    if (value.length != 5) {
                        return c.magenta('Word must be 5 letters.');
                    };
    
                    for (let i = 0; i < 5; i++) {
                        if (!clordleGame.remainingLetters.includes(value[i].toUpperCase())) {
                            return c.magenta('Word must use remaining letters.');
                        }
                    }
                    
                    if (!clordleGame.validateGuess(value)) {
                        return c.magenta('Must be a valid word.');
                    };
                    return true;
                }
            },
            
        ],
        template: '${guess}'
    }).run().then((answer) => {
            let lastGuess = '';
            let result = clordleGame.processGuess(answer.result);
            //console.log(result)
            //console.log(clordleGame);
            for (let i = 0; i < result.length; i++) {
                if (result[i].isCorrect) {
                    lastGuess += c.bgGreen(result[i].character);
                } else if (result[i].inWord) {
                    lastGuess += c.bgYellow(result[i].character);
                } else {
                    lastGuess += result[i].character;
                }
            }
    
            if (clordleGame.word == answer.result.toUpperCase()) {
                console.log(`Previous Guess: ${lastGuess}`);

                if (guessNum == 0) {
                    console.log(c.green('Yay you got the word in 1 try!'));
                } else {
                    console.log(c.green(`Yay you got the word in ${guessNum + 1} tries!`));
                }
                
                
            } else {
                console.log(`Previous Guess: ${lastGuess}`);
                promptThingy(guessNum + 1);
            }
        })
        .catch(console.error);

})

promptThingy()