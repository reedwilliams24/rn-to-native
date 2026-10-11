import * as Haptics from 'expo-haptics'; // @link:import

function CompleteButton({ onComplete }: { onComplete: () => void }) { // @link:fn
  return (
    <Button // @link:button
      title="Complete" // @link:label
      onPress={() => { // @link:handler
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // @link:haptic
        onComplete(); // @link:complete
      }}
    />
  );
}
