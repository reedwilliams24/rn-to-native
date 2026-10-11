// AndroidManifest.xml:
// <service android:name=".PushService" android:exported="false">
//   <intent-filter>
//     <action android:name="com.google.firebase.MESSAGING_EVENT" />
//   </intent-filter>
// </service>
class PushService : FirebaseMessagingService() { // @link:import
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

    override fun onNewToken(token: String) { // @link:refresh,token
        scope.launch { api.registerDevice(token) } // @link:send
    }

    // Called for data messages, and for notification messages while in the foreground
    override fun onMessageReceived(message: RemoteMessage) { // @link:message
        val title = message.notification?.title ?: message.data["title"] ?: return
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
            PackageManager.PERMISSION_GRANTED
        ) {
            showReminder(this, title.hashCode(), title) // @link:message
        }
    }

    override fun onDestroy() {
        scope.cancel()
        super.onDestroy()
    }
}
