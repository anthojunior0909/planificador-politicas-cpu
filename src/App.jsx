import { useState, useMemo, useEffect } from 'react';
import { Sun, Moon, Cpu, Network } from 'lucide-react';
import { ConcurrencyModule } from './components/concurrency/ConcurrencyModule.jsx';
// Algoritmos
import { runFCFS } from './algorithms/fcfs.js';
import { runSPN } from './algorithms/spn.js';
import { runSRT } from './algorithms/srt.js';
import { runRoundRobin } from './algorithms/roundRobin.js';
import { runPriorityNP } from './algorithms/priorityNP.js';

// Componentes del Planificador de CPU
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
import { useConcurrency } from './hooks/useConcurrency.js';

export default function App() {
  // Estado para controlar la pestaña activa: 'cpu' o 'concurrency'
  const [activeTab, setActiveTab] = useState('cpu');

  // Estado local para la configuración de la simulación de CPU
  const [algorithm, setAlgorithm] = useState('SRT');
  const [quantum, setQuantum] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Hook para el módulo de concurrencia
  const concurrency = useConcurrency();

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

  // Ejecución dinámica del algoritmo seleccionado
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
  const averages = simulationResult?.averages || { avgTE: 0, avgTR: 0, cpuUtilization: 0, totalProcesses: 0 };

  // Hook para controlar la línea de tiempo de la animación de CPU
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

  // Mapa de colores para los gráficos
  const colorMap = useMemo(() => {
    return processes.reduce((acc, p) => {
      acc[p.id] = p.color;
      return acc;
    }, {});
  }, [processes]);

  const isPreemptive = algorithm === 'SRT' || algorithm === 'RR';
  const isPriority = algorithm === 'PRIORIDAD_NP';

  // Manejadores de eventos de la CPU
  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    resetSimulation();
  };

  const handleQuantumChange = (e) => {
    setQuantum(Math.max(1, parseInt(e.target.value, 10) || 1));
    resetSimulation();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 md:p-8 font-sans transition-colors selection:bg-blue-200">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Cabecera Principal con Navegador de Pestañas */}
        <header className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-xl text-white shadow-md">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Simulador de Sistemas Operativos
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Planificación de CPU & Concurrencia de Hilos
              </p>
            </div>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 w-full md:w-auto justify-center">
            <button
              onClick={() => setActiveTab('cpu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'cpu'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <Cpu className="w-4 h-4" /> Planificador CPU
            </button>
            <button
              onClick={() => setActiveTab('concurrency')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'concurrency'
                  ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <Network className="w-4 h-4" /> Concurrencia
            </button>
          </div>

          {/* Botón de cambio de tema */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600 transition-colors shadow-inner"
            title="Cambiar a modo claro/oscuro"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </header>

        {/* CONTENIDO DE LA PESTAÑA: PLANIFICADOR DE CPU */}
        {activeTab === 'cpu' && (
          <div className="space-y-6">

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

            {/* Controles de Configuración de Política */}
            {processes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Política de Planificación
                  </label>
                  <select
                    value={algorithm}
                    onChange={handleAlgorithmChange}
                    className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-shadow min-w-[300px]"
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
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                      Quantum (Q)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantum}
                      onChange={handleQuantumChange}
                      className="w-24 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
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
        )}

        {/* CONTENIDO DE LA PESTAÑA: CONCURRENCIA */}
        {activeTab === 'concurrency' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <ConcurrencyModule concurrencyHook={concurrency} />
          </div>
        )}

      </div>
    </div>
  );
}