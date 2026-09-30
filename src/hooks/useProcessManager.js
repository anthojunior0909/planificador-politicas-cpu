import { useState } from 'react';
import { generateColor } from '../utils/colorGenerator.js';

export function useProcessManager() {
    const [processes, setProcesses] = useState([]);

    const addProcess = (newProcess) => {
        setProcesses((prev) => {
            // Validar que no se repitan los IDs
            if (prev.some((p) => p.id === newProcess.id)) {
                alert(`El proceso con ID "${newProcess.id}" ya existe.`);
                return prev;
            }
            return [...prev, {
                ...newProcess,
                restante: newProcess.servicio,
                color: newProcess.color || generateColor(prev.length)
            }];
        });
    };

    const loadBulkProcesses = (loadedProcesses) => {
        // Al cargar un archivo, reemplazamos la lista actual
        setProcesses(loadedProcesses);
    };

    const removeProcess = (id) => {
        setProcesses((prev) => prev.filter((p) => p.id !== id));
    };

    const clearAllProcesses = () => {
        setProcesses([]);
    };

    return {
        processes,
        addProcess,
        loadBulkProcesses,
        removeProcess,
        clearAllProcesses
    };
}