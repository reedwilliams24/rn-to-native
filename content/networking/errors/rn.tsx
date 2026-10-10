class HttpError extends Error {
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (e) {
      const retryable = !(e instanceof HttpError) || e.status >= 500;
      if (!retryable || i === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, 500 * 2 ** i)); // 500ms, 1s, 2s…
    }
  }
}

// const todos = await withRetry(() => getTodos());
