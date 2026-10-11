import Network

// Wrap a callback API in an AsyncStream: cleanup runs when iteration stops
func onlineUpdates() -> AsyncStream<Bool> { // @link:stream
    AsyncStream { continuation in
        let monitor = NWPathMonitor()
        monitor.pathUpdateHandler = { path in // @link:emit
            continuation.yield(path.status == .satisfied) // @link:emit
        }
        continuation.onTermination = { _ in monitor.cancel() } // @link:cleanup
        monitor.start(queue: DispatchQueue(label: "online-monitor")) // @link:register
    }
}

struct ConnectionStatus: View { // @link:fn
    @State private var online = true // @link:state

    var body: some View {
        Text(online ? "Online" : "Offline") // @link:text
            .task { // @link:subscribe
                for await value in onlineUpdates() { online = value } // @link:subscribe
            }
    }
}
