type GreetingProps = { // @link:props
  name: string; // @link:name
  excited?: boolean; // @link:excited
};

export function Greeting({ name, excited = false }: GreetingProps) { // @link:fn,default
  return ( // @link:body
    <Text>{/* @link:text */}
      Hello, {name}{/* @link:text */}
      {excited ? '!' : '.'}{/* @link:text */}
    </Text>
  );
}

// Usage
<Greeting name="Reed" excited />; // @link:usage
