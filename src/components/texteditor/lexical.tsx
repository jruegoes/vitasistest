import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useTranslation } from 'react-i18next';
import { editorConfig } from './config/editor-config';
import { ToolbarPlugin } from './toolbar/toolbar-plugin';
import { TextInsertPlugin } from './plugins/text-insert-plugin';

interface EditorProps {
  onInsertText?: (insertFn: (text: string) => void, addPunctuation: () => void) => void;
}

/**
 * Main Lexical Editor Component
 * A rich text editor with formatting capabilities and automatic text processing
 */
export function Editor({ onInsertText }: EditorProps) {
  const { t } = useTranslation();

  return (
    <div 
      className="border border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg bg-white dark:bg-gray-900 lexical-editor transition-colors overflow-hidden"
      role="region"
      aria-labelledby="editor-section-title"
    >
      <LexicalComposer initialConfig={editorConfig}>
        <div>
          <ToolbarPlugin />
          <div className="p-6 relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  className="min-h-[200px] outline-none focus:outline-none resize-none text-gray-900 dark:text-gray-100 font-open-sans text-base leading-relaxed"
                  role="textbox"
                  aria-multiline="true"
                  aria-label={t('editor.textEditor')}
                  aria-describedby="editor-instructions"
                />
              }
              placeholder={
                <div 
                  className="text-gray-400 dark:text-gray-500 absolute top-0 left-0 p-6 pointer-events-none select-none font-open-sans text-base"
                  aria-hidden="true"
                >
                  {t('editor.placeholder')}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            
            {/* Hidden instructions for screen readers */}
            <div id="editor-instructions" className="sr-only">
              {t('editor.textEditor')}. Use the toolbar above to format your text. {t('editor.placeholder')}
            </div>
            
            <HistoryPlugin />
            <AutoFocusPlugin />
            {onInsertText && <TextInsertPlugin onInsertText={onInsertText} />}
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
