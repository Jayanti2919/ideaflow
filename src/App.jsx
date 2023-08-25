import React, { useState } from "react";
import Editor from "./components/Editor";
import Nav from "./components/Nav";

function App() {
  const [editors, setEditors] = useState([]);

  const addEditor = () => {
    setEditors([...editors, <Editor key={editors.length} />]);
    editors.pop();
  };

  return (
    <div className="text-white bg-primary min-h-screen h-fit">
      <Nav addEditor={addEditor} />
      <div className="flex gap-5 flex-col-reverse">{editors}</div>
    </div>
  );
}

export default App;
