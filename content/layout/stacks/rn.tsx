function ProfileHeader({ name, handle }: { name: string; handle: string }) { // @link:fn
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>{/* @link:row */}
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'gray' }} />{/* @link:avatar */}
      <View>{/* @link:col */}
        <Text style={{ fontWeight: '600' }}>{name}</Text>{/* @link:name */}
        <Text style={{ color: 'gray' }}>@{handle}</Text>{/* @link:handle */}
      </View>
    </View>
  );
}
