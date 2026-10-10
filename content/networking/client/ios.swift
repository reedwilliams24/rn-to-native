// URLSession has no interceptors: wrap it in your own client
struct APIClient {
    let baseURL: URL
    let tokens: TokenStore
    let session: URLSession

    init(baseURL: URL, tokens: TokenStore) {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 10
        self.baseURL = baseURL
        self.tokens = tokens
        self.session = URLSession(configuration: config)
    }

    func get<T: Decodable>(_ path: String, as type: T.Type = T.self) async throws -> T {
        var request = URLRequest(url: baseURL.appending(path: path))
        if let token = await tokens.accessToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        let (data, response) = try await session.data(for: request)
        try TodoAPI.check(response)
        return try JSONDecoder.api.decode(T.self, from: data)
    }
}

// Usage: let todos: [Todo] = try await client.get("todos")
