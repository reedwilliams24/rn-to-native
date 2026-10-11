// An actor serializes access, so only one refresh can run at a time
actor TokenStore { // @link:inflight
    private var access: String?
    private var refresh: String?
    private var refreshTask: Task<String, Error>? // @link:inflight

    func accessToken() -> String? { access }

    func refreshedToken(using auth: AuthAPI) async throws -> String {
        if let refreshTask { return try await refreshTask.value } // join the refresh in flight // @link:join
        guard let refresh else { throw APIError.http(status: 401) } // @link:guard

        let task = Task { // @link:refresh
            let pair = try await auth.refresh(refresh) // @link:refresh
            self.access = pair.accessToken // @link:save
            self.refresh = pair.refreshToken
            return pair.accessToken
        }
        refreshTask = task
        defer { refreshTask = nil } // @link:clear
        return try await task.value
    }
}

// In APIClient: on a 401, call `tokens.refreshedToken(using:)`, then retry once. // @link:hook,retry
