// AndroidManifest.xml: ACCESS_COARSE_LOCATION and ACCESS_FINE_LOCATION // @link:manifest
class LocationRepository(context: Context) {
    private val client = LocationServices.getFusedLocationProviderClient(context) // @link:import

    @RequiresPermission(anyOf = [ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION])
    suspend fun current(): Location? = // @link:fn
        client.getCurrentLocation(Priority.PRIORITY_BALANCED_POWER_ACCURACY, null).await() // @link:fetch,accuracy
}

@Composable
fun NearMeButton(repo: LocationRepository, onLocation: (Location?) -> Unit) {
    val scope = rememberCoroutineScope()
    val launcher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions(), // @link:ask
    ) { grants ->
        // The user may grant only approximate (coarse) location
        if (grants.values.any { it }) { // @link:check
            @SuppressLint("MissingPermission")
            scope.launch { onLocation(repo.current()) } // @link:result
        }
    }

    Button(onClick = {
        launcher.launch(arrayOf(ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION)) // @link:ask
    }) {
        Text("Todos near me")
    }
}
