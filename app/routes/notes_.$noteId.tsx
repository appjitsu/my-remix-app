import { Link, MetaFunction, json, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";

import styles from "~/styles/note-details.css";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: data.title },
    { name: "description", content: data?.content },
  ];
};

export default function NoteDetailsPage() {
  const note = useLoaderData();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note?.title}</h1>
      </header>
      <p id="note-details-content">{note?.content}</p>
    </main>
  );
}

export async function loader({ params }) {
  const notes = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNote = notes.find((note) => note.id === noteId);

  if (!selectedNote) {
    throw new Response("Note not found", {
      status: 404,
    });
  }

  return selectedNote;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
