type User = { name: string; nickname?: string };

function displayName(user?: User): string {
  return user?.nickname ?? user?.name ?? 'Guest';
}

function initial(user?: User): string {
  if (!user) return '?';
  return user.name.slice(0, 1); // narrowed to User
}

function shortName(user?: User): string {
  return user?.nickname?.toUpperCase() ?? 'NONE';
}

// "Trust me": unchecked at runtime
const forced = (user?: User) => user!.name;
