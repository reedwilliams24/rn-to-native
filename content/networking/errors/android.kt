suspend fun <T> withRetry(attempts: Int = 3, block: suspend () -> T): T { // @link:fn
    repeat(attempts - 1) { i -> // @link:loop
        try {
            return block() // @link:attempt
        } catch (e: HttpException) { // @link:catch
            if (e.code() < 500) throw e // 4xx won't fix itself: don't retry // @link:retryable,rethrow
        } catch (e: IOException) { // @link:catch
            // Timeout or no connection: retry
        }
        delay(500L shl i) // 500ms, 1s, 2s… // @link:backoff
    }
    return block() // last attempt: let any error reach the caller // @link:rethrow
}

// Only HttpException and IOException are caught, so cancellation still works.
// val todos = withRetry { todoApi.getTodos() } // @link:usage
