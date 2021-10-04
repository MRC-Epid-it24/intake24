export const toMB = (data: number): string => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

export const getMemoryUsage = (): Record<keyof NodeJS.MemoryUsage, string> => {
  const memory = process.memoryUsage();

  return {
    rss: toMB(memory.rss),
    heapTotal: toMB(memory.heapTotal),
    heapUsed: toMB(memory.heapUsed),
    external: toMB(memory.external),
    arrayBuffers: toMB(memory.arrayBuffers),
  };
};
