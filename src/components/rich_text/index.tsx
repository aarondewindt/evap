import { RichTextEditor, Link, getTaskListExtension } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import { useUncontrolled } from '@mantine/hooks';
import { Fieldset, Input } from '@mantine/core';

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';


export type RichTextProps = {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  editor_enabled?: boolean;
}


export const RichText = (props: RichTextProps) => {
  if (!props.editor_enabled) {
    return <RichViewer {...props}/>
  }

  return <RichEditor {...props}/>
}


export const RichViewer = ({value, label}: RichTextProps) => {
  return <Fieldset legend={label}>
    <div dangerouslySetInnerHTML={{__html: value ?? ""}}/>
  </Fieldset>
}


export const RichEditor = ({value, defaultValue, onChange, label}: RichTextProps) => {
  const [_value, handleChange] = useUncontrolled({
    value,
    defaultValue,
    onChange,
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Color,
      TextStyle,
      getTaskListExtension(TipTapTaskList),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'test-item',
        },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: _value,
    onUpdate({ editor }) {
      handleChange(editor.getHTML());
    },
  });

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar sticky stickyOffset={60}>
        { label }
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.ColorPicker
            colors={[
              '#25262b',
              '#868e96',
              '#fa5252',
              '#e64980',
              '#be4bdb',
              '#7950f2',
              '#4c6ef5',
              '#228be6',
              '#15aabf',
              '#12b886',
              '#40c057',
              '#82c91e',
              '#fab005',
              '#fd7e14',
            ]}
          />
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.TaskList />
          <RichTextEditor.TaskListLift />
          <RichTextEditor.TaskListSink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}


