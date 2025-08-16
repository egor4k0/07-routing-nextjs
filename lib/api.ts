import axios from "axios";
import type { NewNote, Note } from "../types/note";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common['Authorization'] = `Bearer ${myKey}`;

export async function fetchNotes(search: string, page: number, tag?: string ) {
  try {
    const response = await axios.get<NotesHttpResponse>("/notes", {
      params: {
        ...(tag ? { tag } : {}),
        search,
        page,
        perPage: 12,
      },
    })
    return response.data;
  } catch {
    throw new Error("Fetch tasks failed");
  }
}

export async function createNote(newNote: NewNote):Promise<Note> {
  try {
    const response = await axios.post<Note>("/notes", newNote)
    return response.data;
  } catch {
    throw new Error("Create task failed");
  }
}

export async function deleteNote(noteId: string) {
  try {
    const response = await axios.delete<Note>(`/notes/${noteId}`)
    return response.data;
  } catch {
    throw new Error("Delete task failed");
  }
}

export async function fetchNoteById(noteId:string) {
  try {
    const response = await axios.get<Note>(`/notes/${noteId}`)
    return response.data;
  } catch {
    throw new Error("Could not fetch note details.");
  }
}