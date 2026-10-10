struct Spacing {
    var sm: CGFloat = 8
    var md: CGFloat = 16
}

extension EnvironmentValues {
    @Entry var spacing = Spacing()
}

extension Color {
    // Defined in Assets.xcassets with "Any" and "Dark" variants
    static let brand = Color("Brand")
}

struct Tag: View {
    let label: String
    @Environment(\.spacing) private var spacing

    var body: some View {
        Text(label)
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(Color.brand)
            .padding(.horizontal, spacing.md)
            .padding(.vertical, spacing.sm)
            .background(Color.brand.opacity(0.12), in: .rect(cornerRadius: 8))
    }
}

// At the root: ContentView().environment(\.spacing, Spacing()).tint(.brand)
