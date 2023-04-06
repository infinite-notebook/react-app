import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { SortableTree } from './Tree/SortableTree'
import { SimpleTreeItemWrapper } from './Tree/SimpleTreeItemWrapper';
import type { TreeItemComponentProps, TreeItems } from './Tree/types';

import './index.css'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration';

import { WebrtcProvider } from 'y-provider'

const ydoc = new Y.Doc()

const provider = new WebrtcProvider('example-document', ydoc)



const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    content: '<p>Hello World!</p>',
  })

  return (
    <EditorContent editor={editor} />
  )
}

type MinimalTreeItemData = {
  value: string;
}

const initialViableMinimalData: TreeItems<MinimalTreeItemData> = [
  {
    id: '1',
    value: 'Jane',
    children: [
      { id: '4', value: 'John' },
      { id: '5', value: 'Sally' },
    ],
  },
  { id: '2', value: 'Fred', children: [{ id: '6', value: 'Eugene' }] },
  { id: '3', value: 'Helen', canHaveChildren: false },
];

const TreeItemComponent = React.forwardRef<HTMLDivElement, TreeItemComponentProps<MinimalTreeItemData>>((props, ref) => (
  <SimpleTreeItemWrapper {...props} showDragHandle={false} ref={ref} >
    <div>{props.item.value}</div>
  </SimpleTreeItemWrapper >
));

const Example = () => {
  const [items, setItems] = useState(initialViableMinimalData as TreeItems<MinimalTreeItemData>)
  return (
    <div style={{border: 'black 1px solid'}} >
      Sidebar
      <SortableTree items={items} onItemsChanged={setItems} TreeItemComponent={TreeItemComponent} />
    </div>
  )
}



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <div className='rowC'>
      <Example />
      <Tiptap />
    </div>
  </React.StrictMode>,
)
