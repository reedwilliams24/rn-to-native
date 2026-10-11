function InfoCard({ title, text }: { title: string; text: string }) { // @link:fn
  return (
    <View style={styles.card}>{/* @link:card */}
      <Text style={styles.title}>{title}</Text>{/* @link:title */}
      <Text style={styles.text}>{text}</Text>{/* @link:text */}
      <Text style={styles.link}>Read more</Text>{/* @link:link */}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { margin: 16, padding: 16, gap: 4, borderRadius: 12, backgroundColor: '#F2F2F7' }, // @link:margin,padding,gap,bg
  title: { fontSize: 17, fontWeight: '600' }, // @link:title
  text: { color: '#555' }, // @link:text
  link: { marginTop: 12, color: '#1A56DB' }, // @link:link,margintop
});
