function Profile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchUser(userId).then((u) => {
      if (!cancelled) setUser(u);
    });
    return () => {
      cancelled = true; // ignore the stale response
    };
  }, [userId]);

  return user ? <Text>{user.name}</Text> : <ActivityIndicator />;
}
