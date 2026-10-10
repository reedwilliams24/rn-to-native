struct ErrorBanner: View {
    let message: String?

    var body: some View {
        VStack {
            if let message {
                Text(message)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(.red.opacity(0.15))
                    .transition(.move(edge: .top).combined(with: .opacity))
            }
        }
        // The transition only plays inside an animated change
        .animation(.default, value: message)
    }
}
