import React from 'react';
import { ArrowLeft, Trophy, Minus, PieChart } from 'lucide-react';

interface StatsProps {
  xWins: number;
  oWins: number;
  draws: number;
  onBack: () => void;
}

const Statistics: React.FC<StatsProps> = ({ xWins, oWins, draws, onBack }) => {
  const total = xWins + oWins + draws;
  
  const getPercent = (val: number) => total === 0 ? 0 : Math.round((val / total) * 100);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-fade-in space-y-8">
      
      <div className="flex items-center space-x-3 mb-2">
        <PieChart className="text-neonPurple w-8 h-8" />
        <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neonBlue to-neonPurple">
          BATTLE RECORDS
        </h2>
      </div>

      <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Total Games Badge */}
        <div className="flex justify-center">
            <div className="px-4 py-1 rounded-full bg-white/10 border border-white/5 text-xs text-gray-400 uppercase tracking-wider">
                Total Games Played: <span className="text-white font-bold ml-1 text-sm">{total}</span>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-6">
            
            {/* Player X Stats */}
            <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-neonBlue flex items-center gap-2">
                        <Trophy size={14} /> PLAYER X (YOU)
                    </span>
                    <span className="text-xl font-bold">{xWins}</span>
                </div>
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-neonBlue shadow-[0_0_10px_#00f3ff] transition-all duration-1000 ease-out" 
                        style={{ width: `${getPercent(xWins)}%` }}
                    />
                </div>
            </div>

            {/* Player O Stats */}
            <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-neonPink flex items-center gap-2">
                        <Trophy size={14} /> PLAYER O (AI/P2)
                    </span>
                    <span className="text-xl font-bold">{oWins}</span>
                </div>
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-neonPink shadow-[0_0_10px_#ff00ff] transition-all duration-1000 ease-out" 
                        style={{ width: `${getPercent(oWins)}%` }}
                    />
                </div>
            </div>

            {/* Draws Stats */}
            <div className="space-y-2">
                <div className="flex justify-between items-end text-sm">
                    <span className="font-bold text-gray-400 flex items-center gap-2">
                        <Minus size={14} /> DRAWS
                    </span>
                    <span className="text-xl font-bold">{draws}</span>
                </div>
                <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-gray-500 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-1000 ease-out" 
                        style={{ width: `${getPercent(draws)}%` }}
                    />
                </div>
            </div>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="flex items-center space-x-2 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition active:scale-95"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Menu</span>
      </button>

    </div>
  );
};

export default Statistics;