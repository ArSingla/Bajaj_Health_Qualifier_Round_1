const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);

function assertIntegerArray(values, fieldName) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${fieldName} must be a non-empty array of integers.`);
  }

  for (const value of values) {
    if (!Number.isInteger(value) || !Number.isFinite(value)) {
      throw new Error(`${fieldName} must contain only finite integers.`);
    }
  }
}

function bigIntToSerializable(value) {
  if (value <= MAX_SAFE_BIGINT && value >= -MAX_SAFE_BIGINT) {
    return Number(value);
  }

  return value.toString();
}

function fibonacci(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('fibonacci must be a non-negative integer.');
  }

  const result = [];
  let a = 0n;
  let b = 1n;

  for (let i = 0; i < n; i += 1) {
    result.push(bigIntToSerializable(a));
    const next = a + b;
    a = b;
    b = next;
  }

  return result;
}

function isPrimeNumber(value) {
  if (value <= 1 || !Number.isInteger(value)) {
    return false;
  }

  if (value === 2) {
    return true;
  }

  if (value % 2 === 0) {
    return false;
  }

  const limit = Math.floor(Math.sqrt(value));
  for (let i = 3; i <= limit; i += 2) {
    if (value % i === 0) {
      return false;
    }
  }

  return true;
}

function primeFilter(values) {
  assertIntegerArray(values, 'prime');
  return values.filter((value) => isPrimeNumber(value));
}

function gcdBigInt(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;

  while (y !== 0n) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x;
}

function lcmBigInt(a, b) {
  if (a === 0n || b === 0n) {
    return 0n;
  }

  const gcd = gcdBigInt(a, b);
  return (a / gcd) * b < 0n ? -((a / gcd) * b) : (a / gcd) * b;
}

function lcm(values) {
  assertIntegerArray(values, 'lcm');

  const asBigInt = values.map((value) => BigInt(value));
  const output = asBigInt.reduce((acc, current) => lcmBigInt(acc, current));

  return bigIntToSerializable(output);
}

function hcf(values) {
  assertIntegerArray(values, 'hcf');

  const asBigInt = values.map((value) => BigInt(value));
  const output = asBigInt.reduce((acc, current) => gcdBigInt(acc, current));

  return bigIntToSerializable(output);
}

module.exports = {
  fibonacci,
  primeFilter,
  lcm,
  hcf,
};
