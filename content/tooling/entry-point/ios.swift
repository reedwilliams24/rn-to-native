// TodoApp.swift // @link:entry
// @main marks the program's entry point // @link:register
@main // @link:register
struct TodoApp: App { // @link:entry
    var body: some Scene {
        // A window; iPad can open several
        WindowGroup { // @link:root
            TodoScreen() // @link:screen
        }
    }
}
