import * as elements from "./singlecontactelements.js";
import {
  addHandler,
  log,
  getAttribute,
  newElement,
  appendChild,
  addAttribute,
  appendBeforeLastChild,
  addClickHandler,
} from "./utils.js";

addHandler(elements.addEmailButton, "click", () => {
  log(`\n\tAdded phone field\n`);
  const editContactForm = elements.editContactForm;

  const divInputGroup = newElement("div");
  const formGroupLabelSpan = newElement("span");
  const formGroupLabelIcon = newElement("i");
  const emailInput = newElement("input");
  const trashIcon = newElement("i");

  // Add attributes
  addAttribute(divInputGroup, "class", "input-group py-1");
  addAttribute(formGroupLabelSpan, "class", "input-group-label");
  addAttribute(formGroupLabelSpan, "style", "margin-right:5px;");
  addAttribute(formGroupLabelIcon, "class", "bi bi-envelope fw-bolder");
  addAttribute(formGroupLabelIcon, "style", "font-size:2rem;");
  addAttribute(emailInput, "type", "email");
  addAttribute(emailInput, "required", "");
  addAttribute(emailInput, "class", "form-control");
  addAttribute(
    emailInput,
    "name",
    `email${editContactForm.children.length + 1}`
  );
  addAttribute(trashIcon, "class", "bi bi-trash fw-bolder");
  addAttribute(trashIcon, "style", "font-size:2rem;");
  // addAttribute(trashIcon, "style", "margin-left:5px;margin-top:10px; ");

  // Append to document
  appendBeforeLastChild(editContactForm, divInputGroup);
  appendChild(divInputGroup, formGroupLabelSpan);
  appendChild(divInputGroup, emailInput);
  appendChild(divInputGroup, trashIcon);
  appendChild(formGroupLabelSpan, formGroupLabelIcon);

  // Handle any events
  addHandler(trashIcon, "click", () => {
    divInputGroup.remove();
  });
});

addHandler(elements.addPhoneButton, "click", () => {
  log(`\n\tAdded phone field\n`);
  const editContactForm = elements.editContactForm;

  const divInputGroup = newElement("div");
  const formGroupLabelSpan = newElement("span");
  const formGroupLabelIcon = newElement("i");
  const phoneInput = newElement("input");
  const trashIcon = newElement("i");

  // Add attributes
  addAttribute(divInputGroup, "class", "input-group py-1");
  addAttribute(formGroupLabelSpan, "class", "input-group-label");
  addAttribute(formGroupLabelSpan, "style", "margin-right:5px;");
  addAttribute(formGroupLabelIcon, "class", "bi bi-phone fw-bolder");
  addAttribute(formGroupLabelIcon, "style", "font-size:2rem;");
  addAttribute(phoneInput, "type", "tel");
  addAttribute(phoneInput, "required", "");
  addAttribute(phoneInput, "class", "form-control");
  addAttribute(
    phoneInput,
    "name",
    `phone${editContactForm.children.length + 1}`
  );
  addAttribute(trashIcon, "class", "bi bi-trash");
  addAttribute(trashIcon, "style", "font-size:2rem;");

  // Append to document
  appendBeforeLastChild(editContactForm, divInputGroup);
  appendChild(divInputGroup, formGroupLabelSpan);
  appendChild(divInputGroup, phoneInput);
  appendChild(divInputGroup, trashIcon);
  appendChild(formGroupLabelSpan, formGroupLabelIcon);

  // Handle any events
  addHandler(trashIcon, "click", () => {
    divInputGroup.remove();
  });
});

addClickHandler(document.querySelector("#delete-this-document"), () => {
  log("deleted!");
});
