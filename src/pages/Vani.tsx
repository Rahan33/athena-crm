import React, { useRef, useState, useEffect } from 'react';
import { PenTool, MousePointer2, Square, Circle, Type, Download, Trash2 } from 'lucide-react';

export default function Vani() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
       canvas.width = canvas.offsetWidth;
       canvas.height = canvas.offsetHeight;
       const ctx = canvas.getContext('2d');
       if (ctx) {
         ctx.lineCap = 'round';
         ctx.lineJoin = 'round';
         ctx.lineWidth = 4;
       }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) { ctx.closePath(); }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-100 overflow-hidden relative">
      {/* Floating Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-gray-200 flex gap-2 z-10 items-center">
        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg"><PenTool className="w-5 h-5"/></button>
        <button className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg"><MousePointer2 className="w-5 h-5"/></button>
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        <button className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg"><Square className="w-5 h-5"/></button>
        <button className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg"><Circle className="w-5 h-5"/></button>
        <button className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg"><Type className="w-5 h-5"/></button>
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
        <div className="w-px h-6 bg-gray-200 mx-2"></div>
        <button onClick={clearCanvas} className="p-2 hover:bg-red-50 text-red-600 rounded-lg" title="Clear Canvas"><Trash2 className="w-5 h-5"/></button>
      </div>
      
      {/* Drawing Canvas */}
      <div className="flex-1 w-full h-full cursor-crosshair">
        <canvas 
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="w-full h-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"
        />
      </div>
    </div>
  );
}
