import Control from "ol/control/Control";
import satelliteIcon from "./satelliteIcon.svg";
import LayerGroup from "ol/layer/Group";

export class ToggleSatelliteControl extends Control {
  private _enabled = false;

  constructor(options: { imageryLayer: LayerGroup }) {
    super({
      element: document.createElement("div"),
    });

    const el = this.element;
    el.classList.add("ol-control", "toggle-satellite");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = "Toggle satellite view";
    el.append(btn);

    const img = document.createElement("img");
    img.src = satelliteIcon.src;
    img.alt = "Satellite";
    btn.append(img);

    btn.addEventListener("click", () => {
      const prev = options.imageryLayer.getVisible();
      if (prev) {
        el.classList.remove("active");
      } else {
        el.classList.add("active");
      }
      options.imageryLayer.setVisible(!prev);
    });
  }

  enable() {
    this._enabled = true;
    this.element.classList.add("enabled");
  }

  disable() {
    this._enabled = false;
    this.element.classList.remove("enabled");
  }
}
