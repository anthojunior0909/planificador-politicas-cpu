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

export function calculateAverages(results) {
  if (results.length === 0) return { avgTE: 0, avgTR: 0 };
  
  const totalTE = results.reduce((acc, p) => acc + p.waitTime, 0);
  const totalTR = results.reduce((acc, p) => acc + p.turnaroundTime, 0);

  return {
    avgTE: Number((totalTE / results.length).toFixed(2)),
    avgTR: Number((totalTR / results.length).toFixed(2)),
  };
}