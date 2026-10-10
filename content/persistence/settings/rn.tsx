function HideCompletedToggle() {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('hideCompleted').then((v) => setHide(v === 'true'));
  }, []);

  const onChange = (value: boolean) => {
    setHide(value);
    AsyncStorage.setItem('hideCompleted', String(value));
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1 }}>Hide completed</Text>
      <Switch value={hide} onValueChange={onChange} />
    </View>
  );
}
