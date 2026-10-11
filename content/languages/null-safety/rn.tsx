type User = { name: string; nickname?: string }; // @link:type

function displayName(user?: User): string { // @link:display
  return user?.nickname ?? user?.name ?? 'Guest'; // @link:coalesce
}

function initial(user?: User): string { // @link:initial
  if (!user) return '?'; // @link:guard
  return user.name.slice(0, 1); // narrowed to User // @link:narrow
}

function shortName(user?: User): string { // @link:short
  return user?.nickname?.toUpperCase() ?? 'NONE'; // @link:chain
}

// "Trust me": unchecked at runtime
const forced = (user?: User) => user!.name; // @link:force
