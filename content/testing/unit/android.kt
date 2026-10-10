// src/main/java/.../DueLabel.kt
fun dueLabel(daysLeft: Int): String = when {
    daysLeft < 0 -> "Overdue"
    daysLeft == 0 -> "Due today"
    daysLeft == 1 -> "Due tomorrow"
    else -> "Due in $daysLeft days"
}

// src/test/java/.../DueLabelTest.kt
class DueLabelTest {
    @Test
    fun `negative days are overdue`() {
        assertEquals("Overdue", dueLabel(-2))
    }

    @Test
    fun `labels upcoming days`() {
        assertEquals("Due today", dueLabel(0))
        assertEquals("Due tomorrow", dueLabel(1))
        assertEquals("Due in 3 days", dueLabel(3))
    }
}
