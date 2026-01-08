export function fetchAllPrices() {
  return new Promise((resolve, reject) => {
    const delayMs = 800 + Math.floor(Math.random() * 700);

    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error("Failed to load prices."));
        return;
      }

      resolve({
        shirt: 20.0,
        pants: 40.0,
        shoes: 75.0,
        socks: 10.0,
        hat: 15.0,
      });
    }, delayMs);
  });
}