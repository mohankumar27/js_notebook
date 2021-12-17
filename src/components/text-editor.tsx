import MDEditor from "@uiw/react-md-editor";
import React, { useEffect, useRef, useState } from "react";
import { useActions } from "../hooks/use-actions";
import { Cell } from "../state";

import "./text-editor.css";

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const markdownRef = useRef<HTMLDivElement | null>(null);

  const { updateCell } = useActions();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        markdownRef.current &&
        event.target &&
        markdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div ref={markdownRef} className="text-editor">
        <MDEditor
          value={cell.content}
          onChange={(val) => updateCell(cell.id, val || "")}
        />
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)} className="text-editor card">
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || "Click to Edit"} />
      </div>
    </div>
  );
};

export default TextEditor;
