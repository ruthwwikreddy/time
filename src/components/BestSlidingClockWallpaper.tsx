import { useEffect, useState } from 'react';

interface TimeDigits {
  h1: number;
  h2: number;
  m1: number;
  m2: number;
  s1: number;
  s2: number;
}

interface SlidingDigitProps {
  currentDigit: number;
  maxDigit: number;
  hasChanged: boolean;
  label: string;
  color: string;
}

const SlidingDigit = ({ currentDigit, maxDigit, hasChanged, label, color }: SlidingDigitProps) => {
  const numbers = Array.from({ length: maxDigit + 1 }, (_, i) => i);
  const barPosition = (currentDigit / maxDigit) * 100;

  return (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Label */}
      <div className={`text-xs font-bold tracking-wider ${color} opacity-80`}>
        {label}
      </div>
      
      {/* Number line container */}
      <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30 shadow-2xl">
        {/* Glow effect when changed */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${hasChanged ? `bg-gradient-to-r ${color.includes('blue') ? 'from-blue-500/20 to-purple-500/20' : color.includes('green') ? 'from-green-500/20 to-emerald-500/20' : 'from-orange-500/20 to-red-500/20'} animate-pulse` : ''}`}></div>
        
        {/* Numbers in straight line */}
        <div className="flex space-x-8 relative z-10">
          {numbers.map((num) => (
            <div
              key={num}
              className={`text-2xl font-mono font-bold transition-all duration-300 ${
                num === currentDigit 
                  ? `${color} scale-125 filter drop-shadow-lg` 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
        
        {/* Moving selection bar */}
        <div 
          className={`absolute bottom-2 h-1 rounded-full transition-all duration-700 ease-out ${
            hasChanged ? 'animate-pulse' : ''
          } ${
            color.includes('blue') ? 'bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg shadow-blue-500/50' :
            color.includes('green') ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50' :
            'bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-orange-500/50'
          }`}
          style={{
            left: `${barPosition}%`,
            width: `${100 / (maxDigit + 1)}%`,
            transform: 'translateX(-50%)'
          }}
        ></div>
        
        {/* Vertical moving indicator */}
        <div 
          className={`absolute top-0 bottom-0 w-0.5 transition-all duration-700 ease-out ${
            hasChanged ? 'animate-bounce' : ''
          } ${
            color.includes('blue') ? 'bg-gradient-to-b from-blue-400 to-purple-500' :
            color.includes('green') ? 'bg-gradient-to-b from-green-400 to-emerald-500' :
            'bg-gradient-to-b from-orange-400 to-red-500'
          }`}
          style={{
            left: `${barPosition + (100 / (maxDigit + 1)) / 2}%`,
            transform: 'translateX(-50%)'
          }}
        ></div>
      </div>
      
      {/* Current digit display */}
      <div className={`w-16 h-16 rounded-full ${
        color.includes('blue') ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
        color.includes('green') ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
        'bg-gradient-to-br from-orange-500 to-red-600'
      } flex items-center justify-center text-white text-2xl font-bold shadow-xl transform transition-all duration-300 ${
        hasChanged ? 'scale-110 animate-pulse' : 'hover:scale-105'
      }`}>
        {currentDigit}
      </div>
    </div>
  );
};

const BestSlidingClockWallpaper = () => {
  const [currentTime, setCurrentTime] = useState<TimeDigits>({ h1: 0, h2: 0, m1: 0, m2: 0, s1: 0, s2: 0 });
  const [previousTime, setPreviousTime] = useState<TimeDigits>({ h1: -1, h2: -1, m1: -1, m2: -1, s1: -1, s2: -1 });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const newTime = {
        h1: parseInt(hours[0]),
        h2: parseInt(hours[1]),
        m1: parseInt(minutes[0]),
        m2: parseInt(minutes[1]),
        s1: parseInt(seconds[0]),
        s2: parseInt(seconds[1])
      };

      setPreviousTime(currentTime);
      setCurrentTime(newTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,197,94,0.2),transparent_50%)]"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent animate-pulse">
            SLIDING TIME
          </h1>
          <div className="text-2xl text-white font-mono tracking-wider">
            {timeString}
          </div>
          <div className="text-lg text-slate-300 font-light">
            {dateString}
          </div>
        </div>

        {/* Time digits with sliding bars */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Hours */}
          <SlidingDigit
            currentDigit={currentTime.h1}
            maxDigit={2}
            hasChanged={previousTime.h1 !== currentTime.h1}
            label="HOUR TENS"
            color="text-blue-400"
          />
          <SlidingDigit
            currentDigit={currentTime.h2}
            maxDigit={9}
            hasChanged={previousTime.h2 !== currentTime.h2}
            label="HOUR ONES"
            color="text-blue-500"
          />

          {/* Minutes */}
          <SlidingDigit
            currentDigit={currentTime.m1}
            maxDigit={5}
            hasChanged={previousTime.m1 !== currentTime.m1}
            label="MIN TENS"
            color="text-green-400"
          />
          <SlidingDigit
            currentDigit={currentTime.m2}
            maxDigit={9}
            hasChanged={previousTime.m2 !== currentTime.m2}
            label="MIN ONES"
            color="text-green-500"
          />

          {/* Seconds */}
          <SlidingDigit
            currentDigit={currentTime.s1}
            maxDigit={5}
            hasChanged={previousTime.s1 !== currentTime.s1}
            label="SEC TENS"
            color="text-orange-400"
          />
          <SlidingDigit
            currentDigit={currentTime.s2}
            maxDigit={9}
            hasChanged={previousTime.s2 !== currentTime.s2}
            label="SEC ONES"
            color="text-red-500"
          />
        </div>

        {/* Status bar */}
        <div className="flex items-center space-x-4 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-mono">SLIDING_CLOCK_v3.0_ACTIVE</span>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 text-slate-400 text-xs font-mono space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <span>SYSTEM: ONLINE</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          <span>MODE: SLIDING</span>
        </div>
      </div>

      <div className="absolute top-6 right-6 text-slate-400 text-xs font-mono text-right space-y-1">
        <div className="flex items-center justify-end space-x-2">
          <span>REFRESH: 1000ms</span>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <span>STATUS: OPTIMAL</span>
          <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 text-slate-400 text-xs font-mono space-y-1">
        <div>TIMEZONE: {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
        <div className="animate-pulse">ENHANCED_INTERFACE</div>
      </div>

      <div className="absolute bottom-6 right-6 text-slate-400 text-xs font-mono text-right space-y-1">
        <div className="animate-pulse">SLIDING_BARS_ACTIVE</div>
        <div>POWERED_BY_REACT</div>
      </div>
    </div>
  );
};

export default BestSlidingClockWallpaper;