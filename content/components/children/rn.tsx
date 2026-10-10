type PanelProps = {
  title: string;
  children: React.ReactNode;
};

function Panel({ title, children }: PanelProps) {
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontWeight: '600' }}>{title}</Text>
      {children}
    </View>
  );
}

// Usage
<Panel title="Today">
  <Text>Buy milk</Text>
  <Text>Walk the dog</Text>
</Panel>;
