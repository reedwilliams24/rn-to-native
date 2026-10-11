struct RemainingCount: View { // @link:fn
    let count: Int

    var body: some View {
        Text("\(count) left") // @link:text
            .contentTransition(.numericText(value: Double(count))) // @link:transition
            .animation(.snappy, value: count) // @link:transition
    }
}
