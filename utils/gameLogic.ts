import { Player, SquareValue, Difficulty, WinState } from '../types';

// Winning combinations indices
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const checkWinner = (squares: SquareValue[]): WinState => {
  for (let i = 0; i < WIN_LINES.length; i++) {
    const [a, b, c] = WIN_LINES[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as Player, line: WIN_LINES[i] };
    }
  }
  if (!squares.includes(null)) {
    return { winner: 'DRAW', line: null };
  }
  return { winner: null, line: null };
};

// --- AI LOGIC ---

// Helper: Check winner for Minimax simulation (returns simplified score)
const checkWinForMinimax = (board: SquareValue[]): Player | 'DRAW' | null => {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Player;
    }
  }
  if (!board.includes(null)) return 'DRAW';
  return null;
};

// Minimax algorithm
const minimax = (board: SquareValue[], depth: number, isMaximizing: boolean): number => {
  const result = checkWinForMinimax(board);
  if (result === 'O') return 10 - depth; // AI wins (assume AI is O)
  if (result === 'X') return depth - 10; // Human wins
  if (result === 'DRAW') return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

export const getBestMove = (squares: SquareValue[], difficulty: Difficulty): number => {
  const availableMoves = squares.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null) as number[];
  
  if (availableMoves.length === 0) return -1;

  // 1. EASY: Completely Random
  if (difficulty === Difficulty.EASY) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 2. NORMAL: Block immediate wins, otherwise random
  if (difficulty === Difficulty.NORMAL) {
    // Check if we can win instantly
    for (let move of availableMoves) {
      const copy = [...squares];
      copy[move] = 'O';
      if (checkWinForMinimax(copy) === 'O') return move;
    }
    // Check if opponent can win instantly and block
    for (let move of availableMoves) {
      const copy = [...squares];
      copy[move] = 'X';
      if (checkWinForMinimax(copy) === 'X') return move;
    }
    // Else random
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 3. HIGH: Minimax with some randomness (mistakes allowed)
  if (difficulty === Difficulty.HIGH) {
    // 20% chance to make a random move to be "beatable"
    if (Math.random() < 0.2) {
       return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    // Otherwise fall through to optimal
  }

  // 4. VERY HIGH: Full Minimax (Unbeatable)
  // Assume AI is 'O' and maximizing
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      squares[i] = 'O';
      const score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move !== -1 ? move : availableMoves[0];
};