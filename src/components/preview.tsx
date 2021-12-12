import React, { useEffect, useRef } from "react";

import "./preview.css";

interface PreviewProps {
  code: string;
  bundlingError: string;
}

const iframHTML = `
  <html>
    <head>
      <style>html {background-color: white;}</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (err) => {
          const root = document.querySelector("#root");
          root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        };
        // catch asynchoronous errors
        window.addEventListener('error',(event) => {
          event.preventDefault();
          handleError(event.error)
        });
        // catch synchoronous errors
        window.addEventListener('message', event => {
          try{
            eval(event.data);
          }catch(err){
            handleError(err);
          }
        }, false);
      </script>
    </body>
  </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundlingError }) => {
  const childIframe = useRef<any>();

  useEffect(() => {
    childIframe.current.srcdoc = iframHTML;
    setTimeout(() => {
      childIframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={childIframe}
        sandbox="allow-scripts"
        title="code preview"
        srcDoc={iframHTML}
      />
      {bundlingError && (
        <div className="preview-error">
          <h3 style={{ fontWeight: "bold" }}>Bundling Error</h3>
          {bundlingError}
        </div>
      )}
    </div>
  );
};

export default Preview;
