import ReactDOM from 'react-dom';

const inputVal = (el) => el.value;
const selectVal = (el) => el.options[el.selectedIndex].value;

export const getInputValue = (component) => {
  let el = ReactDOM.findDOMNode(component);
  if (el.tagName.toLowerCase() == "input")
    return inputVal(el);
  else if (el.tagName.toLowerCase() == "select")
    return selectVal(el);
  else {
    if (el.getElementsByTagName("input").length)
      return inputVal(el.getElementsByTagName("input")[0]);
    else if (el.getElementsByTagName("select").length)
      return inputVal(el.getElementsByTagName("select")[0]);
  }
};
