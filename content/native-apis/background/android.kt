class SyncWorker( // @link:define
    context: Context,
    params: WorkerParameters,
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result = // @link:define
        try {
            syncTodos() // @link:work
            Result.success() // @link:result
        } catch (e: IOException) {
            Result.retry() // WorkManager backs off and tries again
        }
}

fun registerSync(context: Context) { // @link:register
    val request = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES) // @link:schedule,interval
        .setConstraints(
            Constraints(requiredNetworkType = NetworkType.CONNECTED),
        )
        .build()

    WorkManager.getInstance(context).enqueueUniquePeriodicWork( // @link:register
        "todo-sync", ExistingPeriodicWorkPolicy.KEEP, request, // @link:id
    )
}
