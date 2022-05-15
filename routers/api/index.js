import { Router } from "express";
import { signedIn } from "../../middleware/AuthMiddleware.js";
import {
  createRoomToken,
  retrievAccessToken,
} from "../../controllers/api/index.js";

const api = Router();

api.route("/room/create").post(createRoomToken);

api.route("/room/token").get(retrievAccessToken);

export default api;
