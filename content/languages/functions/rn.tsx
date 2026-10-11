function greet(name: string, greeting = 'Hello') { // @link:greet
  return `${greeting}, ${name}!`; // @link:body
}

const shout = (s: string) => s.toUpperCase(); // @link:shout

// "Named arguments" via an options object
function send( // @link:send
  message: string, // @link:msg
  opts: { to: string; silent?: boolean }, // @link:to,silent
) {
  const flag = opts.silent ? ' (silent)' : ''; // @link:flag
  console.log(`${message} → ${opts.to}${flag}`); // @link:print
}

greet('Reed'); // @link:call1
greet('Reed', 'Hi'); // @link:call2
send('Lunch?', { to: 'Sam', silent: true }); // @link:call3
