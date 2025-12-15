import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Difficulty, Player, SquareValue, WinState } from './types';
import { checkWinner, getBestMove } from './utils/gameLogic';
import { playMoveSound, playWinSound, playDrawSound, initAudio } from './utils/soundEffects';
import GameBoard from './components/GameBoard';
import Scanner from './components/Scanner';
import Statistics from './components/Statistics';
import CursorAnimation from './components/CursorAnimation';
import { Cpu, Users, Bluetooth, Zap, Shield, Skull, Sword, BarChart3, Smartphone } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.MENU);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winState, setWinState] = useState<WinState>({ winner: null, line: null });
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  
  // Game Statistics State
  const [stats, setStats] = useState({ xWins: 0, oWins: 0, draws: 0 });

  // Sound feedback simulation (visual mostly, as no audio assets)
  const vibrate = (ms: number | number[]) => {
    if (navigator.vibrate) navigator.vibrate(ms);
  };

  const resetGame = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinState({ winner: null, line: null });
    setIsAiThinking(false);
  }, []);

  // AI Turn Effect
  useEffect(() => {
    if (mode === GameMode.GAME_VS_CPU && !xIsNext && !winState.winner) {
      // AI's turn
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const move = getBestMove(squares, difficulty);
        if (move !== -1) {
          handleMove(move);
        }
        setIsAiThinking(false);
      }, 700 + Math.random() * 500); // Realistic delay

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xIsNext, mode, winState.winner, squares, difficulty]);

  const handleMove = (i: number) => {
    if (squares[i] || winState.winner) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    vibrate(20);

    const result = checkWinner(nextSquares);
    if (result.winner) {
      setWinState(result);
      if (result.winner !== 'DRAW') {
        vibrate([50, 50, 50]);
        playWinSound();
      } else {
        playDrawSound();
      }
      
      // Update Statistics
      setStats(prev => ({
        ...prev,
        xWins: result.winner === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: result.winner === 'O' ? prev.oWins + 1 : prev.oWins,
        draws: result.winner === 'DRAW' ? prev.draws + 1 : prev.draws,
      }));

    } else {
      setXIsNext(!xIsNext);
      playMoveSound();
    }
  };

  const startGame = (selectedMode: GameMode, diff?: Difficulty) => {
    initAudio(); // Initialize audio context on user gesture
    resetGame();
    if (diff) setDifficulty(diff);
    setMode(selectedMode);
  };

  // Render Logic
  return (
    <div className="min-h-screen w-full bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black text-white flex flex-col items-center overflow-hidden relative">
      
      <CursorAnimation />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neonBlue/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neonPurple/10 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <header className="z-10 pt-8 pb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-neonPurple drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
          NEON<br/><span className="text-white text-3xl md:text-4xl">TIC-TAC-TOE</span>
        </h1>
      </header>

      <main className="flex-1 w-full max-w-2xl z-10 flex flex-col items-center justify-center p-4">
        
        {mode === GameMode.MENU && (
          <div className="flex flex-col space-y-6 w-full max-w-md animate-fade-in-up">
            
            {/* VS Computer Section */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Cpu className="text-neonBlue" />
                <h2 className="text-xl font-bold">Single Player</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => startGame(GameMode.GAME_VS_CPU, Difficulty.EASY)} className="p-3 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-300 transition text-sm font-semibold flex flex-col items-center justify-center gap-2">
                  <Zap size={18} /> Easy
                </button>
                <button onClick={() => startGame(GameMode.GAME_VS_CPU, Difficulty.NORMAL)} className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 transition text-sm font-semibold flex flex-col items-center justify-center gap-2">
                  <Shield size={18} /> Normal
                </button>
                <button onClick={() => startGame(GameMode.GAME_VS_CPU, Difficulty.HIGH)} className="p-3 rounded-lg border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 transition text-sm font-semibold flex flex-col items-center justify-center gap-2">
                  <Sword size={18} /> High
                </button>
                <button onClick={() => startGame(GameMode.GAME_VS_CPU, Difficulty.VERY_HIGH)} className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 transition text-sm font-semibold flex flex-col items-center justify-center gap-2">
                  <Skull size={18} /> Extreme
                </button>
              </div>
            </div>

            {/* Multiplayer Section */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="text-neonPink" />
                <h2 className="text-xl font-bold">Multiplayer</h2>
              </div>
              
              <div className="space-y-3">
                 <button 
                  onClick={() => setMode(GameMode.SCANNING)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 hover:border-blue-400/60 transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-full"><Bluetooth className="text-white w-5 h-5" /></div>
                    <div>
                        <div className="font-bold text-white group-hover:text-neonBlue transition">Nearby Connect</div>
                        <div className="text-xs text-blue-200/60">Scan for local players</div>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => startGame(GameMode.GAME_PVP)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition group text-left"
                >
                   <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-full"><Smartphone className="text-white w-5 h-5" /></div>
                    <div>
                        <div className="font-bold text-white group-hover:text-neonPink transition">Local Device</div>
                        <div className="text-xs text-gray-400">Pass & Play</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

             {/* Stats Button */}
             <button 
                onClick={() => setMode(GameMode.STATS)}
                className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition"
            >
                <BarChart3 className="w-5 h-5" />
                <span>View Statistics</span>
            </button>
            
          </div>
        )}

        {mode === GameMode.SCANNING && (
          <Scanner 
            onConnected={() => startGame(GameMode.GAME_PVP)}
            onCancel={() => setMode(GameMode.MENU)}
          />
        )}

        {(mode === GameMode.GAME_VS_CPU || mode === GameMode.GAME_PVP) && (
          <GameBoard 
            squares={squares}
            xIsNext={xIsNext}
            winState={winState}
            onSquareClick={handleMove}
            onReset={resetGame}
            onHome={() => setMode(GameMode.MENU)}
            isAiThinking={isAiThinking}
            modeLabel={mode === GameMode.GAME_VS_CPU ? `Single Player (${difficulty})` : 'Multiplayer (PvP)'}
          />
        )}

        {mode === GameMode.STATS && (
            <Statistics 
                xWins={stats.xWins}
                oWins={stats.oWins}
                draws={stats.draws}
                onBack={() => setMode(GameMode.MENU)}
            />
        )}

      </main>
    </div>
  );
};

export default App;