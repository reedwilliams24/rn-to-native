// Wrap a callback API in a cold Flow: it starts on collect, cleans up on cancel
fun ConnectivityManager.onlineUpdates(): Flow<Boolean> = callbackFlow { // @link:stream
    val callback = object : ConnectivityManager.NetworkCallback() {
        override fun onAvailable(network: Network) { trySend(true) } // @link:emit
        override fun onLost(network: Network) { trySend(false) } // @link:emit
    }
    registerDefaultNetworkCallback(callback) // @link:register
    awaitClose { unregisterNetworkCallback(callback) } // @link:cleanup
}.distinctUntilChanged()

@Composable
fun ConnectionStatus(connectivity: ConnectivityManager) { // @link:fn
    val online by remember(connectivity) { connectivity.onlineUpdates() } // @link:state,subscribe
        .collectAsStateWithLifecycle(initialValue = true) // @link:subscribe

    Text(if (online) "Online" else "Offline") // @link:text
}
