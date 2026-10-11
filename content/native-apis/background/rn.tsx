import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

const SYNC_TASK = 'todo-sync'; // @link:id

// Must be defined at module scope, outside any component
TaskManager.defineTask(SYNC_TASK, async () => { // @link:define
  await syncTodos(); // @link:work
  return BackgroundTask.BackgroundTaskResult.Success; // @link:result
});

export async function registerSync() { // @link:register
  await BackgroundTask.registerTaskAsync(SYNC_TASK, { // @link:register,schedule
    minimumInterval: 15, // minutes // @link:interval
  });
}
