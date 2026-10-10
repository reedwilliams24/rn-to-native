function TitleRow({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1 }} numberOfLines={1}>
        {title}
      </Text>
      <Button title="Edit" onPress={onEdit} />
    </View>
  );
}
