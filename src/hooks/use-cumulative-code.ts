import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  //combine codes from previous cells and send it for bundle process
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFn = `
    import _React from 'react'
    import _ReactDOM from 'react-dom'
    var show = (value) => {
      const rootSelector = document.querySelector("#root");
      if(typeof value === 'object'){
        if(value.$$typeof && value.props){
          _ReactDOM.render(value,rootSelector)
        }else{
          rootSelector.innerHTML = JSON.stringify(value);
        }
      }else{
        rootSelector.innerHTML = value;
      }
    } 
    `;
    const showFnNoOp = "var show = () => {}";
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFn);
        } else {
          cumulativeCode.push(showFnNoOp);
        }
        cumulativeCode.push(c.content);
      }
      if (c.id === cellId) break;
    }
    return cumulativeCode;
  }).join("\n");
};
