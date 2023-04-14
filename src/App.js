//Css
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

//data
import { wordlist } from "./data/words"

//Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "and"},
]

const guessesQty = 5

function App() {
const [GameStage, setGameStage] = useState(stages[0].name)
const [words] = useState(wordlist)

const [pickedWord, setPickedWord] = useState("")
const [pickedCategory, setPickedCategory] = useState("")
const [letters, setLetter] = useState([])

const [guessedLetters, setGuessedLetters] = useState([])
const [wrongLetters, setWrongLetters] = useState([])
const [guesses, setGuesses] = useState(guessesQty)
const [score, setScore] = useState(0)

const pickWordANDCategory = useCallback(() => {
  //pick a random category
  const categories = Object.keys(words)
  const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

  //pick a random word
  const word = words[category][Math.floor(Math.random() * words[category].length)]

  return {word, category}
}, [words])

// Start the secret word game
const startGame = useCallback (() => {
  //clear all letters
  clearLetterStates()

  //Pick word and pick category
  const {word, category } = pickWordANDCategory();

  // create am array of letters
  let wordLetters = word.split("")
  wordLetters = wordLetters.map((l)=> l.toLowerCase())

  //fill states
  setPickedWord(word)
  setPickedCategory(category)
  setLetter(wordLetters)

  setGameStage(stages[1].name)
}, [pickWordANDCategory])

// process the letter input
const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if(guessedLetters.includes(normalizedLetter) ||
     wrongLetters.includes(normalizedLetter)
     ) {
      return; 
     }

     // push guessed letter or remove a guess
     if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
     } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }


  //check if guesses ended
  useEffect(() => {
   if(guesses <= 0) {
    //Reset all states
    clearLetterStates();

    setGameStage(stages[2].name)
   }
  }, [guesses])


  //check win condition
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)]

    //win condition
    if (guessedLetters.length === uniqueLetters.length){
      // add score
      setScore((actualScore) => (actualScore += 100));

      // restart game with new
      startGame();
    }
  }, [guessedLetters, letters, startGame]);


//restart the game
const retry = () => {

  setScore(0)
  setGuesses(guessesQty)

  setGameStage(stages[0].name)
}

  return (
    <div className="App">
      {GameStage === 'start' && <StartScreen startGame={startGame} />}
      {GameStage === 'game' && <Game
       verifyLetter={verifyLetter}
       pickedWord={pickedWord}
       pickedCategory= {pickedCategory}
       letters={letters}
       guessedLetters={guessedLetters}
       wrongLetters={wrongLetters}
       guesses={guesses}
       score={score}
       />}
      {GameStage === 'and' && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
