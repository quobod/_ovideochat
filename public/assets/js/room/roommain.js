import {
  log,
  cap,
  dlog,
  tlog,
  cls,
  addHandler,
  getAttribute,
  stringify,
} from "../utils.js";
import { updateSocketUser, registerSocketEvents, hideMe } from "./wss.js";
import * as elements from "./roomelements.js";
import {
  handleLocalParticipant,
  handleRemoteParticipants,
  handleDisconnectedParticipant,
} from "./_participantHandler.js";

// init socket connection
const socket = io("/");

const start = () => {
  dlog(`\n\t\tLanded on the room view\n`);
  registerSocketEvents(socket);
};

start();

addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
  const rmtUserId = elements.rmtIdInput.value;
  const data = { rmtUser: rmtUserId };
  // socket.emit("disconnectme", data);
});

// Elements
export const roomNameInput = document.querySelector("#room-name-input");
export const rmtIdInput = document.querySelector("#rmtid-input");
export const chatTypeInput = document.querySelector("#chat-type-input");
export let connected,
  mediaTracks = [];
const joinRoomInput = document.querySelector("#join-room-input");
const localVideo = document.querySelector("#local-part");
const remoteVideo = document.querySelector("#remote-parts");
const roomName = roomNameInput.value;
const token = joinRoomInput.value;
const chatType = chatTypeInput.value;

/* const joinVideoRoom = async (roomName, token) => {
  // join the video room with the Access Token and the given room name
  const room = await Twilio.Video.connect(token, {
    room: roomName,
    audio: true,
    video: { width: 640 },
  });
  return room;
}; */

/* const joinVideoRoom = async (roomName, token, connectionType) => {
  // join the video room with the Access Token and the given room name
  let room;

  if (connectionType.toLowerCase().trim() == "video_chat") {
    room = await Twilio.Video.connect(token, {
      room: roomName,
      audio: true,
      video: { width: 640 },
    });
  } else {
    room = await Twilio.Video.connect(token, {
      room: roomName,
      audio: true,
      video: false,
    });
  }
  return room;
}; */

const joinVideoRoom = async (roomName, token, connectionType) => {
  // join the video room with the Access Token and the given room name
  let room;

  if (connectionType.toLowerCase().trim() == "video_chat") {
    room = await Twilio.Video.connect(token, {
      room: roomName,
      audio: { name: "microphone" },
      video: { name: "camera" },
      networkQuality: {
        local: 3, // LocalParticipant's Network Quality verbosity [1 - 3]
        remote: 3, // RemoteParticipants' Network Quality verbosity [0 - 3]
      },
    });
  } else {
    room = await Twilio.Video.connect(token, {
      room: roomName,
      audio: { name: "microphone" },
      video: false,
      networkQuality: {
        local: 3, // LocalParticipant's Network Quality verbosity [1 - 3]
        remote: 3, // RemoteParticipants' Network Quality verbosity [0 - 3]
      },
    });
  }
  return room;
};

const startRoom = () => {
  if (roomNameInput && joinRoomInput) {
    // log(twl);
    dlog(`\n\tWelcome to the video room\n`);
    dlog(`\n\tJoining room ${cap(roomName)} with token\n`);
    dlog(`\n\tChat type is ${chatType}`);

    joinVideoRoom(roomName, token, chatType)
      .then((room) => {
        room.localParticipant.setNetworkQualityConfiguration({
          local: 3,
          remote: 3,
        });
        connected = room;
        handleLocalParticipant(room.localParticipant);
        room.participants.forEach(handleRemoteParticipants);
        room.on("participantConnected", handleRemoteParticipants);
        room.on("participantDisconnected", handleDisconnectedParticipant);
        window.addEventListener("pagehide", () => room.disconnect());
        window.addEventListener("beforeunload", () => room.disconnect());

        dlog(`\n\tRMT User ID: ${rmtIdInput.value}`);

        updateSocketUser({
          rmtId: rmtIdInput.value,
          participantIdentity: room.localParticipant.identity,
          type: "local",
        });
      })
      .catch((err) => {
        tlog(err);
        return;
      });
  }
};

startRoom();
