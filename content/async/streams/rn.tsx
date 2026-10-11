function ConnectionStatus() { // @link:fn
  const [online, setOnline] = useState(true); // @link:state

  useEffect(() => { // @link:subscribe
    const unsubscribe = NetInfo.addEventListener((s) => setOnline(!!s.isConnected)); // @link:register,emit
    return unsubscribe; // @link:cleanup
  }, []);

  return <Text>{online ? 'Online' : 'Offline'}</Text>; // @link:text
}
