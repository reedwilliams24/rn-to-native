@Entity(tableName = "todos") // @link:table
data class TodoEntity( // @link:entity,table
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val title: String, // @link:title
    val done: Boolean = false, // @link:done
    val createdAt: Long = System.currentTimeMillis(), // @link:created
)

@Dao
interface TodoDao {
    @Query("SELECT * FROM todos ORDER BY createdAt DESC") // @link:select
    fun observeAll(): Flow<List<TodoEntity>> // re-emits whenever the table changes // @link:select

    @Insert // @link:insert
    suspend fun insert(todo: TodoEntity) // @link:insert

    @Update
    suspend fun update(todo: TodoEntity)

    @Query("DELETE FROM todos WHERE done = 1")
    suspend fun clearCompleted()
}

@Database(entities = [TodoEntity::class], version = 1) // @link:open
abstract class AppDatabase : RoomDatabase() {
    abstract fun todoDao(): TodoDao
}

// Build once (e.g. a Hilt @Singleton) and share it
fun buildDatabase(context: Context): AppDatabase = // @link:open
    Room.databaseBuilder(context, AppDatabase::class.java, "app.db").build() // @link:open
