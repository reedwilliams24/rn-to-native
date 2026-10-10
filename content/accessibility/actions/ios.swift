struct TodoRow: View {
    let title: String
    let onDelete: () -> Void
    let onPin: () -> Void

    var body: some View {
        Text(title)
            // List swipe actions are exposed to VoiceOver automatically
            .swipeActions {
                Button("Delete", role: .destructive, action: onDelete)
            }
            // Custom gestures are not, so add them as named actions
            .accessibilityAction(named: "Pin") { onPin() }
    }
}
