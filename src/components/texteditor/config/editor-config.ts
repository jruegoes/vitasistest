import { editorTheme } from './editor-theme';

/**
 * Error handler for Lexical editor
 */
export function onError(error: any) {
  console.error('Lexical Editor Error:', error);
}

/**
 * Initial configuration for Lexical editor
 */
export const editorConfig = {
  namespace: 'VitasisEditor',
  theme: editorTheme,
  onError,
}; 