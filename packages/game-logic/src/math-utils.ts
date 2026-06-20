// Sigmoid function for smooth saturation
export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Hyperbolic tangent for symmetric saturation
export function tanh(x: number): number {
  const e2x = Math.exp(2 * x);
  return (e2x - 1) / (e2x + 1);
}

// Exponential decay for time-based weighting
export function exponentialDecay(t: number, lambda: number = 0.05): number {
  return Math.exp(-lambda * t);
}

// Logarithmic growth with diminishing returns
export function logGrowth(x: number, base: number = 10): number {
  return Math.log(1 + x) / Math.log(base);
}

// Geometric mean for balanced averaging
export function geometricMean(values: number[]): number {
  if (values.length === 0) return 0;
  const product = values.reduce((acc, val) => acc * Math.max(0.01, val), 1);
  return Math.pow(product, 1 / values.length);
}

// Normalize value to 0-1 range
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// Shannon entropy for diversity measurement
export function shannonEntropy(distribution: number[]): number {
  const total = distribution.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;

  return -distribution.reduce((entropy, count) => {
    if (count === 0) return entropy;
    const p = count / total;
    return entropy + p * Math.log2(p);
  }, 0);
}

// Confidence score based on data quality
export function calculateConfidence(dataPoints: number, recencyDays: number, diversitySources: number): number {
  const pointsFactor = Math.min(1.0, dataPoints / 30); // Need 30+ points for full confidence
  const recencyFactor = Math.exp(-recencyDays / 180); // 6 months = 180 days
  const diversityFactor = Math.min(1.0, diversitySources / 3); // 3 sources ideal

  return pointsFactor * recencyFactor * diversityFactor;
}
