import { Trash2, List } from 'lucide-react';

export const ProcessTable = ({ processes, onDeleteProcess, onClearAll }) => {
  if (processes.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <List className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Lista de Procesos ({processes.length})
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-md border border-red-100 dark:border-red-800/50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Limpiar Todo
        </button>
      </div>

      <div className="overflow-x-auto max-h-48 overflow-y-auto rounded-lg border border-gray-100 dark:border-gray-700">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold z-10">
            <tr>
              <th className="p-3 w-12 text-center">Color</th>
              <th className="p-3">Proceso</th>
              <th className="p-3">TLL (Llegada)</th>
              <th className="p-3">Servicio (Duración)</th>
              <th className="p-3 text-center">Prioridad</th>
              <th className="p-3 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="p-3 text-center border-r border-gray-50 dark:border-transparent">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: p.color }}
                  />
                </td>
                <td className="p-3 font-bold text-gray-800 dark:text-gray-200">{p.id}</td>
                <td className="p-3 text-gray-600 dark:text-gray-400">{p.tll}</td>
                <td className="p-3 text-gray-600 dark:text-gray-400">{p.servicio}</td>
                <td className="p-3 text-center font-semibold text-purple-600 dark:text-purple-400">
                  {p.prioridad || 1}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => onDeleteProcess(p.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Eliminar proceso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};