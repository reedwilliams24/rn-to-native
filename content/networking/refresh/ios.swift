// An actor serializes access, so only one refresh can run at a time
actor TokenStore {
    private var access: String?
    private var refresh: String?
    private var refreshTask: Task<String, Error>?

    func accessToken() -> String? { access }

    func refreshedToken(using auth: AuthAPI) async throws -> String {
        if let refreshTask { return try await refreshTask.value } // join the refresh in flight
        guard let refresh else { throw APIError.http(status: 401) }

        let task = Task {
            let pair = try await auth.refresh(refresh)
            self.access = pair.accessToken
            self.refresh = pair.refreshToken
            return pair.accessToken
        }
        refreshTask = task
        defer { refreshTask = nil }
        return try await task.value
    }
}

// In APIClient: on a 401, call `tokens.refreshedToken(using:)`, then retry once.
