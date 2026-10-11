struct Spacing { // @link:spacing
    var sm: CGFloat = 8 // @link:spacing
    var md: CGFloat = 16 // @link:spacing
}

extension EnvironmentValues {
    @Entry var spacing = Spacing() // @link:provide
}

extension Color {
    // Defined in Assets.xcassets with "Any" and "Dark" variants
    static let brand = Color("Brand") // @link:colors
}

struct Tag: View { // @link:tag
    let label: String // @link:tag
    @Environment(\.spacing) private var spacing // @link:read

    var body: some View {
        Text(label) // @link:text,label
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(Color.brand) // @link:fg
            .padding(.horizontal, spacing.md) // @link:padh
            .padding(.vertical, spacing.sm) // @link:padv
            .background(Color.brand.opacity(0.12), in: .rect(cornerRadius: 8)) // @link:bg
    }
}

// At the root: ContentView().environment(\.spacing, Spacing()).tint(.brand) // @link:theme,provide
