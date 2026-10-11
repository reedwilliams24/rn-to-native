enum APIError: Error { // @link:errtype
    case http(status: Int)
}

func withRetry<T>(attempts: Int = 3, _ operation: () async throws -> T) async throws -> T { // @link:fn
    for i in 0..<(attempts - 1) { // @link:loop
        do {
            return try await operation() // @link:attempt
        } catch APIError.http(let status) where status < 500 { // @link:catch,retryable
            throw APIError.http(status: status) // 4xx won't fix itself: don't retry // @link:rethrow
        } catch { // @link:catch
            // 5xx, timeout, or no connection: retry
        }
        // Throws CancellationError if the task was cancelled, which ends the loop
        try await Task.sleep(for: .milliseconds(500 << i)) // @link:backoff
    }
    return try await operation() // @link:rethrow
}

// let todos = try await withRetry { try await api.getTodos() } // @link:usage
