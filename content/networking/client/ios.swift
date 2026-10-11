// URLSession has no interceptors: wrap it in your own client // @link:intercept
struct APIClient { // @link:client
    let baseURL: URL // @link:base
    let tokens: TokenStore
    let session: URLSession

    init(baseURL: URL, tokens: TokenStore) {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 10 // @link:timeout
        self.baseURL = baseURL
        self.tokens = tokens
        self.session = URLSession(configuration: config) // @link:client
    }

    func get<T: Decodable>(_ path: String, as type: T.Type = T.self) async throws -> T { // @link:intercept
        var request = URLRequest(url: baseURL.appending(path: path))
        if let token = await tokens.accessToken() { // @link:token
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization") // @link:header
        }
        let (data, response) = try await session.data(for: request) // @link:proceed
        try TodoAPI.check(response)
        return try JSONDecoder.api.decode(T.self, from: data)
    }
}

// Usage: let todos: [Todo] = try await client.get("todos") // @link:usage
