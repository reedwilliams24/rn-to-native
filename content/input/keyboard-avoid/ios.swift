struct ChatScreen: View { // @link:fn
    var body: some View {
        MessageList() // @link:list
            // Pinned above the bottom safe area, which includes the keyboard.
            // No avoiding view needed.
            .safeAreaInset(edge: .bottom) { Composer() } // @link:avoid,composer
            .scrollDismissesKeyboard(.interactively)
    }
}
