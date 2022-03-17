import './code-editor.css';
import MonacoEditor from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useCallback, useEffect, useRef, useState } from 'react';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

interface CodeEditorProps {
    initialValue: string;
    onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
    const editorRef = useRef<any>();
    const monacoJSXHighlighterRef = useRef<any>();

    const [isEditorReady, setIsEditorReady] = useState(false);
    const [isJSXHighlightingOn, setIsJSXHighlightingOn] = useState(true);
    const [isJSXCommentingOn, setIsJSXCommentingOn] = useState(false);

    //   editor: monaco.editor.IStandaloneCodeEditor,   monaco: Monaco,
    const handleEditorDidMount = (editor: any, monaco: any) => {
        editorRef.current = editor;
    }



    useEffect(() => {
        // Instantiate the highlighter
        monacoJSXHighlighterRef.current = new MonacoJSXHighlighter(
            MonacoEditor, parse, traverse, monacoJSXHighlighterRef.current
        );

        monacoJSXHighlighterRef.current.highlightOnDidChangeModelContent(100);
        monacoJSXHighlighterRef.current.addJSXCommentCommand();
    }, [editorRef])


    console.log(monacoJSXHighlighterRef.current)

    //    value: string | undefined,   ev: monaco.editor.IModelContentChangedEvent,
    const handleChange = (value: any, event: any) => {
        onChange(value);
    }

    const onFormatClick = () => {
        const unformatted = editorRef.current.getValue();

        const formatted = prettier.format(unformatted, {
            parser: 'babel',
            plugins: [parser],
            useTabs: false,
            semi: true,
            singleQuote: true,
        }).replace(/\n$/, '');;

        editorRef.current.setValue(formatted)
    }

    return (<div className='editor-wrapper'>
        <button className="button button-format is-primary is-small" onClick={onFormatClick}>Format</button>
        <MonacoEditor
            value={initialValue}
            onMount={handleEditorDidMount}
            onChange={handleChange}
            language="javascript"
            height="100%"
            theme="dark"
            options={{
                wordWrap: 'on',
                minimap: { enabled: false },
                showUnused: false,
                folding: false,
                lineNumbersMinChars: 3,
                fontSize: 16,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2
            }} />
    </div>);
}

export default CodeEditor;


const activateMonacoJSXHighlighter = async (monacoEditor: any, monaco: any) => {
    // monaco-jsx-highlighter depends on these in addition to Monaco and an instance of a Monaco Editor.
    const { default: traverse } = await import("@babel/traverse");
    const { parse } = await import("@babel/parser");
    // >>> The star of the show =P >>>
    const { default: MonacoJSXHighlighter, JSXTypes } = await import(
        "monaco-jsx-highlighter" // Note: there is a polyfilled version alongside the regular version.
    ); // For example, starting with 2.0.2, 2.0.2-polyfilled is also available.

    // Instantiate the highlighter
    const monacoJSXHighlighter = new MonacoJSXHighlighter(
        monaco, // references Range and other APIs
        parse, // obtains an AST, internally passes to parse options: {...options, sourceType: "module",plugins: ["jsx"],errorRecovery: true}
        traverse, // helps collecting the JSX expressions within the AST
        monacoEditor // highlights the content of that editor via decorations
    );
    // Start the JSX highlighting and get the dispose function
    let disposeJSXHighlighting = monacoJSXHighlighter.highlightOnDidChangeModelContent();
    // Enhance monaco's editor.action.commentLine with JSX commenting and get its disposer
    let disposeJSXCommenting = monacoJSXHighlighter.addJSXCommentCommand();
    // <<< You are all set. >>>

    // Optional: customize the color font in JSX texts (style class JSXElement.JSXText.tastyPizza from ./index.css)
    JSXTypes.JSXText.options.inlineClassName = "JSXElement.JSXText.tastyPizza";
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

        disposeJSXHighlighting = monacoJSXHighlighter.highlightOnDidChangeModelContent();
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
        isToggleJSXCommentingOn
    };
};