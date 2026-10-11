const isDone = (todo: Todo) => todo.done; // @link:isdone

function measure(label: string, block: () => void) { // @link:measure
  const start = Date.now(); // @link:start
  block(); // @link:call
  console.log(`${label}: ${Date.now() - start}ms`); // @link:print
}

function example(todos: Todo[]) { // @link:example
  measure('filter', () => { // @link:trailing
    const open = todos.filter((t) => !t.done); // @link:filter
    console.log(open.map((t) => t.title)); // @link:map
  });

  let taps = 0; // @link:taps
  const onTap = () => { // @link:ontap
    taps += 1; // closures capture variables // @link:ontap
  };
  onTap(); // @link:invoke
}
