interface Props {
  params: Promise<{ slug: string[] }>;
};

import { fetchNotes } from "@/lib/api"
import NotesClient from "./Notes.client"

export default async function NotesByCategory({ params }: Props) {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0]
  const initialData = await fetchNotes("", 1, tag );

  return (
    <main >
      <NotesClient initialData={initialData} tag={ tag } />
    </main>
  )
}