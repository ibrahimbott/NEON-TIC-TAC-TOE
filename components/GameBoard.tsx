import React from 'react';
import { SquareValue, WinState } from '../types';
import { X, Circle, RefreshCw, Home, Brain, Trophy } from 'lucide-react';

interface GameBoardProps {
  squares: SquareValue[];
  xIsNext: boolean;
  winState: WinState;
  onSquareClick: (index: number) => void;
  onReset: () => void;
  onHome: () => void;
  isAiThinking: boolean;
  modeLabel: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  squares, 
  xIsNext, 
  winState, 
  onSquareClick, 
  onReset, 
  onHome,
  isAiThinking,
  modeLabel
}) => {
  
  const isAiMode = modeLabel.includes("AI");

  const renderSquare = (i: number) => {
    const isWinningSquare = winState.line?.includes(i);
    const value = squares[i];
    
    // Dynamic styling for winning squares based on who won
    let winClasses = '';
    let iconWinClasses = '';
    
    if (isWinningSquare) {
      if (winState.winner === 'X') {
        winClasses = 'border-neonBlue bg-neonBlue/20 shadow-[0_0_30px_rgba(0,243,255,0.6)] z-10 animate-winner-pulse';
        iconWinClasses = 'drop-shadow-[0_0_15px_rgba(0,243,255,1)]';
      } else if (winState.winner === 'O') {
        winClasses = 'border-neonPink bg-neonPink/20 shadow-[0_0_30px_rgba(255,0,255,0.6)] z-10 animate-winner-pulse';
        iconWinClasses = 'drop-shadow-[0_0_15px_rgba(255,0,255,1)]';
      }
    } else {
      winClasses = 'border-white/10 bg-white/5 hover:bg-white/10';
    }

    return (
      <button
        key={i}
        className={`
          relative flex items-center justify-center h-24 w-24 sm:h-28 sm:w-28
          rounded-xl border-2 transition-all duration-300
          ${winClasses}
          ${!value && !winState.winner && !isAiThinking ? 'cursor-pointer active:scale-95' : 'cursor-default'}
          ${isAiThinking && !value ? 'opacity-50' : 'opacity-100'}
        `}
        onClick={() => onSquareClick(i)}
        disabled={!!value || !!winState.winner || isAiThinking}
      >
        {value === 'X' && (
          <X 
            className={`w-12 h-12 sm:w-16 sm:h-16 text-neonBlue transition-all ${isWinningSquare ? iconWinClasses : 'drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] animate-fade-in'}`} 
            strokeWidth={2.5} 
          />
        )}
        {value === 'O' && (
          <Circle 
            className={`w-10 h-10 sm:w-14 sm:h-14 text-neonPink transition-all ${isWinningSquare ? iconWinClasses : 'drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] animate-fade-in'}`} 
            strokeWidth={3} 
          />
        )}
      </button>
    );
  };

  const renderStatusContent = () => {
    if (winState.winner === 'DRAW') {
      return <span className="text-gray-200">GAME DRAWN</span>;
    }
    if (winState.winner) {
      return (
        <div className="flex items-center space-x-2 animate-pulse">
          <Trophy className={`w-4 h-4 ${winState.winner === 'X' ? 'text-neonBlue' : 'text-neonPink'}`} />
          <span className={winState.winner === 'X' ? 'text-neonBlue' : 'text-neonPink'}>
            {winState.winner === 'X' ? 'PLAYER X' : (isAiMode ? 'AI' : 'PLAYER O')} WINS!
          </span>
        </div>
      );
    }
    if (isAiThinking) {
      return (
        <div className="flex items-center space-x-2 text-neonPurple animate-pulse">
          <Brain className="w-4 h-4" />
          <span>AI THINKING...</span>
        </div>
      );
    }
    return (
      <span className={xIsNext ? 'text-neonBlue' : 'text-neonPink'}>
        {xIsNext ? "PLAYER X" : (isAiMode ? "AI" : "PLAYER O")}'S TURN
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto animate-fade-in">
      
      {/* Player Indicators & Status HUD */}
      <div className="flex justify-between items-end w-full px-6 mb-6">
        
        {/* Player X Indicator */}
        <div className={`flex flex-col items-center transition-all duration-300 ${xIsNext && !winState.winner && !isAiThinking ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]' : 'opacity-40 scale-90'}`}>
           <X className="w-8 h-8 text-neonBlue" />
           <span className="text-[10px] font-bold mt-1 text-neonBlue tracking-widest">YOU</span>
        </div>

        {/* Center Status Badge */}
         <div className={`
            mx-4 mb-1 px-6 py-2 rounded-full border backdrop-blur-md text-sm font-bold tracking-wide transition-all duration-500
            ${isAiThinking 
                ? 'border-neonPurple/50 bg-neonPurple/10 shadow-[0_0_15px_rgba(188,19,254,0.3)]' 
                : winState.winner 
                    ? `border-white/20 bg-white/10 scale-110 ${winState.winner === 'X' ? 'shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 'shadow-[0_0_20px_rgba(255,0,255,0.3)]'}`
                    : 'border-white/10 bg-black/40'
            }
         `}>
           {renderStatusContent()}
         </div>

        {/* Player O Indicator */}
        <div className={`flex flex-col items-center transition-all duration-300 ${(!xIsNext || isAiThinking) && !winState.winner ? 'opacity-100 scale-110 drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]' : 'opacity-40 scale-90'}`}>
           {isAiThinking ? (
             <Brain className="w-8 h-8 text-neonPurple animate-bounce" />
           ) : (
             <Circle className="w-8 h-8 text-neonPink" />
           )}
           <span className="text-[10px] font-bold mt-1 text-neonPink tracking-widest">{isAiMode ? 'AI' : 'P2'}</span>
        </div>

      </div>

      {/* Grid */}
      <div className={`
        grid grid-cols-3 gap-3 sm:gap-4 p-4 rounded-3xl backdrop-blur-sm border transition-all duration-700 mb-8
        ${isAiThinking 
           ? 'border-neonPurple/60 shadow-[0_0_35px_rgba(188,19,254,0.25)] bg-purple-900/10' 
           : 'border-white/5 bg-black/30 neon-box'
        }
      `}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => renderSquare(i))}
      </div>

      {/* Controls */}
      <div className="flex space-x-6">
        <button 
            onClick={onReset}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition active:scale-95 shadow-lg border border-white/5"
        >
            <RefreshCw className="w-5 h-5" />
            <span>Restart</span>
        </button>
        <button 
            onClick={onHome}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/20 transition active:scale-95"
        >
            <Home className="w-5 h-5" />
            <span>Menu</span>
        </button>
      </div>

      {/* Mode Label Footer */}
      <div className="mt-6 text-xs text-gray-500 font-mono uppercase tracking-widest opacity-60">
        Current Mode: {modeLabel}
      </div>
    </div>
  );
};

export default GameBoard;