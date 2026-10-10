suspend fun <T> withRetry(attempts: Int = 3, block: suspend () -> T): T {
    repeat(attempts - 1) { i ->
        try {
            return block()
        } catch (e: HttpException) {
            if (e.code() < 500) throw e // 4xx won't fix itself: don't retry
        } catch (e: IOException) {
            // Timeout or no connection: retry
        }
        delay(500L shl i) // 500ms, 1s, 2s…
    }
    return block() // last attempt: let any error reach the caller
}

// Only HttpException and IOException are caught, so cancellation still works.
// val todos = withRetry { todoApi.getTodos() }
