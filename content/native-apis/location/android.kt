// AndroidManifest.xml: ACCESS_COARSE_LOCATION and ACCESS_FINE_LOCATION
class LocationRepository(context: Context) {
    private val client = LocationServices.getFusedLocationProviderClient(context)

    @RequiresPermission(anyOf = [ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION])
    suspend fun current(): Location? =
        client.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, null).await()
}

@Composable
fun NearMeButton(repo: LocationRepository, onLocation: (Location?) -> Unit) {
    val scope = rememberCoroutineScope()
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions(),
    ) { grants ->
        // The user may grant only approximate (coarse) location
        if (grants.values.any { it }) {
            @SuppressLint("MissingPermission")
            scope.launch { onLocation(repo.current()) }
        }
    }

    Button(onClick = {
        launcher.launch(arrayOf(ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION))
    }) {
        Text("Todos near me")
    }
}
