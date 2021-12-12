import MDEditor from "@uiw/react-md-editor";
import React, { useEffect, useRef, useState } from "react";

import "./text-editor.css";

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("# Header");
  const markdownRef = useRef<HTMLDivElement | null>(null);

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
        <MDEditor value={value} onChange={(val) => setValue(val || "")} />
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)} className="text-editor card">
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default TextEditor;
