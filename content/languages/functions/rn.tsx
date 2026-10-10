function greet(name: string, greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}

const shout = (s: string) => s.toUpperCase();

// "Named arguments" via an options object
function send(
  message: string,
  opts: { to: string; silent?: boolean },
) {
  const flag = opts.silent ? ' (silent)' : '';
  console.log(`${message} → ${opts.to}${flag}`);
}

greet('Reed');
greet('Reed', 'Hi');
send('Lunch?', { to: 'Sam', silent: true });
