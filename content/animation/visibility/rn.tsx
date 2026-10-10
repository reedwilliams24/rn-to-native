import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

function ErrorBanner({ message }: { message: string | null }) {
  return (
    <>
      {message !== null && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.banner}>
          <Text>{message}</Text>
        </Animated.View>
      )}
    </>
  );
}
