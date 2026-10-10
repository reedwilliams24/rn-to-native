import * as Notifications from 'expo-notifications';

async function remindLater(title: string) {
  const { granted } = await Notifications.requestPermissionsAsync();
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: { title: 'Reminder', body: title },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60,
    },
  });
}
