import type { LexicalEditor } from 'lexical';
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getRoot,
} from 'lexical';

/**
 * Formatting actions for the toolbar
 */
export const formatActions = {
  bold: (editor: LexicalEditor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  },

  italic: (editor: LexicalEditor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  },

  underline: (editor: LexicalEditor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  },

  strikethrough: (editor: LexicalEditor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  },

  code: (editor: LexicalEditor) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
  },

  clearText: (editor: LexicalEditor) => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      root.append(paragraph);
      paragraph.selectEnd();
    });
  },

  copyText: async (editor: LexicalEditor) => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (selection && $isRangeSelection(selection)) {
        // If there's a range selection, copy only the selected text
        const selectedText = selection.getTextContent();
        if (selectedText) {
          navigator.clipboard.writeText(selectedText).then(() => {
            console.log('Selected text copied to clipboard');
          }).catch(err => {
            console.error('Failed to copy selected text:', err);
          });
          return;
        }
      }
      
      // If no selection or empty selection, copy all text
      const root = $getRoot();
      const textContent = root.getTextContent();
      if (textContent) {
        navigator.clipboard.writeText(textContent).then(() => {
          console.log('All text copied to clipboard');
        }).catch(err => {
          console.error('Failed to copy text:', err);
        });
      }
    });
  }
};

/**
 * Check if a specific format is currently active in the selection
 */
export const getFormatStates = (selection: any) => {
  if (!$isRangeSelection(selection)) {
    return {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      code: false,
    };
  }

  return {
    bold: selection.hasFormat('bold'),
    italic: selection.hasFormat('italic'),
    underline: selection.hasFormat('underline'),
    strikethrough: selection.hasFormat('strikethrough'),
    code: selection.hasFormat('code'),
  };
}; 