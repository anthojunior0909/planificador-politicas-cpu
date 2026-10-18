import { useState, useCallback } from 'react';
import { SCENARIOS } from '../../hooks/useConcurrency.js';

import { ProducerConsumerSimulation } from '../../concurrency/scenarios/producerConsumer.js';
import { ReadersWritersSimulation } from '../../concurrency/scenarios/readersWriters.js';
import { DiningPhilosophersSimulation } from '../../concurrency/scenarios/diningPhilosophers.js';
import { SleepingBarberSimulation } from '../../concurrency/scenarios/sleepingBarber.js';
import { CigaretteSmokersSimulation } from '../../concurrency/scenarios/cigaretteSmokers.js';

import { ProducerConsumerView } from './ProducerConsumerView.jsx';
import { ReadersWritersView } from './ReadersWritersView.jsx';
import { PhilosophersView } from './PhilosophersView.jsx';
import { SleepingBarberView } from './SleepingBarberView.jsx';
import { CigaretteSmokersView } from './CigaretteSmokersView.jsx';

export const ConcurrencyModule = ({ concurrencyHook }) => {
    const { selectedScenario, changeScenario, syncEnabled, setSyncEnabled } = concurrencyHook;

    const [, setTick] = useState(0);
    const forceUpdate = useCallback(() => setTick(t => t + 1), []);

    const createSimulationInstance = (scenario) => {
        switch (scenario) {
            case SCENARIOS.PRODUCER_CONSUMER:
                return new ProducerConsumerSimulation(forceUpdate);
            case SCENARIOS.READERS_WRITERS:
                return new ReadersWritersSimulation(forceUpdate);
            case SCENARIOS.DINING_PHILOSOPHERS:
                return new DiningPhilosophersSimulation(forceUpdate);
            case SCENARIOS.SLEEPING_BARBER:
                return new SleepingBarberSimulation(forceUpdate);
            case SCENARIOS.CIGARETTE_SMOKERS:
                return new CigaretteSmokersSimulation();
            default:
                return new ProducerConsumerSimulation(forceUpdate);
        }
    };

    const [prevScenario, setPrevScenario] = useState(selectedScenario);
    const [simInstance, setSimInstance] = useState(() => createSimulationInstance(selectedScenario));

    if (prevScenario !== selectedScenario) {
        const newInstance = createSimulationInstance(selectedScenario);
        setPrevScenario(selectedScenario);
        setSimInstance(newInstance);
    }

    const simState = simInstance ? simInstance.getState() : null;

    const refreshState = () => {
        forceUpdate();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                        Problema Clásico de Concurrencia
                    </label>
                    <select
                        value={selectedScenario}
                        onChange={(e) => changeScenario(e.target.value)}
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 outline-none transition-shadow min-w-[320px]"
                    >
                        <option value={SCENARIOS.PRODUCER_CONSUMER}>1. Productor - Consumidor (Buffer Limitado)</option>
                        <option value={SCENARIOS.READERS_WRITERS}>2. Lectores - Escritores (Acceso a BD)</option>
                        <option value={SCENARIOS.DINING_PHILOSOPHERS}>3. Filósofos Comensales (Deadlock e Inanición)</option>
                        <option value={SCENARIOS.SLEEPING_BARBER}>4. El Barbero Dormilón (Sillas & Sala)</option>
                        <option value={SCENARIOS.CIGARETTE_SMOKERS}>5. El Problema de los Fumadores (Agente & Ingredientes)</option>
                    </select>
                </div>
            </div>

            {selectedScenario === SCENARIOS.PRODUCER_CONSUMER && (
                <ProducerConsumerView
                    simulationState={simState}
                    onProduce={(pId) => { simInstance.produceItem(pId, syncEnabled); refreshState(); }}
                    onConsume={(cId) => { simInstance.consumeItem(cId, syncEnabled); refreshState(); }}
                    onDurationChange={(pSec, cSec) => { simInstance.setDurations(pSec, cSec); refreshState(); }}
                    syncEnabled={syncEnabled}
                    onToggleSync={() => setSyncEnabled(!syncEnabled)}
                />
            )}

            {selectedScenario === SCENARIOS.READERS_WRITERS && (
                <ReadersWritersView
                    simulationState={simState}
                    onRead={(rId) => { simInstance.startRead(rId, syncEnabled); refreshState(); }}
                    onWrite={(wId, customText) => { simInstance.startWrite(wId, customText, syncEnabled); refreshState(); }}
                    onDurationChange={(rSec, wSec) => { simInstance.setDurations(rSec, wSec); refreshState(); }}
                    syncEnabled={syncEnabled}
                    onToggleSync={() => setSyncEnabled(!syncEnabled)}
                />
            )}

            {selectedScenario === SCENARIOS.DINING_PHILOSOPHERS && (
                <PhilosophersView
                    simulationState={simState}
                    onEat={(idx) => { simInstance.takeChopsticks(idx, syncEnabled); refreshState(); }}
                    onForceDeadlock={() => { simInstance.forceDeadlock(); refreshState(); }}
                    onDurationChange={(sec) => { simInstance.setEatDuration(sec); refreshState(); }}
                    syncEnabled={syncEnabled}
                    onToggleSync={() => setSyncEnabled(!syncEnabled)}
                />
            )}

            {selectedScenario === SCENARIOS.SLEEPING_BARBER && (
                <SleepingBarberView
                    simulationState={simState}
                    onCustomerArrive={() => { simInstance.customerArrives(syncEnabled); refreshState(); }}
                    onDurationChange={(sec) => { simInstance.setCutDuration(sec); refreshState(); }}
                    syncEnabled={syncEnabled}
                    onToggleSync={() => setSyncEnabled(!syncEnabled)}
                />
            )}

            {selectedScenario === SCENARIOS.CIGARETTE_SMOKERS && (
                <CigaretteSmokersView
                    simulationState={simState}
                    onAgentAction={() => { simInstance.agentPlacesIngredients(syncEnabled); refreshState(); }}
                    onSmokerAction={(idx) => { simInstance.smokerSmokes(idx, syncEnabled); refreshState(); }}
                    syncEnabled={syncEnabled}
                    onToggleSync={() => setSyncEnabled(!syncEnabled)}
                />
            )}
        </div>
    );
};