import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Preview from "./preview";

export interface WindowedPreviewProps {
    syncAsClosed: () => void;
    cellId: string;
    windowRef: Window;
    bundle: {
        loading: boolean;
        code: string;
        error: string;
    } | undefined;
}

const WindowedPreview = ({ syncAsClosed, cellId, bundle, windowRef }: WindowedPreviewProps) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    // create element to pass into window
    useEffect(() => {
        const div = document.createElement("div");
        windowRef.document.body.appendChild(div);

        setContainer(div);

        windowRef.addEventListener('beforeunload', () => {
            syncAsClosed();
        });
        return () => windowRef.close();
    }, []);

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