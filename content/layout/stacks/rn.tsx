function ProfileHeader({ name, handle }: { name: string; handle: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'gray' }} />
      <View>
        <Text style={{ fontWeight: '600' }}>{name}</Text>
        <Text style={{ color: 'gray' }}>@{handle}</Text>
      </View>
    </View>
  );
}
