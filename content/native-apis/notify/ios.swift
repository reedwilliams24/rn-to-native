func remindLater(_ title: String) async throws { // @link:fn
    let center = UNUserNotificationCenter.current() // @link:import
    guard try await center.requestAuthorization(options: [.alert, .sound, .badge]) else { // @link:ask,check
        return
    }

    let content = UNMutableNotificationContent() // @link:content
    content.title = "Reminder" // @link:content
    content.body = title // @link:content
    content.sound = .default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 60 * 60, repeats: false) // @link:trigger
    let request = UNNotificationRequest(
        identifier: UUID().uuidString, content: content, trigger: trigger
    )
    try await center.add(request) // @link:schedule
}
