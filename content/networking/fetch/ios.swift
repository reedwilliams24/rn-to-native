struct TodoAPI { // @link:api
    var baseURL = URL(string: "https://api.example.com")! // @link:base
    var session = URLSession.shared

    func getTodos() async throws -> [Todo] { // @link:get
        let (data, response) = try await session.data(from: baseURL.appending(path: "todos")) // @link:get-req
        try Self.check(response) // @link:check
        return try JSONDecoder.api.decode([Todo].self, from: data) // @link:decode
    }

    func createTodo(_ input: NewTodo) async throws -> Todo { // @link:create
        var request = URLRequest(url: baseURL.appending(path: "todos")) // @link:create-req
        request.httpMethod = "POST" // @link:post
        request.setValue("application/json", forHTTPHeaderField: "Content-Type") // @link:ctype
        request.httpBody = try JSONEncoder().encode(input) // @link:body
        let (data, response) = try await session.data(for: request)
        try Self.check(response) // @link:check
        return try JSONDecoder.api.decode(Todo.self, from: data) // @link:decode
    }

    // Like fetch, URLSession doesn't throw for 4xx/5xx
    static func check(_ response: URLResponse) throws { // @link:check
        guard let http = response as? HTTPURLResponse else { throw URLError(.badServerResponse) }
        guard (200..<300).contains(http.statusCode) else { throw APIError.http(status: http.statusCode) }
    }
}
