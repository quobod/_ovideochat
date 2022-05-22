import * as elements from "./dashboardelements.js";
import {
  addHandler,
  log,
  getAttribute,
  newElement,
  appendChild,
  addAttribute,
  appendBeforeLastChild,
  addClickHandler,
} from "./utils.js";
import { registerSocketEvents } from "./room/wss.js";

const socket = io("/");

window.onload = () => {
  // start();
  log(`\n\tLanded on the dashboard view\n`);
  registerSocketEvents(socket);
};

addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
});
