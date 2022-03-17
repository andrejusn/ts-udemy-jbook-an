export const activateMonacoJSXHighlighter = async (
  monacoEditor: any,
  monaco: any
) => {
  // monaco-jsx-highlighter depends on these in addition to Monaco and an instance of a Monaco Editor.
  const { default: traverse } = await import('@babel/traverse');
  const { parse } = await import('@babel/parser');
  // >>> The star of the show =P >>>
  const { default: MonacoJSXHighlighter, JSXTypes } = await import(
    'monaco-jsx-highlighter' // Note: there is a polyfilled version alongside the regular version.
  ); // For example, starting with 2.0.2, 2.0.2-polyfilled is also available.

  // Instantiate the highlighter
  const monacoJSXHighlighter = new MonacoJSXHighlighter(
    monaco, // references Range and other APIs
    parse, // obtains an AST, internally passes to parse options: {...options, sourceType: "module",plugins: ["jsx"],errorRecovery: true}
    traverse, // helps collecting the JSX expressions within the AST
    monacoEditor // highlights the content of that editor via decorations
  );
  // Start the JSX highlighting and get the dispose function
  let disposeJSXHighlighting =
    monacoJSXHighlighter.highlightOnDidChangeModelContent();
  // Enhance monaco's editor.action.commentLine with JSX commenting and get its disposer
  let disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand();
  // <<< You are all set. >>>

  // Optional: customize the color font in JSX texts (style class JSXElement.JSXText.tastyPizza from ./index.css)
  JSXTypes.JSXText.options.inlineClassName = 'JSXElement.JSXText.tastyPizza';
  // more details here: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IModelDecorationOptions.html
  console.log(
    "Customize each JSX expression type's options, they must match monaco.editor.IModelDecorationOptions:",
    JSXTypes
  );

  // This example's shorthands for toggling actions
  const toggleJSXHighlighting = () => {
    if (disposeJSXHighlighting) {
      disposeJSXHighlighting();
      disposeJSXHighlighting = null;
      return false;
    }

    disposeJSXHighlighting =
      monacoJSXHighlighter.highlightOnDidChangeModelContent();
    return true;
  };

  const toggleJSXCommenting = () => {
    if (disposeJSXCommenting) {
      disposeJSXCommenting();
      disposeJSXCommenting = null;
      return false;
    }

    disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand();
    return true;
  };

  const isToggleJSXHighlightingOn = () => !!disposeJSXHighlighting;
  const isToggleJSXCommentingOn = () => !!disposeJSXCommenting;

  return {
    monacoJSXHighlighter,
    toggleJSXHighlighting,
    toggleJSXCommenting,
    isToggleJSXHighlightingOn,
    isToggleJSXCommentingOn,
  };
};
