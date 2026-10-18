export function calculateNonPreemptiveMetrics(ti, tll, tf) {
  return {
    waitTime: ti - tll,          // TE = TI - TLL
    turnaroundTime: tf - tll     // TR = TF - TLL
  };
}

export function calculatePreemptiveMetrics(ti, tll, te, tf) {
  return {
    waitTime: ti - tll + te,     // TE = TI - TLL + te
    turnaroundTime: tf - tll     // TR = TF - TLL
  };
}
export function calculateAverages(results, history) {
  if (!results || results.length === 0) {
    return { avgTR: 0, avgTE: 0, cpuUtilization: 0, totalProcesses: 0 };
  }

  const totalTR = results.reduce((acc, p) => acc + p.turnaroundTime, 0);
  const totalTE = results.reduce((acc, p) => acc + p.waitTime, 0);

  // Tiempo total de la simulación
  const totalTime = history ? history.length : Math.max(...results.map(p => p.tf));

  // Contar cuántas unidades de tiempo la CPU NO estuvo libre (cpu !== null)
  const busyTime = history 
    ? history.filter(step => step.cpu !== null).length 
    : results.reduce((acc, p) => acc + p.servicio, 0);

  const cpuUtilization = totalTime > 0 ? (busyTime / totalTime) * 100 : 0;

  return {
    avgTR: Number((totalTR / results.length).toFixed(2)),
    avgTE: Number((totalTE / results.length).toFixed(2)),
    cpuUtilization: Number(cpuUtilization.toFixed(2)),
    totalProcesses: results.length
  };
}