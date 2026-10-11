// Info.plist: BGTaskSchedulerPermittedIdentifiers = ["com.example.todo.sync"] // @link:id
// Signing & Capabilities: Background Modes → Background fetch
@main
struct TodoApp: App {
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup { ContentView() }
            .onChange(of: scenePhase) { _, phase in
                if phase == .background { scheduleSync() }
            }
            .backgroundTask(.appRefresh("com.example.todo.sync")) { // @link:define
                scheduleSync() // each request runs once, so re-schedule
                await syncTodos() // @link:work
            }
    }
}

func scheduleSync() { // @link:register
    let request = BGAppRefreshTaskRequest(identifier: "com.example.todo.sync") // @link:schedule
    request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60) // @link:interval
    try? BGTaskScheduler.shared.submit(request) // @link:register
}
