// Documents: kept and backed up. Caches: not backed up; the system may purge it. // @link:dirs
func exportTodos(_ todos: [Todo]) throws -> URL { // @link:export
    let url = URL.documentsDirectory.appending(path: "export.json") // @link:exportpath
    try JSONEncoder().encode(todos).write(to: url, options: .atomic) // @link:exportwrite
    return url // @link:exportret
}

func cacheThumbnail(id: String, data: Data) throws -> URL { // @link:cache
    let url = URL.cachesDirectory.appending(path: "thumb-\(id).jpg") // @link:cachepath
    try data.write(to: url) // @link:cachewrite
    return url // @link:cacheret
}
