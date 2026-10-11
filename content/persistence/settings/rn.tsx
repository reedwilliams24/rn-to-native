function HideCompletedToggle() { // @link:fn
  const [hide, setHide] = useState(false); // @link:state

  useEffect(() => {
    AsyncStorage.getItem('hideCompleted').then((v) => setHide(v === 'true')); // @link:read
  }, []);

  const onChange = (value: boolean) => { // @link:write
    setHide(value);
    AsyncStorage.setItem('hideCompleted', String(value)); // @link:write
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>{/* @link:row */}
      <Text style={{ flex: 1 }}>Hide completed</Text>{/* @link:label */}
      <Switch value={hide} onValueChange={onChange} />{/* @link:toggle */}
    </View>
  );
}
