struct StatRow: View { // @link:fn
    let label: String
    let value: String
    @Environment(\.dynamicTypeSize) private var typeSize // @link:scale
    @ScaledMetric(relativeTo: .body) private var iconSize = 20.0 // @link:icon-size

    var body: some View {
        let layout = typeSize.isAccessibilitySize // @link:stacked,layout
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: 8))
            : AnyLayout(HStackLayout(spacing: 8))

        layout {
            Image(systemName: "checkmark") // @link:icon
                .resizable()
                .frame(width: iconSize, height: iconSize)
                .accessibilityHidden(true)
            Text(label) // @link:label
                .frame(maxWidth: .infinity, alignment: .leading)
            Text(value)
                .fontWeight(.semibold)
                .dynamicTypeSize(...DynamicTypeSize.accessibility2) // @link:cap
        }
    }
}
