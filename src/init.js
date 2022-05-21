import ImgurUpload from "./view/ImgurUpload.js";
import "../styles/main.scss";

import uploadImages from "./upload.js";

Hooks.once("ready", () => {
	new ImgurUpload().render(true, { focus: true });
});

Hooks.on("init", () => {
	game.modules.get("imgur-upload").api = {
		run: uploadImages,
	};
});

Hooks.on("renderSettings", (app, html) => {
	const button = document.createElement("button");
	button.innerHTML = `<i class="fas fa-photo-video"></i> Imgur Upload`;
	button.addEventListener("click", () => new ImgurUpload().render(true, { focus: true }));
	html[0].querySelector("#settings-game").append(button);
	app.setPosition();
});
