import React from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { GameBoard } from './components/GameBoard';
import { Play, Trophy } from 'lucide-react';

function App() {
  const { gameState, startGame, GRID_SIZE } = useGameLoop();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {!gameState.gameStarted ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-500 mb-8">Snake Game</h1>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Play size={24} />
              Start Game
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between w-full mb-4">
              <div className="flex items-center gap-2 text-white">
                <Trophy size={24} className="text-yellow-500" />
                <span className="text-2xl font-bold">Score: {gameState.score}</span>
              </div>
            </div>

            <GameBoard gameState={gameState} gridSize={GRID_SIZE} />

            {gameState.gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg text-center">
                  <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                  <p className="text-xl mb-6">Final Score: {gameState.score}</p>
                  <button
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mx-auto"
                  >
                    <Play size={24} />
                    Play Again
                  </button>
                </div>
              </div>
            )}

            {!gameState.gameOver && (
              <p className="text-gray-400 mt-4">
                Use arrow keys or WASD to control the snake
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;