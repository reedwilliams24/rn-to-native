struct Stat: View { // @link:fn
    let value: String // @link:fn
    let label: String // @link:fn
    // Scales 20pt the same way the .body text style scales
    @ScaledMetric(relativeTo: .body) private var iconSize = 20.0 // @link:scale

    var body: some View {
        HStack(spacing: 8) { // @link:row
            Image(systemName: "star.fill") // @link:icon
                .resizable()
                .frame(width: iconSize, height: iconSize) // @link:icon,scale
            Text(value).font(.body) // @link:value
            Text(label) // @link:label
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        // Like maxFontSizeMultiplier, but for the whole subtree
        .dynamicTypeSize(...DynamicTypeSize.accessibility2) // @link:cap
    }
}
