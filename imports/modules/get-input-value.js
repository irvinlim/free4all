import ReactDOM from 'react-dom';

export const getInputValue = (component) => {
  let el = ReactDOM.findDOMNode(component);
  if (el.tagName == "input")
    return el.value;
  else
    return el.getElementsByTagName("input")[0].value;
};
