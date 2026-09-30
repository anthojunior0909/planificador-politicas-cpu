import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export const ProcessForm = ({ onAddProcess }) => {
  const [id, setId] = useState('');
  const [tll, setTll] = useState('');
  const [servicio, setServicio] = useState('');
  const [prioridad, setPrioridad] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || tll === '' || servicio === '') return;

    onAddProcess({
      id: id.trim().toUpperCase(),
      tll: parseInt(tll, 10),
      servicio: parseInt(servicio, 10),
      prioridad: prioridad !== '' ? parseInt(prioridad, 10) : 1
    });

    setId('');
    setTll('');
    setServicio('');
    setPrioridad('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-600" /> Agregar Manual
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">ID</label>
            <input
              type="text"
              placeholder="ej. A"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Llegada (TLL)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={tll}
              onChange={(e) => setTll(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Duración</label>
            <input
              type="number"
              min="1"
              placeholder="5"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Prioridad</label>
            <input
              type="number" min="1" placeholder="1" value={prioridad} onChange={(e) => setPrioridad(e.target.value)}
              title="Menor número = mayor prioridad"
              className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex justify-center items-center gap-2"
      >
        <PlusCircle className="w-4 h-4" /> Agregar a la Lista
      </button>
    </form>
  );
};