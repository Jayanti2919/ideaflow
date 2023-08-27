import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "prosemirror-state";
import { TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Schema, DOMParser } from "prosemirror-model";
import { schema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";
import "../assets/editor.css";
import state from "../store";
import { useSnapshot } from "valtio";

const Editor = (props) => {
  const editorRef = useRef(null);
  const snap = useSnapshot(state);
  const [showDropdown, setShowDropdown] = useState(false);
  const [view, setView] = useState(null);
  const [backspace, setBackspace] = useState(false);
  const [currschema, setCurrSchema] = useState(null);

  const handleAddValueToEditor = (value) => {
    const currentEditorState = view.state;
    const newValue = value;

    const marks = currschema.marks;
    const mark = marks.textColor.create({ color: "#80CAD4" });

    const tr = currentEditorState.tr
      .insertText(newValue)
      .addMark(
        currentEditorState.selection.from - 2,
        currentEditorState.selection.to + newValue.length,
        mark
      );
    const newEditorState = currentEditorState.apply(tr);

    view.updateState(newEditorState);
    state.map[props.id] = newEditorState.doc.textContent;
  };

  useEffect(() => {
    const mySchema = new Schema({
      nodes: schema.spec.nodes,
      marks: {
        ...schema.spec.marks,
        textColor: {
          attrs: {
            color: {default: '#F2F1F2'},
          },
          inline: true,
          group: "inline",
          parseDOM: [
            {
              style: "color",
              getAttrs: (color) => ({ color }),
            },
          ],
          toDOM: (mark) => ["span", { style: `color: ${mark.attrs.color}` }, 0],
        },
      },
    });

    setCurrSchema(mySchema);
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
        if (textContent.slice(-2) === '<>') {
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
            const index = state.map[props.id].indexOf("<");
            console.log(index);
            const tr = editorView.state.tr.setSelection(
              TextSelection.create(
                editorView.state.doc,
                $from.start() + index,
                $to.end()
              )
            );
            editorView.dispatch(tr);
            setShowDropdown(false);
          } else {
            const { $from, $to } = editorView.state.selection;
            const index = state.map[props.id].indexOf("<");
            console.log(index);
            const tr = editorView.state.tr.deleteRange(
              $from.start() + index,
              $to.end()
            );
            editorView.dispatch(tr);
            setBackspacePressed(false);
            setShowDropdown(false);
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
    <div className="border-b-2 border-secondary px-5 overflow-hidden text-white">
      <div ref={editorRef} />
      {showDropdown && (
        <ul className="bg-secondary px-5 py-2 list-none mb-1">
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