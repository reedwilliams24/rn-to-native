import * as Notifications from 'expo-notifications'; // @link:import

async function remindLater(title: string) { // @link:fn
  const { granted } = await Notifications.requestPermissionsAsync(); // @link:ask
  if (!granted) return; // @link:check

  await Notifications.scheduleNotificationAsync({ // @link:schedule
    content: { title: 'Reminder', body: title }, // @link:content
    trigger: { // @link:trigger
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60, // @link:trigger
    },
  });
}
