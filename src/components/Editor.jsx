import React, { useEffect } from 'react'
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {Schema, DOMParser} from "prosemirror-model"
import {schema} from "prosemirror-schema-basic"
import {addListNodes} from "prosemirror-schema-list"
import {exampleSetup} from "prosemirror-example-setup"
import '../assets/editor.css'

const Editor = () => {
    useEffect(()=>{
        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
            marks: schema.spec.marks
          })
          
          window.view = new EditorView(document.querySelector("#editor"), {
            state: EditorState.create({
              doc: DOMParser.fromSchema(mySchema).parse(document.querySelector("#content")),
              plugins: exampleSetup({schema: mySchema})
            })
          })
    }, [])
  return (
    <div className='px-10'>
        <div id="editor"/>
        <div id="content" />
        <div className='h-0.5 w-full bg-secondary'></div>
    </div>
  )
}

export default Editor