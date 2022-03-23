import './code-editor.css';
import MonacoEditor, { Monaco, OnChange, OnMount } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useEffect, useRef } from 'react';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

interface CodeEditorProps {
    initialValue: string;
    onChange: (value: string) => void;
    darkTheme?: boolean;
    updateContentsHeight: (heightInPx: number) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange, darkTheme, updateContentsHeight }) => {
    // monaco.editor.IStandaloneCodeEditor - the library does not provide a type definition, yet?
    const editorRef = useRef<any>();
    const monacoRef = useRef<Monaco>();
    // MonacoJSXHighlighter - the library does not provide a type definition, yet?
    const monacoJSXHighlighterRef = useRef<any>();

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
    }

    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            monacoJSXHighlighterRef.current = new MonacoJSXHighlighter(
                monacoRef.current, parse, traverse, editorRef.current
            );
            monacoJSXHighlighterRef.current.highlightOnDidChangeModelContent();
            monacoJSXHighlighterRef.current.addJSXCommentCommand();
            monacoJSXHighlighterRef.current.addJSXCommentCommand();

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorRef.current, monacoRef.current])

    const handleChange: OnChange = (value, event) => {
        if (value) {
            onChange(value);
        }
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

        editorRef.current.setValue(formatted);
    }

    useEffect(() => {
        updateContentsHeight(editorRef?.current?.getScrollHeight());
    }, [editorRef, updateContentsHeight]);

    return (<div className='editor-wrapper'>
        <button className="button button-format is-primary is-small" onClick={onFormatClick}>Format</button>
        <MonacoEditor
            value={initialValue}
            onMount={handleEditorDidMount}
            onChange={handleChange}
            language="javascript"
            height="100%"
            theme={darkTheme ? 'vs-dark' : 'light'}
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