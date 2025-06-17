import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Column {
  x: number;
  y: number;
  speed: number;
  numbers: number[];
  highlighted: number;
}

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize columns to match the image layout
    const columnWidth = 80;
    const numColumns = Math.floor(canvas.width / columnWidth);
    
    const initialColumns: Column[] = [];
    for (let i = 0; i < numColumns; i++) {
      const columnHeight = Math.floor(Math.random() * 8) + 4; // 4-12 numbers per column
      const numbers = Array.from({ length: columnHeight }, () => Math.floor(Math.random() * 10));
      
      initialColumns.push({
        x: i * columnWidth + 40,
        y: Math.random() * -500, // Start above screen
        speed: Math.random() * 2 + 1,
        numbers,
        highlighted: Math.floor(Math.random() * columnHeight)
      });
    }
    
    setColumns(initialColumns);

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw columns
      setColumns(prevColumns => 
        prevColumns.map(column => {
          const newY = column.y + column.speed;
          
          // Reset column when it goes off screen
          if (newY > canvas.height + 200) {
            const columnHeight = Math.floor(Math.random() * 8) + 4;
            const numbers = Array.from({ length: columnHeight }, () => Math.floor(Math.random() * 10));
            
            return {
              ...column,
              y: -200,
              speed: Math.random() * 2 + 1,
              numbers,
              highlighted: Math.floor(Math.random() * columnHeight)
            };
          }

          // Draw the column
          ctx.font = '24px monospace';
          ctx.textAlign = 'center';
          
          column.numbers.forEach((num, index) => {
            const y = newY + (index * 30);
            
            if (y > -30 && y < canvas.height + 30) {
              if (index === column.highlighted) {
                // Draw highlighted number with circle background
                ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
                ctx.beginPath();
                ctx.arc(column.x, y, 20, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#000000';
                ctx.fillText(num.toString(), column.x, y + 8);
              } else {
                // Draw regular number
                const opacity = Math.max(0.3, 1 - (index * 0.1));
                ctx.fillStyle = `rgba(160, 160, 160, ${opacity})`;
                ctx.fillText(num.toString(), column.x, y + 8);
              }
            }
          });

          return { ...column, y: newY };
        })
      );

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: '#000000' }}
      />
      
      {/* Static overlay to match the exact image layout */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="flex justify-center items-center h-full gap-8">
          {/* Column 1 */}
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center text-black font-bold">1</div>
            <div className="text-sm opacity-60">2</div>
            <div className="text-sm opacity-40">3</div>
            <div className="text-sm opacity-30">4</div>
            <div className="text-sm opacity-20">5</div>
            <div className="text-sm opacity-15">6</div>
            <div className="text-sm opacity-10">7</div>
            <div className="text-sm opacity-10">8</div>
            <div className="text-sm opacity-10">9</div>
          </div>
          
          {/* Column 2 */}
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <div className="text-sm opacity-60">0</div>
            <div className="text-sm opacity-50">1</div>
            <div className="text-sm opacity-40">2</div>
            <div className="text-sm opacity-30">3</div>
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center text-black font-bold">4</div>
            <div className="text-sm opacity-20">5</div>
            <div className="text-sm opacity-15">6</div>
            <div className="text-sm opacity-10">7</div>
            <div className="text-sm opacity-10">8</div>
            <div className="text-sm opacity-10">9</div>
          </div>
          
          {/* Column 3 */}
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <div className="text-sm opacity-60">0</div>
            <div className="text-sm opacity-50">1</div>
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center text-black font-bold">2</div>
            <div className="text-sm opacity-40">3</div>
            <div className="text-sm opacity-30">4</div>
            <div className="text-sm opacity-20">5</div>
            <div className="text-sm opacity-15">6</div>
          </div>
          
          {/* Column 4 */}
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <div className="text-sm opacity-60">0</div>
            <div className="text-sm opacity-50">1</div>
            <div className="text-sm opacity-40">2</div>
            <div className="text-sm opacity-30">3</div>
            <div className="text-sm opacity-25">4</div>
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center text-black font-bold">9</div>
            <div className="text-sm opacity-15">1</div>
            <div className="text-sm opacity-10">2</div>
            <div className="text-sm opacity-10">3</div>
            <div className="text-sm opacity-10">4</div>
            <div className="text-sm opacity-10">5</div>
            <div className="text-sm opacity-10">6</div>
          </div>
          
          {/* Column 5 */}
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <div className="text-sm opacity-60">3</div>
            <div className="text-sm opacity-50">4</div>
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center text-black font-bold">5</div>
            <div className="text-sm opacity-40">6</div>
            <div className="text-sm opacity-30">7</div>
            <div className="text-sm opacity-20">8</div>
          </div>
          
          {/* Column 6 */}
          <div className="flex flex-col items-center space-y-2 text-muted-foreground">
            <div className="text-sm opacity-60">4</div>
            <div className="text-sm opacity-50">5</div>
            <div className="text-sm opacity-40">6</div>
            <div className="text-sm opacity-30">7</div>
            <div className="text-sm opacity-25">8</div>
            <div className="w-8 h-8 bg-muted-foreground/20 rounded-full flex items-center justify-center text-black font-bold">9</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixRain;