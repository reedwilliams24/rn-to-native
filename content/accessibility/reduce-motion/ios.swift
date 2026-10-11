struct Banner<Content: View>: View { // @link:fn
    let visible: Bool
    @ViewBuilder let content: Content
    @Environment(\.accessibilityReduceMotion) private var reduceMotion // @link:reduce

    var body: some View {
        VStack {
            if visible { // @link:visible
                content // @link:content
                    .transition(reduceMotion ? .opacity : .move(edge: .top).combined(with: .opacity)) // @link:enter,exit
            }
        }
        .animation(.default, value: visible) // @link:visible
    }
}
