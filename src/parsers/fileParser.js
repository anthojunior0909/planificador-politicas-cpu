import { generateColor } from '../utils/colorGenerator.js';

/**
 * Parsea el contenido de un archivo .txt o .csv
 * Soporta delimitadores: coma (,), punto y coma (;), espacio ( ) o tabulación (\t).
 */
export function parseProcessFile(fileContent) {
  const lines = fileContent.split(/\r?\n/);
  const processes = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    // Ignorar líneas vacías o comentarios que empiecen con "#"
    if (!trimmed || trimmed.startsWith('#')) return;

    // Dividir la línea usando una expresión regular para los delimitadores
    const tokens = trimmed.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean);

    // Necesitamos al menos 3 columnas: ID, TLL, Servicio
    if (tokens.length < 3) return;

    // Ignorar cabeceras si el usuario incluye "Proceso, TLL, Servicio"
    if (tokens[0].toLowerCase() === 'proceso' || tokens[0].toLowerCase() === 'id') return;

    const id = tokens[0].toUpperCase();
    const tll = parseInt(tokens[1], 10);
    const servicio = parseInt(tokens[2], 10);
    
    // CORRECCIÓN: Usar tokens[3] en lugar de parts[3]
    const prioridadParseada = parseInt(tokens[3], 10);
    const prioridad = !isNaN(prioridadParseada) ? prioridadParseada : 1; // Si no hay 4ta columna, prioridad 1

    // Validar que los números sean correctos
    if (!isNaN(tll) && !isNaN(servicio) && tll >= 0 && servicio > 0) {
      processes.push({
        id,
        tll,
        servicio,
        prioridad, // CORRECCIÓN: Faltaba agregarlo al objeto del proceso
        restante: servicio,
        color: generateColor(processes.length)
      });
    }
  });

  if (processes.length === 0) {
    throw new Error("El archivo no contiene procesos válidos o el formato es incorrecto.");
  }

  return processes;
}