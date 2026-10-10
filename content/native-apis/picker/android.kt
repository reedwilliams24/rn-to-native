// No permission needed: the system photo picker runs in its own process.
@Composable
fun AttachPhoto(onPicked: (Uri) -> Unit) {
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.PickVisualMedia(),
    ) { uri ->
        if (uri != null) onPicked(uri)
    }

    Button(onClick = {
        launcher.launch(
            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly),
        )
    }) {
        Text("Attach photo")
    }
}
