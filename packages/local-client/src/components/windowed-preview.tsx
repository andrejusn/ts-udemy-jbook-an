import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Preview from "./preview";

interface SeparateWindowPreviewProps {
    syncAsClosed: () => void;
    cellId: string;
    bundle: {
        loading: boolean;
        code: string;
        error: string;
    } | undefined
}

const WindowedPreview = ({ cellId, bundle, syncAsClosed }: SeparateWindowPreviewProps) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const newWindow = useRef(window);

    useEffect(() => {
        const div = document.createElement("div");
        setContainer(div);
    }, []);

    console.log('rendering')

    useEffect(() => {
        if (container) {
            (newWindow as any).current = window.open(
                "",
                "",
                // `preview_${cellId}`, 
                "width=800,height=600,left=400,top=400"
            );
            newWindow.current.document.body.appendChild(container);
            const curWindow = newWindow.current;
            newWindow.current.addEventListener('beforeunload', () => {
                syncAsClosed();
            });
            return () => curWindow.close();
        }
    }, [container]);

    return container && createPortal(
        <>
            {!bundle || bundle.loading ?
                (<div className='progress-cover'>
                    <progress className='progress is-small is-primary' max="100">Loading</progress>
                </div>)
                :
                <Preview id={cellId} code={bundle.code} bundlingStatus={bundle.error} isFullWindow />}
        </>
        , container);
};

export default WindowedPreview;