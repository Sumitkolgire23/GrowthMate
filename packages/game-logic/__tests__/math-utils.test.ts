import { describe, it, expect } from 'vitest';
import { sigmoid, tanh, exponentialDecay, logGrowth, geometricMean, normalize, shannonEntropy, calculateConfidence } from '../src/math-utils';

describe('math-utils', () => {
  it('sigmoid matches expectation', () => {
    expect(sigmoid(0)).toBe(0.5);
    expect(sigmoid(10)).toBeGreaterThan(0.99);
  });

  it('tanh matches expectation', () => {
    expect(tanh(0)).toBe(0);
    expect(tanh(2)).toBeCloseTo(0.964, 3);
  });

  it('exponentialDecay decay rate works', () => {
    expect(exponentialDecay(0)).toBe(1);
    expect(exponentialDecay(10, 0.1)).toBeCloseTo(0.3679, 4);
  });

  it('logGrowth works', () => {
    expect(logGrowth(0)).toBe(0);
    expect(logGrowth(9, 10)).toBeCloseTo(1.0, 5);
  });

  it('geometricMean handles values', () => {
    expect(geometricMean([])).toBe(0);
    expect(geometricMean([2, 8])).toBeCloseTo(4, 5);
  });

  it('normalize fits values in range', () => {
    expect(normalize(5, 0, 10)).toBe(0.5);
    expect(normalize(12, 0, 10)).toBe(1.0);
    expect(normalize(-2, 0, 10)).toBe(0);
  });

  it('shannonEntropy handles distributions', () => {
    expect(shannonEntropy([0, 0])).toBe(0);
    expect(shannonEntropy([5, 5])).toBe(1); // 50/50 split -> 1 bit of entropy
  });

  it('calculateConfidence works', () => {
    expect(calculateConfidence(0, 0, 0)).toBe(0);
    expect(calculateConfidence(30, 0, 3)).toBe(1.0);
  });
});
