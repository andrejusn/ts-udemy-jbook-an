import './code-cell.css';
import React, { useEffect, useState } from 'react';
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
    const cumulativeCode = useCumulativeCode(cell.id);

    const [open, setOpen] = useState(false);

    function openInNewWindow() {
        console.log('clikced in cell, ', open)
        setOpen(true);
    }

    function closedInNewWindow() {
        setOpen(false);
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


    return <>
        <div className='action-bar-wrapper'>
            <ActionBar id={cell.id} openInNewWindow={openInNewWindow} />
        </div>
        {open && bundle && <WindowedPreview cellId={cell.id} bundle={bundle} syncAsClosed={() => closedInNewWindow()} />
        }
        <Resizable direction={'vertical'}>
            <div style={{
                height: 'calc(100% - 10px)',
                display: 'flex',
                flexDirection: 'row'
            }}>
                <Resizable direction='horizontal'>
                    <CodeEditor
                        initialValue={cell.content}
                        onChange={(value) => updateCell(cell.id, value)}
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
    </>
        ;
}

export default CodeCell;