import * as Haptics from 'expo-haptics';

function CompleteButton({ onComplete }: { onComplete: () => void }) {
  return (
    <Button
      title="Complete"
      onPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
      }}
    />
  );
}
