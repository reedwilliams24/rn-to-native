const isDone = (todo: Todo) => todo.done;

function measure(label: string, block: () => void) {
  const start = Date.now();
  block();
  console.log(`${label}: ${Date.now() - start}ms`);
}

function example(todos: Todo[]) {
  measure('filter', () => {
    const open = todos.filter((t) => !t.done);
    console.log(open.map((t) => t.title));
  });

  let taps = 0;
  const onTap = () => {
    taps += 1; // closures capture variables
  };
  onTap();
}
