type GreetingProps = {
  name: string;
  excited?: boolean;
};

export function Greeting({ name, excited = false }: GreetingProps) {
  return (
    <Text>
      Hello, {name}
      {excited ? '!' : '.'}
    </Text>
  );
}

// Usage
<Greeting name="Reed" excited />;
