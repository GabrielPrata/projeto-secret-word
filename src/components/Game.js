import { useState, useRef } from 'react';
import './Game.css';

const Game = ({
  verifyLetter,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
  pickedWord,
  pickedCategory,
  letters
}) => {

  // Letra digitada pelo usuário
  const [letra, setLetra] = useState("");
  const letraRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    verifyLetter(letra);

    setLetra("");

    letraRef.current.focus();

  };

  return (
    <div className="game">

      <p className="points">
        <span>Pontuação: {score}</span>
      </p>

      <h1>Adivinhe a palavra:</h1>

      <h3 className="tip">
        Dica: <span>{pickedCategory}</span>
      </h3>

      <p>Você ainda tem {guesses === 1 ? (guesses + " tentativa") : (guesses + " tentativas")}</p>

      <div className="wordContainer">
        {/* Aqui, mapeio letters que é onde as letras da palavra estão armazenadas
            Se guessedLetters (Letras que o usuário tentou) conter alguma das letras que estava em letters,
            eu exibo a letra na tela, caso contrário, exibo o quadrado branco.
            letter = letra retornada de letters
            i = key gerada automaticamente pelo React
        */}
        {letters.map((letter, i) =>
          guessedLetters.includes(letter) ? (
            <span key={i} className="letter">{letter}</span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        )}
      </div>

      <div className="letterContainer">
        <p>Tente adivinhar uma letra:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            required
            onChange={(e) => setLetra(e.target.value)}
            value={letra}
            ref={letraRef}
          />
          <button>Verificar...</button>
        </form>
      </div>

      <div className="wrongLettersContainer">
        <p>Letras já utilizadas</p>
        {wrongLetters.map((letter, i) => (
          <span key={i}>{letter}, </span>
        ))}
      </div>

    </div>
  )
}

export default Game