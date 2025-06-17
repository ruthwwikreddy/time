import { useEffect, useRef, useState } from 'react';

interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  highlightIndex: number;
}

const MatrixWallpaper = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [time, setTime] = useState(new Date());
  const dropsRef = useRef<MatrixDrop[]>([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeDrops();
    };

    const initializeDrops = () => {
      const fontSize = 20;
      const columns = Math.floor(canvas.width / fontSize);
      dropsRef.current = [];

      for (let i = 0; i < columns; i++) {
        const dropLength = Math.floor(Math.random() * 15) + 5;
        const chars = Array.from({ length: dropLength }, () => 
          Math.floor(Math.random() * 10).toString()
        );
        
        dropsRef.current.push({
          x: i * fontSize,
          y: Math.random() * -canvas.height,
          speed: Math.random() * 3 + 1,
          chars,
          highlightIndex: Math.floor(Math.random() * dropLength)
        });
      }
    };

    const drawMatrix = () => {
      // Create trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '20px "Courier New", monospace';
      ctx.textAlign = 'center';

      dropsRef.current.forEach((drop, dropIndex) => {
        drop.chars.forEach((char, charIndex) => {
          const charY = drop.y + charIndex * 25;
          
          if (charY > -30 && charY < canvas.height + 30) {
            if (charIndex === drop.highlightIndex) {
              // Draw highlight circle
              ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
              ctx.beginPath();
              ctx.arc(drop.x + 10, charY, 15, 0, Math.PI * 2);
              ctx.fill();
              
              // Draw highlighted number
              ctx.fillStyle = '#000000';
              ctx.fillText(char, drop.x + 10, charY + 7);
            } else {
              // Calculate opacity based on position in chain
              const opacity = Math.max(0.1, 1 - (charIndex * 0.08));
              ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
              ctx.fillText(char, drop.x + 10, charY + 7);
            }
          }
        });

        // Update drop position
        drop.y += drop.speed;

        // Reset drop when it goes off screen
        if (drop.y > canvas.height + 100) {
          drop.y = Math.random() * -200;
          drop.speed = Math.random() * 3 + 1;
          const dropLength = Math.floor(Math.random() * 15) + 5;
          drop.chars = Array.from({ length: dropLength }, () => 
            Math.floor(Math.random() * 10).toString()
          );
          drop.highlightIndex = Math.floor(Math.random() * dropLength);
        }
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      drawMatrix();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const formatTime = (date: Date) => {
    return {
      hours: date.getHours().toString().padStart(2, '0'),
      minutes: date.getMinutes().toString().padStart(2, '0'),
      seconds: date.getSeconds().toString().padStart(2, '0'),
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  const timeData = formatTime(time);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#000000' }}
      />
      
      {/* Digital Clock Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center mb-8">
          {/* Time Display */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-black/80 border border-green-500 rounded-lg px-6 py-4 font-mono text-6xl text-green-400 shadow-lg shadow-green-500/20">
              {timeData.hours}
            </div>
            <div className="text-green-400 text-6xl font-mono animate-pulse">:</div>
            <div className="bg-black/80 border border-green-500 rounded-lg px-6 py-4 font-mono text-6xl text-green-400 shadow-lg shadow-green-500/20">
              {timeData.minutes}
            </div>
            <div className="text-green-400 text-6xl font-mono animate-pulse">:</div>
            <div className="bg-black/80 border border-green-500 rounded-lg px-6 py-4 font-mono text-6xl text-green-400 shadow-lg shadow-green-500/20">
              {timeData.seconds}
            </div>
          </div>
          
          {/* Date Display */}
          <div className="bg-black/60 border border-green-500/50 rounded-lg px-8 py-3 mb-2">
            <div className="text-green-300 text-2xl font-mono">
              {timeData.day}
            </div>
          </div>
          
          <div className="bg-black/60 border border-green-500/50 rounded-lg px-8 py-3">
            <div className="text-green-300 text-xl font-mono">
              {timeData.date}
            </div>
          </div>
        </div>
        
        {/* Matrix Code Effect Around Clock */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-96 h-96 border border-green-500/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute inset-4 border border-green-500/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <div className="absolute inset-4 border border-green-500/10 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Corner Effects */}
      <div className="absolute top-4 left-4 text-green-400 font-mono text-sm opacity-60">
        <div>MATRIX_SYSTEM_ONLINE</div>
        <div>STATUS: ACTIVE</div>
      </div>
      
      <div className="absolute top-4 right-4 text-green-400 font-mono text-sm opacity-60 text-right">
        <div>USER: NEO</div>
        <div>ACCESS: GRANTED</div>
      </div>
      
      <div className="absolute bottom-4 left-4 text-green-400 font-mono text-sm opacity-60">
        <div>REALITY.EXE</div>
        <div>LOADING...</div>
      </div>
      
      <div className="absolute bottom-4 right-4 text-green-400 font-mono text-sm opacity-60 text-right">
        <div>WAKE_UP_NEO</div>
        <div className="animate-pulse">FOLLOW_RABBIT</div>
      </div>
    </div>
  );
};

export default MatrixWallpaper;