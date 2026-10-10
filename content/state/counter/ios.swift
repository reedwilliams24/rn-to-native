struct Counter: View {
    @State private var count = 0

    var body: some View {
        HStack(spacing: 12) {
            Button("−") { count -= 1 }
            Text("\(count)")
            Button("+") { count += 1 }
        }
    }
}
