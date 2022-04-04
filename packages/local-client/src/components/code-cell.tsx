import './code-cell.css';
import React, { useEffect, useRef, useState } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview'
import Resizable from './resizable';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions'
import { useTypedSelector } from '../hooks/use-typed-selector'
import { useCumulativeCode } from '../hooks/use-cumulative-code'
import ActionBar from './action-bar';
import WindowedPreview from './windowed-preview';

interface CodeCellProps {
    cell: Cell
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {

    const { updateCell, createBundle } = useActions();
    const bundle = useTypedSelector((state) => state.bundles[cell.id]);
    const darkTheme = useTypedSelector(({ theme: { darkTheme } }) => darkTheme);

    const cumulativeCode = useCumulativeCode(cell.id);

    const [editorContentsHeight, setEditorContentsHeight] = useState<number | undefined>(undefined)
    const [usersSetHeight, setUsersSetHeight] = useState<number | undefined>(undefined)
    const [totalHeight, setTotalHeight] = useState<number>(200)

    const newWindow = useRef<Window>(window);

    function updateContentsHeight(heightInPx: number) {
        setEditorContentsHeight(heightInPx);
    }

    function updateUsersSetHeight(heightInPx: number) {
        setUsersSetHeight(heightInPx);
    }

    const [previewInWindow, setPreviewInWindow] = useState(false);

    function openInNewWindow() {
        newWindow.current = window.open(
            "",
            "",
            "width=800,height=600,left=400,top=400"
        )!!;

        setPreviewInWindow(true);
    }

    function closeNewWindow() {
        setPreviewInWindow(false);
    }

    useEffect(() => {

        if (!bundle) {
            createBundle(cell.id, cumulativeCode);
            return;
        }

        const timer = setTimeout(async () => {
            createBundle(cell.id, cumulativeCode);

        }, 750);
        return () => {
            clearTimeout(timer)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cell.id, cumulativeCode, createBundle]);

    // always know how much code is displayed in editor, height in pixels
    useEffect(() => {
        if (editorContentsHeight) {
            setEditorContentsHeight(editorContentsHeight)
        }
    }, [editorContentsHeight, setEditorContentsHeight]);

    // stretch the resizer with content, unless the user resized manually
    useEffect(() => {
        if (usersSetHeight) {
            setTotalHeight(usersSetHeight);
        }
        else {
            if (editorContentsHeight && editorContentsHeight >= 200) {
                setTotalHeight(editorContentsHeight + 10);
            }
        }
    }, [editorContentsHeight, usersSetHeight, setTotalHeight]);

    return <>
        <div className='action-bar-wrapper'>
            <ActionBar id={cell.id} openInNewWindow={openInNewWindow} isOpen={previewInWindow} />
            {cell.tcheck?.map(t => {
                return <p key={t.message}>
                    {t.message} - {t.location}
                </p>
            })}
        </div>
        {previewInWindow && newWindow && (<WindowedPreview cellId={cell.id} bundle={bundle} syncAsClosed={closeNewWindow} windowRef={newWindow.current} />)}
        <Resizable direction={'vertical'} vHeight={totalHeight} vHeightRegister={updateUsersSetHeight}>
            <div style={{
                height: `calc(100% - 10px)`,
                display: 'flex',
                flexDirection: 'row'
            }}>

                <Resizable direction='horizontal'>
                    <CodeEditor
                        initialValue={cell.content}
                        onChange={(value) => updateCell(cell.id, value)}
                        darkTheme={darkTheme}
                        updateContentsHeight={updateContentsHeight}
                    />
                </Resizable>
                <div className='progress-wrapper'>
                    {!bundle || bundle.loading ? (
                        <div className='progress-cover'>
                            <progress
                                className='progress is-small is-primary'
                                max="100"
                            >
                                Loading
                            </progress>
                        </div>
                    ) : (
                        <Preview id={cell.id} code={bundle.code} bundlingStatus={bundle.error} />
                    )}
                </div>
            </div>
        </Resizable>
    </>;
}

export default CodeCell;