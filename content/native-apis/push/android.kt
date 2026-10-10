// AndroidManifest.xml:
// <service android:name=".PushService" android:exported="false">
//   <intent-filter>
//     <action android:name="com.google.firebase.MESSAGING_EVENT" />
//   </intent-filter>
// </service>
class PushService : FirebaseMessagingService() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onNewToken(token: String) {
        scope.launch { api.registerDevice(token) }
    }

    // Called for data messages, and for notification messages while in the foreground
    override fun onMessageReceived(message: RemoteMessage) {
        val title = message.notification?.title ?: message.data["title"] ?: return
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
            PackageManager.PERMISSION_GRANTED
        ) {
            showReminder(this, title.hashCode(), title)
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }
}
