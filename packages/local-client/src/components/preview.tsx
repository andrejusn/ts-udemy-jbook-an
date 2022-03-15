import './preview.css'
import { useEffect, useRef } from "react";

interface PreviewProps {
  id: string;
  code: string;
  bundlingStatus: string;
  isFullWindow?: boolean;
}

const html = `
<html>
  <head></head>
  <body>
    <div id="root"></div>
    <script>
    const handleError = (err) => {
      const root = document.querySelector('#root');
      root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
      console.error(err);
    };

    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(event.error);
    });

    window.addEventListener('message', (event) => {
      try {
        eval(event.data);
      } catch (err) {
        handleError(err);
      }
    }, false);
  </script>
  </body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ id, code, bundlingStatus, isFullWindow }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;

    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
      // increased delay so that Firefox is done with window mutation in time, Chrome was good with 50
    }, 500);

  }, [code]);

  const styleByWindowed = isFullWindow ? { width: '100%', height: '97vh', border: 'none' } : undefined

  return <div className="preview-wrapper">
    <iframe
      id={`pr_${id}`}
      title={`code${id}`}
      name={`preview_${id}`}
      ref={iframe}
      srcDoc={html}
      sandbox='allow-scripts'
      style={styleByWindowed}
      allow={styleByWindowed ? "fullscreen" : ''}
    />
    {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}
  </div>
}

export default Preview;