// src/main/java/.../DueLabel.kt // @link:file
fun dueLabel(daysLeft: Int): String = when { // @link:fn
    daysLeft < 0 -> "Overdue" // @link:overdue
    daysLeft == 0 -> "Due today" // @link:today
    daysLeft == 1 -> "Due tomorrow" // @link:tomorrow
    else -> "Due in $daysLeft days" // @link:later
}

// src/test/java/.../DueLabelTest.kt // @link:testfile
class DueLabelTest { // @link:suite
    @Test
    fun `negative days are overdue`() { // @link:neg-test
        assertEquals("Overdue", dueLabel(-2)) // @link:neg-assert
    }

    @Test
    fun `labels upcoming days`() { // @link:table
        assertEquals("Due today", dueLabel(0)) // @link:table-assert
        assertEquals("Due tomorrow", dueLabel(1))
        assertEquals("Due in 3 days", dueLabel(3))
    }
}
