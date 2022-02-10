import findAssets from "./replace.js";
import replace from "./replace.js";

/* FIXME Do when button pressed instead */
// @ts-expect-error
game.modules.get("imgur-sync").api = {
    run: findAssets
};
