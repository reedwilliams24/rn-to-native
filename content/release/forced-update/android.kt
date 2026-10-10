// implementation("com.google.android.play:app-update-ktx:2.1.0")
// Create in onCreate: registerForActivityResult must run before STARTED.
class UpdateGate(activity: ComponentActivity) {
    private val manager = AppUpdateManagerFactory.create(activity)
    private val launcher = activity.registerForActivityResult(
        ActivityResultContracts.StartIntentSenderForResult(),
    ) { result ->
        // RESULT_CANCELED means the user backed out of an immediate update
    }

    // minVersionCode comes from your remote config / API
    suspend fun promptIfRequired(minVersionCode: Int) {
        if (BuildConfig.VERSION_CODE >= minVersionCode) return

        val info = manager.requestAppUpdateInfo()
        if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE &&
            info.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)
        ) {
            manager.startUpdateFlowForResult(
                info,
                launcher,
                AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build(),
            )
        }
    }
}
