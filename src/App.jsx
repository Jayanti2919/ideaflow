import React, { useState } from "react";
import Editor from "./components/Editor";
import Nav from "./components/Nav";

function App() {
  const [editors, setEditors] = useState([]);
  const [count, setCount] = useState(0)

  const addEditor = () => {
    setEditors([...editors, <Editor key={editors.length} id={count}/>]);
    setCount(count+1)
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
