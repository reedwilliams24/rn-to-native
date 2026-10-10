// Info.plist: BGTaskSchedulerPermittedIdentifiers = ["com.example.todo.sync"]
// Signing & Capabilities: Background Modes → Background fetch
@main
struct TodoApp: App {
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup { ContentView() }
            .onChange(of: scenePhase) { _, phase in
                if phase == .background { scheduleSync() }
            }
            .backgroundTask(.appRefresh("com.example.todo.sync")) {
                scheduleSync() // each request runs once, so re-schedule
                await syncTodos()
            }
    }
}

func scheduleSync() {
    let request = BGAppRefreshTaskRequest(identifier: "com.example.todo.sync")
    request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60)
    try? BGTaskScheduler.shared.submit(request)
}
