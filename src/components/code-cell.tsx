import { useState } from "react";

import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundler from "../bundler";

const CodeCell = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onSubmitHandler = async () => {
    const output = await bundler(input);
    setCode(output);
  };

  return (
    <div>
      <CodeEditor
        initialValue="//js code here"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onSubmitHandler}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
