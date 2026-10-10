enum APIError: Error {
    case http(status: Int)
}

func withRetry<T>(attempts: Int = 3, _ operation: () async throws -> T) async throws -> T {
    for i in 0..<(attempts - 1) {
        do {
            return try await operation()
        } catch APIError.http(let status) where status < 500 {
            throw APIError.http(status: status) // 4xx won't fix itself: don't retry
        } catch {
            // 5xx, timeout, or no connection: retry
        }
        // Throws CancellationError if the task was cancelled, which ends the loop
        try await Task.sleep(for: .milliseconds(500 << i))
    }
    return try await operation()
}

// let todos = try await withRetry { try await api.getTodos() }
