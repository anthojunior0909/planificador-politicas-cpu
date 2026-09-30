import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { parseProcessFile } from '../parsers/fileParser.js';

export const FileUploader = ({ onProcessesLoaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const processes = parseProcessFile(text);
        
        setFileName(file.name);
        onProcessesLoaded(processes);
      } catch (err) {
        setError(err.message || "Error al procesar el archivo.");
        setFileName(null);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Carga Masiva (.txt / .csv)
      </h3>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400" 
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
        }`}
      >
        <input
          type="file"
          accept=".txt,.csv"
          id="file-input"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center w-full">
          <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Arrastra tu archivo aquí o <span className="text-blue-600 dark:text-blue-400 underline">examina</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Soporta CSV o TXT (comas, espacios, tabulaciones)</span>
        </label>
      </div>

      {fileName && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800/50">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Archivo cargado: <strong>{fileName}</strong></span>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800/50">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};