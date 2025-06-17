import { useEffect, useState, useRef } from 'react';

interface TimeDigits {
  h1: number;
  h2: number;
  m1: number;
  m2: number;
  s1: number;
  s2: number;
}

interface DigitBarProps {
  digit: number;
  maxDigit: number;
  hasChanged: boolean;
  height: string;
  label: string;
}

const DigitBar = ({ digit, maxDigit, hasChanged, height, label }: DigitBarProps) => {
  return (
    <div 
      className={`relative bg-gradient-to-b from-slate-500 via-slate-400 to-slate-500 rounded-xl w-14 flex flex-col items-center justify-between p-4 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl group ${hasChanged ? 'animate-pulse' : ''}`}
      style={{ height }}
    >
      {/* Label */}
      <div className="absolute -top-8 text-xs text-slate-400 font-semibold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </div>
      
      {/* Numbers above highlighted digit */}
      <div className="flex flex-col items-center justify-end flex-1 gap-2 overflow-hidden">
        {Array.from({ length: digit }, (_, i) => (
          <div 
            key={i} 
            className="text-slate-300 text-sm font-medium opacity-60 hover:opacity-90 transition-opacity duration-200"
          >
            {i}
          </div>
        ))}
      </div>

      {/* Highlighted digit */}
      <div className={`w-8 h-8 bg-gradient-to-br from-white to-slate-200 text-slate-800 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transform transition-all duration-300 ${hasChanged ? 'scale-110 shadow-white/50' : ''}`}>
        {digit}
      </div>

      {/* Numbers below highlighted digit */}
      <div className="flex flex-col items-center justify-start flex-1 gap-2 overflow-hidden">
        {Array.from({ length: maxDigit - digit }, (_, i) => (
          <div 
            key={digit + i + 1} 
            className="text-slate-300 text-sm font-medium opacity-60 hover:opacity-90 transition-opacity duration-200"
          >
            {digit + i + 1}
          </div>
        ))}
      </div>

      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${hasChanged ? 'animate-ping opacity-30' : ''}`}></div>
    </div>
  );
};

const Particle = ({ delay }: { delay: number }) => {
  return (
    <div 
      className="absolute w-1 h-1 bg-white/20 rounded-full animate-bounce"
      style={{
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 4 + 3}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

const EnhancedLiveClockWallpaper = () => {
  const [currentTime, setCurrentTime] = useState<TimeDigits>({ h1: 0, h2: 0, m1: 0, m2: 0, s1: 0, s2: 0 });
  const [previousTime, setPreviousTime] = useState<TimeDigits>({ h1: -1, h2: -1, m1: -1, m2: -1, s1: -1, s2: -1 });
  const [particles, setParticles] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

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
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentTime]);

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      setParticles(prev => {
        const newParticles = [...prev];
        for (let i = 0; i < 3; i++) {
          newParticles.push(Math.random());
        }
        return newParticles.slice(-15); // Keep only last 15 particles
      });
    };

    const particleInterval = setInterval(createParticles, 1000);
    return () => clearInterval(particleInterval);
  }, []);

  const timeData = [
    { 
      digit: currentTime.h1, 
      maxDigit: 2, 
      hasChanged: previousTime.h1 !== currentTime.h1, 
      height: '12rem',
      label: 'HOUR'
    },
    { 
      digit: currentTime.h2, 
      maxDigit: 9, 
      hasChanged: previousTime.h2 !== currentTime.h2, 
      height: '20rem',
      label: 'HOUR'
    },
    { 
      digit: currentTime.m1, 
      maxDigit: 5, 
      hasChanged: previousTime.m1 !== currentTime.m1, 
      height: '16rem',
      label: 'MIN'
    },
    { 
      digit: currentTime.m2, 
      maxDigit: 9, 
      hasChanged: previousTime.m2 !== currentTime.m2, 
      height: '10rem',
      label: 'MIN'
    },
    { 
      digit: currentTime.s1, 
      maxDigit: 5, 
      hasChanged: previousTime.s1 !== currentTime.s1, 
      height: '24rem',
      label: 'SEC'
    },
    { 
      digit: currentTime.s2, 
      maxDigit: 9, 
      hasChanged: previousTime.s2 !== currentTime.s2, 
      height: '28rem',
      label: 'SEC'
    }
  ];

  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_52%)] bg-[length:20px_20px]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, index) => (
          <Particle key={index} delay={particle} />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Digital Time Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-mono text-white font-bold tracking-wider mb-2 animate-pulse">
            {timeString}
          </div>
          <div className="text-xl text-slate-300 font-light tracking-wide">
            {dateString}
          </div>
        </div>

        {/* Time Bars Container */}
        <div className="flex gap-8 items-end">
          {timeData.map((data, index) => (
            <DigitBar
              key={index}
              digit={data.digit}
              maxDigit={data.maxDigit}
              hasChanged={data.hasChanged}
              height={data.height}
              label={data.label}
            />
          ))}
        </div>

        {/* Separator Lines */}
        <div className="flex gap-8 items-center mt-4">
          <div className="w-14 h-0.5 bg-slate-500"></div>
          <div className="w-14 h-0.5 bg-slate-500"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
          <div className="w-14 h-0.5 bg-slate-500"></div>
          <div className="w-14 h-0.5 bg-slate-500"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
          <div className="w-14 h-0.5 bg-slate-500"></div>
          <div className="w-14 h-0.5 bg-slate-500"></div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>LIVE WALLPAPER ACTIVE</span>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 text-slate-500 text-xs font-mono">
        <div>SYSTEM_TIME: SYNCHRONIZED</div>
        <div>REFRESH_RATE: 1000ms</div>
      </div>

      <div className="absolute top-4 right-4 text-slate-500 text-xs font-mono text-right">
        <div>MODE: WALLPAPER</div>
        <div>STATUS: RUNNING</div>
      </div>

      <div className="absolute bottom-4 left-4 text-slate-500 text-xs font-mono">
        <div>UTC_OFFSET: {now.getTimezoneOffset() / -60}</div>
        <div>TIMEZONE: {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
      </div>

      <div className="absolute bottom-4 right-4 text-slate-500 text-xs font-mono text-right">
        <div className="animate-pulse">ENHANCED_CLOCK_v2.0</div>
        <div>POWERED_BY_REACT</div>
      </div>
    </div>
  );
};

export default EnhancedLiveClockWallpaper;