type PanelProps = { // @link:props
  title: string; // @link:title
  children: React.ReactNode; // @link:slot
};

function Panel({ title, children }: PanelProps) { // @link:fn
  return ( // @link:body
    <View style={{ padding: 16 }}>{/* @link:container */}
      <Text style={{ fontWeight: '600' }}>{title}</Text>{/* @link:heading */}
      {children}{/* @link:render-slot */}
    </View>
  );
}

// Usage
<Panel title="Today">{/* @link:usage */}
  <Text>Buy milk</Text>{/* @link:milk */}
  <Text>Walk the dog</Text>{/* @link:dog */}
</Panel>;
