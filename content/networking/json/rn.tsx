// TS types vanish at runtime, so validate the payload (here with zod)
const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  done: z.boolean().default(false),
  due_date: z.string().datetime().nullable().optional(),
});

type Todo = z.infer<typeof TodoSchema>;

function parseTodos(json: unknown): Todo[] {
  return z.array(TodoSchema).parse(json);
}
