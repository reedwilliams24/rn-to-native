#Preview("Open") { // @link:open
    TodoRow(title: "Buy milk", done: false, onToggle: {}) // @link:open-args
}

#Preview("Done") { // @link:done
    TodoRow(title: "Buy milk", done: true, onToggle: {}) // @link:done-args
}
