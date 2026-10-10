final class Ref<Value> {
    var value: Value
    init(_ value: Value) { self.value = value }
}

struct SubmitButton: View {
    let onSubmit: () -> Void
    // @State keeps the same object for the view's lifetime. The class isn't
    // @Observable, so writing to it doesn't re-evaluate body.
    @State private var lastTap = Ref(Date.distantPast)

    var body: some View {
        Button("Submit") {
            let now = Date.now
            if now.timeIntervalSince(lastTap.value) >= 1 {
                lastTap.value = now
                onSubmit()
            }
        }
    }
}
