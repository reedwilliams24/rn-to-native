struct ErrorBanner: View { // @link:fn
    let message: String?

    var body: some View {
        VStack {
            if let message { // @link:visible
                Text(message) // @link:text
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(.red.opacity(0.15)) // @link:banner
                    .transition(.move(edge: .top).combined(with: .opacity)) // @link:enter,exit
            }
        }
        // The transition only plays inside an animated change
        .animation(.default, value: message) // @link:visible
    }
}
