type Session = { userId: string; displayName: string }; // @link:type

const SessionContext = createContext<Session | null>(null); // @link:key

function useSession() { // @link:read
  const session = useContext(SessionContext); // @link:read
  if (!session) throw new Error('useSession must be inside <SessionContext>'); // @link:missing
  return session;
}

function Root({ session }: { session: Session }) { // @link:root
  return (
    <SessionContext.Provider value={session}>{/* @link:provide */}
      <ProfileHeader />{/* @link:child */}
    </SessionContext.Provider>
  );
}

function ProfileHeader() { // @link:header
  const { displayName } = useSession(); // @link:read2
  return <Text>Signed in as {displayName}</Text>; // @link:text
}
