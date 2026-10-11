struct DeleteButton: View { // @link:fn
    let onDelete: () -> Void

    var body: some View {
        // The title stays as the VoiceOver label even when only the icon shows // @link:label
        Button("Delete todo", systemImage: "trash", role: .destructive, action: onDelete) // @link:button,click,role,label,icon
            .labelStyle(.iconOnly) // @link:icon
            .accessibilityHint("Removes it from your list") // @link:hint
    }
}

// Purely decorative images: Image(decorative: "confetti") // @link:decorative
