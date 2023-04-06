
import React from "react";

import { cryptoutils, WebrtcProvider } from "y-provider";

import { EditorView } from "prosemirror-view";
import { EditorState } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { buildInputRules, exampleSetup } from "prosemirror-example-setup";

import * as Y from "yjs";
import {
    ySyncPlugin,
    yCursorPlugin,
    yUndoPlugin,
    undo,
    redo,
} from "y-prosemirror";

import { schema } from "./schema";


export const ydoc = new Y.Doc();

const provider = new WebrtcProvider("room", ydoc, { password: "password" });

const yXmlFragment = ydoc.getXmlFragment("prosemirror");


export class Editor extends React.Component<{}, {}> {
    editorRef: React.RefObject<HTMLDivElement>
    editorState: EditorState
    editorView?: EditorView

    constructor(props: {}) {
        super(props);
        this.editorState = EditorState.create({
            schema,
            plugins: [
                ySyncPlugin(yXmlFragment),
                yCursorPlugin(provider.awareness),
                yUndoPlugin(),
                keymap({
                    "Mod-z": undo,
                    "Mod-y": redo,
                    "Mod-Shift-z": redo,
                }),
            ].concat(
                exampleSetup({
                    schema,
                    menuBar: false,
                })
            ),
        })
        this.editorRef = React.createRef();
    }

    createEditorView = (element: HTMLDivElement | null) => {
        if (element != null) {
            this.editorView = new EditorView(element, {
                // nodeViews,
                state: this.editorState,
            })
        }
    }


    componentDidMount() {
        this.createEditorView(this.editorRef.current)
        this.forceUpdate()
    }

    componentWillUnmount() {
        if (this.editorView) {
            this.editorView.destroy()
        }
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return <div ref={this.editorRef} />
    }
}

