function AvatarWithBadge({ count }: { count: number }) { // @link:fn
  return (
    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'gray' }}>{/* @link:avatar */}
      {count > 0 && ( // @link:cond
        <View style={styles.badge}>{/* @link:badge */}
          <Text style={{ color: 'white', fontSize: 12 }}>{count}</Text>{/* @link:text */}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute', top: -4, right: -4, // @link:pos
    minWidth: 20, height: 20, borderRadius: 10, backgroundColor: 'red', // @link:size,bg
    alignItems: 'center', justifyContent: 'center',
  },
});
