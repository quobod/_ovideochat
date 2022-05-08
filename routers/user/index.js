import { Router } from "express";
import { body, check, validationResult } from "express-validator";
import {
  userDashboard,
  viewUserProfile,
  userReauth,
  updateUserProfile,
  userRoom,
  createRoomToken,
  joinAsPeer,
} from "../../controllers/user/index.js";
import { signedIn, reauthorize } from "../../middleware/AuthMiddleware.js";
import { lettersOnly } from "../../custom_modules/index.js";

const user = Router();

user.route("/").get(signedIn, userDashboard);

user.route("/profile").get(reauthorize, viewUserProfile).post(userReauth);

user.route("/profile/update").post(signedIn, updateUserProfile);

user.route("/room").get(signedIn, userRoom);

user.route("/room/create").post(signedIn, createRoomToken);

user.route("/room/join").get(signedIn, joinAsPeer);

export default user;
