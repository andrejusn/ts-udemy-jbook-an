import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Preview from "./preview";


const RenderInWindow = (props: any) => {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const newWindow = useRef(window);

    useEffect(() => {
        const div = document.createElement("div");
        setContainer(div);
    }, []);


    useEffect(() => {
        if (container) {
            (newWindow as any).current = window.open(
                "",
                "",
                "width=1280,height=760,left=200,top=200"
            );
            newWindow.current.document.body.appendChild(container);
            const curWindow = newWindow.current;

            return () => curWindow.close();
        }
    }, [container]);

    return container && createPortal(props.children, container);
};


interface SeparateWindowPreviewProps {
    syncAsClosed: () => void;
    cellId: string;
    bundle: {
        loading: boolean;
        code: string;
        error: string;
    }
}

const WindowedPreview: React.FC<SeparateWindowPreviewProps> = ({ syncAsClosed, cellId, bundle }) => {

    useEffect(() => {
        return () => {
            console.log('closing preview window')
            syncAsClosed();
        }
    }, []);

    return <RenderInWindow>
        <Preview id={cellId} code={bundle.code} bundlingStatus={bundle.error} />
    </RenderInWindow>
}

export default WindowedPreview;