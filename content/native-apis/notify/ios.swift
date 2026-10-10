func remindLater(_ title: String) async throws {
    let center = UNUserNotificationCenter.current()
    guard try await center.requestAuthorization(options: [.alert, .sound, .badge]) else {
        return
    }

    let content = UNMutableNotificationContent()
    content.title = "Reminder"
    content.body = title
    content.sound = .default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 60 * 60, repeats: false)
    let request = UNNotificationRequest(
        identifier: UUID().uuidString, content: content, trigger: trigger
    )
    try await center.add(request)
}
