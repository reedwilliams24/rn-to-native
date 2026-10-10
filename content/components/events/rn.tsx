type TodoRowProps = {
  title: string;
  done: boolean;
  onToggle: () => void;
};

function TodoRow({ title, done, onToggle }: TodoRowProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
    >
      <Text>{done ? '☑' : '☐'}</Text>
      <Text style={{ marginLeft: 8 }}>{title}</Text>
    </Pressable>
  );
}
