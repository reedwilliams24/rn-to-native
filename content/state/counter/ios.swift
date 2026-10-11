struct Counter: View { // @link:fn
    @State private var count = 0 // @link:state

    var body: some View { // @link:body
        HStack(spacing: 12) { // @link:row
            Button("−") { count -= 1 } // @link:dec
            Text("\(count)") // @link:text
            Button("+") { count += 1 } // @link:inc
        }
    }
}
