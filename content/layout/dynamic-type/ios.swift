struct Stat: View {
    let value: String
    let label: String
    // Scales 20pt the same way the .body text style scales
    @ScaledMetric(relativeTo: .body) private var iconSize = 20.0

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "star.fill")
                .resizable()
                .frame(width: iconSize, height: iconSize)
            Text(value).font(.body)
            Text(label)
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        // Like maxFontSizeMultiplier, but for the whole subtree
        .dynamicTypeSize(...DynamicTypeSize.accessibility2)
    }
}
