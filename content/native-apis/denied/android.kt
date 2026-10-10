@Composable
fun CameraGate(content: @Composable () -> Unit) {
    val context = LocalContext.current
    val activity = LocalActivity.current ?: return
    fun isGranted() = ContextCompat.checkSelfPermission(
        context, Manifest.permission.CAMERA,
    ) == PackageManager.PERMISSION_GRANTED

    var granted by remember { mutableStateOf(isGranted()) }
    var askedOnce by rememberSaveable { mutableStateOf(false) }
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { result ->
        granted = result
        askedOnce = true
    }
    // Re-check when returning from Settings
    LifecycleResumeEffect(Unit) {
        granted = isGranted()
        onPauseOrDispose { }
    }

    val permanentlyDenied = askedOnce && !granted &&
        !activity.shouldShowRequestPermissionRationale(Manifest.permission.CAMERA)

    when {
        granted -> content()
        permanentlyDenied -> Button(onClick = {
            val uri = Uri.fromParts("package", context.packageName, null)
            context.startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, uri))
        }) { Text("Enable camera in Settings") }
        else -> Button(onClick = { launcher.launch(Manifest.permission.CAMERA) }) {
            Text("Allow camera")
        }
    }
}
