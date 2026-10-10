struct Elapsed: View {
    @State private var seconds = 0

    var body: some View {
        Text("\(seconds)s")
            .task {
                // Cancelled automatically when the view disappears:
                // Task.sleep then throws and we fall out of the loop.
                do {
                    while true {
                        try await Task.sleep(for: .seconds(1))
                        seconds += 1
                    }
                } catch {}
            }
    }
}
