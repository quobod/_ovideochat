import * as store from "./store.js";
import * as elements from "./roomelements.js";
import * as connectedpeerselements from "./connectedpeersscriptelements.js";
import * as ui from "./ui.js";
import {
  cls,
  log,
  dlog,
  tlog,
  stringify,
  parse,
  removeChildren,
  getElement,
  appendChild,
} from "../utils.js";

let socketIO = null,
  userDetails = {};

export const registerSocketEvents = (socket) => {
  socketIO = socket;

  socket.on("connect", () => {
    if (document.querySelector("#personal-code")) {
      document.querySelector("#personal-code").value = socket.id;
    }
    // ui.updatePersonalCode(socket.id);

    dlog(
      `\n\tSuccessfully connected to socket.io server\n`,
      "wss.js\n\tregisterSocketEvents method\n\tsocket connect emitter",
      `registerSocketEvents socket.on("connect")`
    );
  });

  socket.on("updateuserlist", (data) => {
    // console.log(`\n\tUpdated User List: ${JSON.stringify(data)}\n\n`);
    ui.updateUserList(data);
  });

  socket.on("chatrequest", (data) => {
    dlog(
      `\n\tReceived chat request. Request Data ${stringify(data)}\n`,
      `registerSocketEvents socket.on("updateuserlist")`
    );

    userDetails = {
      senderSocketId: data.sender.socketId,
      receiverSocketId: socketIO.id,
      type: data.requestType,
    };

    dlog(
      `\n\tUser Details: ${stringify(userDetails)}\n`,
      `registerSocketEvents`
    );

    const callout = ui.createChatRequestCallout(
      data,
      handleChatAccept,
      handleChatReject,
      handleChatRequestNoResponse
    );

    removeChildren(getElement("callout-parent"));
    appendChild(getElement("callout-parent"), callout);
  });

  socket.on("chatrequested", (data) => {
    dlog(
      `\n\tRequested chat ${stringify(data)}`,
      `registerSocketEvents socket.on("chatrequested")`
    );

    userDetails = {
      receiverSocketId: data.receiver.socketId,
      senderSocketId: socketIO.id,
      type: data.requestType,
    };

    dlog(
      `\n\tUser Details: ${stringify(userDetails)}\n`,
      `registerSocketEvents socket.on("chatrequested")`
    );

    const callout = ui.chatRequestStatus(data);
    removeChildren(getElement("callout-parent"));
    appendChild(getElement("callout-parent"), callout);
  });

  socket.on("chatrejected", (data) => {
    const { response, receiver } = data;
    handleResponse(data);
  });

  socket.on("noresponse", (data) => {
    const { response, receiver } = data;
    handleResponse(data);
  });

  socket.on("chatrequestaccepted", (data) => {
    dlog(
      `\n\tchatrequestaccepted method data: ${stringify(data)}`,
      `registerSocketEvents socket.on("chatrequestaccepted")`
    );
    const { senderSocketId, receiverSocketId, type, sender, roomName } = data;
    let xmlHttp, token, chatType;

    if (sender) {
      try {
        xmlHttp = new XMLHttpRequest();

        xmlHttp.open("POST", "/user/room/create");

        xmlHttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );

        xmlHttp.onload = () => {
          const responseText = xmlHttp.responseText;

          if (responseText) {
            log(`\n\tResponse Text: ${stringify(responseText)}\n`);
            const responseJson = parse(responseText);
            token = responseJson.token;

            location.href = `/user/room/join?roomName=${roomName}&chatType=${type}`;
          }
        };

        xmlHttp.send(`chatType=${type}&roomName=${roomName}`);
      } catch (err) {
        tlog(err);
        return;
      }
    } else {
      xmlHttp = new XMLHttpRequest();

      xmlHttp.onload = () => {
        location.href = `/user/room/join?roomName=${roomName}&chatType=${type}`;
      };

      xmlHttp.open(
        "GET",
        `/user/room/join?roomName=${roomName}&chatType=${type}`
      );

      xmlHttp.send();
    }
  });

  socket.on("showloggedinusers", (data) => {
    showLoggedInUsers(data);
  });

  requestRegistration(socket);
};

export const hideMe = (data = null) => {
  dlog(
    `hideMe method invoked`,
    "wss.js\n\thideMe method",
    `wss.js hideMe method`
  );
  if (data) {
    socketIO.emit("changevisibility", data);
  }
};

export const updateSocketUser = (data = null) => {
  if (null != data) {
    dlog(
      `Updating user store`,
      "wss.js\n\tupdateSocketUser method",
      `wss.js updateSocketUser method`
    );
    socketIO.emit("participant", data);
  }
};

export const userActivity = (data = null) => {
  if (null != data) {
    dlog(
      `User activity detected`,
      "wss.js\n\tuserActivity method",
      `wss.js userActivity method`
    );
    socketIO.emit("useractivity", data);
  }
};

export const participantDisconnected = (data = null) => {
  if (null != data) {
    dlog(
      `Participtant disconnected : ${stringify(data)}`,
      "wss.js\tparticipantDisconnected method"
    );
    socketIO.emit("participantdisconnected", data);
  }
};

export const requestChat = (data) => {
  dlog(`Chat Request\n\t\t${stringify(data)}`, `wss.js requestChat method`);
  socketIO.emit("sendchatrequest", data);
};

function showLoggedInUsers(data) {
  const { users, userCount } = data;
  let userStatus;

  switch (userCount) {
    case 1:
      userStatus = `user connected`;
      break;

    default:
      userStatus = `users connected`;
      break;
  }

  dlog(`${userCount} ${userStatus}`);
}

function requestRegistration(socket) {
  if (elements.rmtIdInput) {
    setTimeout(() => {
      const data = {
        socketId: socket.id,
        rmtId: elements.rmtIdInput.value,
        hasCamera: false,
      };
      const mediaDevices = navigator.mediaDevices || null;
      // log(mediaDevices);
      if (mediaDevices != null) {
        data.hasCamera = true;
      }

      socketIO.emit("registerme", data);
    }, 700);
  }
}

const handleChatAccept = () => {
  userDetails.response = "accept";
  socketIO.emit("chataccepted", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleChatReject = () => {
  userDetails.response = "reject";
  socketIO.emit("chatrejected", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleChatRequestNoResponse = () => {
  userDetails.response = "noresponse";
  socketIO.emit("chatrequestnoresponse", userDetails);
  removeChildren(getElement("callout-parent"));
};

const handleResponse = (data) => {
  const callout = ui.handleChatRequestResponse(data);
  removeChildren(getElement("callout-parent"));
  appendChild(getElement("callout-parent"), callout);
};
