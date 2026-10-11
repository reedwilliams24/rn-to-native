type TodoStatusProps = { // @link:props
  done: boolean; // @link:done
  dueDate?: string; // @link:due
};

function TodoStatus({ done, dueDate }: TodoStatusProps) { // @link:fn
  return ( // @link:body
    <View>{/* @link:column */}
      {done ? <Text>Done</Text> : <Text>Open</Text>}{/* @link:if-else */}
      {dueDate ? <Text>Due {dueDate}</Text> : null}{/* @link:optional */}
    </View>
  );
}
