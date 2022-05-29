import * as elements from "./contactsmainelements.js";
import {
  addHandler,
  log,
  tlog,
  getAttribute,
  newElement,
  appendChild,
  addAttribute,
  appendBeforeLastChild,
  addClickHandler,
  countChildren,
  stringify,
  parse,
} from "./utils.js";

window.onload = () => {
  // start();
  log(`\n\tLanded on the contacts view\n`);
};

/* addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
  const rmtUserId = document.querySelector("#rmtuser").value;
  const data = { rmtUser: rmtUserId };
  socket.emit("disconnectme", data);
}); */

addHandler(elements.showPresenceInput, "click", (e) => {
  const target = e.target;
  elements.showPresence.innerHTML = target.checked ? "Hidden" : "Visible";

  socket.emit("changevisibility", {
    userId: socket.id,
    show: target.checked,
  });
});

addHandler(elements.searchInput, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9\@\-]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactEmail, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9\@]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactFname, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9 ]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactLname, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^a-zA-Z\.0-9 ]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.contactPhone, "keyup", (e) => {
  const element = e.target;
  const value = e.target.value;
  const text = value.replace(/[^\-0-9]/gi, "").trim();

  console.log(text);
  element.value = text;
});

addHandler(elements.addEmailButton, "click", () => {
  log(`\n\tAdded email field\n`);
  const editContactForm = elements.editContactForm;

  const divInputGroup = newElement("div");
  const divGroup = newElement("div");
  const spanInputGroupLabel = newElement("span");
  const emailInput = newElement("input");
  const trashIcon = newElement("i");
  const emailIcon = newElement("i");

  // Add attributes
  addAttribute(divGroup, "class", "grid-x");
  addAttribute(divInputGroup, "class", "input-group");
  addAttribute(spanInputGroupLabel, "class", "input-group-label");
  addAttribute(emailInput, "type", "email");
  addAttribute(emailInput, "required", "");
  addAttribute(emailInput, "class", "input-group-field");
  addAttribute(
    emailInput,
    "name",
    `email${editContactForm.children.length + 1}`
  );
  addAttribute(trashIcon, "class", "fa-solid fa-trash");
  addAttribute(emailIcon, "class", "fa-solid fa-envelope");
  addAttribute(trashIcon, "style", "margin-left:5px;margin-top:10px; ");

  // Config elements
  // spanInputGroupLabel.innerHTML = `<i class="fa-solid fa-envelope"></i>`;

  // Append to document
  appendBeforeLastChild(editContactForm, divGroup);
  appendChild(divGroup, divInputGroup);
  appendChild(divInputGroup, spanInputGroupLabel);
  appendChild(divInputGroup, emailInput);
  appendChild(divInputGroup, trashIcon);
  appendChild(spanInputGroupLabel, emailIcon);

  // Handle any events
  addHandler(trashIcon, "click", () => {
    divInputGroup.remove();
  });
});

addHandler(elements.addPhoneButton, "click", () => {
  log(`\n\tAdded phone field\n`);
  const editContactForm = elements.editContactForm;

  const divInputGroup = newElement("div");
  const divGroup = newElement("div");
  const spanInputGroupLabel = newElement("span");
  const phoneInput = newElement("input");
  const trashIcon = newElement("i");
  const phoneIcon = newElement("i");

  // Add attributes
  addAttribute(divGroup, "class", "grid-x");
  addAttribute(divInputGroup, "class", "input-group");
  addAttribute(spanInputGroupLabel, "class", "input-group-label");
  addAttribute(phoneInput, "type", "tel");
  addAttribute(phoneInput, "required", "");
  addAttribute(phoneInput, "class", "input-group-field");
  addAttribute(
    phoneInput,
    "name",
    `phone${editContactForm.children.length + 1}`
  );
  addAttribute(trashIcon, "class", "fa-solid fa-trash");
  addAttribute(phoneIcon, "class", "fa-solid fa-phone");
  addAttribute(trashIcon, "style", "margin-left:5px;margin-top:10px; ");

  // Config elements
  // spanInputGroupLabel.innerHTML = `<i class="fa-solid fa-envelope"></i>`;

  // Append to document
  appendBeforeLastChild(editContactForm, divGroup);
  appendChild(divGroup, divInputGroup);
  appendChild(divInputGroup, spanInputGroupLabel);
  appendChild(divInputGroup, phoneInput);
  appendChild(divInputGroup, trashIcon);
  appendChild(spanInputGroupLabel, phoneIcon);

  // Handle any events
  addHandler(trashIcon, "click", () => {
    divInputGroup.remove();
  });
});

addClickHandler(elements.deleteContactLink, () => {
  const target = elements.deleteContactIcon;
  const uid = target.getAttributeNode("data-uid").value.split("-")[1];
  log(`Delete ${uid}`);

  try {
    const xmlHttp = new XMLHttpRequest();

    xmlHttp.onload = () => {
      const responseText = xmlHttp.responseText;

      if (responseText) {
        log(`\n\tResponse Text: ${stringify(responseText)}\n`);
      }

      location.href = `/contacts`;
    };

    xmlHttp.open("GET", `/contacts/delete/contact/${uid}`, true);

    xmlHttp.send();
  } catch (err) {
    tlog(err);
    return;
  }
});
