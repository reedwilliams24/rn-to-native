class SyncWorker(
    context: Context,
    params: WorkerParameters,
) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result =
        try {
            syncTodos()
            Result.success()
        } catch (e: IOException) {
            Result.retry() // WorkManager backs off and tries again
        }
}

fun registerSync(context: Context) {
    val request = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
        .setConstraints(
            Constraints(requiredNetworkType = NetworkType.CONNECTED),
        )
        .build()

    WorkManager.getInstance(context).enqueueUniquePeriodicWork(
        "todo-sync", ExistingPeriodicWorkPolicy.KEEP, request,
    )
}
