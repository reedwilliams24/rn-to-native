type Session = { userId: string; displayName: string };

const SessionContext = createContext<Session | null>(null);

function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession must be inside <SessionContext>');
  return session;
}

function Root({ session }: { session: Session }) {
  return (
    <SessionContext.Provider value={session}>
      <ProfileHeader />
    </SessionContext.Provider>
  );
}

function ProfileHeader() {
  const { displayName } = useSession();
  return <Text>Signed in as {displayName}</Text>;
}
