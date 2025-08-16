"use client";

import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, NotesHttpResponse } from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css"

interface NotesClientProps {
  initialData: NotesHttpResponse,
  tag: string | undefined
}

export default function NotesClient({ initialData, tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data, isSuccess } = useQuery({
    queryKey: ["notes", search, page, tag],
    queryFn: () => fetchNotes(search, page, tag),
    placeholderData: keepPreviousData,
    initialData,
  })

  const totalPages = data?.totalPages ?? 1

  const handleCreate = () => {
    setIsModalOpen(true)
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value:string) => {
    debouncedSetSearch(value)
  };

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value)
    setPage(1)
  },
    1000
  );

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={ handleChange } />
        {isSuccess && totalPages > 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage}/>}
        <button className={css.button} onClick={handleCreate}>Create note +</button>
      </div>
      {data?.notes !== undefined && data?.notes.length !== 0
        ? <NoteList notes={data?.notes} />
        : <p className={css.empty}>Notes not found.</p>}
      {isModalOpen &&
        <Modal onClose={handleClose} >
          <NoteForm onClose={handleClose} />
        </Modal>
      }
    </div>
  )
}