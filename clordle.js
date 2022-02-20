const { words } = require('./words');

const clordle = class {
    constructor(word = words[Math.floor((new Date().getTime() - new Date("06/29/2021").getTime()) / (1000 * 3600 * 24))], day = -1) { //the default word value aligns with the real wordle guesses. will break sometime in 2027 but 24 y/o me will deal with that

        if (day >= 0) {
            word = words[day];
        }
        
        this.word = word;
        this.wordSplit = this.word.split('');
        this.guesses = [];
        this.existingLetters = [];
        this.remainingLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; //im the joker from the movie joker
    }

    validateGuess(guess = 'CRATE') {

        guess = guess.toUpperCase();
        
        if (words.includes(guess)) {
            return true;
        } else {
            return false;
        }
    }

    processGuess(guess = 'CRATE') {

        guess = guess.toUpperCase();

        //relying on validation via validateGuess() instead of this function
        /*
        if (!this.validateGuess(guess)) {
            return false;
        }
        */
        
        let guessSplit = guess.split('');
    
        let letters = [];
    
        for (let i = 0; i < guessSplit.length; i++) {
            this.guesses.push(guessSplit[i]);
            
            let letter = {
                character: guessSplit[i],
                inWord: false,
                isCorrect: false
            };
    
            if (this.word.includes(guessSplit[i])) {
                letter.inWord = true;
                this.existingLetters.push(guessSplit[i]);
            } else {
                this.remainingLetters = this.remainingLetters.replace(guessSplit[i], '');                
            };
    
            if (guessSplit[i] == this.wordSplit[i]) {
                letter.isCorrect = true;
            };
    
            letters.push(letter);
        }
    
        return letters;
    };
}

exports.lib = clordle;