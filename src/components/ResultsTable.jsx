import { Table, Cpu, Users, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const ResultsTable = ({ results, averages, isPreemptive, isPriority }) => {
  if (!results || results.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <Table className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Resultados Finales y Métricas Globales
      </h3>

      {/* TARJETAS DE MÉTRICAS / KPIS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
        
        {/* Cantidad de Procesos */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-xl text-purple-900 dark:text-purple-300 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-800/40 rounded-lg">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <span className="text-xs text-purple-700 dark:text-purple-400 font-medium block">Total Procesos</span>
            <strong className="text-xl font-bold">{averages.totalProcesses || results.length}</strong>
          </div>
        </div>

        {/* Porcentaje de Uso de CPU */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-emerald-900 dark:text-emerald-300 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-emerald-100 dark:bg-emerald-800/40 rounded-lg">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
          </div>
          <div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium block">Uso de CPU</span>
            <strong className="text-xl font-bold">{averages.cpuUtilization}%</strong>
          </div>
        </div>

        {/* TE Medio */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl text-blue-900 dark:text-blue-300 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-800/40 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <span className="text-xs text-blue-700 dark:text-blue-400 font-medium block">TE Medio (Espera)</span>
            <strong className="text-xl font-bold">{averages.avgTE} u</strong>
          </div>
        </div>

        {/* TR Medio */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-amber-900 dark:text-amber-300 flex items-center gap-3 shadow-sm">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-800/40 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium block">TR Medio (Retorno)</span>
            <strong className="text-xl font-bold">{averages.avgTR} u</strong>
          </div>
        </div>

      </div>


      {/*tabla de resultados*/}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 mb-5">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
            <tr>
              <th className="p-3 border-r border-gray-200 dark:border-gray-700 text-center w-12">Color</th>
              <th className="p-3">Proceso</th>
              <th className="p-3 text-center">TLL</th>
              <th className="p-3 text-center">Servicio</th>
              {isPriority && <th className="p-3 text-center text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-900/20">Prioridad</th>}
              <th className="p-3 text-center">TI</th>
              <th className="p-3 text-center">TF</th>
              {isPreemptive && <th className="p-3 text-center text-amber-600 dark:text-amber-400 bg-amber-50/30 dark:bg-amber-900/20">te (Expulsión)</th>}
              <th className="p-3 text-center font-bold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20">TE (Espera)</th>
              <th className="p-3 text-center font-bold text-green-700 dark:text-green-400 bg-green-50/50 dark:bg-green-900/20">TR (Retorno)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((p) => (
              <tr 
                key={p.id} 
                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors font-mono"
              >
                <td className="p-3 text-center border-r border-gray-100 dark:border-gray-700/50">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: p.color }}
                  />
                </td>
                <td className="p-3 font-bold text-gray-800 dark:text-gray-200">{p.id}</td>
                <td className="p-3 text-center text-gray-600 dark:text-gray-400">{p.tll}</td>
                <td className="p-3 text-center text-gray-600 dark:text-gray-400">{p.servicio}</td>
                {isPriority && <td className="p-3 text-center font-semibold text-purple-600 dark:text-purple-400 bg-purple-50/10 dark:bg-purple-900/10">{p.prioridad}</td>}
                <td className="p-3 text-center text-gray-600 dark:text-gray-400">{p.ti}</td>
                <td className="p-3 text-center text-gray-600 dark:text-gray-400">{p.tf}</td>
                {isPreemptive && <td className="p-3 text-center text-amber-600 dark:text-amber-400 bg-amber-50/10 dark:bg-amber-900/10">{p.te}</td>}
                <td className="p-3 text-center font-bold text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/10">{p.waitTime}</td>
                <td className="p-3 text-center font-bold text-green-600 dark:text-green-400 bg-green-50/30 dark:bg-green-900/10">{p.turnaroundTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};