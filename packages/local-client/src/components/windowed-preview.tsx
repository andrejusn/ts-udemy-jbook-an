import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Preview from "./preview";

export interface WindowedPreviewProps {
    syncAsClosed: () => void;
    cellId: string;
    bundle: {
        loading: boolean;
        code: string;
        error: string;
    } | undefined;
}

const WindowedPreview = ({ cellId, bundle, syncAsClosed }: WindowedPreviewProps) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const newWindow = useRef(window);

    // create element to pass into window
    useEffect(() => {
        const div = document.createElement("div");
        setContainer(div);
    }, []);

    // after element is created, open a new window, attach element to it
    useEffect(() => {
        if (container) {
            (newWindow as any).current = window.open(
                "",
                "",
                "width=800,height=600,left=400,top=400"
            );

            newWindow.current.document.body.appendChild(container);
            const curWindow = newWindow.current;
            newWindow.current.addEventListener('beforeunload', () => {
                syncAsClosed();
            });

            return () => curWindow.close();
        }

        // buggy with syncAsClosed listed ???
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [container]);

    // show the component within the element
    return container && createPortal(
        <>
            {!bundle || bundle.loading ?
                (<div className='progress-cover'>
                    <progress className='progress is-small is-primary' max="100">Loading</progress>
                </div>)
                :
                <Preview id={cellId} code={bundle.code} bundlingStatus={bundle.error} isFullWindow />}
        </>,
        container);
};

export default WindowedPreview;