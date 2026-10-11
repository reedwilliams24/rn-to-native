function TitleRow({ title, onEdit }: { title: string; onEdit: () => void }) { // @link:fn
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>{/* @link:row */}
      <Text style={{ flex: 1 }} numberOfLines={1}>{/* @link:text,flex,lines */}
        {title}{/* @link:text */}
      </Text>
      <Button title="Edit" onPress={onEdit} />{/* @link:edit */}
    </View>
  );
}
