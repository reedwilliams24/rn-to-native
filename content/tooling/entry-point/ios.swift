// TodoApp.swift
// @main marks the program's entry point
@main
struct TodoApp: App {
    var body: some Scene {
        // A window; iPad can open several
        WindowGroup {
            TodoScreen()
        }
    }
}
