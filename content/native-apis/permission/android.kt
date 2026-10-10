// AndroidManifest.xml:
// <uses-permission android:name="android.permission.CAMERA" />

@Composable
fun ScanButton(onScan: () -> Unit) {
    val context = LocalContext.current
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (granted) onScan()
    }

    Button(onClick = {
        val status = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA)
        if (status == PackageManager.PERMISSION_GRANTED) {
            onScan()
        } else {
            launcher.launch(Manifest.permission.CAMERA)
        }
    }) {
        Text("Scan receipt")
    }
}
