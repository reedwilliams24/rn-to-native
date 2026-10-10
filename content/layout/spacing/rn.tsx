function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.link}>Read more</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { margin: 16, padding: 16, gap: 4, borderRadius: 12, backgroundColor: '#F2F2F7' },
  title: { fontSize: 17, fontWeight: '600' },
  text: { color: '#555' },
  link: { marginTop: 12, color: '#1A56DB' },
});
