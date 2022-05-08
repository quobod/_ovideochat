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

window.onload = () => {
  // start();
  log(`\n\tLanded on the dashboard view\n`);
};

addEventListener("beforeunload", (event) => {
  log(`\n\tBefore unload\n`);
});

if (elements.closeButton) {
  addHandler(elements.closeButton, "click", (e) => {
    const target = e.target;
    const parent = target.parentElement;
    const grandParent = parent.parentElement;
    grandParent.remove();
  });
}
