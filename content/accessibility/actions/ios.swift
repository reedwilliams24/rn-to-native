struct TodoRow: View { // @link:fn
    let title: String
    let onDelete: () -> Void
    let onPin: () -> Void

    var body: some View {
        Text(title) // @link:title
            // List swipe actions are exposed to VoiceOver automatically // @link:swipe
            .swipeActions { // @link:swipe,delete
                Button("Delete", role: .destructive, action: onDelete) // @link:delete
            }
            // Custom gestures are not, so add them as named actions
            .accessibilityAction(named: "Pin") { onPin() } // @link:pin,actions
    }
}
