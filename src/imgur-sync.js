import ImgurSyncConfig from "./view/application.js";
import "../styles/main.scss";

import uploadImages from "./upload.js";

Hooks.once('ready', () => new ImgurSyncConfig().render(true, { focus: true }));

Hooks.on("init", () => game.modules.get("imgur-sync").api = {
    run: uploadImages
});

Hooks.on("renderSettings", (/** @type {Settings} */ app, /** @type {JQuery} */html) => {
    const button = document.createElement("button");
    button.innerHTML = `<i class="fas fa-photo-video"></i> Imgur Upload`;
    button.addEventListener("click", () => new ImgurSyncConfig().render(true, { focus: true }));
    html[0].querySelector("#settings-game").append(button);
    app.setPosition();
});
