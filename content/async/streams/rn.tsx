function ConnectionStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((s) => setOnline(!!s.isConnected));
    return unsubscribe;
  }, []);

  return <Text>{online ? 'Online' : 'Offline'}</Text>;
}
