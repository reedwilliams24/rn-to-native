final class Ref<Value> { // @link:refclass
    var value: Value
    init(_ value: Value) { self.value = value }
}

struct SubmitButton: View { // @link:fn
    let onSubmit: () -> Void // @link:fn
    // @State keeps the same object for the view's lifetime. The class isn't
    // @Observable, so writing to it doesn't re-evaluate body.
    @State private var lastTap = Ref(Date.distantPast) // @link:ref

    var body: some View {
        Button("Submit") { // @link:button,label,press
            let now = Date.now // @link:now
            if now.timeIntervalSince(lastTap.value) >= 1 { // @link:check
                lastTap.value = now // @link:write
                onSubmit() // @link:call
            }
        }
    }
}
