import React from 'react';
import { GameState, Position } from '../types';

interface GameBoardProps {
  gameState: GameState;
  gridSize: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameState, gridSize }) => {
  const cellSize = Math.min(
    Math.floor((window.innerHeight - 200) / gridSize),
    Math.floor((window.innerWidth - 40) / gridSize)
  );

  const renderCell = (position: Position) => {
    const isSnake = gameState.snake.some(
      segment => segment.x === position.x && segment.y === position.y
    );
    const isFood = gameState.food.x === position.x && gameState.food.y === position.y;
    const isHead = gameState.snake[0].x === position.x && gameState.snake[0].y === position.y;

    return (
      <div
        key={`${position.x}-${position.y}`}
        className={`
          w-full h-full border border-gray-800
          ${isHead ? 'bg-green-600' : ''}
          ${isSnake && !isHead ? 'bg-green-500' : ''}
          ${isFood ? 'bg-red-500' : ''}
          ${!isSnake && !isFood ? 'bg-gray-900' : ''}
          rounded-sm
        `}
      />
    );
  };

  return (
    <div
      className="grid gap-0 bg-gray-800 p-2 rounded-lg"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
      }}
    >
      {Array.from({ length: gridSize * gridSize }, (_, i) => ({
        x: i % gridSize,
        y: Math.floor(i / gridSize),
      })).map(renderCell)}
    </div>
  );
};