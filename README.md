# 💻 Simulador de Gestión de Procesos y Concurrencia de Sistemas Operativos

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=black)
![Plotly](https://img.shields.io/badge/Plotly.js-2.x-3F4F75?style=for-the-badge&logo=plotly&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-green?style=for-the-badge)

Una aplicación web interactiva desarrollada para la enseñanza y experimentación de conceptos fundamentales de **Sistemas Operativos**: algoritmos de planificación de CPU y resolución de problemas clásicos de concurrencia mediante primitivas de sincronización (*Mutex* y *Semáforos*).

---

## 📋 Tabla de Contenidos
- [Características Principales](#-características-principales)
  - [1. Módulo de Planificación de CPU](#1-módulo-de-planificación-de-cpu)
  - [2. Módulo de Concurrencia e Hilos](#2-módulo-de-concurrencia-e-hilos)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación y Uso](#-instalación-y-uso)
- [📄 Formato de Carga Masiva (.txt / .csv)](#-formato-de-carga-masiva-txt--csv)
- [🎓 Contexto Académico](#-contexto-académico)
- [📝 Licencia](#-licencia)

---

## ✨ Características Principales

### 1. Módulo de Planificación de CPU
Permite evaluar y comparar el comportamiento del procesador bajo distintas políticas de ordenamiento y asignación de tiempo:
* **Algoritmos Implementados:**
  * **FCFS** (*First-Come, First-Served*) - No expulsivo.
  * **SPN / SJF** (*Shortest Process Next*) - No expulsivo.
  * **Prioridades** - No expulsivo.
  * **SRT** (*Shortest Remaining Time*) - Expulsivo.
  * **Round Robin (RR)** - Expulsivo (con *quantum* de tiempo configurable).
* **Entrada de Datos:** Registro manual interactivo y soporte de **carga masiva** mediante archivos `.txt` o `.csv`.
* **Visualización Dinámica:**
  * **Diagrama de Gantt Interactivo:** Renderizado en tiempo real con zoom y desplazamiento utilizando Plotly.js.
  * **Pila Vertical de CPU:** Historial paso a paso del estado de la cola de ejecución.
* **Métricas Automáticas:** Cálculo instantáneo de utilización de CPU ($100\%$), Tiempo de Espera Medio ($\bar{T}_w$) y Tiempo de Retorno Medio ($\bar{T}_r$).

### 2. Módulo de Concurrencia e Hilos
Representación gráfica y simulación dinámica de los **5 problemas clásicos de sincronización**:
1. **Productor - Consumidor (Buffer Limitado):**
   * Buffer circular de capacidad $N=5$.
   * Control mediante semáforos contadores (`empty`, `full`) y cerrojo `Mutex`.
   * Conmutación de **Sincronización ACTIVADA / DESACTIVADA** para evidenciar condiciones de carrera (*race conditions*).
2. **Lectores - Escritores:**
   * Acceso concurrente de múltiples lectores a una Base de Datos compartida.
   * Exclusión mutua estricta para escritores (`rw_mutex`) y personalización del dato a escribir.
3. **Filósofos Comensales:**
   * Mesa circular con 5 filósofos y asignación asimétrica de cubiertos adyacentes.
   * Botón interactivo para **Provocar Interbloqueo (*Deadlock*)** y evidenciar el bloqueo circular.
4. **El Barbero Dormilón:**
   * Simulación de sala de espera con $N=3$ sillas finitas.
   * Control de estado del barbero (Dormido / Atendiendo) y temporizador de corte parametrizable.
5. **El Problema de los Fumadores:**
   * Coordinación entre un hilo Agente y 3 hilos Fumadores (Tabaco, Papel, Fósforos).
   * Generación aleatoria de insumos en la mesa y activación automática del hilo correspondiente.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** [React 18](https://react.dev/) (Hooks, `useCallback`, `useState`).
* **Estilos & UI:** [Tailwind CSS](https://tailwindcss.com/) (Diseño responsivo, componentes limpios y soporte para modo oscuro).
* **Gráficos:** [Plotly.js](https://plotly.com/javascript/) / `react-plotly.js` (Diagramas de Gantt interactivos).
* **Iconografía:** [Lucide React](https://lucide.dev/) (Indicadores dinámicos de estado e interfaz).
* **Lógica Interna:** JavaScript ES6+ (Clases puras para `Mutex`, `Semaphore` y motores de simulación con patrón *Observer/Callback*).

---

## 📁 Estructura del Proyecto

```text
simulador-so/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/            # Componentes funcionales de React (UI)
│   │   ├── Navbar.jsx
│   │   ├── CPUPlanificador.jsx
│   │   ├── ConcurrenciaModulo.jsx
│   │   └── GanttChart.jsx
│   ├── concurrency/           # Lógica pura de concurrencia y sincronización
│   │   ├── core/
│   │   │   ├── Mutex.js       # Implementación de cerrojo Mutex con cola FIFO
│   │   │   └── Semaphore.js   # Semáforo contador de Dijkstra
│   │   └── scenarios/
│   │       ├── producerConsumer.js
│   │       ├── readersWriters.js
│   │       ├── diningPhilosophers.js
│   │       ├── sleepingBarber.js
│   │       └── cigaretteSmokers.js
│   ├── scheduler/             # Algoritmos de planificación de CPU
│   │   ├── fcfsScheduler.js
│   │   ├── spnScheduler.js
│   │   ├── srtScheduler.js
│   │   ├── priorityScheduler.js
│   │   └── roundRobinScheduler.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🚀 Instalación y Uso

### Requisitos Previos
* [Node.js](https://nodejs.org/) (versión 16.x o superior)
* `npm` o `yarn`

### Pasos de Ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu_usuario/tu_repositorio_simulador.git
   cd tu_repositorio_simulador
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Accede a `http://localhost:5173` (o la URL indicada por Vite/React).

---

## 📄 Formato de Carga Masiva (.txt / .csv)

El módulo de planificación de CPU permite importar un conjunto de procesos desde un archivo de texto plano. Cada línea debe contener los valores separados por comas, espacios o tabulaciones con el siguiente formato:

```text
ID, Tiempo_Llegada, Tiempo_Servicio, Prioridad
```

### Ejemplo (`procesos.txt`):
```text
A, 0, 5, 1
B, 1, 2, 1
C, 2, 6, 1
D, 3, 4, 1
E, 4, 3, 1
```

---

## 🎓 Contexto Académico

* **Institución:** Universidad Nacional del Altiplano (UNAP - Puno)
* **Facultad:** Facultad de Ingeniería Mecánica Eléctrica, Electrónica y Sistemas
* **Escuela Profesional:** Ingeniería de Sistemas
* **Curso:** Sistemas Operativos
* **Docente:** Ing. Donia Alizandra Ruelas Aceros
* **Desarrollado por:** Anthony Junior Quispe Cruz
* **Semestre:** Quinto Semestre (2026-II)

---

## 📝 Licencia

Este proyecto está bajo la Licencia **MIT**. Consulta el archivo `LICENSE` para más información.