class HttpError extends Error { // @link:errtype
  constructor(public status: number) {
    super(`HTTP ${status}`);
  }
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> { // @link:fn
  for (let i = 0; ; i++) { // @link:loop
    try {
      return await fn(); // @link:attempt
    } catch (e) { // @link:catch
      const retryable = !(e instanceof HttpError) || e.status >= 500; // @link:retryable
      if (!retryable || i === attempts - 1) throw e; // @link:rethrow
      await new Promise((r) => setTimeout(r, 500 * 2 ** i)); // 500ms, 1s, 2s… // @link:backoff
    }
  }
}

// const todos = await withRetry(() => getTodos()); // @link:usage
