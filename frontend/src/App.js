import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/Card";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Textarea } from "./components/Textarea";
import { motion } from "framer-motion";
import { Trash2, PlusCircle } from "lucide-react";
import axios from "axios";

export default function NewNotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке заметок", error);
    }
  };

  const addNote = async () => {
    if (title.trim() && content.trim()) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/notes`, { title, content });
        setNotes([...notes, response.data]);
        setTitle("");
        setContent("");
      } catch (error) {
        console.error("Ошибка при добавлении заметки", error);
      }
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении заметки", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NewNotes App</h1>
      <div className="mb-4 space-y-2">
        <Input
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Текст заметки"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={addNote} className="flex items-center gap-2">
          <PlusCircle size={20} /> Добавить
        </Button>
      </div>
      <div className="space-y-4">
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="p-4 flex justify-between items-start">
              <CardContent>
                <h2 className="text-lg font-semibold">{note.title}</h2>
                <p className="text-gray-600">{note.content}</p>
              </CardContent>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteNote(note.id)}
              >
                <Trash2 size={18} />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
