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

  // Select parent element
  const parent = getElement("remote-parts");
  const content = newElement("div");
  const controlsPanel = newElement("div");
  const controls = newElement("div");
  const participantParent = newElement("div");
  const recordIcon = newElement("i");
  const stopIcon = newElement("i");

  // create a div for this participant's tracks
  const participantDiv = newElement("div");

  // Add selection attribute
  addAttribute(participantDiv, "id", participant.identity);

  // Add styling attributes
  addAttribute(participantParent, "class", "remote-video cell small-12");
  addAttribute(recordIcon, "class", "fa-solid fa-circle fa-2x");
  addAttribute(stopIcon, "class", "fa-solid fa-stop fa-2x");
  addAttribute(content, "class", "grid-x");
  addAttribute(controlsPanel, "class", "cell small-12");
  addAttribute(controlsPanel, "id", "remote-controls-panel");
  addAttribute(controls, "id", "remote-media-controls-parent");

  // Prepare parent for single child
  removeChildren(parent);

  // Add element to it's parent
  // appendChild(parent, participantDiv);
  // appendChild(parent, participantParent);
  appendChild(participantParent, participantDiv);
  appendChild(parent, content);
  appendChild(content, participantParent);
  appendChild(content, controlsPanel);
  appendChild(controlsPanel, controls);
  appendChild(controls, recordIcon);
  appendChild(controls, stopIcon);

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
      recordIcon.classList.remove("fa-circle");
      recordIcon.classList.add("fa-pause");
      stopIcon.classList.remove("hide");
    } else {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  addClickHandler(stopIcon, (e) => {
    if (recordIcon.classList.contains("fa-pause")) {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  stopIcon.classList.add("hide");
};

export const handleLocalParticipant = (participant) => {
  log(`\n\tLocal Participant joined the room:${participant.identity}`);

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
  addAttribute(videoIcon, "class", "fa-solid fa-video fa-2x");
  addAttribute(videoIcon, "id", "local-video-camera");
  addAttribute(microphoneIcon, "class", "fa-solid fa-microphone fa-2x");
  addAttribute(microphoneIcon, "id", "local-microphone");
  addAttribute(recordIcon, "class", "fa-solid fa-circle fa-2x");
  addAttribute(stopIcon, "class", "fa-solid fa-stop fa-2x");
  addAttribute(disconnectIcon, "class", "fa-solid fa-square-xmark fa-2x");
  addAttribute(content, "class", "grid-x");
  addAttribute(controlsPanel, "class", "cell small-12");
  addAttribute(controlsPanel, "id", "local-controls-panel");
  addAttribute(participantDiv, "class", "local-video cell small-12");
  addAttribute(controls, "id", "local-media-controls-parent");

  // Prepare parent for single child
  removeChildren(parent);

  // Add element to it's parent
  // appendChild(parent, participantParent);
  appendChild(participantParent, participantDiv);
  appendChild(parent, content);
  appendChild(content, participantParent);
  appendChild(content, controlsPanel);
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
      microphoneElement.classList.remove("fa-microphone");
      microphoneElement.classList.add("fa-microphone-slash");
    } else {
      microphoneElement.classList.remove("fa-microphone-slash");
      microphoneElement.classList.add("fa-microphone");
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
      videoElement.classList.remove("fa-video");
      videoElement.classList.add("fa-video-slash");
    } else {
      log(videoElement.id);
      videoElement.classList.remove("fa-video-slash");
      videoElement.classList.add("fa-video");
    }
  });

  addClickHandler(recordIcon, (e) => {
    const recordingEnabled = recordVideo();

    if (recordingEnabled) {
      recordIcon.classList.remove("fa-circle");
      recordIcon.classList.add("fa-pause");
      stopIcon.classList.remove("hide");
    } else {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  addClickHandler(stopIcon, (e) => {
    if (recordIcon.classList.contains("fa-pause")) {
      recordIcon.classList.remove("fa-pause");
      recordIcon.classList.add("fa-circle");
      stopIcon.classList.add("hide");
    }
  });

  stopIcon.classList.add("hide");
  document.title = roomNameInput.value;
};
