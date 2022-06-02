export const stringify = (arg = {}) => {
  if (null != arg && undefined != arg) {
    return JSON.stringify(arg);
  }
  return false;
};
export const parse = (arg = {}) => {
  if (null != arg && undefined != arg) {
    return JSON.parse(arg);
  }
  return false;
};
export const log = console.log.bind(console);
export const dlog = (arg = "", label = null) => {
  if (null != label) {
    console.group(label);
    console.log(`\n\t${arg}`);
    console.groupEnd();
  } else {
    log(`\n\t${arg}\n`);
  }
};
export const tlog = (arg = "", label = "utils.js") => {
  console.group(label);
  console.trace(`${arg}`);
  console.groupEnd();
};
export const table = console.table.bind(console);
export const error = console.error.bind(console);
export const cls = console.clear.bind(console);
export const addHandler = (theElement, whichEvent, method) => {
  if (null != theElement && null != whichEvent && typeof method == "function") {
    theElement.addEventListener(whichEvent, method);
  }
};

export const addClickHandler = (theElement, handler) => {
  if (null != theElement && typeof handler == "function") {
    addHandler(theElement, "click", handler);
  }
};

export const addAttribute = (theElement, whichAttribute, attributeValue) => {
  if (null != theElement) {
    theElement.setAttribute(whichAttribute, attributeValue);
  }
};

export const setAttribute = (theElement, whichAttribute, attributeValue) => {
  if (null != theElement) {
    theElement.setAttribute(whichAttribute, attributeValue);
  }
};

export const getAttribute = (theElement, whichAttribute) => {
  if (null != theElement && null != whichAttribute) {
    return theElement.getAttribute(`${whichAttribute}`) || null;
  }
  return "Element is null";
};

export const removeAttribute = (theElement, whichAttribute) => {
  if (null != theElement) {
    if (theElement.hasAttribute(whichAttribute)) {
      theElement.removeAttribute(whichAttribute);
    }
  }
};

export const getElement = (nameIdClass) => {
  let element = null;
  if (null != (element = document.querySelector(`${nameIdClass}`))) {
    return element;
  }
  if (null != (element = document.querySelector(`#${nameIdClass}`))) {
    return element;
  }
  if (null != (element = document.querySelector(`.${nameIdClass}`))) {
    return element;
  }
  return null;
};

export const getElements = (nameIdClass) => {
  let elements = null;
  if (null != (elements = document.querySelectorAll(`${nameIdClass}`))) {
    return elements;
  }
  if (null != (elements = document.querySelectorAll(`#${nameIdClass}`))) {
    return elements;
  }
  if (null != (elements = document.querySelectorAll(`.${nameIdClass}`))) {
    return elements;
  }
  return null;
};

export const size = (arg = null) => {
  if (null != arg) {
    if (Array.isArray(arg)) {
      return arg.length;
    } else if (arg instanceof Object && !Array.isArray(arg)) {
      return Object.keys(arg).length;
    } else if (
      !(arg instanceof Object) &&
      !Array.isArray(arg) &&
      typeof arg == "string"
    ) {
      return arg.length;
    } else {
      return NaN;
    }
  }
};

export const keys = (obj = {}) => (obj != null ? Object.keys(obj) : null);

export const cap = (arg) => {
  let word_split = null,
    line = "",
    word = arg.toString();
  if (null !== word && undefined !== word) {
    if (
      word.trim().toLowerCase() === "id" ||
      word.trim().toLowerCase() === "ssn" ||
      word.trim().toLowerCase() === "sku" ||
      word.trim().toLowerCase() === "vm" ||
      word.trim().toLowerCase() === "mac" ||
      word.trim().toLowerCase() === "imei" ||
      word.trim().toLowerCase() === "os" ||
      word.trim().toLowerCase() === "atm" ||
      word.trim().toLowerCase() === "pa" ||
      word.trim().toLowerCase() === "rjw"
    ) {
      return word.toUpperCase();
    } else if (word.match(/[-]/)) {
      if (null !== (word_split = word.split(["-"])).length > 0) {
        for (let i = 0; i < word_split.length; i++) {
          if (i < word_split.length - 1) {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1) +
              "-";
          } else {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1);
          }
        }
        return line;
      }
    } else if (word.match(/[ ]/)) {
      if (null !== (word_split = word.split([" "])).length > 0) {
        for (let i = 0; i < word_split.length; i++) {
          if (i < word_split.length - 1) {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1) +
              " ";
          } else {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1);
          }
        }
        return line;
      }
    } else {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    }
  }
};

export const appendChild = (parent, child) => {
  if (null != parent && null != child) {
    parent.appendChild(child);
  }
};

export const appendBeforeLastChild = (parent, child) => {
  if (null != parent && null != child) {
    const lastChildIndex = parent.children.length - 1;
    const lastChild = parent.children[lastChildIndex];
    parent.insertBefore(child, lastChild);
  }
};

export const append = (parent, child) => {
  parent.append(child);
};

export const removeChildren = (parent) => {
  parent.querySelectorAll("*").forEach((dialog) => {
    dialog.remove();
  });
};

export const countChildren = (parent) => {
  if (null != parent) {
    return parent.children.length;
  }
  return null;
};

export const getLastChild = (parent) => {
  if (null != parent) {
    return parent.lastElementChild;
  }
  return null;
};

export const removeChild = (parent, child) => {
  parent.removeChild(child);
};

export const removeById = (elementID) => {
  const element = document.querySelector(`#${elementID}`) || null;
  if (element != null) {
    element.remove();
  }
};

export const getFirstChild = (parent) => {
  if (null != parent) {
    return parent.firstElementChild;
  }
  return null;
};

export const newElement = (type) => {
  if (null != type && typeof type == "string") {
    return document.createElement(type);
  }
  return null;
};

export const generatePhoneInputBlock = (
  placeHolder = "Phone",
  name = "phonex"
) => {
  const col = newElement("div");
  const group = newElement("div");
  const label = newElement("span");
  const icon = newElement("i");
  const deleteIcon = newElement("i");

  addAttribute(col, "class", "col-12 py-3");
  addAttribute(group, "class", "input-group");
  addAttribute(label, "class", "input-group-text");
  addAttribute(icon, "class", "bi bi-phone");
  addAttribute(deleteIcon, "style", "margin-left:5px;margin-top:10px; ");
  addAttribute(deleteIcon, "class", "bi bi-trash");

  appendChild(col, group);
  appendChild(group, label);
  appendChild(label, icon);
  appendChild(group, generatePhoneInput(placeHolder, name));
  appendChild(group, deleteIcon);

  addClickHandler(deleteIcon, () => {
    col.remove();
  });

  return col;
};

export const generateEmailInputBlock = (
  placeHolder = "example@email.net",
  name = "emailx"
) => {
  const col = newElement("div");
  const group = newElement("div");
  const label = newElement("span");
  const icon = newElement("i");
  const deleteIcon = newElement("i");

  addAttribute(col, "class", "col-12 py-3");
  addAttribute(group, "class", "input-group");
  addAttribute(icon, "class", "bi bi-envelope");
  addAttribute(label, "class", "input-group-text");
  addAttribute(deleteIcon, "style", "margin-left:5px;margin-top:10px; ");
  addAttribute(deleteIcon, "class", "bi bi-trash");

  appendChild(col, group);
  appendChild(group, label);
  appendChild(label, icon);
  appendChild(group, generateEmailInput(placeHolder, name));
  appendChild(group, deleteIcon);

  addClickHandler(deleteIcon, () => {
    col.remove();
  });

  return col;
};

export const generatePhoneInput = (placeHolder = "Phone", name = `phonex`) => {
  const textInput = newElement("input");

  addAttribute(textInput, "type", "tel");
  addAttribute(textInput, "name", `${name}`);
  addAttribute(textInput, "class", `form-control`);
  addAttribute(textInput, "placeholder", `${placeHolder}`);
  addAttribute(textInput, "required", "");

  return textInput;
};

export const generateEmailInput = (placeHolder = "Email", name = `emailx`) => {
  const textInput = newElement("input");

  addAttribute(textInput, "type", "email");
  addAttribute(textInput, "name", `${name}`);
  addAttribute(textInput, "class", `form-control`);
  addAttribute(textInput, "placeholder", `${placeHolder}`);
  addAttribute(textInput, "required", "");

  return textInput;
};
