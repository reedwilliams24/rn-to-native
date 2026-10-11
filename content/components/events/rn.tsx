type TodoRowProps = { // @link:props
  title: string; // @link:title
  done: boolean; // @link:done
  onToggle: () => void; // @link:callback
};

function TodoRow({ title, done, onToggle }: TodoRowProps) { // @link:fn
  return ( // @link:body
    <Pressable // @link:pressable
      onPress={onToggle} // @link:tap
      style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }} // @link:row
    >
      <Text>{done ? '☑' : '☐'}</Text>{/* @link:check */}
      <Text style={{ marginLeft: 8 }}>{title}</Text>{/* @link:label */}
    </Pressable>
  );
}
