type SettingRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function SettingRow({ label, value, onValueChange }: SettingRowProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1 }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function Settings() {
  const [notifications, setNotifications] = useState(true);
  return (
    <SettingRow label="Notifications" value={notifications} onValueChange={setNotifications} />
  );
}
