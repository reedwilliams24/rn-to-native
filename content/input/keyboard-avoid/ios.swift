struct ChatScreen: View {
    var body: some View {
        MessageList()
            // Pinned above the bottom safe area, which includes the keyboard.
            // No avoiding view needed.
            .safeAreaInset(edge: .bottom) { Composer() }
            .scrollDismissesKeyboard(.interactively)
    }
}
