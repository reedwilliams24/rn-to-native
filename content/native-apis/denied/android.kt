@Composable
fun CameraGate(content: @Composable () -> Unit) { // @link:fn
    val context = LocalContext.current
    val activity = LocalActivity.current ?: return
    fun isGranted() = ContextCompat.checkSelfPermission(
        context, Manifest.permission.CAMERA,
    ) == PackageManager.PERMISSION_GRANTED

    var granted by remember { mutableStateOf(isGranted()) } // @link:status
    var askedOnce by rememberSaveable { mutableStateOf(false) }
    val launcher = rememberLauncherForActivityResult( // @link:ask
        ActivityResultContracts.RequestPermission(),
    ) { result ->
        granted = result
        askedOnce = true
    }
    // Re-check when returning from Settings // @link:recheck
    LifecycleResumeEffect(Unit) { // @link:recheck
        granted = isGranted()
        onPauseOrDispose { }
    }

    val permanentlyDenied = askedOnce && !granted && // @link:denied
        !activity.shouldShowRequestPermissionRationale(Manifest.permission.CAMERA)

    when {
        granted -> content() // @link:granted
        permanentlyDenied -> Button(onClick = { // @link:settings,denied
            val uri = Uri.fromParts("package", context.packageName, null)
            context.startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, uri)) // @link:settings
        }) { Text("Enable camera in Settings") }
        else -> Button(onClick = { launcher.launch(Manifest.permission.CAMERA) }) { // @link:ask
            Text("Allow camera")
        }
    }
}
