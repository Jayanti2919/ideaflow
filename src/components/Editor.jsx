import React, { useEffect, useRef } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import '../assets/editor.css';

const Editor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph (list_item)*', 'block'),
      marks: schema.spec.marks,
    });

    const editorView = new EditorView(editorRef.current, {
      state: EditorState.create({
        doc: DOMParser.fromSchema(mySchema).parse(document.querySelector('#content')),
        plugins: exampleSetup({ schema: mySchema }),
      }),
    });

    return () => {
      // Clean up the EditorView when the component unmounts
      editorView.destroy();
    };
  }, []);

  return (
    <div className='border-b-2 border-secondary px-5'>
      <div ref={editorRef} />
      <div id='content' style={{ display: 'none' }}>
      </div>
    </div>
  );
};

export default Editor;
