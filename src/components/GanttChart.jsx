import { useState, useEffect, useMemo } from 'react';
import { BarChart3, Maximize2, Minimize2, ZoomIn, ZoomOut, Zap } from 'lucide-react';

export const GanttChart = ({ history, processes }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cellSize, setCellSize] = useState(40);

  useEffect(() => {
    if (isFullscreen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFullscreen]);

  const executionBlocks = useMemo(() => {
    if (!history) return [];
    const blocks = [];
    let currentBlock = null;

    history.forEach((step, t) => {
      if (currentBlock && currentBlock.id === step.cpu) {
        currentBlock.duration += 1;
      } else {
        if (currentBlock) blocks.push(currentBlock);
        if (step.cpu) {
          currentBlock = { id: step.cpu, start: t, duration: 1 };
        } else {
          currentBlock = null;
        }
      }
    });
    if (currentBlock) blocks.push(currentBlock);
    return blocks;
  }, [history]);

  if (!history || history.length === 0 || processes.length === 0) return null;

  const colorMap = processes.reduce((acc, p) => {
    acc[p.id] = p.color;
    return acc;
  }, {});

  const processIds = [...processes]
    .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
    .map(p => p.id);

  const containerClass = isFullscreen
    ? "fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 p-6 overflow-auto flex flex-col"
    : "bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative transition-colors";

  const fontSizeClass = cellSize < 25 ? "text-[8px]" : cellSize < 35 ? "text-[10px]" : "text-xs";
  const isHeavyLoad = history.length > 200 || processes.length > 50;

  const gridBackground = {
    backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${cellSize - 1}px, #d1d5db ${cellSize - 1}px, #d1d5db ${cellSize}px)`,
    backgroundSize: `${cellSize}px 100%`
  };
  
  const darkGridBackground = {
    backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${cellSize - 1}px, #374151 ${cellSize - 1}px, #374151 ${cellSize}px)`,
    backgroundSize: `${cellSize}px 100%`
  };

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-4 sticky left-0">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 
            Diagrama de Ejecución
          </h3>
          {isHeavyLoad && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md flex items-center gap-1">
              <Zap className="w-3 h-3" /> Modo Alto Rendimiento
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <ZoomOut className="w-4 h-4" />
            <input 
              type="range" min="10" max="80" 
              value={cellSize} 
              onChange={(e) => setCellSize(Number(e.target.value))}
              className="w-24 cursor-pointer accent-blue-600"
            />
            <ZoomIn className="w-4 h-4" />
          </div>
          
          <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600"></div>
          
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium text-sm flex items-center gap-1.5 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isFullscreen ? 'Salir' : 'Ampliar'}
          </button>
        </div>
      </div>

      <div className="overflow-auto pb-6 flex-grow custom-scrollbar bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
        <div className="min-w-max inline-block relative">
          
          <div className="flex border-t border-l border-gray-300 dark:border-gray-600">
            <div className="flex flex-col bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-400 dark:border-gray-500 font-bold text-gray-700 dark:text-gray-300 sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
              {processIds.map((id) => (
                <div 
                  key={`label-${id}`} 
                  className={`flex items-center justify-center border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 ${fontSizeClass}`} 
                  style={{ width: `${Math.max(40, cellSize)}px`, height: `${cellSize}px` }}
                >
                  {id}
                </div>
              ))}
            </div>

            <div 
              className="relative dark:hidden" 
              style={{ ...gridBackground, width: `${history.length * cellSize}px` }}
            >
              {processIds.map((id) => (
                <div key={`row-${id}`} className="border-b border-gray-300" style={{ height: `${cellSize}px`, width: '100%' }}></div>
              ))}

              {executionBlocks.map((block, idx) => {
                const rowIndex = processIds.indexOf(block.id);
                if (rowIndex === -1) return null;
                
                return (
                  <div
                    key={`block-${idx}`}
                    className="absolute rounded-sm shadow-sm opacity-90 hover:opacity-100 transition-opacity"
                    style={{
                      backgroundColor: colorMap[block.id],
                      top: `${rowIndex * cellSize + 1}px`,
                      left: `${block.start * cellSize + 1}px`,
                      width: `${block.duration * cellSize - 2}px`,
                      height: `${cellSize - 2}px`,
                      zIndex: 10
                    }}
                  />
                );
              })}
            </div>

            <div 
              className="relative hidden dark:block" 
              style={{ ...darkGridBackground, width: `${history.length * cellSize}px` }}
            >
              {processIds.map((id) => (
                <div key={`dark-row-${id}`} className="border-b border-gray-600" style={{ height: `${cellSize}px`, width: '100%' }}></div>
              ))}
              {executionBlocks.map((block, idx) => {
                const rowIndex = processIds.indexOf(block.id);
                if (rowIndex === -1) return null;
                return (
                  <div
                    key={`dark-block-${idx}`}
                    className="absolute rounded-sm shadow-md"
                    style={{
                      backgroundColor: colorMap[block.id],
                      top: `${rowIndex * cellSize + 1}px`,
                      left: `${block.start * cellSize + 1}px`,
                      width: `${block.duration * cellSize - 2}px`,
                      height: `${cellSize - 2}px`,
                      zIndex: 10
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex border-t-2 border-gray-400 dark:border-gray-500 pt-1" style={{ marginLeft: `${Math.max(40, cellSize)}px` }}>
            {history.map((step, t) => {
              if (isHeavyLoad && cellSize < 20 && t % 5 !== 0 && t !== history.length) return <div key={`time-${t}`} style={{ width: `${cellSize}px` }} className="shrink-0"></div>;
              
              return (
                <div key={`time-${t}`} className={`relative font-mono text-gray-600 dark:text-gray-400 shrink-0 ${fontSizeClass}`} style={{ width: `${cellSize}px` }}>
                  <span className="absolute -left-1 sm:-left-2 top-0 px-0.5">{t}</span>
                  <div className="absolute left-0 -top-2 w-[1px] h-2 bg-gray-400 dark:bg-gray-500" />
                </div>
              );
            })}
            <div className={`relative font-mono text-gray-600 dark:text-gray-400 shrink-0 ${fontSizeClass}`}>
              <span className="absolute -left-1 sm:-left-2 top-0 px-0.5">{history.length}</span>
              <div className="absolute left-0 -top-2 w-[1px] h-2 bg-gray-400 dark:bg-gray-500" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};