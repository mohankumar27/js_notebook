import React, { useEffect, useRef } from "react";

import "./preview.css";

interface PreviewProps {
  code: string | undefined;
}

const iframHTML = `
  <html>
    <head>
      <style>html {background-color: white;}</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener('message', event => {
          try{
            eval(event.data);
          }catch(err){
            const root = document.querySelector("#root");
            root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          }
        }, false);
      </script>
    </body>
  </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const childIframe = useRef<any>();

  useEffect(() => {
    childIframe.current.srcdoc = iframHTML;
    if (code) {
      setTimeout(() => {
        childIframe.current.contentWindow.postMessage(code, "*");
      }, 50);
    } else {
      // capture syntax errors
      // TODO: check if it can be improved to throw errors in Iframe instead of console
      childIframe.current.contentWindow.postMessage(
        "document.querySelector('#root').innerHTML = 'Syntax Error. Check console for error details';document.querySelector('#root').style['color']  = 'red'",
        "*"
      );
    }
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={childIframe}
        sandbox="allow-scripts"
        title="code preview"
        srcDoc={iframHTML}
      />
    </div>
  );
};

export default Preview;
