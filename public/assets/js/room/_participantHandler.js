import {
  log,
  dlog,
  addAttribute,
  getElement,
  newElement,
  appendChild,
  removeChildren,
  addClickHandler,
  keys,
} from "../utils.js";
import { participantDisconnected, userActivity } from "./wss.js";
import {
  muteMicrophone,
  muteCamera,
  recordVideo,
  disconnect,
} from "./mediacontrols.js";
import {
  rmtIdInput,
  chatTypeInput,
  connected,
  roomNameInput,
} from "./roommain.js";

function printNetworkQualityStats(networkQualityLevel, networkQualityStats) {
  // Print in console the networkQualityLevel using bars
  console.log(
    {
      1: "▃",
      2: "▃▄",
      3: "▃▄▅",
      4: "▃▄▅▆",
      5: "▃▄▅▆▇",
    }[networkQualityLevel] || ""
  );

  if (networkQualityStats) {
    // Print in console the networkQualityStats, which is non-null only if Network Quality
    // verbosity is 2 (moderate) or greater
    console.log("Network Quality statistics:", networkQualityStats);
  }
}

const handleTrackPublication = (trackPublication, participant) => {
  function displayTrack(track) {
    // append this track to the participant's div and render it on the page
    const participantDiv = document.getElementById(participant.identity);
    // track.attach creates an HTMLVideoElement or HTMLAudioElement
    // (depending on the type of track) and adds the video or audio stream
    participantDiv.append(track.attach());
  }

  if (trackPublication.track) {
    displayTrack(trackPublication.track);
  }

  // listen for any new subscriptions to this track publication
  trackPublication.on("subscribed", displayTrack);
};

const handleDisconnection = (participant) => {
  log(`\n\t${participant.identity} disconnected`);
  participantDisconnected({ rmtUser: rmtIdInput.value });
};

const handleNetworkQualityChanged = (
  printNetworkQualityStats,
  networkQualityLevel,
  networkQualityStats
) => {
  // Print in console the networkQualityLevel using bars
  console.log(
    {
      1: "▃",
      2: "▃▄",
      3: "▃▄▅",
      4: "▃▄▅▆",
      5: "▃▄▅▆▇",
    }[networkQualityLevel] || ""
  );

  if (networkQualityStats) {
    // Print in console the networkQualityStats, which is non-null only if Network Quality
    // verbosity is 2 (moderate) or greater
    console.log("Network Quality statistics:", networkQualityStats);
  }
};

export const handleDisconnectedParticipant = (participant) => {
  // stop listening for this participant
  participant.removeAllListeners();

  // remove this participant's div from the page
  const participantDiv = document.getElementById(participant.identity);

  // removeById(participant.id);
  if (participantDiv.parentElement.nextElementSibling) {
    participantDiv.parentElement.nextElementSibling.remove();
  }
  participantDiv.remove();
};

export const handleRemoteParticipants = (participant) => {
  log(`\n\tRemote Participant joined the room:${participant.identity}`);
  const partParent = getElement("part-parent");

  // Select parent element
  const parent = getElement("remote-parts");
  const content = newElement("div");
  const controlsPanel = newElement("div");
  const controls = newElement("div");
  const participantParent = newElement("div");
  const recordIconParent = newElement("div");
  const stopIconParent = newElement("div");
  const recordIcon = newElement("i");
  const stopIcon = newElement("i");

  // create a div for this participant's tracks
  const participantDiv = newElement("div");

  // Add selection attribute
  addAttribute(participantDiv, "id", participant.identity);

  // Add styling attributes
  //   addAttribute(participantParent, "class", "remote-video");

  addAttribute(recordIcon, "class", "bi bi-record col auto");
  addAttribute(recordIcon, "style", "font-size: 2rem; color: cornflowerblue;");

  addAttribute(stopIcon, "class", "bi bi-stop col auto");
  addAttribute(stopIcon, "style", "font-size: 2rem; color: cornflowerblue;");

  //   addAttribute(content, "class", "row");
  addAttribute(controlsPanel, "class", "col auto p-1");
  addAttribute(controlsPanel, "id", "remote-controls-panel");
  addAttribute(controls, "class", "row");
  addAttribute(controls, "id", "remote-media-controls-parent");
  addAttribute(recordIconParent, "class", "col-4 p-1");
  addAttribute(stopIconParent, "class", "col-4 p-1");

  // Prepare parent for single child
  removeChildren(parent);

  // Add element to it's parent
  //   appendChild(parent, content);
  appendChild(parent, participantDiv);
  //   appendChild(content, controlsPanel);
  appendChild(controlsPanel, controls);
  appendChild(controls, recordIconParent);
  appendChild(controls, stopIconParent);
  appendChild(recordIconParent, recordIcon);
  appendChild(stopIconParent, stopIcon);

  // iterate through the participant's published tracks and
  // call `handleTrackPublication` on them
  log(`\n\tHandling Participant: ${participant.identity} tracks`);

  participant.tracks.forEach((trackPublication) => {
    handleTrackPublication(trackPublication, participant);
  });

  // Print the initial Network Quality Level and statistics
  printNetworkQualityStats(
    participant.networkQualityLevel,
    participant.networkQualityStats
  );

  // Print changes to Network Quality Level and statistics
  participant.on("networkQualityLevelChanged", printNetworkQualityStats);

  // listen for any new track publications
  participant.on("trackPublished", (trackPublication) => {
    function displayTrack(track) {
      // append this track to the participant's div and render it on the page
      const participantDiv = document.getElementById(participant.identity);
      // track.attach creates an HTMLVideoElement or HTMLAudioElement
      // (depending on the type of track) and adds the video or audio stream
      participantDiv.append(track.attach());
    }

    if (trackPublication.track) {
      displayTrack(trackPublication.track);
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
  });

  participant.on("disconnected", handleDisconnection);

  participant.on("trackDimensionsChanged", (track) => {
    dlog(`Track dimensions changed\n\t${JSON.stringify(track)}`);
  });

  addClickHandler(participantDiv, (e) => {
    console.log(`\n\t${e} was clicked\n`);
  });

  addClickHandler(recordIcon, (e) => {
    const recordingEnabled = recordVideo();

    if (recordingEnabled) {
      recordIcon.classList.remove("bi-record");
      recordIcon.classList.add("bi-pause");
      stopIcon.classList.remove("invisible");
    } else {
      recordIcon.classList.remove("bi-pause");
      recordIcon.classList.add("bi-record");
      stopIcon.classList.add("invisible");
    }
  });

  addClickHandler(stopIcon, (e) => {
    if (recordIcon.classList.contains("bi-pause")) {
      recordIcon.classList.remove("bi-pause");
      recordIcon.classList.add("bi-record");
      stopIcon.classList.add("invisible");
    }
  });

  stopIcon.classList.add("invisible");
};

export const handleLocalParticipant = (participant) => {
  log(`\n\tLocal Participant joined the room:${participant.identity}`);
  const partParent = getElement("part-parent");

  // select the parent element
  const parent = getElement("local-part");
  const content = newElement("div");
  const controlsPanel = newElement("div");
  const controls = newElement("div");
  const participantParent = newElement("div");
  const videoIcon = newElement("i");
  const microphoneIcon = newElement("i");
  const recordIcon = newElement("i");
  const stopIcon = newElement("i");
  const disconnectIcon = newElement("i");

  // create a div for this participant's tracks
  const participantDiv = newElement("div");

  // Add selection attribute
  addAttribute(participantDiv, "id", participant.identity);

  // Add styling attributes
  addAttribute(videoIcon, "class", "bi bi-camera-video col auto");
  addAttribute(videoIcon, "style", "font-size: 2rem; color: cornflowerblue;");
  addAttribute(videoIcon, "id", "local-video-camera");

  addAttribute(microphoneIcon, "class", "bi bi-mic col auto");
  addAttribute(microphoneIcon, "id", "local-microphone");
  addAttribute(
    microphoneIcon,
    "style",
    "font-size: 2rem; color: cornflowerblue;"
  );

  addAttribute(recordIcon, "class", "bi bi-record col auto");
  addAttribute(recordIcon, "style", "font-size: 2rem; color: cornflowerblue;");

  addAttribute(stopIcon, "class", "bi bi-stop");
  addAttribute(stopIcon, "style", "font-size: 2rem; color: cornflowerblue;");

  addAttribute(disconnectIcon, "class", "bi bi-x-square col auto");
  addAttribute(
    disconnectIcon,
    "style",
    "font-size: 2rem; color: cornflowerblue;"
  );

  //   addAttribute(content, "class", "row");
  addAttribute(controlsPanel, "class", "col auto");
  addAttribute(controlsPanel, "id", "local-controls-panel");
  //   addAttribute(participantDiv, "class", "local-video col-sm-12 col-md-6");
  addAttribute(controls, "class", "row");
  addAttribute(controls, "id", "local-media-controls-parent");

  // Prepare parent for single child
  removeChildren(parent);

  // Add element to it's parent
  // appendChild(parent, participantParent);
  //   appendChild(participantParent, participantDiv);
  appendChild(parent, participantDiv);
  //   appendChild(content, participantParent);
  //   appendChild(content, controlsPanel);
  appendChild(controlsPanel, controls);
  appendChild(controls, disconnectIcon);

  if (chatTypeInput.value.toLowerCase().trim() == "video_chat") {
    appendChild(controls, videoIcon);
    appendChild(controls, microphoneIcon);
    appendChild(controls, recordIcon);
    appendChild(controls, stopIcon);
  } else {
    appendChild(controls, microphoneIcon);
  }

  // iterate through the participant's published tracks and
  // call `handleTrackPublication` on them
  participant.tracks.forEach((trackPublication) => {
    handleTrackPublication(trackPublication, participant);
    trackPublication.on("unsubscribed", () => {
      log(`\n\tUser ${rmtIdInput.value} unsubscribed`);
    });
  });

  // Print the initial Network Quality Level and statistics
  printNetworkQualityStats(
    participant.networkQualityLevel,
    participant.networkQualityStats
  );

  // Print changes to Network Quality Level and statistics
  participant.on("networkQualityLevelChanged", handleNetworkQualityChanged);

  // listen for any new track publications
  participant.on("trackPublished", (trackPublication) => {
    // log(`\n\tLocal participant published a track or more`);
    function displayTrack(track) {
      // append this track to the participant's div and render it on the page
      const participantDiv = document.getElementById(participant.identity);
      // track.attach creates an HTMLVideoElement or HTMLAudioElement
      // (depending on the type of track) and adds the video or audio stream
      participantDiv.append(track.attach());
    }

    if (trackPublication.track) {
      displayTrack(trackPublication.track);

      /*  TODO:
            Check if participant ID is already added to the mediaTracks array
      */
      const objData = {
        "track publication": {
          kind: trackPublication.track.kind,
          id: trackPublication.track.id,
          sid: trackPublication.track.sid,
          trackPublicationName: trackPublication.trackName,
          trackPublicationID: trackPublication.trackSid,
        },
        rmtUserId: rmtIdInput.value,
        participantSid: participant.sid,
        participantIdentity: participant.identity,
        activityType: `Track Published`,
      };

      userActivity(objData);
    }

    // listen for any new subscriptions to this track publication
    trackPublication.on("subscribed", displayTrack);
  });

  participant.on("trackDisabled", (track) => {
    const objData = {
      activityType: `Track Disabled`,
      trackKind: track.kind,
      trackId: track.id,
      rmtUserId: rmtIdInput.value,
      participantSid: participant.sid,
      participantIdentity: participant.identity,
    };
    userActivity(objData);
  });

  participant.on("trackEnabled", (track) => {
    const objData = {
      activityType: `Track Enabled`,
      trackKind: track.kind,
      trackId: track.id,
      rmtUserId: rmtIdInput.value,
      participantSid: participant.sid,
      participantIdentity: participant.identity,
    };

    userActivity(objData);
  });

  participant.on("trackStarted", (track) => {
    const objData = {
      activityType: `Track Started`,
      trackKind: track.kind,
      trackId: track.id,
      rmtUserId: rmtIdInput.value,
      participantSid: participant.sid,
      participantIdentity: participant.identity,
    };
    userActivity(objData);
  });

  participant.on("disconnected", handleDisconnection);

  addClickHandler(participantDiv, (e) => {
    const target = e.target;
    console.log(`\n\t${target.id || target} was clicked\n`);
  });

  addClickHandler(microphoneIcon, (e) => {
    const muted = muteMicrophone(connected, true);
    const microphoneElement = getElement("local-microphone");

    if (muted) {
      microphoneElement.classList.remove("bi-mic");
      microphoneElement.classList.add("bi-mic-mute");
    } else {
      microphoneElement.classList.remove("bi-mic-mute");
      microphoneElement.classList.add("bi-mic");
    }
  });

  addClickHandler(disconnectIcon, (e) => {
    disconnect(connected);
    location.href = "/user/room";
  });

  addClickHandler(videoIcon, (e) => {
    const muted = muteCamera(connected, true);
    const videoElement = getElement("local-video-camera");

    if (muted) {
      log(videoElement.id);
      videoElement.classList.remove("bi-camera-video");
      videoElement.classList.add("bi-camera-video-off");
    } else {
      log(videoElement.id);
      videoElement.classList.remove("bi-camera-video-off");
      videoElement.classList.add("bi-camera-video");
    }
  });

  addClickHandler(recordIcon, (e) => {
    const recordingEnabled = recordVideo();

    if (recordingEnabled) {
      recordIcon.classList.remove("bi-record");
      recordIcon.classList.add("bi-pause");
      stopIcon.classList.remove("invisible");
    } else {
      recordIcon.classList.remove("bi-pause");
      recordIcon.classList.add("bi-record");
      stopIcon.classList.add("invisible");
    }
  });

  addClickHandler(stopIcon, (e) => {
    if (recordIcon.classList.contains("bi-pause")) {
      recordIcon.classList.remove("bi-pause");
      recordIcon.classList.add("bi-record");
      stopIcon.classList.add("invisible");
    }
  });

  stopIcon.classList.add("invisible");
  document.title = roomNameInput.value;
};
