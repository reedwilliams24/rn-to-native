type Priority = 'low' | 'medium' | 'high'; // @link:enum

function PriorityBadge({ priority }: { priority: Priority }) { // @link:fn,param
  switch (priority) { // @link:switch
    case 'high': // @link:high
      return <Text style={{ color: 'red' }}>High</Text>; // @link:high
    case 'medium': // @link:medium
      return <Text style={{ color: 'orange' }}>Medium</Text>; // @link:medium
    case 'low': // @link:low
      return <Text style={{ color: 'gray' }}>Low</Text>; // @link:low
  }
}
