import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { addAutomaticPunctuation, insertTextWithCapitalization } from '../../../utils/text-formatting';

interface TextInsertPluginProps {
  onInsertText: (insertFn: (text: string) => void, addPunctuation: () => void) => void;
}

/**
 * Plugin for handling text insertion with automatic formatting
 * Provides text insertion and punctuation addition capabilities
 */
export function TextInsertPlugin({ onInsertText }: TextInsertPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    /**
     * Insert text with automatic capitalization
     */
    const insertText = (text: string) => {
      editor.update(() => {
        insertTextWithCapitalization(text);
      });
    };

    /**
     * Add automatic punctuation (period and space)
     */
    const addPunctuation = () => {
      editor.update(() => {
        addAutomaticPunctuation();
      });
    };

    // Register the functions with the parent component
    onInsertText(insertText, addPunctuation);
  }, [editor, onInsertText]);

  return null;
} 