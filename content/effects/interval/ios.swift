struct Elapsed: View { // @link:fn
    @State private var seconds = 0 // @link:state

    var body: some View {
        Text("\(seconds)s") // @link:text
            .task { // @link:effect
                // Cancelled automatically when the view disappears: // @link:cleanup
                // Task.sleep then throws and we fall out of the loop.
                do {
                    while true { // @link:loop
                        try await Task.sleep(for: .seconds(1)) // @link:tick
                        seconds += 1 // @link:tick
                    }
                } catch {}
            }
    }
}
