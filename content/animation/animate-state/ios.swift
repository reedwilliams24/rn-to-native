struct LikeButton: View { // @link:fn
    let liked: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) { // @link:button
            Image(systemName: "heart.fill") // @link:icon
                .foregroundStyle(liked ? .red : .gray) // @link:tint
                .scaleEffect(liked ? 1.3 : 1) // @link:scale,apply
                .animation(.bouncy, value: liked) // @link:spring
        }
        .accessibilityLabel(liked ? "Unlike" : "Like")
    }
}

// Or animate at the point of change, for every view that depends on it:
// withAnimation(.bouncy) { todo.liked.toggle() }
