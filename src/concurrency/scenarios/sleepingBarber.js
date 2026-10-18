import { Semaphore } from '../Semaphore.js';

export class SleepingBarberSimulation {
  constructor(onStateChange = null, numChairs = 3) {
    this.onStateChange = onStateChange;
    this.numChairs = numChairs;

    // Semáforos clásicos del Barbero Dormilón
    this.customers = new Semaphore(0); // Clientes esperando
    this.barber = new Semaphore(0);    // Barbero listo
    
    this.waitingRoom = [];             // Cola de clientes en sala de espera
    this.currentCustomer = null;       // Cliente en la silla de barbería
    this.barberState = 'SLEEPING';     // SLEEPING, CUTTING, IDLE

    this.cutDuration = 3000;           // Tiempo de corte (3 segundos por defecto)
    this.customerCounter = 1;
    this.logs = [];
  }

  notifyStateChange() {
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  // Permite ajustar el tiempo de corte desde la UI (en segundos)
  setCutDuration(seconds) {
    this.cutDuration = Math.max(1, seconds) * 1000;
  }

  // --- LLEGADA DE UN CLIENTE ---
  customerArrives(syncEnabled = true) {
    const customer = { id: `Cliente #${this.customerCounter++}` };
    this.addLog(`[${customer.id}] Llegó a la barbería.`);

    if (!syncEnabled) {
      // Modo sin sincronización (Carrera de datos)
      this.currentCustomer = customer;
      this.barberState = 'CUTTING';
      this.addLog(`⚠️ Carrera de datos: [${customer.id}] desplazó al barbero sin control.`);
      this.notifyStateChange();
      return true;
    }

    // 1. Si el barbero está durmiendo, el cliente lo despierta directamente
    if (this.barberState === 'SLEEPING' && this.waitingRoom.length === 0) {
      this.barberState = 'CUTTING';
      this.currentCustomer = customer;
      this.addLog(`[${customer.id}] Despertó al barbero y se sentó en la silla de barbería. ✂️`);
      this.notifyStateChange();

      this._startCuttingHair();
      return true;
    }

    // 2. Si el barbero está ocupado, verifica si hay espacio en la sala de espera
    if (this.waitingRoom.length < this.numChairs) {
      this.waitingRoom.push(customer);
      this.addLog(`[${customer.id}] Se sentó en la sala de espera (${this.waitingRoom.length}/${this.numChairs}).`);
      this.notifyStateChange();
      return true;
    }

    // 3. Si la sala de espera está llena, el cliente se va (Inanición / Pérdida)
    this.addLog(`🚪 [${customer.id}] Sala de espera llena. El cliente se retiró.`);
    this.notifyStateChange();
    return false;
  }

  // --- PROCESO DE CORTE DE PELO ---
  _startCuttingHair() {
    setTimeout(() => {
      if (!this.currentCustomer) return;

      const finishedCustomer = this.currentCustomer;
      this.addLog(`✨ [${finishedCustomer.id}] Terminó su corte de pelo y se retira feliz.`);
      this.currentCustomer = null;

      // Al terminar, revisa si hay clientes en la sala de espera
      if (this.waitingRoom.length > 0) {
        // Toma al primer cliente de la cola (FIFO)
        const nextCustomer = this.waitingRoom.shift();
        this.currentCustomer = nextCustomer;
        this.barberState = 'CUTTING';
        this.addLog(`[Barbero] Atendiendo al siguiente: [${nextCustomer.id}] de la sala de espera. ✂️`);
        this.notifyStateChange();

        // Inicia el corte para el nuevo cliente
        this._startCuttingHair();

      } else {
        // Si no hay nadie más esperando, el barbero vuelve a dormir
        this.barberState = 'SLEEPING';
        this.addLog(`💤 [Barbero] No hay clientes en la sala. Volvió a dormirse.`);
        this.notifyStateChange();
      }

    }, this.cutDuration);
  }

  addLog(msg) {
    this.logs.unshift({ time: new Date().toLocaleTimeString(), msg });
    if (this.logs.length > 15) this.logs.pop();
  }

  getState() {
    return {
      barberState: this.barberState,
      currentCustomer: this.currentCustomer,
      waitingRoom: [...this.waitingRoom],
      numChairs: this.numChairs,
      logs: [...this.logs]
    };
  }
}