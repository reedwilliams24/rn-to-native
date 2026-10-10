type TodoStatusProps = {
  done: boolean;
  dueDate?: string;
};

function TodoStatus({ done, dueDate }: TodoStatusProps) {
  return (
    <View>
      {done ? <Text>Done</Text> : <Text>Open</Text>}
      {dueDate ? <Text>Due {dueDate}</Text> : null}
    </View>
  );
}
