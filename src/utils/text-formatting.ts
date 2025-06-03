import { 
  $getRoot, 
  $getSelection, 
  $isRangeSelection, 
  $createTextNode, 
  $insertNodes,
  $createParagraphNode 
} from 'lexical';

/**
 * Adds automatic punctuation (period and space) to the end of text if needed,
 * and capitalizes the first letter of the next sentence
 */
export const addAutomaticPunctuation = (): void => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;

  const root = $getRoot();
  const textContent = root.getTextContent().trim();
  
  // Only add punctuation if there's text and it doesn't already end with punctuation
  if (!textContent || /[.!?]$/.test(textContent)) return;

  // Add period and space
  const punctuationNode = $createTextNode('. ');
  $insertNodes([punctuationNode]);
  
  console.log("Added automatic punctuation: '. '");
};

/**
 * Capitalizes the first letter of text that follows after punctuation
 * This should be called when new text is inserted after punctuation
 */
export const capitalizeAfterPunctuation = (text: string): string => {
  if (!text) return text;
  
  // Check if the text should start with a capital letter
  // (if it's the beginning of a sentence or follows punctuation)
  const trimmedText = text.trim();
  if (!trimmedText) return text;
  
  // Capitalize the first letter
  const capitalizedText = trimmedText.charAt(0).toUpperCase() + trimmedText.slice(1);
  
  console.log(`Capitalized text: "${trimmedText}" -> "${capitalizedText}"`);
  return capitalizedText;
};

/**
 * Checks if the current text context suggests the next word should be capitalized
 * (e.g., after a period, exclamation, question mark, or at the beginning)
 */
export const shouldCapitalizeNext = (textContent: string): boolean => {
  if (!textContent.trim()) return true; // Capitalize at the beginning
  
  // Look for sentence-ending punctuation followed by space(s)
  return /[.!?]\s*$/.test(textContent.trim());
};

/**
 * Enhanced text insertion that handles automatic capitalization
 */
export const insertTextWithCapitalization = (text: string): void => {
  if (!text) return;
  
  const root = $getRoot();
  const currentText = root.getTextContent();
  
  // Determine if we should capitalize the first letter
  const shouldCapitalize = shouldCapitalizeNext(currentText);
  const processedText = shouldCapitalize ? capitalizeAfterPunctuation(text) : text;
  
  // Create paragraph and text node (consistent with original behavior)
  const paragraph = $createParagraphNode();
  const textNode = $createTextNode(processedText);
  paragraph.append(textNode);
  $insertNodes([paragraph]);
}; 