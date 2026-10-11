struct DueLabel: View { // @link:fn
    let due: Date
    let cost: Decimal

    var body: some View {
        // HStack lays out right-to-left automatically in Arabic or Hebrew // @link:row
        HStack(spacing: 8) { // @link:row
            Text(due, format: .dateTime.day().month(.abbreviated).year()) // @link:date,date-text
            Text(cost, format: .currency(code: "USD")) // @link:price,price-text
        }
    }
}
