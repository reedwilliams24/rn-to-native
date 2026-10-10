struct DueLabel: View {
    let due: Date
    let cost: Decimal

    var body: some View {
        // HStack lays out right-to-left automatically in Arabic or Hebrew
        HStack(spacing: 8) {
            Text(due, format: .dateTime.day().month(.abbreviated).year())
            Text(cost, format: .currency(code: "USD"))
        }
    }
}
