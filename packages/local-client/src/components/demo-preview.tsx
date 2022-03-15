import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

interface DemoPreviewProps {
    closeWindowPortal: () => void;
}

export const DemoPreview: React.FC<DemoPreviewProps> = ({ children, closeWindowPortal }) => {
    const externalWindow = useRef(
        window.open("", "", "width=600,height=400,left=200,top=200")
    );

    const containerEl = document.createElement("div");

    useEffect(() => {
        const currentWindow = externalWindow.current;
        return () => currentWindow?.close();
    }, []);

    externalWindow.current?.document.body.appendChild(containerEl);
    // copyStyles(document, externalWindow.current.document);

    externalWindow.current?.addEventListener("beforeunload", () => {
        closeWindowPortal();
    });

    return ReactDOM.createPortal(children, containerEl);
};
