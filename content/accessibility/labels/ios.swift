struct DeleteButton: View {
    let onDelete: () -> Void

    var body: some View {
        // The title stays as the VoiceOver label even when only the icon shows
        Button("Delete todo", systemImage: "trash", role: .destructive, action: onDelete)
            .labelStyle(.iconOnly)
            .accessibilityHint("Removes it from your list")
    }
}

// Purely decorative images: Image(decorative: "confetti")
