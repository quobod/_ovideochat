import {
  appendChild,
  newElement,
  addHandler,
  addAttribute,
  removeAttribute,
} from "./utils.js";

// Contacts View Elements

// Search contacts input field
export const searchInput = document.querySelector("#search-input");

// New contact form
export const contactFname = document.querySelector("#contact-fname");
export const contactLname = document.querySelector("#contact-lname");
export const contactEmail = document.querySelector("#contact-email");
export const contactPhone = document.querySelector("#contact-phone");
export const newContactFormContainer = document.querySelector(
  "#new-contact-form-container"
);
export const addPhoneFormButton = document.querySelector(
  "#add-phone-form-button"
);
export const addEmailFormButton = document.querySelector(
  "#add-email-form-button"
);

export const deleteContactLink = document.querySelector(
  "#delete-this-contact-anchor"
);
export const deleteContactIcon = document.querySelector(
  "#delete-this-contact-icon"
);

// Messages
export const closeButton = document.querySelector(".close-button");

// Partials
export const newContactForm = document.querySelector("#new-contact-form");
export const searchForm = document.querySelector("#search-form");

// Dialog
export const addNewContactLink = document.querySelector(
  "#add-new-contact-link"
);

// RMT User ID
export const rmtUserId = document.querySelector("#rmtid-input");

// Personal Code
export const personalCode = document.querySelector("#personal-code");
