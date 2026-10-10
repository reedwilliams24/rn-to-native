struct StatRow: View {
    let label: String
    let value: String
    @Environment(\.dynamicTypeSize) private var typeSize
    @ScaledMetric(relativeTo: .body) private var iconSize = 20.0

    var body: some View {
        let layout = typeSize.isAccessibilitySize
            ? AnyLayout(VStackLayout(alignment: .leading, spacing: 8))
            : AnyLayout(HStackLayout(spacing: 8))

        layout {
            Image(systemName: "checkmark")
                .resizable()
                .frame(width: iconSize, height: iconSize)
                .accessibilityHidden(true)
            Text(label)
                .frame(maxWidth: .infinity, alignment: .leading)
            Text(value)
                .fontWeight(.semibold)
                .dynamicTypeSize(...DynamicTypeSize.accessibility2)
        }
    }
}
