import Network

// Wrap a callback API in an AsyncStream: cleanup runs when iteration stops
func onlineUpdates() -> AsyncStream<Bool> {
    AsyncStream { continuation in
        let monitor = NWPathMonitor()
        monitor.pathUpdateHandler = { path in
            continuation.yield(path.status == .satisfied)
        }
        continuation.onTermination = { _ in monitor.cancel() }
        monitor.start(queue: DispatchQueue(label: "online-monitor"))
    }
}

struct ConnectionStatus: View {
    @State private var online = true

    var body: some View {
        Text(online ? "Online" : "Offline")
            .task {
                for await value in onlineUpdates() { online = value }
            }
    }
}
