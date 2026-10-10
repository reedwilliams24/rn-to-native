// Wrap a callback API in a cold Flow: it starts on collect, cleans up on cancel
fun ConnectivityManager.onlineUpdates(): Flow<Boolean> = callbackFlow {
    val callback = object : ConnectivityManager.NetworkCallback() {
        override fun onAvailable(network: Network) { trySend(true) }
        override fun onLost(network: Network) { trySend(false) }
    }
    registerDefaultNetworkCallback(callback)
    awaitClose { unregisterNetworkCallback(callback) }
}.distinctUntilChanged()

@Composable
fun ConnectionStatus(connectivity: ConnectivityManager) {
    val online by remember(connectivity) { connectivity.onlineUpdates() }
        .collectAsStateWithLifecycle(initialValue = true)

    Text(if (online) "Online" else "Offline")
}
