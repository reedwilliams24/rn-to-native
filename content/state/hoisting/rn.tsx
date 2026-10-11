type SettingRowProps = { // @link:props
  label: string; // @link:label
  value: boolean; // @link:value
  onValueChange: (value: boolean) => void; // @link:onchange
};

function SettingRow({ label, value, onValueChange }: SettingRowProps) { // @link:fn
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>{/* @link:row */}
      <Text style={{ flex: 1 }}>{label}</Text>{/* @link:text */}
      <Switch value={value} onValueChange={onValueChange} />{/* @link:switch */}
    </View>
  );
}

function Settings() { // @link:settings
  const [notifications, setNotifications] = useState(true); // @link:state
  return (
    <SettingRow label="Notifications" value={notifications} onValueChange={setNotifications} /> // @link:use
  );
}
