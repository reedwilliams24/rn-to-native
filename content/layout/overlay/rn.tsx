function AvatarWithBadge({ count }: { count: number }) {
  return (
    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'gray' }}>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={{ color: 'white', fontSize: 12 }}>{count}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -4, right: -4,
    minWidth: 20, height: 20, borderRadius: 10, backgroundColor: 'red',
    alignItems: 'center', justifyContent: 'center',
  },
});
