import { Mutex } from '../Mutex.js';
import { Semaphore } from '../Semaphore.js';

export class CigaretteSmokersSimulation {
  constructor() {
    // Semáforos para cada ingrediente que falta en la mesa
    this.smokersSem = {
      tobacco: new Semaphore(0), // Faltaba tabaco -> Despierta al fumador con Tabaco
      paper: new Semaphore(0),   // Faltaba papel -> Despierta al fumador con Papel
      match: new Semaphore(0)    // Faltaban fósforos -> Despierta al fumador con Fósforos
    };

    // Semáforo para notificar al agente que la mesa está libre
    this.agentSem = new Semaphore(1);
    this.mutex = new Mutex();

    this.tableIngredients = []; // Ingredeintes actuales en la mesa
    this.agentState = 'WAITING'; // 'WAITING', 'PLACING_INGREDIENTS'
    
    this.smokers = [
      { id: 'Fumador_Tabaco', has: 'Tabaco', needs: ['Papel', 'Fósforos'], state: 'WAITING' },
      { id: 'Fumador_Papel', has: 'Papel', needs: ['Tabaco', 'Fósforos'], state: 'WAITING' },
      { id: 'Fumador_Fósforos', has: 'Fósforos', needs: ['Tabaco', 'Papel'], state: 'WAITING' }
    ];

    this.logs = [];
  }

  // Evento: El Agente coloca 2 ingredientes aleatorios en la mesa
  agentPlacesIngredients(syncEnabled = true) {
    if (syncEnabled) {
      const canPlace = this.agentSem.wait('Agente');
      if (!canPlace) {
        this.addLog(`[Agente] Esperando a que un fumador termine de fumar.`);
        return false;
      }
    }

    this.agentState = 'PLACING_INGREDIENTS';
    
    // Elegimos aleatoriamente el ingrediente que NO estará en la mesa
    const options = ['tobacco', 'paper', 'match'];
    const missingIndex = Math.floor(Math.random() * 3);
    const missingIngredient = options[missingIndex];

    // Los dos ingredientes en la mesa son los que no son missingIngredient
    if (missingIngredient === 'tobacco') {
      this.tableIngredients = ['Papel', 'Fósforos'];
    } else if (missingIngredient === 'paper') {
      this.tableIngredients = ['Tabaco', 'Fósforos'];
    } else {
      this.tableIngredients = ['Tabaco', 'Papel'];
    }

    this.addLog(`[Agente] Puso en la mesa: ${this.tableIngredients.join(' y ')}.`);

    if (syncEnabled) {
      // Notificamos al semáforo del fumador que posee el ingrediente faltante
      this.smokersSem[missingIngredient].signal();
    } else {
      // Sin Sincronización: Todos intentan tomar los ingredientes al tiempo (Condición de Carrera)
      this.addLog(`⚠️ Condición de Carrera: Todos los fumadores se abalanzan sobre la mesa.`);
      const winnerIndex = Math.floor(Math.random() * 3);
      this.smokerSmokes(winnerIndex, false);
    }

    this.agentState = 'WAITING';
    return true;
  }

  // Intenta hacer fumar a un fumador específico
  smokerSmokes(smokerIndex, syncEnabled = true) {
    const s = this.smokers[smokerIndex];

    if (syncEnabled) {
      // Determinamos cuál es el semáforo de este fumador
      const key = s.has === 'Tabaco' ? 'tobacco' : s.has === 'Papel' ? 'paper' : 'match';
      
      // Verificamos si este fumador fue notificado
      if (this.smokersSem[key].getValue() <= 0) {
        this.addLog(`[${s.id}] No tiene los ingredientes que necesita en la mesa.`);
        return false;
      }

      this.smokersSem[key].wait(s.id);
    }

    // --- SECCIÓN CRÍTICA ---
    s.state = 'SMOKING';
    this.addLog(`[${s.id}] Tomó ${this.tableIngredients.join(' y ')} de la mesa. Armó su cigarrillo y ¡Está Fumando! 🚬`);
    this.tableIngredients = [];

    setTimeout(() => {
      s.state = 'WAITING';
      this.addLog(`[${s.id}] Terminó de fumar.`);
      
      if (syncEnabled) {
        // Notifica al Agente para que vuelva a colocar ingredientes
        this.agentSem.signal();
      }
    }, 2500);

    return true;
  }

  addLog(msg) {
    this.logs.unshift({ time: new Date().toLocaleTimeString(), msg });
    if (this.logs.length > 15) this.logs.pop();
  }

  getState() {
    return {
      tableIngredients: [...this.tableIngredients],
      agentState: this.agentState,
      smokers: [...this.smokers],
      logs: [...this.logs]
    };
  }
}