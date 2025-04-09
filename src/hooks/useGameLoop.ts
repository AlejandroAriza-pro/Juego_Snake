import { useState, useCallback, useEffect, useRef } from 'react';
import { Direction, GameState, Position } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

const createInitialState = (): GameState => ({
  snake: [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ],
  food: { x: 5, y: 5 },
  direction: 'UP',
  score: 0,
  gameOver: false,
  gameStarted: false,
});

const generateFood = (snake: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const gameLoopRef = useRef<number>();
  const speedRef = useRef(INITIAL_SPEED);

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || !prevState.gameStarted) return prevState;

      const newHead = { ...prevState.snake[0] };
      switch (prevState.direction) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        return { ...prevState, gameOver: true };
      }

      // Check self collision
      if (
        prevState.snake.some(
          segment => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        return { ...prevState, gameOver: true };
      }

      const newSnake = [newHead, ...prevState.snake];
      let newFood = prevState.food;
      let newScore = prevState.score;

      // Check food collision
      if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
        newFood = generateFood(newSnake);
        newScore += 1;
        speedRef.current = Math.max(
          MIN_SPEED,
          INITIAL_SPEED - newScore * SPEED_INCREMENT
        );
      } else {
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(createInitialState());
    setGameState(prev => ({ ...prev, gameStarted: true }));
  }, []);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!gameState.gameStarted) return;

      const key = event.key.toLowerCase();
      setGameState(prevState => {
        const newDirection: Direction =
          (key === 'arrowup' || key === 'w'
            ? 'UP'
            : key === 'arrowdown' || key === 's'
            ? 'DOWN'
            : key === 'arrowleft' || key === 'a'
            ? 'LEFT'
            : key === 'arrowright' || key === 'd'
            ? 'RIGHT'
            : prevState.direction);

        // Prevent 180-degree turns
        const invalidMove =
          (prevState.direction === 'UP' && newDirection === 'DOWN') ||
          (prevState.direction === 'DOWN' && newDirection === 'UP') ||
          (prevState.direction === 'LEFT' && newDirection === 'RIGHT') ||
          (prevState.direction === 'RIGHT' && newDirection === 'LEFT');

        return invalidMove
          ? prevState
          : { ...prevState, direction: newDirection };
      });
    },
    [gameState.gameStarted]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speedRef.current);
      return () => {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
    }
  }, [gameState.gameStarted, gameState.gameOver, moveSnake]);

  return {
    gameState,
    startGame,
    GRID_SIZE,
  };
};