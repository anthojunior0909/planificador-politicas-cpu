import { useState, useMemo, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
// Algoritmos
import { runFCFS } from './algorithms/fcfs.js';
import { runSPN } from './algorithms/spn.js';
import { runSRT } from './algorithms/srt.js';
import { runRoundRobin } from './algorithms/roundRobin.js';
import { runPriorityNP } from './algorithms/priorityNP.js';
// Componentes
import { FileUploader } from './components/FileUploader.jsx';
import { ProcessForm } from './components/ProcessForm.jsx';
import { ProcessTable } from './components/ProcessTable.jsx';
import { GanttChart } from './components/GanttChart.jsx';
import { QueueViewer } from './components/QueueViewer.jsx';
import { ResultsTable } from './components/ResultsTable.jsx';
import { SimulationControls } from './components/SimulationControls.jsx';

// Hooks
import { useProcessManager } from './hooks/useProcessManager.js';
import { useSimulation } from './hooks/useSimulation.js';

export default function App() {
  // Estado local para la configuración de la simulación
  const [algorithm, setAlgorithm] = useState('SRT');
  const [quantum, setQuantum] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Inyecta o remueve la clase "dark" en el HTML según el estado
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);
  // Hook para gestionar el CRUD de procesos
  const {
    processes,
    addProcess,
    loadBulkProcesses,
    removeProcess,
    clearAllProcesses
  } = useProcessManager();

  // Ejecución dinámica del algoritmo seleccionado (se recalcula si cambian los procesos o la configuración)
  const simulationResult = useMemo(() => {
    if (processes.length === 0) return null;

    switch (algorithm) {
      case 'FCFS':
        return runFCFS(processes);
      case 'SPN':
        return runSPN(processes);
      case 'SRT':
        return runSRT(processes);
      case 'RR':
        return runRoundRobin(processes, quantum);
      case 'PRIORIDAD_NP': 
        return runPriorityNP(processes);
      default:
        return null;
    }
  }, [processes, algorithm, quantum]);

  // Extraemos los datos calculados de forma segura
  const history = simulationResult?.history || [];
  const results = simulationResult?.results || [];
  const averages = simulationResult?.averages || { avgTE: 0, avgTR: 0 };

  // Hook para controlar la línea de tiempo de la animación
  const {
    currentStep,
    isPlaying,
    speed,
    setSpeed,
    togglePlayPause,
    stepForward,
    skipToEnd,
    resetSimulation
  } = useSimulation(history.length);



  // Mapa de colores rápidos para que los gráficos mantengan consistencia
  const colorMap = useMemo(() => {
    return processes.reduce((acc, p) => {
      acc[p.id] = p.color;
      return acc;
    }, {});
  }, [processes]);

  const isPreemptive = algorithm === 'SRT' || algorithm === 'RR';
  const isPriority = algorithm === 'PRIORIDAD_NP';

  // Manejadores de eventos que además resetean la simulación si la lista cambia
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    resetSimulation();
  };

  const handleQuantumChange = (e) => {
    setQuantum(Math.max(1, parseInt(e.target.value, 10) || 1));
    resetSimulation();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8 font-sans selection:bg-blue-200">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Cabecera */}
        <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Simulador de Políticas de Planificación de CPU
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Visualizador interactivo con colas dinámicas y algoritmos evaluados paso a paso.
            </p>
          </div>

          {/* Botón de cambio de tema */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700 transition-colors shadow-inner"
            title="Cambiar a modo claro/oscuro"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* Zona de Ingesta de Datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploader onProcessesLoaded={(data) => {
            loadBulkProcesses(data);
            resetSimulation();
          }} />
          <ProcessForm onAddProcess={(p) => {
            addProcess(p);
            resetSimulation();
          }} />
        </div>

        {/* Tabla de Procesos Crudos */}
        <ProcessTable
          processes={processes}
          onDeleteProcess={(id) => {
            removeProcess(id);
            resetSimulation();
          }}
          onClearAll={() => {
            clearAllProcesses();
            resetSimulation();
          }}
        />

        {/* Controles de Configuración de Política (Solo visible si hay procesos) */}
        {processes.length > 0 && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Política de Planificación
              </label>
              <select
                value={algorithm}
                onChange={handleAlgorithmChange}
                className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow min-w-[300px]"
              >
                <option value="FCFS">FCFS (First-Come, First-Served) - No Expulsivo</option>
                <option value="SPN">SPN (Shortest Process Next) - No Expulsivo</option>
                <option value="PRIORIDAD_NP">Prioridades - No Expulsivo</option>
                <option value="SRT">SRT (Shortest Remaining Time) - Expulsivo</option>
                <option value="RR">Round Robin - Expulsivo</option>
              </select>
            </div>

            {algorithm === 'RR' && (
              <div className="animate-in fade-in slide-in-from-left-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Quantum (Q)
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantum}
                  onChange={handleQuantumChange}
                  className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow font-semibold"
                />
              </div>
            )}
          </div>
        )}

        {/* Área Visual de Simulación y Resultados */}
        {simulationResult && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <SimulationControls
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              onStep={stepForward}
              onSkipToEnd={skipToEnd}
              onReset={resetSimulation}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            <GanttChart
              history={history.slice(0, currentStep + 1)}
              processes={processes}
            />
            <QueueViewer
              historySlice={history.slice(0, currentStep + 1)}
              colorMap={colorMap}
            />
            {/* Solo mostramos la tabla final si la simulación ha terminado de reproducirse (opcional, pero queda muy bien) */}
            {currentStep === history.length - 1 && (
              <ResultsTable
                results={results}
                averages={averages}
                isPreemptive={isPreemptive}
                isPriority={isPriority}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}