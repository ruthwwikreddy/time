import { useEffect, useRef } from 'react';

interface Column {
  x: number;
  y: number;
  speed: number;
  numbers: number[];
  highlighted: number;
}

const MatrixRainExact = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create columns to match the exact image layout
    const columns: Column[] = [
      {
        x: canvas.width * 0.2,
        y: 0,
        speed: 1.5,
        numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        highlighted: 0 // Position of "1"
      },
      {
        x: canvas.width * 0.35,
        y: 0,
        speed: 1.2,
        numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        highlighted: 4 // Position of "4"
      },
      {
        x: canvas.width * 0.45,
        y: 0,
        speed: 1.8,
        numbers: [0, 1, 2, 3, 4, 5, 6],
        highlighted: 2 // Position of "2"
      },
      {
        x: canvas.width * 0.55,
        y: 0,
        speed: 1.3,
        numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
        highlighted: 5 // Position of "9"
      },
      {
        x: canvas.width * 0.65,
        y: 0,
        speed: 1.6,
        numbers: [3, 4, 5, 6, 7, 8],
        highlighted: 2 // Position of "5"
      },
      {
        x: canvas.width * 0.8,
        y: 0,
        speed: 1.4,
        numbers: [4, 5, 6, 7, 8, 9],
        highlighted: 5 // Position of "9"
      }
    ];

    const animate = () => {
      // Clear canvas with pure black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font properties
      ctx.font = '28px monospace';
      ctx.textAlign = 'center';

      columns.forEach((column) => {
        column.numbers.forEach((num, index) => {
          const y = column.y + (index * 40);
          
          if (y > -50 && y < canvas.height + 50) {
            if (index === column.highlighted) {
              // Draw highlighted number with gray circle background
              ctx.fillStyle = 'rgba(128, 128, 128, 0.7)';
              ctx.beginPath();
              ctx.arc(column.x, y, 22, 0, Math.PI * 2);
              ctx.fill();
              
              // Draw the highlighted number in black
              ctx.fillStyle = '#000000';
              ctx.fillText(num.toString(), column.x, y + 10);
            } else {
              // Calculate opacity for trailing effect
              const distanceFromHighlight = Math.abs(index - column.highlighted);
              const opacity = Math.max(0.1, 1 - (distanceFromHighlight * 0.15));
              
              ctx.fillStyle = `rgba(160, 160, 160, ${opacity})`;
              ctx.fillText(num.toString(), column.x, y + 10);
            }
          }
        });

        // Move column down slowly
        column.y += column.speed;

        // Reset column position when it goes too far down
        if (column.y > canvas.height + 200) {
          column.y = -200;
          // Randomize the highlighted position occasionally
          if (Math.random() < 0.3) {
            column.highlighted = Math.floor(Math.random() * column.numbers.length);
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: '#000000' }}
      />
    </div>
  );
};

export default MatrixRainExact;