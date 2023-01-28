// CSS
import './App.css';

//React
import { useCallBack, useEffect, useState } from 'react';

//data
import { wordsList } from './data/words';

// Componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

// Crio essa constante para não ter que ficar alterando os use state 
// caso algum dia eu queira mudar a quantiadade de chanches.
const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallBack(() => {
    const categories = Object.keys(words);

    // Pegando uma categoria aleatória.
    // Uso as keys do objeto para poder selecionar uma categoria
    // Math.random() não retorna um número inteiro, por isso utilizo o Math.floor
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Pegando uma palavra aleatória da categoria selecionada
    // Em vez de usar as keys do objeto, utilizo a quantidade de elementos daquela key
    const word = wordsList[category][Math.floor(Math.random() * wordsList[category].length)];

    return { word, category };

    //Coloco para ser observado o que é fundamental para o bom funcionamento desta função
  }, [words]);

  //Função para startar o jogo
  //useCallBack serve para evitar que a função fique se repetindo dentro do useEffect
  //o próprio React reclama que a função está dentro do useEffect
  const startGame = useCallBack(() => {

    // Escolhendo a palavra e a categoria
    const { word, category } = pickWordAndCategory();

    // Transformando a palavra em letras
    let wordLetters = word.split("");

    // Como o JavaScript é case sensitive, preciso normalizar as palavras
    // Pois a primeira letra de cada palavra do objeto de palvras é maiúscula
    // E isso iria gerar problemas na hora de validar as palavras
    // Itero cada uma das letras e transformo para letra minúscula
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //Setando os estados
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    setGameStage(stages[1].name);

    //Coloco para ser observado o que é fundamental para o bom funcionamento desta função
  }, [pickWordAndCategory]);

  // Processando a entrada das letras
  const verifyLetter = (letra) => {

    const normalizedLetra = letra.toLowerCase();

    // Checa se a letra já foi utilizada
    // Aqui é pra salvar usuário burro caso ele digite novamente uma letra a qual ele já inseriu
    if (guessedLetters.includes(normalizedLetra) || wrongLetters.includes(normalizedLetra)) {
      return;
    }

    // Incluo a letra inserida para as letras acertadas ou para as letras erradas e removo um chance
    if (letters.includes(normalizedLetra)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetra
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetra
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }

  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //Use effect para ficar monitorando as vidas do usuário
  useEffect(() => {
    if (guesses <= 0) {
      // Verifico se o usuário ainda tem vidas, caso não tenha reseto o jogo todo
      clearLetterStates();

      setGameStage(stages[2].name);

    }

  }, [guesses])


  //Use effect para checar a condição de vitória
  useEffect(() => {
    // Criando uma lista de letras únicas
    // Exemplo: A plavra OVO
    // Pois se o usuário digitar um O, dos dois serão preenchidos
    // Para isso, pego o array de letters e tiro as letras repetidas
    // o Set() só deixa itens únicos em um array
    const uniqueLetters = [...new Set(letters)];

    // Condição de vitória
    if (guessedLetters.length === uniqueLetters.length) {
      // Adiconando a pontuação
      setScore((actualScore) => actualScore += 100);

      //Reiniciar as letras, para não puxar os states da palavra anterior na nova palavra
      //Poderia também chamar a função clearLetterStates() dentro da função StartGame()
      clearLetterStates();

      //Linha adicionada por mim para poder resetar as vida em cada fase
      setGuesses(guessesQty);

      //Reiniciar o jogo com uma nova palavra
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // Função para reiniciar o jogo caso o usuário perca
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {
        gameStage === 'game' &&
        <Game
          pickedWord={pickedWord}
          letters={letters}
          pickedCategory={pickedCategory}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
          verifyLetter={verifyLetter}
        />}
      {gameStage === 'end' && <GameOver
        retry={retry}
        score={score}
        resposta={pickedWord}
      />}
    </div>
  );
}

export default App;
