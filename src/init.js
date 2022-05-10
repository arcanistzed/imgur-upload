import ImgurSync from "./view/ImgurSync.js";
import "../styles/main.scss";

import uploadImages from "./upload.js";

Hooks.once("ready", () => {
	new ImgurSync().render(true, { focus: true });
});

Hooks.on("init", () => {
	game.modules.get("imgur-sync").api = {
		run: uploadImages,
	};
});

Hooks.on("renderSettings", (app, html) => {
	const button = document.createElement("button");
	button.innerHTML = `<i class="fas fa-photo-video"></i> Imgur Upload`;
	button.addEventListener("click", () => new ImgurSync().render(true, { focus: true }));
	html[0].querySelector("#settings-game").append(button);
	app.setPosition();
});
