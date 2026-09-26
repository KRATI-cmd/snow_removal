// Coordinates hiding the inline HTML preloader once fonts and the hero scene are ready.
const pending = new Set(["fonts", "hero"]);
const MAX_WAIT = 4000;
let done = false;

function hide() {
  if (done) return;
  done = true;
  const el = document.getElementById("preloader");
  if (!el) return;
  el.classList.add("is-done");
  el.addEventListener("transitionend", () => el.remove(), { once: true });
  setTimeout(() => el.remove(), 1000);
}

export function markReady(key) {
  pending.delete(key);
  if (pending.size === 0) hide();
}

document.fonts?.ready.then(() => markReady("fonts"), () => markReady("fonts"));
setTimeout(hide, MAX_WAIT);
