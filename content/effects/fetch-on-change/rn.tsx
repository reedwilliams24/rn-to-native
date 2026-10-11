function Profile({ userId }: { userId: string }) { // @link:fn
  const [user, setUser] = useState<User | null>(null); // @link:state

  useEffect(() => { // @link:effect
    let cancelled = false; // @link:cancel
    fetchUser(userId).then((u) => { // @link:fetch
      if (!cancelled) setUser(u); // @link:assign
    });
    return () => {
      cancelled = true; // ignore the stale response // @link:cancel
    };
  }, [userId]); // @link:effect

  return user ? <Text>{user.name}</Text> : <ActivityIndicator />; // @link:render,loading
}
