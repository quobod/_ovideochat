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
  blockUser,
  unblockUser,
  getBlockedList,
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

user.route("/block/:userId").post(blockUser);

user.route("/unblock/:userId").post(unblockUser);

user.route("/get/blockedlist/:blocker").get(signedIn, getBlockedList);

export default user;
