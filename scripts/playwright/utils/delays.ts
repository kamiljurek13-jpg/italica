export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const randomDelay = (min: number, max: number): Promise<void> =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);

export const slowDelay = (): Promise<void> => randomDelay(3000, 8000);
export const mediumDelay = (): Promise<void> => randomDelay(1000, 3000);
export const fastDelay = (): Promise<void> => randomDelay(500, 1500);
export const veryFastDelay = (): Promise<void> => randomDelay(300, 800);
