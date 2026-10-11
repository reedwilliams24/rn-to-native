function Elapsed() { // @link:fn
  const [seconds, setSeconds] = useState(0); // @link:state

  useEffect(() => { // @link:effect
    const id = setInterval(() => setSeconds((s) => s + 1), 1000); // @link:tick
    return () => clearInterval(id); // @link:cleanup
  }, []); // @link:effect

  return <Text>{seconds}s</Text>; // @link:text
}
