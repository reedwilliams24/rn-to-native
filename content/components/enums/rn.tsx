type Priority = 'low' | 'medium' | 'high';

function PriorityBadge({ priority }: { priority: Priority }) {
  switch (priority) {
    case 'high':
      return <Text style={{ color: 'red' }}>High</Text>;
    case 'medium':
      return <Text style={{ color: 'orange' }}>Medium</Text>;
    case 'low':
      return <Text style={{ color: 'gray' }}>Low</Text>;
  }
}
