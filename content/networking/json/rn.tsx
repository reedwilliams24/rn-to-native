// TS types vanish at runtime, so validate the payload (here with zod)
const TodoSchema = z.object({ // @link:model
  id: z.string(), // @link:id
  title: z.string(), // @link:title
  done: z.boolean().default(false), // @link:done
  due_date: z.string().datetime().nullable().optional(), // @link:due
});

type Todo = z.infer<typeof TodoSchema>; // @link:model

function parseTodos(json: unknown): Todo[] { // @link:parse
  return z.array(TodoSchema).parse(json); // @link:parse
}
