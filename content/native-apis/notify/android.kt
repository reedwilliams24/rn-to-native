// Android 13+: POST_NOTIFICATIONS is a runtime permission (request it like CAMERA).
// Android 8+: every notification must belong to a channel.
fun createReminderChannel(context: Context) {
    val channel = NotificationChannel(
        "reminders", "Reminders", NotificationManager.IMPORTANCE_DEFAULT,
    )
    context.getSystemService(NotificationManager::class.java)
        .createNotificationChannel(channel)
}

@RequiresPermission(Manifest.permission.POST_NOTIFICATIONS)
fun showReminder(context: Context, id: Int, title: String) {
    val notification = NotificationCompat.Builder(context, "reminders")
        .setSmallIcon(android.R.drawable.ic_popup_reminder)
        .setContentTitle("Reminder")
        .setContentText(title)
        .setAutoCancel(true)
        .build()
    NotificationManagerCompat.from(context).notify(id, notification)
}

// Android has no "schedule a local notification" API. To show it in an hour,
// enqueue a WorkManager job (next section) that calls showReminder().
