import findAssets from "./replace.js";
import replace from "./replace.js";

/* FIXME Do when button pressed instead */
// @ts-expect-error
Hooks.on("init", () => game.modules.get("imgur-sync").api = {
    run: findAssets
});
Hooks.on("renderSettings", (app: Settings, html: JQuery) => {
    const button = document.createElement("button");
    button.innerHTML = `<i class="fas fa-photo-video"></i> Imgur Upload`;
    button.addEventListener("click", () => findAssets(false));
    html[0].querySelector("#settings-game")!.append(button);
    app.setPosition();
});
