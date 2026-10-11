// No permission needed: the system photo picker runs in its own process. // @link:noperm
@Composable
fun AttachPhoto(onPicked: (Uri) -> Unit) { // @link:fn
    val launcher = rememberLauncherForActivityResult( // @link:import
        ActivityResultContracts.PickVisualMedia(), // @link:import
    ) { uri ->
        if (uri != null) onPicked(uri) // @link:picked
    }

    Button(onClick = { // @link:button,pick
        launcher.launch( // @link:launch
            PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly), // @link:images
        )
    }) {
        Text("Attach photo") // @link:button
    }
}
