export async function mockApiDelay(durationMs = 2000) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}
