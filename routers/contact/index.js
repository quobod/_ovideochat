import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import {
  addNewContact,
  searchContacts,
  viewContact,
  editContact,
  deleteContact,
  getContacts,
  getContactCount,
} from "../../controllers/contacts/index.js";
import { signedIn, reauthorize } from "../../middleware/AuthMiddleware.js";
import { lettersOnly } from "../../custom_modules/index.js";

const contact = Router();

contact.route("/").get(signedIn, getContacts);

contact
  .route("/add")
  .post(
    signedIn,
    [
      body("email").isEmail().withMessage("Must provide a valid email"),
      body("phone").isMobilePhone(),
      body("fname").notEmpty().withMessage("Must provide a first name"),
      body("lname").notEmpty().withMessage("Must provide a last name"),
    ],
    addNewContact
  );

contact.route("/view/contact/:contactId").get(signedIn, viewContact);

contact.route("/edit/contact").post(signedIn, editContact);

contact.route(`/search`).post(signedIn, searchContacts);

contact.route("/delete/contact/:contactId").get(signedIn, deleteContact);

contact.route("/count").get(signedIn, getContactCount);

export default contact;
