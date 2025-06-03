/**
 * Text Editor Components
 * Modular Lexical editor with formatting capabilities
 */

// Main editor component
export { Editor } from './lexical';

// Configuration
export { editorConfig } from './config/editor-config';
export { editorTheme } from './config/editor-theme';

// Toolbar components
export { ToolbarPlugin } from './toolbar/toolbar-plugin';
export { ToolbarButton } from './toolbar/toolbar-button';
export { formatActions } from './toolbar/toolbar-actions';

// Plugins
export { TextInsertPlugin } from './plugins/text-insert-plugin';

// Types
export type { ColorScheme } from './toolbar/toolbar-button'; 