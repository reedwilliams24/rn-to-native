import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

const SYNC_TASK = 'todo-sync';

// Must be defined at module scope, outside any component
TaskManager.defineTask(SYNC_TASK, async () => {
  await syncTodos();
  return BackgroundTask.BackgroundTaskResult.Success;
});

export async function registerSync() {
  await BackgroundTask.registerTaskAsync(SYNC_TASK, {
    minimumInterval: 15, // minutes
  });
}
