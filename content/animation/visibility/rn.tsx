import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

function ErrorBanner({ message }: { message: string | null }) { // @link:fn
  return (
    <>
      {message !== null && ( // @link:visible
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.banner}>{/* @link:enter,exit,banner */}
          <Text>{message}</Text>{/* @link:text */}
        </Animated.View>
      )}
    </>
  );
}
