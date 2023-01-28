import './GameOver.css';

const GameOver = ({retry, score, resposta}) => {
  return (
    <div>
      <h1>Acabou!</h1>
      <h2>Sua Pontuação foi: <span>{score}</span></h2>
      <p>A resposta era: {resposta}</p>
      <button onClick={retry}>Reiniciar</button>
    </div>
  )
}

export default GameOver