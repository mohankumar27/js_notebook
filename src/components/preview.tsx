import React, { useEffect, useRef } from "react";

interface PreviewProps {
  code: string | undefined;
}

const iframHTML = `
  <html>
    <head></head>
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
      childIframe.current.contentWindow.postMessage(code, "*");
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
    <iframe
      ref={childIframe}
      sandbox="allow-scripts"
      title="code preview"
      srcDoc={iframHTML}
    />
  );
};

export default Preview;
