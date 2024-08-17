export const rateToLabel = (rate: number) => `${rate}x`;

export const timeToLabel = (rate: number) => `${rate}s`;

export const arrToOptions = (arr: number[], generateLabel: (item: number) => string) => arr.map((item) => ({ value: item, label: generateLabel(item) }));

export const round = (number: number, digits = 2) => (digits ? +number.toFixed(digits) : Math.floor(number));
