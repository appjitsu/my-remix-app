import { MetaFunction, json, redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";

export const meta: MetaFunction = () => {
  return [
    { title: "All Notes" },
    { name: "description", content: "Manage your notes." },
  ];
};

export default function NotesPage() {
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  // if (!notes || notes.length === 0) {
  //   throw json("No notes found", {
  //     status: 404,
  //   });
  // }
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return { message: "title must be at least 5 characters long" };
  }

  if (noteData.content.trim().length < 5) {
    return { message: "content must be at least 5 characters long" };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function ErrorBoundary() {
  const error = useRouteError();

  console.log("error", error);

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    <main className="error">
      <h1>Oops</h1>
      <p>
        Status: {error?.status} {error?.statusText}
      </p>
    </main>;
  }

  return (
    <main className="error">
      <h1>An error occured!</h1>
      <p>
        {error?.status} {error?.data}
      </p>
      <p>
        <Link to="/">back to safety!</Link>
      </p>
    </main>
  );
}
