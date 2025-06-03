import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection } from 'lexical';
import { Bold, Italic, Underline, Strikethrough, Code2, Trash2, Copy } from 'lucide-react';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { mergeRegister } from '@lexical/utils';
import { useTranslation } from 'react-i18next';
import { ToolbarButton } from './toolbar-button';
import { formatActions, getFormatStates } from './toolbar-actions';

/**
 * Toolbar plugin for the Lexical editor
 * Provides formatting controls and text manipulation actions
 */
export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  
  // Formatting states
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
  });

  /**
   * Update toolbar state based on current selection
   */
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    const states = getFormatStates(selection);
    setFormatState(states);
  }, []);

  // Memoize action handlers to prevent recreation on every render
  const actionHandlers = useMemo(() => ({
    bold: () => formatActions.bold(editor),
    italic: () => formatActions.italic(editor),
    underline: () => formatActions.underline(editor),
    strikethrough: () => formatActions.strikethrough(editor),
    code: () => formatActions.code(editor),
    copyText: () => formatActions.copyText(editor),
    clearText: () => formatActions.clearText(editor),
  }), [editor]);

  // Register update listener
  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [editor, updateToolbar]);

  return (
    <div 
      className="flex items-center gap-3 mb-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl"
      role="toolbar"
      aria-label={t('accessibility.formatGroup')}
    >
      {/* Basic Formatting Group */}
      <div 
        className="flex items-center gap-2"
        role="group"
        aria-label={`${t('editor.bold')}, ${t('editor.italic')}, ${t('editor.underline')}`}
      >
        <ToolbarButton
          onClick={actionHandlers.bold}
          isActive={formatState.bold}
          label={t('editor.bold')}
          colorScheme="blue"
          shortcut="Ctrl+B"
        >
          <Bold className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={actionHandlers.italic}
          isActive={formatState.italic}
          label={t('editor.italic')}
          colorScheme="blue"
          shortcut="Ctrl+I"
        >
          <Italic className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={actionHandlers.underline}
          isActive={formatState.underline}
          label={t('editor.underline')}
          colorScheme="blue"
          shortcut="Ctrl+U"
        >
          <Underline className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      </div>

      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" role="separator" aria-orientation="vertical" />

      {/* Advanced Formatting Group */}
      <div 
        className="flex items-center gap-2"
        role="group"
        aria-label={`${t('editor.strikethrough')}, ${t('editor.code')}`}
      >
        <ToolbarButton
          onClick={actionHandlers.strikethrough}
          isActive={formatState.strikethrough}
          label={t('editor.strikethrough')}
          colorScheme="green"
        >
          <Strikethrough className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={actionHandlers.code}
          isActive={formatState.code}
          label={t('editor.code')}
          colorScheme="purple"
        >
          <Code2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      </div>

      <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" role="separator" aria-orientation="vertical" />

      {/* Action Group */}
      <div 
        className="flex items-center gap-2"
        role="group"
        aria-label={`${t('editor.copy')}, ${t('editor.clearText')}`}
      >
        <ToolbarButton
          onClick={actionHandlers.copyText}
          isActive={false}
          label={t('editor.copy')}
          colorScheme="gray"
          shortcut="Ctrl+C"
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>

        <ToolbarButton
          onClick={actionHandlers.clearText}
          isActive={false}
          label={t('editor.clearText')}
          colorScheme="red"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </ToolbarButton>
      </div>
    </div>
  );
} 