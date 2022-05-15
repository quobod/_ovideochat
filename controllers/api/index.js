import asyncHandler from "express-async-handler";
import bunyan from "bunyan";
import { body, check, validationResult } from "express-validator";
import twilio from "twilio";
import { customAlphabet } from "nanoid";
import { createCipheriv } from "crypto";
import { cap, stringify, dlog, log } from "../../custom_modules/index.js";
const logger = bunyan.createLogger({ name: "User Controller" });
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 13);
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const findOrCreateRoom = async (roomName) => {
  let twilioClient;

  try {
    twilioClient = twilio(process.env.API_KEY, process.env.APP_SECRET, {
      accountSid: process.env.ACCT_SID,
    });
    // see if the room exists already. If it doesn't, this will throw
    // error 20404.
    await twilioClient.video.rooms(roomName).fetch();
  } catch (error) {
    // the room was not found, so create it
    if (error.code == 20404) {
      await twilioClient.video.rooms.create({
        uniqueName: roomName,
        type: "go",
      });
    } else {
      // let other errors bubble up
      throw error;
    }
  }
};

const getAccessToken = (roomName) => {
  // create an access token
  const token = new AccessToken(
    process.env.ACCT_SID,
    process.env.API_KEY,
    process.env.APP_SECRET,
    // generate a random unique identity for this participant
    { identity: nanoid() }
  );
  // create a video grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // add the video grant
  token.addGrant(videoGrant);
  // serialize the token and return it
  return token.toJwt();
};

//  @desc           Create room and token
//  @route          POST /api/room/create
//  @access         Private
export const createRoomToken = asyncHandler(async (req, res) => {
  logger.info(`POST: /user/room/create`);

  const { chatType, roomName } = req.body;

  dlog(
    `Creating room token\n\t\tChat Type: ${chatType} Room Name: ${roomName}`
  );

  try {
    // find or create a room with the given roomName
    findOrCreateRoom(roomName);

    // generate an Access Token for a participant in this room
    const token = getAccessToken(roomName);

    if (token) {
      dlog(`Created Token`);
      return res.json({ token: token, status: true, chatType: chatType });
    } else {
      dlog(`Token Failure`);
      return res.json({ status: false, cause: `Failed to create token` });
    }
  } catch (err) {
    dlog(err);
    return res.json({
      status: false,
      cause: `Error creating or finding room`,
      detail: `user controller.createRoom method.`,
    });
  }
});

//  @desc           Get Room Token
//  @route          POST /api/room/token
//  @access         Private
export const retrievAccessToken = asyncHandler(async (req, res) => {
  logger.info(`GET: /user/room/join`);
  try {
    const { roomName, chatType } = req.query;

    dlog(`Getting token for room: ${stringify(req.query)}`);

    const accessToken = getAccessToken(roomName);

    if (accessToken) {
      dlog(`Got room token:\t${accessToken}`);
      let videoChat;

      switch (chatType.toLowerCase().trim()) {
        case "video_chat":
          videoChat = true;
          break;

        default:
          videoChat = false;
      }

      return res.json({
        status: true,
        accessToken,
        videoChat,
      });
    }
  } catch (err) {
    return res({
      status: false,
      detail: `controller.chat.getAccessToken`,
      error: err,
    });
  }
});
