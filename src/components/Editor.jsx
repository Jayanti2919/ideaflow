import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { Plugin, TextSelection, PluginKey } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { exampleSetup } from "prosemirror-example-setup";
import "../assets/editor.css";
import state from "../store";
import { useSnapshot } from "valtio";

const Editor = (props) => {
  const editorRef = useRef(null);
  const snap = useSnapshot(state);
  const [showDropdown, setShowDropdown] = useState(false);
  const [linkedIdea, setlinkedIdea] = useState("");
  const [view, setView] = useState(null);
  const [backspace, setBackspace] = useState(false);

  const handleAddValueToEditor = (value) => {
    const currentEditorState = view.state;
    const currentContent = currentEditorState.doc.textContent;
    const newValue = value;
    const tr = currentEditorState.tr.insertText(newValue);
    const newEditorState = currentEditorState.apply(tr);

    view.updateState(newEditorState);
    state.map[props.id] = newEditorState.doc.textContent;
  };

  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, "paragraph (list_item)*", "block"),
      marks: schema.spec.marks,
    });

    const editorView = new EditorView(editorRef.current, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(
          document.querySelector("#content")
        ),
        plugins: exampleSetup({ schema: mySchema }),
      }),
      dispatchTransaction(transaction) {
        const newState = editorView.state.apply(transaction);
        editorView.updateState(newState);
        const textContent = newState.doc.textContent;
        if (textContent.includes("<>")) {
          setShowDropdown(true);
        } else {
          setShowDropdown(false);
        }
        state.map[props.id] = textContent;
      },
    });
    setView(editorView);

    const handleKeyDown = (event) => {
      if (event.key === "Backspace") {
        if (state.map[props.id].includes("<>")) {
          if (!backspace) {
            setBackspace(true);
            event.preventDefault();
            const { $from, $to } = editorView.state.selection;
            const index = state.map[props.id].indexOf('<')
            console.log(index)
            const tr = editorView.state.tr.setSelection(
              TextSelection.create(editorView.state.doc, $from.start()+index, $to.end())
            );
            editorView.dispatch(tr);
            setShowDropdown(false)
          } else {
            const { $from, $to } = editorView.state.selection;
            const index = state.map[props.id].indexOf('<')
            console.log(index)
            const tr = editorView.state.tr.deleteRange($from.start()+index, $to.end());
            editorView.dispatch(tr);
            setBackspacePressed(false);
            setShowDropdown(false)
          }
        }
      } else {
        setBackspace(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      editorView.destroy();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const values = Object.values(state.map).filter(
    (value) => value !== state.map[props.id]
  );
  return (
    <div className="border-b-2 border-secondary px-5">
      <div ref={editorRef} />
      {showDropdown && (
        <ul className="bg-secondary px-5 py-2 list-none">
          {values.map((val) => (
            <li
              className="cursor-pointer"
              key={val}
              onClick={(e) => {
                e.preventDefault();
                state.map[props.id] = state.map[props.id] + val;
                handleAddValueToEditor(val);
                setShowDropdown(false);
              }}
            >
              {val}
            </li>
          ))}
        </ul>
      )}
      <div id="content" style={{ display: "none" }}></div>
    </div>
  );
};

export default Editor;
