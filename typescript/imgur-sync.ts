// @ts-expect-error
import BasicApplication from './view/application.js';
import "../styles/main.scss";

import uploadImages from "./upload.js";

Hooks.once('ready', () => new BasicApplication().render(true, { focus: true }));

// @ts-expect-error
Hooks.on("init", () => game.modules.get("imgur-sync").api = {
    run: uploadImages
});
Hooks.on("renderSettings", (app: Settings, html: JQuery) => {
    const button = document.createElement("button");
    button.innerHTML = `<i class="fas fa-photo-video"></i> Imgur Upload`;
    button.addEventListener("click", () => uploadImages(false));
    html[0].querySelector("#settings-game")!.append(button);
    app.setPosition();
});
