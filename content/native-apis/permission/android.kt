// AndroidManifest.xml: // @link:manifest
// <uses-permission android:name="android.permission.CAMERA" /> // @link:manifest

@Composable
fun ScanButton(onScan: () -> Unit) { // @link:fn
    val context = LocalContext.current
    val launcher = rememberLauncherForActivityResult( // @link:ask
        ActivityResultContracts.RequestPermission(),
    ) { granted ->
        if (granted) onScan() // @link:asked-ok
    }

    Button(onClick = { // @link:button,press
        val status = ContextCompat.checkSelfPermission(context, Manifest.permission.CAMERA) // @link:status
        if (status == PackageManager.PERMISSION_GRANTED) { // @link:granted
            onScan()
        } else {
            launcher.launch(Manifest.permission.CAMERA) // @link:ask
        }
    }) {
        Text("Scan receipt") // @link:button
    }
}
