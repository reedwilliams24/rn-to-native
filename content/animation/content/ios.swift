struct RemainingCount: View {
    let count: Int

    var body: some View {
        Text("\(count) left")
            .contentTransition(.numericText(value: Double(count)))
            .animation(.snappy, value: count)
    }
}
