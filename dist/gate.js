(() => {
  const STORAGE_KEY = "portal-access-v1";
  const EXPECTED =
    "7a06f2b83c359891078f7f13bb4181146ed0ba23b9ff3c185c1165cbe12e3564";

  const unlocked = () => sessionStorage.getItem(STORAGE_KEY) === "1";

  async function sha256Hex(text) {
    const data = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function unlock() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.documentElement.classList.remove("portal-locked");
    const gate = document.getElementById("access-gate");
    if (gate) gate.remove();
  }

  function renderGate() {
    document.documentElement.classList.add("portal-locked");
    const gate = document.createElement("div");
    gate.id = "access-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "access-gate-title");
    gate.innerHTML =
      '<div class="access-gate-card">' +
      '<p class="access-gate-eyebrow">やわらかロジカルシンキング</p>' +
      '<h1 id="access-gate-title">学習ポータル</h1>' +
      "<p>閲覧にはパスワードが必要です。</p>" +
      '<form id="access-gate-form">' +
      '<label for="access-password">パスワード</label>' +
      '<input id="access-password" name="password" type="password" autocomplete="current-password" required autofocus>' +
      '<button type="submit">入室する</button>' +
      '<p id="access-gate-error" class="access-gate-error" hidden>パスワードが違います。</p>' +
      "</form></div>";
    document.body.prepend(gate);

    const form = document.getElementById("access-gate-form");
    const input = document.getElementById("access-password");
    const error = document.getElementById("access-gate-error");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.hidden = true;
      try {
        const hash = await sha256Hex(input.value);
        if (hash === EXPECTED) {
          unlock();
          return;
        }
      } catch (_) {
        error.textContent = "この環境では認証できません。HTTPSで開いてください。";
      }
      error.hidden = false;
      input.select();
    });
  }

  if (unlocked()) {
    document.documentElement.classList.remove("portal-locked");
    return;
  }

  document.documentElement.classList.add("portal-locked");

  if (document.body) {
    renderGate();
  } else {
    document.addEventListener("DOMContentLoaded", renderGate, { once: true });
  }
})();
