const MC_PLAYERS = [
  { n: "deniz_07", uuid: "1b2c7e4a-9f3e-4c1d-8a77-2f0c9b6e1d21", plat: "Java", on: true, bal: "184.250", k: 41, d: 12, grp: "vip", seen: "şimdi", ac: 0, pun: 0 },
  { n: "Kaanx", uuid: "7c1f0e9b-2a4d-4b8e-9c21-6d3a0f8e4b12", plat: "Java", on: true, bal: "2.940.100", k: 212, d: 88, grp: "elmas", seen: "şimdi", ac: 1, pun: 0 },
  { n: "mavi_kedi", uuid: "c9e2a4d1-77b0-4f3a-8e1c-0b6f2d9a5e33", plat: "Bedrock", on: true, bal: "12.400", k: 3, d: 9, grp: "default", seen: "şimdi", ac: 0, pun: 0 },
  { n: "yagmur.k", uuid: "2d8e6f1c-3b9a-4e7d-a1c4-9f0b2e6d8c44", plat: "Java", on: true, bal: "76.900", k: 18, d: 20, grp: "vip", seen: "şimdi", ac: 0, pun: 0 },
  { n: "Efe_Can", uuid: "8a4b2c6d-1e3f-4a5b-9c7d-0e2f4a6b8c55", plat: "Bedrock", on: true, bal: "4.150", k: 0, d: 2, grp: "default", seen: "şimdi", ac: 0, pun: 0 },
  { n: "griefer_tr", uuid: "f1e2d3c4-b5a6-4978-8a9b-0c1d2e3f4a66", plat: "Java", on: false, bal: "310", k: 7, d: 31, grp: "default", seen: "2 saat önce", ac: 4, pun: 2 },
  { n: "spamci", uuid: "0a9b8c7d-6e5f-4a3b-2c1d-0e9f8a7b6c77", plat: "Java", on: false, bal: "0", k: 0, d: 1, grp: "default", seen: "dün", ac: 0, pun: 1 },
  { n: "Tarkan_", uuid: "5e4d3c2b-1a09-4f8e-7d6c-5b4a3f2e1d88", plat: "Java", on: false, bal: "1.208.000", k: 96, d: 54, grp: "kaptan", seen: "3 gün önce", ac: 0, pun: 0 }
];
const SQ_PLAYERS = [
  ["[TR] Bora", "76561198012345671", 1, "Alpha", "TRK"], ["Selin", "76561198023456782", 1, "Alpha", "TRK"], ["mehmet55", "76561198034567893", 1, "Bravo", ""],
  ["Ghost", "76561198045678904", 1, "Bravo", "GHS"], ["Kurt", "76561198056789015", 1, "Logi", ""], ["ivan_ru", "76561198067890126", 2, "1 INF", "RU"],
  ["Dmitri", "76561198078901237", 2, "1 INF", "RU"], ["sasha", "76561198089012348", 2, "ARMOR", ""], ["Tank_Kral", "76561198090123459", 2, "ARMOR", "TRK"],
  ["yeni_oyuncu", "76561198101234560", 0, "", ""]
];

function rng(seed) { let x = seed % 2147483647; if (x <= 0) x += 2147483646; return () => (x = x * 16807 % 2147483647) / 2147483647; }
function series(n, base, amp, seed, drift = 0) { const r = rng(seed); let v = base; return Array.from({ length: n }, (_, i) => { v += (r() - 0.5) * amp + drift; v = Math.max(0, v); return +(v + Math.sin(i / 5) * amp * 0.4).toFixed(1); }); }
function seedOf(s) { return [...s].reduce((a, c) => a + c.charCodeAt(0) * 31, 7); }

const H = {
  head(title, sub, actions = "") {
    return `<div class="shead"><div><h2>${esc(title)}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${actions ? `<div class="toolbar">${actions}</div>` : ""}</div>`;
  },
  search(ph, target, w) { return `<label class="field"${w ? ` style="width:${w}"` : ""}><i data-lucide="search"></i><span class="sr">${esc(ph)}</span><input data-search="${target}" placeholder="${esc(ph)}"${w ? ' style="width:100%"' : ""}></label>`; },
  seg(opts, target, active = 0, key = "k") { return `<div class="seg" role="group" data-seg="${target || ""}" data-key="${key}">${opts.map((o, i) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<button type="button" data-v="${esc(v)}" aria-pressed="${i === active}">${esc(l)}</button>`; }).join("")}</div>`; },
  select(opts, label) { return `<label class="field sel"><span class="sr">${esc(label || "Seç")}</span><select>${opts.map(o => `<option>${esc(o)}</option>`).join("")}</select></label>`; },
  table(id, cols, rows, opts = {}) {
    return `<div class="dt-wrap"><table class="dt${opts.cls ? " " + opts.cls : ""}" id="${id}"><thead><tr>${cols.map(c => { const [l, cl] = Array.isArray(c) ? c : [c, ""]; return `<th class="${cl}">${l}</th>`; }).join("")}</tr></thead><tbody>${rows.map(r => {
      const attrs = r.attrs || ""; const cells = r.cells || r;
      return `<tr ${attrs}>${cells.map((c, i) => { const cl = Array.isArray(cols[i]) ? cols[i][1] : ""; return `<td class="${cl}">${c}</td>`; }).join("")}</tr>`;
    }).join("")}</tbody></table></div>${opts.foot ? `<p class="tfoot">${opts.foot}</p>` : ""}`;
  },
  chart(title, value, data, o = {}) {
    const w = 600, h = 120, max = o.max ?? (Math.max(...data) * 1.15 || 1), min = o.min ?? 0;
    const pts = data.map((v, i) => [i / (data.length - 1) * w, h - (Math.min(v, max) - min) / (max - min) * (h - 4) - 2]);
    const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
    const t = o.tone || "";
    return `<figure class="chart"><figcaption><span title="${esc(o.info || "")}">${esc(title)}${o.info ? ' <i data-lucide="info"></i>' : ""}</span><b class="${t}">${value}</b></figcaption>
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${esc(title)} grafiği"><path class="grid" d="M0 ${h / 4} H${w} M0 ${h / 2} H${w} M0 ${h * 3 / 4} H${w}"/>${o.limit ? `<path class="limit" d="M0 ${h - (o.limit - min) / (max - min) * h} H${w}"/>` : ""}<path class="area ${t}" d="${line} L${w} ${h} L0 ${h} Z"/><path class="ln ${t}" d="${line}"/></svg>
      <div class="axis"><span>${o.from || "1 saat önce"}</span><span>${o.mid || ""}</span><span>şimdi</span></div></figure>`;
  },
  kv(pairs, cls = "") { return `<dl class="kv ${cls}">${pairs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`).join("")}</dl>`; },
  figs(pairs) { return `<div class="figs">${pairs.map(([k, v, t]) => `<div><span>${esc(k)}</span><b class="${t || ""}">${v}</b></div>`).join("")}</div>`; },
  sw(on, label) { return `<button type="button" class="sw" role="switch" aria-checked="${!!on}"${label ? ` aria-label="${esc(label)}"` : ""}></button>`; },
  swl(on, label) { return `<label class="swl">${H.sw(on, label)}<span>${esc(label)}</span></label>`; },
  t(text, tone) { return `<span class="t ${tone || ""}">${text}</span>`; },
  dotT(text, st) { return `<span class="state ${st}"><span class="dot ${st}" aria-hidden="true"></span>${text}</span>`; },
  err(title, body, action = "Tekrar dene") { return `<div class="err" role="alert"><i data-lucide="circle-alert"></i><div><b>${esc(title)}</b><p>${esc(body)}</p></div><button class="btn sm" data-toast="Yeniden deneniyor">${esc(action)}</button></div>`; },
  empty(title, body) { return `<div class="empty"><b>${esc(title)}</b>${esc(body || "")}</div>`; },
  pager(total, per = 25) { return `<div class="pager"><span>${total} kayıttan 1-${Math.min(per, total)}</span><div class="toolbar"><button class="btn sm icon" aria-label="Önceki sayfa" disabled><i data-lucide="chevron-left"></i></button><button class="btn sm icon" aria-label="Sonraki sayfa"><i data-lucide="chevron-right"></i></button></div></div>`; },
  act(label, icon, attrs = "") { return `<button class="btn sm ghost" ${attrs}>${icon ? `<i data-lucide="${icon}"></i>` : ""}${esc(label)}</button>`; },
  iact(label, icon, attrs = "") { return `<button class="btn sm icon ghost" title="${esc(label)}" aria-label="${esc(label)}" ${attrs}><i data-lucide="${icon}"></i></button>`; },
  field(label, input, cls = "") { return `<label class="f ${cls}">${esc(label)}${input}</label>`; },
  input(v = "", ph = "", type = "text", extra = "") { return `<input type="${type}" value="${esc(v)}" placeholder="${esc(ph)}" ${extra}>`; },
  sel(opts, cur) { return `<select>${opts.map(o => `<option${o === cur ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`; },
  code(lines) { return `<pre class="editor" tabindex="0">${lines.map(l => `<span class="ln">${l}</span>`).join("\n")}</pre>`; }
};

function yamlLine(l) {
  if (/^\s*#/.test(l)) return `<span class="c">${esc(l)}</span>`;
  const m = l.match(/^(\s*-?\s*)([\w.\-]+)(:)(.*)$/);
  if (!m) return esc(l);
  let v = esc(m[4]);
  if (/^\s*(true|false)\s*$/.test(m[4])) v = `<span class="b">${v}</span>`;
  else if (/^\s*-?\d[\d.]*\s*$/.test(m[4])) v = `<span class="n">${v}</span>`;
  else if (m[4].trim()) v = `<span class="s">${v}</span>`;
  return `${esc(m[1])}<span class="k">${esc(m[2])}</span>${m[3]}${v}`;
}

function bindCommon(root) {
  root.querySelectorAll("[data-seg]").forEach(g => g.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
    const t = g.dataset.seg; if (!t) return;
    const key = g.dataset.key, v = b.dataset.v;
    root.querySelectorAll(`#${t} tbody tr, #${t} > [data-${key}]`).forEach(r => { if (r.dataset[key] === undefined) return; r.dataset.segHide = v !== "all" && !r.dataset[key].split(" ").includes(v) ? "1" : ""; applyHide(r); });
  })));
  root.querySelectorAll("[data-search]").forEach(inp => inp.addEventListener("input", () => {
    const q = norm(inp.value.trim()); const t = inp.dataset.search;
    root.querySelectorAll(`#${t} tbody tr, #${t} > .li, #${t} > li`).forEach(r => { r.dataset.qHide = q && !norm(r.textContent).includes(q) ? "1" : ""; applyHide(r); });
  }));
  root.querySelectorAll(".sw").forEach(s => s.addEventListener("click", e => { e.preventDefault(); s.setAttribute("aria-checked", s.getAttribute("aria-checked") !== "true"); }));
  root.querySelectorAll("[data-player-act]").forEach(b => b.addEventListener("click", () => openActionDialog(b.dataset.playerAct, b.dataset.game || "minecraft", b.dataset.preset)));
  root.querySelectorAll("[data-toast]").forEach(b => b.addEventListener("click", () => toast(b.dataset.toast)));
  root.querySelectorAll("[data-confirm]").forEach(b => b.addEventListener("click", () => { const [t, d, c] = b.dataset.confirm.split("|"); confirmDialog(t, d, c, () => toast(b.dataset.done || "İşlem kuyruğa alındı (örnek)"), true); }));
}
function applyHide(r) { r.hidden = !!(r.dataset.segHide || r.dataset.qHide); }

const ACTIONS_MC = ["Uyar", "Sustur", "At", "Yasakla", "Susturmayı Aç", "Yasağı Kaldır", "Grup Ver", "Grup Al", "Whitelist +", "Whitelist −"];
const ACTIONS_SQ = ["Uyar", "At", "Yasakla", "Manga dağıt", "Takım değiştir", "Flag ekle", "Not ekle"];
function openActionDialog(player, game, preset) {
  const acts = game === "squad" ? ACTIONS_SQ : ACTIONS_MC;
  let cur = Math.max(0, acts.indexOf(preset || "Uyar"));
  openLayer(`<div class="dialog wide" role="dialog" aria-modal="true" aria-labelledby="adT">
    <div class="dialog-head"><div><h2 id="adT">Oyuncu aksiyonu</h2><p>${player ? `<b style="color:var(--ink)">${esc(player)}</b> için` : "Oyuncu seçerek"} işlem uygula. Ceza geçmişine yazılır.</p></div><button class="btn icon ghost" id="adX" aria-label="Kapat"><i data-lucide="x"></i></button></div>
    <div class="dialog-body">
      <div class="seg wrap" role="radiogroup" aria-label="Aksiyon" id="adActs">${acts.map((a, i) => `<button type="button" role="radio" aria-checked="${i === cur}" aria-pressed="${i === cur}" data-i="${i}">${a}</button>`).join("")}</div>
      <div class="form-grid">
        ${H.field("Oyuncu", H.input(player || "", "Oyuncu adı, UUID veya SteamID"))}
        ${game === "squad" ? H.field("Kural kodu", H.sel(["-", "A1 Hakaret", "A2 Takım hasarı", "B4 Manga kilidi", "C1 Hile şüphesi"])) : H.field("Şablon", H.sel(["Şablon yok", "Küfür / hakaret", "Spam", "Grief", "Hile (x-ray)", "Dupe istismarı"]))}
        <div class="f span" id="adDur"><span>Süre</span><div class="chips">${["30 dk", "1 saat", "6 saat", "1 gün", "3 gün", "7 gün", "30 gün", "Kalıcı"].map((d, i) => `<button type="button" class="chip" aria-pressed="${i === 3}">${d}</button>`).join("")}<input class="dur-in" placeholder="7d / 12h / 30m / perm" aria-label="Özel süre"></div><small class="hint">Boş bırakılırsa merdiven karar verir.</small></div>
        ${H.field("Sebep", H.input("", "Ceza geçmişine yazılır..."), "span")}
        ${game === "squad" ? "" : H.field("Kapsam", H.sel(["Bu sunucu", "Tüm ağ (global)"]))}
        ${H.field("Yetkili", H.input(DATA.user.name, "", "text", "readonly"))}
        ${H.swl(false, "Sessiz (duyuru yapma)")}
      </div>
    </div>
    <div class="dialog-foot"><span class="note" id="adNote">aktif ceza yok</span><button class="btn ghost" id="adC">Vazgeç</button><button class="btn-game" id="adGo">Uygula</button></div></div>`, sc => {
    bindCommon(sc);
    const btns = sc.querySelectorAll("#adActs button");
    const sync = () => { btns.forEach((b, i) => { b.setAttribute("aria-pressed", i === cur); b.setAttribute("aria-checked", i === cur); }); sc.querySelector("#adDur").hidden = !["Sustur", "Yasakla", "Grup Ver", "Whitelist +"].includes(acts[cur]); };
    btns.forEach(b => b.onclick = () => { cur = +b.dataset.i; sync(); });
    sc.querySelectorAll(".chip").forEach(c => c.onclick = () => sc.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === c)));
    sync();
    sc.querySelector("#adX").onclick = closeLayer; sc.querySelector("#adC").onclick = closeLayer;
    sc.querySelector("#adGo").onclick = () => { const who = sc.querySelector("input").value.trim(); if (!who) { const n = sc.querySelector("#adNote"); n.textContent = "Önce oyuncu seç."; n.style.color = "var(--warn)"; return; } closeLayer(); toast(`${acts[cur]}: ${who} (örnek)`); };
  });
}

const SCREENS = {};

SCREENS.telemetri = s => {
  const sd = seedOf(s.id), on = isOn(s), N = 60;
  const z = n => on ? n : Array(N).fill(0);
  const tickName = s.game === "squad" ? "Sunucu FPS" : "TPS";
  const tick = s.game === "squad" ? series(N, 48, 3, sd + 4) : series(N, s.tps || 20, 0.8, sd + 4).map(v => Math.min(20, v));
  const html = `
    ${s.reasons.includes("Toplayıcı çevrimdışı") ? H.err("Telemetri toplayıcısı yanıt vermiyor", "Agent bu sunucu için 10 dakikadır veri göndermiyor. Sunucu metrikleri gelene kadar yalnız host verisi görünür.") : ""}
    ${H.head("Telemetri", "Agent her 5 saniyede örnekler; uzun aralıklar sıkıştırılmış geçmişten gelir.", H.seg([["1h", "1 saat"], ["6h", "6 saat"], ["24h", "24 saat"], ["7d", "7 gün"]], "", 0) + H.iact("Yenile", "refresh-cw", 'data-toast="Telemetri yenilendi"'))}
    ${on ? `<div class="charts">
      \${H.chart("Sunucu CPU", on ? \`%\${s.cpu}\` : "-", z(series(N, s.cpu, 9, sd)), { max: 100, limit: 85, tone: s.cpu >= 85 ? "bad" : "", info: "Sunucu sürecinin kullandığı CPU, tüm çekirdeklere oranla." })}
      \${H.chart("Sunucu RAM", on ? s.ramText : "-", z(series(N, s.ram, 3, sd + 1)), { max: 100, tone: s.ram >= 85 ? "warn" : "", info: "Sunucu sürecinin RSS belleği; JVM heap dahil." })}
      \${H.chart("Oyuncu", on ? \`\${s.players}/\${s.max}\` : "-", z(series(N, Math.max(1, s.players), Math.max(2, s.players / 6), sd + 2)), { info: "Sorgu portundan okunan çevrimiçi oyuncu sayısı." })}
      \${H.chart(tickName, on ? (s.tps ? s.tps.toFixed(1) : s.fps || "-") : "-", z(tick), { max: s.game === "squad" ? 60 : 20, min: 0, tone: s.tps && s.tps < 18 ? "warn" : "", info: "Sunucu döngü hızı; Minecraft için 20 ideal." })}
    </div>` : H.empty("Sunucu kapalı", "Sunucu çalışmadığı için CPU, RAM, oyuncu ve tick verisi yok. Başlatınca grafikler dolar.")}
    <section class="sec">
      ${H.head("Host", `${node(s.node).name}, ${node(s.node).cores} çekirdek`)}
      <div class="charts three">
        ${H.chart("Host CPU", `%${node(s.node).cpu}`, series(N, node(s.node).cpu, 7, sd + 5), { max: 100 })}
        ${H.chart("Host RAM", `%${node(s.node).ram}`, series(N, node(s.node).ram, 2, sd + 6), { max: 100 })}
        ${H.chart("Host disk", `%${node(s.node).disk}`, series(N, node(s.node).disk, 0.3, sd + 7, 0.01), { max: 100 })}
      </div>
    </section>
    <section class="sec">
      ${H.head("Ağ", "Port yoklaması ve trafik puanı")}
      <div class="cols2">
        <div class="charts one">
          ${on ? H.chart("RX / TX", "4,2 / 9,8 Mbit/s", series(N, 6, 3, sd + 8), { info: "Sunucu arayüzünden geçen gelen/giden trafik." }) : H.empty("Trafik yok", "Sunucu kapalı.")}
        </div>
        ${H.kv([
          ["Game port", on ? H.dotT(s.game === "squad" ? "7787/udp açık" : "25565/tcp açık", "ok") : H.dotT("kapalı", "bad")],
          ["Query port", on ? H.dotT(s.game === "squad" ? "27165/udp açık" : "25565/udp açık", "ok") : H.dotT("kapalı", "bad")],
          ["RCON port", s.game === "squad" ? H.dotT("21114/tcp yalnız panel", "ok") : s.game === "arma" ? H.dotT("19999/tcp kapalı", "idle") : H.dotT("25575/tcp yalnız lo", "ok")],
          ...(s.game === "squad" ? [["Beacon port", H.dotT("15000/udp açık", "ok")]] : []),
          ["Sorgu gecikmesi", on ? "18 ms" : "-"], ["Gecikme puanı", on ? "İyi" : "-"],
          ["Trafik skoru", on ? H.t("Normal", "ok") : "-"], ["Paket drop", on ? "%0,02" : "-"],
          ["TCP bağlantı", on ? "142" : "-"], ["UDP soket", on ? "6" : "-"], ["Şüpheli soket", on ? "0" : "-"]
        ])}
      </div>
    </section>
    <section class="sec">
      ${H.head("Olaylar", "Durum değişiklikleri ve eşik aşımları")}
      ${s.state === "idle" ? H.empty("Olay bulunamadı.", "") : H.table("telEv", ["Zaman", "Olay", ["Değer", "r"]], [
        [clock(-420), s.state === "warn" ? H.t("CPU eşiği aşıldı", "warn") : "Oyuncu zirvesi", s.state === "warn" ? "%88" : `${s.players + 6}`],
        [clock(-3900), "Yeniden başlatıldı (zamanlanmış görev)", "-"],
        [clock(-7300), s.state === "bad" ? H.t("Süreç beklenmedik şekilde sonlandı", "bad") : "Yedek tamamlandı", s.state === "bad" ? "exit 137" : "2,1 GB"]
      ])}
    </section>`;
  return { html };
};

const FILES = {
  minecraft: [["plugins", "dir", "", "bugün 13:02"], ["world", "dir", "", "bugün 13:15"], ["world_nether", "dir", "", "bugün 13:15"], ["logs", "dir", "", "bugün 13:15"], ["server.properties", "edit", "1,4 KB", "dün 22:40"], ["bukkit.yml", "edit", "1,1 KB", "3 gün önce"], ["paper-global.yml", "edit", "6,8 KB", "3 gün önce"], ["start.sh", "edit", "312 B", "12 Eyl"], ["paper-1.21.8-60.jar", "bin", "48,2 MB", "12 Eyl"], ["backup-0914.zip", "big", "2,1 GB", "14 Eyl"]],
  squad: [["SquadGame/ServerConfig", "dir", "", "bugün 11:20"], ["SquadGame/Saved/Logs", "dir", "", "bugün 13:15"], ["SquadJS", "dir", "", "dün"], ["Server.cfg", "edit", "2,2 KB", "dün 20:11"], ["Admins.cfg", "edit", "3,9 KB", "bugün 09:41"], ["LayerRotation.cfg", "edit", "1,7 KB", "2 gün önce"], ["MOTD.cfg", "edit", "410 B", "8 Eyl"], ["SquadGameServer.sh", "edit", "180 B", "1 Eyl"]],
  arma: [["profile", "dir", "", "2 gün önce"], ["addons", "dir", "", "2 gün önce"], ["config.json", "edit", "1,8 KB", "2 gün önce"], ["ArmaReforgerServer", "bin", "212 MB", "1 Eyl"]]
};
const FILE_BODY = {
  "server.properties": ["# Minecraft server properties", "motd=\\u00a7b\\u00a7lARKONAS \\u00a78» \\u00a77Skyblock", "max-players=150", "online-mode=false", "view-distance=8", "simulation-distance=6", "spawn-protection=0", "enable-rcon=true", "rcon.port=25575", "white-list=false", "difficulty=normal"],
  "bukkit.yml": ["settings:", "  allow-end: false", "  connection-throttle: -1", "  shutdown-message: Sunucu kapatılıyor", "spawn-limits:", "  monsters: 50", "  animals: 8", "ticks-per:", "  autosave: 6000"],
  "Server.cfg": ["ServerName=\"[TR] Arkonas Squad #1 | Invasion/RAAS\"", "MaxPlayers=100", "NumReservedSlots=4", "PublicQueueLimit=25", "AllowTeamChanges=true", "PreventTeamChangeIfUnbalanced=true", "TKAutoKickEnabled=true", "RecordDemos=false"],
  "Admins.cfg": ["Group=Owner:changemap,pause,cheat,private,balance,chat,kick,ban,config,cameraman,immune,manageserver,featuretest,reserve,demos,clientdemos,debug,teamchange,forceteamchange,canseeadminchat", "Group=Moderator:changemap,balance,chat,kick,ban,cameraman,teamchange,forceteamchange,canseeadminchat,reserve", "Admin=76561198012345671:Owner // Bora", "Admin=76561198023456782:Moderator // Selin"],
  "LayerRotation.cfg": ["Narva_RAAS_v1", "Gorodok_Invasion_v2", "Yehorivka_RAAS_v3", "Fallujah_Invasion_v1", "Harju_RAAS_v2", "Mutaha_Invasion_v1", "AlBasrah_RAAS_v1"]
};
FILE_BODY["paper-global.yml"] = ["chunk-loading-basic:", "  autoconfig-send-distance: true", "  player-max-chunk-load-rate: 100.0", "proxies:", "  velocity:", "    enabled: true", "    online-mode: true", "    secret: '••••••'"];
SCREENS.dosyalar = s => {
  const list = FILES[s.game];
  const root = s.game === "squad" ? "/home/squad/arkonas1" : s.game === "arma" ? "/home/arma/reforger" : `/root/${s.id}`;
  const kind = { dir: "Klasör", edit: "Düzenlenebilir", bin: "İkili", big: "Büyük" };
  const ico = { dir: "folder", edit: "file-text", bin: "file-box", big: "file-archive" };
  const html = `
    ${H.head("Dosyalar", `<span class="mono">${root}</span>`, H.search("Bu klasörde ara", "fileT") + `<button class="btn sm" data-toast="Yükleme penceresi (örnek)"><i data-lucide="upload"></i>Yükle</button><button class="btn sm" id="newFile"><i data-lucide="file-plus"></i>Yeni dosya</button><button class="btn sm" id="newDir"><i data-lucide="folder-plus"></i>Yeni klasör</button>` + H.iact("Listeyi yenile", "refresh-cw", 'data-toast="Liste yenilendi"'))}
    <div class="files">
      ${H.table("fileT", ["Ad", ["Tür", "hide-sm"], ["Boyut", "r"], ["Değiştirilme", "hide-sm"], ["", "r"]], list.map(([n, k, sz, t]) => ({
        attrs: `data-file="${esc(n)}" data-kind="${k}" class="${k === "edit" || k === "dir" ? "clickable" : ""}"`,
        cells: [`<span class="fname"><i data-lucide="${ico[k]}"></i><span class="${k === "dir" ? "strong" : ""}">${esc(n)}${k === "dir" ? "/" : ""}</span></span>`, `<span class="muted">${kind[k]}</span>`, sz || "-", t,
          `<div class="row-actions">${k === "big" ? H.iact("Zip aç", "package-open", 'data-toast="Zip açılıyor (örnek)"') : ""}${k !== "dir" ? H.iact("İndir", "download", 'data-toast="İndirme başladı (örnek)"') : ""}${H.iact("Yeniden adlandır", "pencil", 'data-toast="Yeni ad (örnek)"')}${H.iact("Sil", "trash-2", `data-confirm="${esc(n)} silinsin mi?|Bu işlem geri alınamaz.|Sil"`)}</div>`]
      })))}
      <p class="drop"><i data-lucide="upload-cloud"></i>Dosyaları buraya bırak, bu klasöre yüklensin.</p>
      <div id="editorHost"></div>
    </div>`;
  const mount = root => {
    const host = root.querySelector("#editorHost");
    root.querySelectorAll("#fileT tr[data-kind=edit]").forEach(tr => tr.addEventListener("click", e => {
      if (e.target.closest("button")) return;
      root.querySelectorAll("#fileT tr").forEach(x => x.classList.toggle("sel", x === tr));
      const n = tr.dataset.file, body = (FILE_BODY[n] || ["# " + n, "örnek içerik"]).join("\n");
      host.innerHTML = `<div class="edit-head"><b class="mono">${esc(n)}</b><span class="muted" id="dirty"></span><div class="toolbar" style="margin-left:auto"><button class="btn sm ghost" id="edClose" aria-label="Editörü kapat"><i data-lucide="x"></i>Kapat</button><button class="btn sm" id="edSave">Kaydet</button><button class="btn-game" id="edSaveR">Kaydet ve yeniden başlat</button></div></div><textarea class="editor-ta mono" spellcheck="false" aria-label="${esc(n)} içeriği">${esc(body)}</textarea>`;
      icons();
      const ta = host.querySelector("textarea");
      ta.oninput = () => host.querySelector("#dirty").textContent = "• kaydedilmedi";
      host.querySelector("#edClose").onclick = () => { if (host.querySelector("#dirty").textContent) return confirmDialog("Kaydedilmemiş değişiklikler silinsin mi?", "Editör kapatılırsa değişiklikler kaybolur.", "Sil ve kapat", () => { host.innerHTML = ""; }, true); host.innerHTML = ""; };
      host.querySelector("#edSave").onclick = () => { host.querySelector("#dirty").textContent = ""; toast(`${n} kaydedildi (örnek)`); };
      host.querySelector("#edSaveR").onclick = () => { host.querySelector("#dirty").textContent = ""; toast(`${n} kaydedildi, yeniden başlatılıyor (örnek)`); };
      ta.focus();
    }));
    root.querySelector("#newFile").onclick = () => promptDialog("Yeni dosya", "Yeni dosya adı (örn. config.yml)", v => toast(`${v} oluşturuldu (örnek)`));
    root.querySelector("#newDir").onclick = () => promptDialog("Yeni klasör", "Yeni klasör adı", v => toast(`${v}/ oluşturuldu (örnek)`));
  };
  return { html, mount };
};

function promptDialog(title, ph, fn) {
  openLayer(`<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="prT"><div class="dialog-head"><div><h2 id="prT">${esc(title)}</h2></div></div>
    <div class="dialog-body"><label class="f">${esc(ph)}<input id="prIn" placeholder="${esc(ph)}"></label></div>
    <div class="dialog-foot"><button class="btn ghost" id="prC">Vazgeç</button><button class="btn-game" id="prGo">Oluştur</button></div></div>`, sc => {
    sc.querySelector("#prC").onclick = closeLayer;
    const go = () => { const v = sc.querySelector("#prIn").value.trim(); if (!v) return; closeLayer(); fn(v); };
    sc.querySelector("#prGo").onclick = go;
    sc.querySelector("#prIn").onkeydown = e => { if (e.key === "Enter") go(); };
  });
}

const CONFIGS = {
  minecraft: [
    { f: "server.properties", live: false, fields: [["motd", "§b§lARKONAS §8» §7Skyblock", "text"], ["max-players", "150", "number"], ["view-distance", "8", "number"], ["simulation-distance", "6", "number"], ["spawn-protection", "0", "number"], ["online-mode", false, "bool"], ["white-list", false, "bool"], ["enable-rcon", true, "bool"], ["rcon.password", null, "secret"], ["difficulty", "normal", ["peaceful", "easy", "normal", "hard"]]] },
    { f: "bukkit.yml", live: true, fields: [["settings.allow-end", false, "bool"], ["settings.connection-throttle", "-1", "number"], ["spawn-limits.monsters", "50", "number"], ["ticks-per.autosave", "6000", "number"]] },
    { f: "spigot.yml", live: true, fields: [["settings.bungeecord", false, "bool"], ["world-settings.default.entity-activation-range.monsters", "24", "number"], ["world-settings.default.merge-radius.item", "3.5", "number"]] },
    { f: "paper-global.yml", live: false, fields: [["proxies.velocity.enabled", true, "bool"], ["proxies.velocity.secret", null, "secret"], ["chunk-loading-basic.player-max-chunk-load-rate", "100.0", "number"]] }
  ],
  squad: [
    { f: "Server.cfg", live: false, fields: [["ServerName", "[TR] Arkonas Squad #1 | Invasion/RAAS", "text"], ["MaxPlayers", "100", "number"], ["NumReservedSlots", "4", "number"], ["PublicQueueLimit", "25", "number"], ["AllowTeamChanges", true, "bool"], ["PreventTeamChangeIfUnbalanced", true, "bool"], ["TKAutoKickEnabled", true, "bool"], ["RecordDemos", false, "bool"]] },
    { f: "Rcon.cfg", live: false, fields: [["Port", "21114", "number"], ["Password", null, "secret"]] },
    { f: "MOTD.cfg", live: true, fields: [["MOTD", "Discord: discord.gg/arkonas, Kurallar için !kurallar", "text"]] },
    { f: "SquadJS config.json", live: true, fields: [["server.logReaderMode", "tail", ["tail", "ftp", "sftp"]], ["connectors.discord", null, "secret"], ["verboseLogging", false, "bool"]] }
  ],
  arma: [{ f: "config.json", live: false, fields: [["game.name", "Reforger Test", "text"], ["game.maxPlayers", "64", "number"], ["game.scenarioId", "{ECC61978EDCC2B5A}Missions/23_Campaign.conf", "text"], ["game.passwordAdmin", null, "secret"], ["operating.slotReservationTimeout", "60", "number"], ["game.crossPlatform", true, "bool"]] }]
};
SCREENS.yapilandirma = s => {
  const cfgs = CONFIGS[s.game];
  const field = ([k, v, t]) => {
    let ctl;
    if (t === "bool") ctl = H.sw(v, k);
    else if (t === "secret") ctl = `<span class="secret"><input type="password" placeholder="gizli değer saklandı" aria-label="${esc(k)}"><small>salt yazma; mevcut değer asla gösterilmez</small></span>`;
    else if (Array.isArray(t)) ctl = `<select aria-label="${esc(k)}">${t.map(o => `<option${o === v ? " selected" : ""}>${o}</option>`).join("")}</select>`;
    else ctl = `<input type="${t === "number" ? "text" : "text"}" ${t === "number" ? 'inputmode="decimal"' : ""} value="${esc(v)}" aria-label="${esc(k)}">`;
    return `<div class="cfg-row"><span class="mono">${esc(k)}</span>${ctl}</div>`;
  };
  const panel = c => `
    <div class="edit-head"><b class="mono">${esc(c.f)}</b>${H.t(c.live ? "Canlı yükleme destekleniyor" : "Kaydetme sonrası yeniden başlatma gerekli", c.live ? "ok" : "warn")}
      <div class="toolbar" style="margin-left:auto">${H.seg([["form", "Alanlar"], ["raw", "Ham"]], "", 0)}<button class="btn sm" data-toast="${esc(c.f)} kaydedildi (örnek)">Kaydet</button></div></div>
    <div class="cfg-form">${c.fields.map(field).join("")}</div>
    <div class="cfg-raw" hidden>${H.code((FILE_BODY[c.f] || c.fields.map(([k, v, t]) => `${k}: ${t === "secret" ? "'••••••'" : v}`)).map(yamlLine))}</div>`;
  const html = `
    ${H.head("Yapılandırma", "Sunucu ve eklenti yapılandırma dosyaları. Alanlar şemadan gelir; bilinmeyen anahtarlar Ham görünümde düzenlenir.")}
    <div class="split">
      <div class="list" id="cfgList" role="listbox" aria-label="Yapılandırma dosyaları">${cfgs.map((c, i) => `<div class="li" role="option" tabindex="0" data-i="${i}" aria-selected="${i === 0}"><b class="mono">${esc(c.f)}</b><small>${c.fields.length} alan, ${i === 1 ? H.t("Değiştirilmiş", "warn") : "Kayıtlı"}</small></div>`).join("")}</div>
      <div class="detail" id="cfgDetail">${panel(cfgs[0])}</div>
    </div>`;
  const mount = root => {
    const det = root.querySelector("#cfgDetail");
    const wire = () => { bindCommon(det); det.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => { det.querySelector(".cfg-form").hidden = b.dataset.v === "raw"; det.querySelector(".cfg-raw").hidden = b.dataset.v !== "raw"; })); icons(); };
    root.querySelectorAll("#cfgList .li").forEach(li => li.onclick = li.onkeydown = e => { if (e.type === "keydown" && e.key !== "Enter") return; root.querySelectorAll("#cfgList .li").forEach(x => x.setAttribute("aria-selected", x === li)); det.innerHTML = panel(cfgs[+li.dataset.i]); wire(); });
    det.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => { det.querySelector(".cfg-form").hidden = b.dataset.v === "raw"; det.querySelector(".cfg-raw").hidden = b.dataset.v !== "raw"; }));
  };
  return { html, mount };
};

SCREENS.network = s => {
  const on = isOn(s);
  const ports = s.game === "squad"
    ? [["7787", "UDP", "Game port", true, "Açık (herkese)"], ["27165", "UDP", "Query port", true, "Açık (herkese)"], ["15000", "UDP", "Beacon port", true, "Açık (herkese)"], ["21114", "TCP", "RCON", true, "Yalnız panel IP"]]
    : s.game === "arma" ? [["2001", "UDP", "Game port", false, "Açık (herkese)"], ["17777", "UDP", "Query (A2S)", false, "Açık (herkese)"], ["19999", "TCP", "RCON", false, "Kapalı"]]
    : [[s.id === "velocity" ? "25565" : "255" + (60 + seedOf(s.id) % 9), "TCP", "Game port (proxy arkası)", on, "Yalnız proxy IP"], ["25575", "TCP", "RCON", on, "Yalnız lo"], ["8100", "TCP", "Votifier", false, "Kapalı"]];
  const html = `
    ${H.head("Network", "Port ve firewall durumu. Docker ile yayınlanan portlar ufw kurallarını atlar; burada ayrıca işaretlenir.", `<button class="btn sm" data-toast="Yoklanıyor"><i data-lucide="refresh-cw"></i>Yenile</button>`)}
    ${H.table("netT", ["Port", "Protokol", "Amaç", "Dinliyor", "Firewall", ["Dışarıdan erişim", ""]], ports.map(([p, pr, a, l, fw]) => [
      `<span class="mono strong">${p}</span>`, pr, a, l ? H.dotT("Evet", "ok") : H.dotT("Hayır", "idle"), fw,
      fw.startsWith("Açık") ? (l ? H.t("Erişilebilir", "ok") : H.t("Port açık ama süreç yok", "warn")) : fw === "Kapalı" ? H.t("Kapalı", "") : H.t("Kısıtlı", "")
    ]))}
    ${H.kv([["Node", `${node(s.node).name} <span class="mono muted">${node(s.node).host}</span>`], ["Son yoklama", "12 sn önce"], ["Firewall", "ufw etkin, varsayılan deny"], ["Docker yayını", s.id === "dev" ? H.t("25590/tcp ufw'yi atlıyor", "warn") : "yok"]], "narrow")}`;
  return { html };
};

SCREENS.gorevler = s => {
  const rows = [["Her gün 06:00 yeniden başlat", "Yeniden başlat", "0 6 * * *", "Europe/Istanbul", "yarın 06:00", true], ["Her gece 04:00 yedekle", "Yedekle", "0 4 * * *", "Europe/Istanbul", "yarın 04:00", true], ["Duyuru: yeniden başlatma uyarısı", "Komut", "55 5 * * *", "Europe/Istanbul", "yarın 05:55", true], ["Pazartesi 05:00 güncelle", "Güncelle", "0 5 * * 1", "UTC", "Pzt 08:00", false]];
  const html = `
    ${H.head("Zamanlanmış Görevler", "Cron ifadesi seçilen zaman diliminde çalışır.")}
    ${H.table("jobT", ["Görev", "Tür", "Cron", "Zaman dilimi", "Sonraki", "Durum", ["", "r"]], rows.map(([n, t, c, tz, nx, en]) => [
      `<span class="strong">${n}</span>`, t, `<span class="mono">${c}</span>`, tz, en ? nx : "-", en ? H.dotT("Etkin", "ok") : H.dotT("Durdu", "idle"),
      `<div class="row-actions">${H.act(en ? "Durdur" : "Etkinleştir", en ? "pause" : "play", `data-toast="${en ? "Görev durduruldu" : "Görev etkinleştirildi"} (örnek)"`)}${H.iact("Sil", "trash-2", `data-confirm="Görev silinsin mi?|${esc(n)} kalıcı olarak kaldırılır.|Sil"`)}</div>`
    ]))}
    <section class="sec">
      ${H.head("Yeni görev", "Hazır şablondan başla ya da cron yaz.")}
      <div class="chips">${["Her gün 06:00 yeniden başlat", "Her gece 04:00 yedekle", "Pazartesi 05:00 güncelle"].map(p => `<button type="button" class="chip" data-preset="${p}">${p}</button>`).join("")}</div>
      <div class="form-grid four">
        ${H.field("Görev", H.sel(["Yeniden başlat", "Yedekle", "Güncelle", "Komut çalıştır", "Durdur", "Başlat"]))}
        ${H.field("Cron (dk saat gün ay hafta)", H.input("0 6 * * *", "0 6 * * *", "text", 'class="mono" id="cronIn"'))}
        ${H.field("Zaman dilimi", H.sel(["Europe/Istanbul", "UTC"]))}
        ${H.field("Komut (isteğe bağlı)", H.input("", "say Sunucu 5 dk içinde yeniden başlıyor"))}
      </div>
      <p class="hint" id="cronHint">Her gün 06:00'da çalışır. Sonraki: yarın 06:00.</p>
      <div><button class="btn-game" data-toast="Görev kaydedildi (örnek)">Görevi Kaydet</button></div>
    </section>`;
  const mount = root => root.querySelectorAll("[data-preset]").forEach(b => b.onclick = () => {
    const map = { "Her gün 06:00 yeniden başlat": ["0 6 * * *", "Her gün 06:00'da çalışır."], "Her gece 04:00 yedekle": ["0 4 * * *", "Her gün 04:00'te çalışır."], "Pazartesi 05:00 güncelle": ["0 5 * * 1", "Her Pazartesi 05:00'te çalışır."] };
    root.querySelector("#cronIn").value = map[b.dataset.preset][0]; root.querySelector("#cronHint").textContent = map[b.dataset.preset][1];
  });
  return { html, mount };
};

const MC_FEED = [
  ["join", "deniz_07", "katıldı", ""], ["chat", "Kaanx", "maden warpı açık mı?", ""], ["cmd", "Kaanx", "/is warp maden", ""], ["punish", "Mert", "griefer_tr banladı, 7 gün, Grief", "bad"],
  ["ac", "griefer_tr", "Grim: Reach (VL 4.2)", "warn"], ["chat", "mavi_kedi", "selam herkese", ""], ["auction", "Kaanx", "ihaleye koydu: Elmas Kazma (Verimlilik V) 45.000", ""], ["leave", "mavi_kedi", "ayrıldı", ""],
  ["cmd", "yagmur.k", "/ah", ""], ["join", "Efe_Can", "katıldı (Bedrock)", ""], ["punish", "Selin", "spamci susturdu, 1 saat, Spam", "bad"], ["chat", "yagmur.k", "kim takas yapar", ""]
];
const MC_FEED_LBL = { join: "Giriş", leave: "Çıkış", chat: "Sohbet", cmd: "Komut", punish: "Ceza", ac: "Anticheat", auction: "İhale" };
SCREENS["mod-operations"] = s => {
  const online = MC_PLAYERS.filter(p => p.on).slice(0, s.players ? 5 : 0);
  const html = `
    <div class="cols2 wide-left">
      <section class="sec">
        ${H.head("Canlı akış", "WebSocket ile anlık; eski olaylar aşağı kaydırınca yüklenir.", H.search("Ara (yüklü olaylarda geçerli)", "mcFeed"))}
        ${H.seg([["all", "Tümü"], ["join leave", "Giriş/Çıkış"], ["chat", "Sohbet"], ["cmd", "Komut"], ["punish", "Ceza"], ["ac", "Anticheat"], ["auction", "İhale"]], "mcFeed", 0, "k")}
        <ul class="tl" id="mcFeed">${MC_FEED.map(([k, who, msg, tone], i) => `<li data-k="${k}${k === "leave" ? " join leave" : k === "join" ? " join leave" : ""}"><time class="mono">${clock(-i * 37)}</time><span class="kind ${tone}">${MC_FEED_LBL[k]}</span><span><button class="plink" data-player-act="${esc(who)}">${esc(who)}</button> ${esc(msg)}</span></li>`).join("")}</ul>
        <p class="tfoot">Daha eski olaylar yükleniyor…</p>
      </section>
      <aside class="sec">
        ${H.head(`Çevrimiçi ${s.players}`, "Bu sunucuda", H.search("Oyuncu", "mcOn", "120px"))}
        ${online.length ? `<ul class="plist" id="mcOn">${online.map(p => `<li><span class="pname"><span class="face" aria-hidden="true">${p.n[0].toUpperCase()}</span><b>${esc(p.n)}</b><small>${p.plat}, ${p.grp}</small></span><span class="row-actions">${H.iact("Uyar", "message-square-warning", `data-player-act="${p.n}" data-preset="Uyar"`)}${H.iact("Sustur", "volume-x", `data-player-act="${p.n}" data-preset="Sustur"`)}${H.iact("At", "log-out", `data-player-act="${p.n}" data-preset="At"`)}${H.iact("Yasakla", "ban", `data-player-act="${p.n}" data-preset="Yasakla"`)}</span></li>`).join("")}</ul>` : H.empty("Sunucuda oyuncu yok.", "")}
        <div class="dock">
          <h3>Hızlı aksiyon</h3>
          <div class="toolbar"><button class="btn sm" data-player-act="" data-preset="Yasakla"><i data-lucide="gavel"></i>Ceza uygula</button><button class="btn sm" data-player-act="" data-preset="Grup Ver"><i data-lucide="shield"></i>Grup ver</button></div>
          <label class="f">Duyuru Metni<textarea rows="2" placeholder="Tüm sunucuya gönderilecek duyuru..."></textarea></label>
          <div><button class="btn sm" data-toast="Duyuru gönderildi (örnek)"><i data-lucide="megaphone"></i>Duyur</button></div>
        </div>
      </aside>
    </div>`;
  return { html };
};

SCREENS["mod-coreprotect"] = s => {
  const acts = [["Blok kırdı", "diamond_ore", "-1204 12 388", "Kaanx"], ["Blok koydu", "spawner", "-1200 64 390", "Kaanx"], ["Kaptan aldı", "netherite_ingot ×4", "220 70 -1450", "griefer_tr"], ["Kaba koydu", "elytra", "220 70 -1450", "Tarkan_"], ["Blok kırdı", "chest", "221 70 -1451", "griefer_tr"], ["Sohbet", "kim takas yapar", "-", "yagmur.k"], ["Komut", "/is warp maden", "-", "Kaanx"], ["Blok kırdı", "beacon", "18 90 -77", "deniz_07"]];
  const html = `
    ${H.head("CoreProtect", "Blok, kap, sohbet ve komut geçmişi. Sorgu oyuncu ve zamana göre daraltılınca hızlanır.")}
    <form class="filters" onsubmit="event.preventDefault();toast('Sorgu çalıştı (örnek)')">
      ${H.field("Oyuncu", H.input("", "Oyuncu adı..."))}
      ${H.field("Materyal", H.input("", "Materyal (diamond, spawner...)"))}
      ${H.field("Metin", H.input("", "Komut / sohbet metni..."))}
      ${H.field("İşlem", H.sel(["Tümü", "Blok kırma", "Blok koyma", "Kap işlemi", "Sohbet", "Komut", "Oturum"]))}
      ${H.field("Zaman", H.sel(["Son 1 saat", "Son 6 saat", "Son 24 saat", "Son 7 gün", "Son 30 gün", "Tüm zaman"], "Son 24 saat"))}
      ${H.field("Konum (isteğe bağlı)", H.input("", "x y z, yarıçap 10", "text", 'class="mono"'))}
      <div class="f end"><button class="btn-game"><i data-lucide="search"></i>Sorgula</button></div>
    </form>
    ${H.table("cpT", ["Zaman", "Oyuncu", "İşlem", "Nesne", "Konum", ["", "r"]], acts.map(([a, o, l, p], i) => ({ attrs: i === 4 ? 'class="undone"' : "", cells: [`<span class="mono">${clock(-i * 410)}</span>`, `<button class="plink" data-player-act="${p}">${p}</button>`, a, `<span class="mono">${esc(o)}</span>${i === 4 ? ` ${H.t("geri alındı", "")}` : ""}`, `<span class="mono">${l}</span>`, i < 5 ? `<div class="row-actions">${H.iact("Işınlan", "map-pin", 'data-toast="Işınlanma komutu kopyalandı"')}${H.iact("Geri al", "undo-2", `data-confirm="Bu işlem geri alınsın mı?|co rollback bu kayıt için çalıştırılır.|Geri al"`)}</div>` : ""] })))}
    <p class="tfoot">Kaydın sonu</p>`;
  return { html };
};

SCREENS["mod-auctions"] = s => {
  const rows = [["#48211", "Elmas Kazma", "Verimlilik V, Kırılmazlık III", 1, "Kaanx", "-", "45.000", "open"], ["#48207", "Spawner (Zombi)", "", 1, "Tarkan_", "deniz_07", "1.200.000", "sold"], ["#48199", "Netherit Külçesi", "", 16, "yagmur.k", "Kaanx", "380.000", "sold"], ["#48188", "Elytra", "Onarım", 1, "griefer_tr", "-", "900.000", "removed"], ["#48170", "Shulker Kutusu (Mavi)", "27 eşya", 1, "Efe_Can", "-", "60.000", "expired"], ["#48166", "Büyülü Kitap", "Keskinlik V", 1, "mavi_kedi", "-", "18.000", "withdrawn"]];
  const st = { open: ["Açık", "ok"], sold: ["Satıldı", ""], expired: ["Süresi doldu", "idle"], withdrawn: ["Geri çekildi", "idle"], removed: ["Yetkili sildi", "bad"] };
  const html = `
    ${H.head("İhaleler", "Satıcı ve alıcı izleme; şüpheli fiyat hareketleri için geçmiş.", H.search("Satıcı, alıcı veya materyal...", "auT") + H.select(["Son 24 saat", "Son 7 gün", "Son 30 gün", "Tüm zaman"], "Zaman"))}
    ${H.seg([["all", "Tümü"], ["open", "Açık"], ["sold", "Satıldı"], ["expired", "Süresi doldu"], ["withdrawn", "Geri çekildi"], ["removed", "Yetkili sildi"]], "auT", 0, "st")}
    ${H.table("auT", ["İhale", "Ürün", "Satıcı", "Alıcı", ["Fiyat", "r"], "Durum", "Zaman"], rows.map(([id, it, lore, n, sel, buy, pr, k], i) => ({ attrs: `data-st="${k}" class="clickable" data-au="${i}"`, cells: [`<span class="mono">${id}</span>`, `<span class="strong">${it}</span>${n > 1 ? ` <span class="muted">×${n}</span>` : ""}${lore ? `<small class="sub">${lore}</small>` : ""}`, sel, buy, `<span class="v">${pr}</span>`, H.dotT(st[k][0], st[k][1] || "idle"), clock(-i * 1500)] })))}
    ${H.pager(214)}`;
  const mount = root => root.querySelectorAll("[data-au]").forEach(tr => tr.onclick = () => {
    const r = rows[+tr.dataset.au];
    openLayer(`<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="auD"><div class="dialog-head"><div><h2 id="auD">${r[1]} <span class="mono muted">${r[0]}</span></h2><p>${r[2] || "Büyü veya açıklama yok"}</p></div><button class="btn icon ghost" id="auX" aria-label="Kapat"><i data-lucide="x"></i></button></div>
      <div class="dialog-body">${H.kv([["Satıcı", r[4]], ["Alıcı", r[5]], ["Adet", r[3]], ["Fiyat", r[6]], ["Durum", st[r[7]][0]], ["Materyal", `<span class="mono">${r[1].toLowerCase().replace(/ /g, "_")}</span>`]])}
      <div class="inv small">${Array.from({ length: 9 }, (_, i) => `<span>${i === 0 ? r[1].slice(0, 3) : ""}</span>`).join("")}</div></div>
      <div class="dialog-foot">${r[7] === "open" ? `<button class="btn danger" id="auDel">İhaleyi kaldır</button>` : ""}<button class="btn ghost" id="auC">Kapat</button></div></div>`, sc => { sc.querySelector("#auX").onclick = sc.querySelector("#auC").onclick = closeLayer; const d = sc.querySelector("#auDel"); if (d) d.onclick = () => { closeLayer(); toast("İhale kaldırıldı (örnek)"); }; });
  });
  return { html, mount };
};

function mcProfile(p) {
  const inv = ["Kılıç", "Kazma", "Balta", "Altın·32", "", "", "Meşale·64", "", "Ekmek·12"].concat(Array(27).fill("")).map((x, i) => x || (i % 7 === 3 ? "Taş·64" : ""));
  return `
    <div class="prof-head"><span class="face lg" aria-hidden="true">${p.n[0].toUpperCase()}</span><div><h2>${esc(p.n)}</h2><p class="muted">${p.on ? H.dotT("Çevrimiçi", "ok") : `Son görülme ${p.seen}`}, ${p.plat}, <span class="mono">${p.uuid.slice(0, 8)}…</span></p></div>
      <div class="toolbar">${["Uyar", "Sustur", "At", "Yasakla"].map(a => `<button class="btn sm" data-player-act="${p.n}" data-preset="${a}">${a}</button>`).join("")}</div></div>
    ${H.figs([["Bakiye", p.bal], ["Kill / Ölüm", `${p.k} / ${p.d}`], ["Aktif Ceza", p.pun, p.pun ? "t-bad" : ""], ["Anticheat", p.ac, p.ac ? "t-warn" : ""]])}
    <div class="cols2">
      <section class="sec"><h3>Kimlikler</h3>${H.kv([["UUID", `<span class="mono">${p.uuid}</span>`], ["Bedrock XUID", p.plat === "Bedrock" ? '<span class="mono">2535412398712</span>' : "-"], ["Discord", p.n === "Kaanx" ? "kaanx#0" : "-"], ["IP (hash)", '<span class="mono">a91f…3c0e</span>'], ["İlişkili hesap", p.n === "griefer_tr" ? H.t("kumcu_45 (aynı IP)", "warn") : "-"], ["İlk görülme", "12 Ağu 2026"], ["Son görülme", p.seen]])}</section>
      <section class="sec"><h3>İstatistik</h3>${H.kv([["Oynama süresi", "142 sa"], ["Yürüme", "1.284 km"], ["Mob kill", "8.412"], ["Oyuncu kill", p.k], ["Ölüm", p.d], ["En çok öldürülen", "Zombi"], ["Seviye (XP)", "38"], ["Açlık", "18/20"]])}</section>
    </div>
    <section class="sec"><h3>Gruplar</h3><p class="v">${p.grp} <span class="muted">· Miras: default</span></p></section>
    <section class="sec"><h3>Envanter</h3><div class="inv">${inv.map(x => { const [n, c] = x.split("·"); return `<span title="${x.replace("·", " ×")}">${n ? n.slice(0, 4) : ""}${c ? `<i>${c}</i>` : ""}</span>`; }).join("")}</div><p class="hint">Konum: world, <span class="mono">-1204 64 388</span></p></section>
    <section class="sec"><h3>Ceza geçmişi</h3>${p.pun ? H.table("pPun", ["Tür", "Sebep", "Yetkili", "Süre", "Durum"], [["Ban", "Grief", "Mert", "7 gün", H.dotT("Aktif", "bad")], ["Uyarı", "Hakaret", "Selin", "-", H.dotT("Sona eren", "idle")]].slice(0, p.pun)) : `<p class="muted">Ceza kaydı yok.</p>`}</section>
    <section class="sec"><h3>Son olaylar</h3><ul class="tl">${MC_FEED.filter(e => e[1] === p.n).map(([k, , m, t], i) => `<li><time class="mono">${clock(-i * 90)}</time><span class="kind ${t}">${MC_FEED_LBL[k]}</span><span>${esc(m)}</span></li>`).join("") || `<li class="muted">Bu oyuncuya ait olay yok.</li>`}</ul></section>`;
}
SCREENS["mod-profiles"] = s => {
  const html = `
    ${H.head("Profiller", "Oyuncu profili, envanter, kimlikler ve ceza geçmişi.")}
    <div class="split">
      <div class="list"><div class="list-tools">${H.search("İsim, UUID veya IP hash", "profList", "100%")}${H.seg([["all", "Tümü"], ["on", "Çevrimiçi"]], "profList", 0, "on")}</div>
        <div id="profList">${MC_PLAYERS.map((p, i) => `<div class="li" role="option" tabindex="0" data-i="${i}" data-on="${p.on ? "on" : "off"}" aria-selected="${i === 1}"><b><span class="dot ${p.on ? "ok" : "idle"}" aria-hidden="true"></span>${esc(p.n)}</b><small>${p.plat}, ${p.grp}, ${p.on ? "çevrimiçi" : p.seen}${p.pun ? `, ${H.t("cezalı", "bad")}` : ""}</small></div>`).join("")}</div></div>
      <div class="detail" id="profDetail">${mcProfile(MC_PLAYERS[1])}</div>
    </div>`;
  const mount = root => root.querySelectorAll("#profList .li").forEach(li => li.onclick = li.onkeydown = e => {
    if (e.type === "keydown" && e.key !== "Enter") return;
    root.querySelectorAll("#profList .li").forEach(x => x.setAttribute("aria-selected", x === li));
    const d = root.querySelector("#profDetail"); d.innerHTML = mcProfile(MC_PLAYERS[+li.dataset.i]); bindCommon(d); icons();
  });
  return { html, mount };
};

SCREENS["mod-anticheat"] = s => {
  const rows = [["griefer_tr", "Reach", "4.2", "3.31 blok mesafe"], ["griefer_tr", "Killaura (B)", "2.0", "açı tutarsızlığı"], ["Kaanx", "Fly", "1.0", "Elytra sınırı, olası yanlış pozitif"], ["griefer_tr", "Timer", "6.8", "paket hızı %112"], ["deniz_07", "NoFall", "0.5", "su kenarı"]];
  const html = `
    ${H.head("Anticheat", `Motor: <b class="v">GrimAC 2.3.71</b>, son 24 saatte ${rows.length} uyarı`, H.search("Oyuncu veya kontrol", "acT"))}
    ${H.figs([["Uyarı (24 saat)", rows.length], ["Uyarı alan oyuncu", 3], ["En yüksek VL", "6.8", "t-warn"], ["Otomatik ceza", "kapalı"]])}
    ${H.table("acT", ["Zaman", "Oyuncu", "Kontrol", ["VL", "r"], "Ayrıntı", ["", "r"]], rows.map(([p, c, vl, d], i) => [`<span class="mono">${clock(-i * 600)}</span>`, `<button class="plink" data-player-act="${p}">${p}</button>`, `<span class="strong">${c}</span>`, `<span class="${+vl >= 4 ? "t-warn" : ""}">${vl}</span>`, `<span class="muted">${d}</span>`, `<div class="row-actions">${H.act("İzle", "eye", 'data-toast="Gözlemci modu komutu gönderildi (örnek)"')}${H.act("Ceza", "gavel", `data-player-act="${p}" data-preset="Yasakla"`)}</div>`]))}`;
  return { html };
};

SCREENS["mod-economy"] = s => {
  const top = [...MC_PLAYERS].sort((a, b) => +b.bal.replace(/\./g, "") - +a.bal.replace(/\./g, ""));
  const html = `
    ${H.head("Ekonomi & Oy", "ExcellentEconomy bakiyeleri ve VotingPlugin oy kayıtları.")}
    ${H.figs([["Toplam para arzı", "4.536.010"], ["Ortalama bakiye", "567.001"], ["Bu hafta oy", "418"], ["Bugünkü oy", "62"]])}
    <div class="cols2">
      <section class="sec">${H.head("Bakiye sıralaması", "", H.search("Oyuncu", "ecoT", "140px"))}
        ${H.table("ecoT", [["#", "r"], "Oyuncu", ["Bakiye", "r"], ["", "r"]], top.map((p, i) => [`<span class="muted">${i + 1}</span>`, `<span class="strong">${p.n}</span>`, `<span class="v">${p.bal}</span>`, `<div class="row-actions">${H.iact("Bakiye düzenle", "pencil", 'data-toast="Bakiye düzenleme (örnek)"')}</div>`]))}</section>
      <section class="sec">${H.head("Oylar", "", H.seg([["w", "Bu Hafta"], ["m", "Bu Ay"], ["a", "Tüm Zaman"]], "", 0))}
        ${H.table("voteT", ["Oyuncu", ["Puan", "r"], ["Oy", "r"], "Son oy"], [["deniz_07", 84, 21, "1 saat önce"], ["yagmur.k", 72, 18, "3 saat önce"], ["Kaanx", 60, 15, "dün"], ["Efe_Can", 28, 7, "dün"], ["mavi_kedi", 12, 3, "2 gün önce"]].map(r => [`<span class="strong">${r[0]}</span>`, r[1], r[2], `<span class="muted">${r[3]}</span>`]))}</section>
    </div>`;
  return { html };
};

SCREENS["mod-roles"] = s => {
  const groups = [["owner", "admin", 100, "&4KURUCU", 1], ["admin", "mod", 90, "&cADMİN", 2], ["mod", "helper", 80, "&9MOD", 4], ["helper", "kaptan", 60, "&aYARDIMCI", 3], ["kaptan", "elmas", 40, "&6KAPTAN", 12], ["elmas", "vip", 30, "&bELMAS", 31], ["vip", "default", 20, "&eVIP", 88], ["default", "-", 0, "&7KÖYLÜ", 4210]];
  const html = `
    ${H.head("Roller", "LuckPerms grupları ve miras zinciri. Değişiklikler ağ geneli (server: global) uygulanır.", H.search("Grup seç", "rolesT") + `<button class="btn sm" data-player-act="" data-preset="Grup Ver"><i data-lucide="user-plus"></i>Oyuncuya grup ver</button>`)}
    ${H.table("rolesT", ["Grup Adı", "Parent Grup", ["Weight", "r"], "Prefix", ["Üye", "r"], ["", "r"]], groups.map(([g, p, w, pre, n]) => [`<span class="strong mono">${g}</span>`, `<span class="mono muted">${p}</span>`, w, `<span class="mono">${esc(pre)}</span>`, n.toLocaleString("tr-TR"), `<div class="row-actions">${H.act("Üyeler", "users", 'data-toast="Üye listesi (örnek)"')}${H.act("İzinler", "key-round", 'data-toast="İzin listesi (örnek)"')}</div>`]))}
    <p class="hint">Merdiven: default › vip › elmas › kaptan. Merdiven dışı rütbe verirken mevcut rütbe korunur.</p>`;
  return { html };
};

SCREENS["mod-punishments"] = s => {
  const rows = [["Ban", "griefer_tr", "Grief", "Mert", "7 gün", "21 Eyl 13:02", true], ["Mute", "spamci", "Spam", "Selin", "1 saat", "bugün 14:10", true], ["Uyarı", "mavi_kedi", "Caps lock", "Selin", "-", "-", false], ["Kick", "Efe_Can", "AFK farm", "Mert", "-", "-", false], ["Ban", "nehir_33", "Ban kaçağı (kumcu_45)", "Aydoğan", "Kalıcı", "-", true], ["Mute", "deniz_07", "Hakaret", "Mert", "30 dk", "dün", false]];
  const tone = { Ban: "bad", Mute: "warn", Uyarı: "", Kick: "" };
  const html = `
    ${H.head("Cezalar", "LiteBans geçmişi. Şablon seçilirse süre ceza merdiveninden gelir.", H.search("Oyuncu, sebep veya yetkili", "punT") + `<button class="btn-game" data-player-act="" data-preset="Yasakla"><i data-lucide="plus"></i>Yeni ceza</button>`)}
    ${H.seg([["all", "Tümü"], ["Ban", "Ban"], ["Mute", "Mute"], ["Uyarı", "Uyarı"], ["Kick", "Kick"]], "punT", 0, "t")}
    ${H.table("punT", ["Tür", "Oyuncu", "Sebep", "Yetkili", "Süre", "Bitiş", "Durum", ["", "r"]], rows.map(([t, p, r, by, d, end, act]) => ({ attrs: `data-t="${t}"`, cells: [H.t(t, tone[t]), `<button class="plink" data-player-act="${p}">${p}</button>`, r, by, d, end, act ? H.dotT("Aktif", "bad") : H.dotT("Sona eren", "idle"), act ? `<div class="row-actions">${H.act(t === "Mute" ? "Susturmayı aç" : "Kaldır", "undo-2", `data-player-act="${p}" data-preset="${t === "Mute" ? "Susturmayı Aç" : "Yasağı Kaldır"}"`)}</div>` : ""] })))}
    ${H.pager(1284)}`;
  return { html };
};

const MC_PLUGINS = [["LuckPerms", "Yetki", "5.4.141", true, ["config.yml"]], ["EssentialsX", "Temel", "2.21.0", true, ["config.yml", "messages_tr.properties"]], ["LiteBans", "Moderasyon", "2.15.2", s => s.id !== "skyblock", ["config.yml", "messages.yml"]], ["CoreProtect", "Kayıt", "22.4", true, ["config.yml"]], ["GrimAC", "Anticheat", "2.3.71", true, ["config.yml", "punishments.yml"]], ["ItemsAdder", "İçerik", "4.0.17", true, ["config.yml"]], ["DeluxeMenus", "Arayüz", "1.14.1", true, ["config.yml", "gui_menus/modalidades.yml"]], ["WorldGuard", "Koruma", "7.0.12", true, ["config.yml"]], ["ExcellentEconomy", "Ekonomi", "2.6.0", true, ["config.yml"]], ["VotingPlugin", "Oy", "6.17", true, ["Config.yml", "VoteSites.yml"]], ["Skript", "Betik", "2.9.5", true, ["config.sk"]]];
SCREENS["mod-plugins"] = s => {
  const html = `
    ${H.head("Pluginler", "Plugin kataloğu ve yapılandırma editörü. Düzenleme yetkiye bağlıdır.")}
    <div class="split">
      <div class="list"><div class="list-tools">${H.search("Plugin adı ara...", "plList", "100%")}<label class="field sel"><span class="sr">Kategori</span><select><option>Tüm kategoriler</option>${[...new Set(MC_PLUGINS.map(p => p[1]))].map(c => `<option>${c}</option>`).join("")}</select></label></div>
        <div id="plList">${MC_PLUGINS.map((p, i) => `<div class="li" role="option" tabindex="0" data-i="${i}" aria-selected="${i === 0}"><b>${p[0]} <span class="muted mono">${p[2]}</span></b><small>${p[1]}, ${p[4].length} config</small></div>`).join("")}</div></div>
      <div class="detail" id="plDetail"></div>
    </div>`;
  const show = (root, i) => {
    const p = MC_PLUGINS[i]; const d = root.querySelector("#plDetail");
    d.innerHTML = `<div class="prof-head"><div><h2>${p[0]}</h2><p class="muted">${p[1]}, sürüm <span class="mono">${p[2]}</span>, ${H.dotT("Etkin", "ok")}</p></div><div class="toolbar"><button class="btn sm" data-toast="${p[0]} yeniden yüklendi (örnek)"><i data-lucide="refresh-cw"></i>Yeniden yükle</button></div></div>
      <h3>Config Dosyaları</h3>
      <div class="chips">${p[4].map((f, j) => `<button type="button" class="chip mono" aria-pressed="${j === 0}">${f}</button>`).join("")}</div>
      <div class="edit-head"><b class="mono">${p[4][0]}</b><span class="muted">Otomatik (önerilen) biçim</span><div class="toolbar" style="margin-left:auto"><button class="btn sm" data-toast="Kaydedildi (örnek)">Kaydet</button><button class="btn-game" data-toast="Kaydedildi ve uygulandı (örnek)">Kaydet ve uygula</button></div></div>
      ${H.code(["# " + p[0] + " yapılandırması", "prefix: '&b&lᴀʀᴋᴏɴᴀꜱ &8» '", "storage-method: mysql", "data:", "  address: 127.0.0.1", "  database: arkonas", "  password: '••••••'", "sync-minutes: 3", "debug: false"].map(yamlLine))}`;
    bindCommon(d); icons();
    d.querySelectorAll(".chip").forEach(c => c.onclick = () => { d.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", x === c)); d.querySelector(".edit-head b").textContent = c.textContent; });
  };
  const mount = root => { show(root, 0); root.querySelectorAll("#plList .li").forEach(li => li.onclick = li.onkeydown = e => { if (e.type === "keydown" && e.key !== "Enter") return; root.querySelectorAll("#plList .li").forEach(x => x.setAttribute("aria-selected", x === li)); show(root, +li.dataset.i); }); };
  return { html, mount };
};

const SQ_FEED = [["chat", "[TR] Bora", "Takım: Alpha logi lazım"], ["kill", "ivan_ru", "Ghost'u öldürdü (AK-74M)"], ["conn", "yeni_oyuncu", "bağlandı"], ["admin", "Selin", "AdminWarn: Ghost, manga kilidi"], ["tk", "mehmet55", "Kurt'a takım hasarı (M4)"], ["chat", "Dmitri", "Tüm: gg"], ["conn", "sasha", "ayrıldı"], ["layer", "Sistem", "Yeni layer: Narva RAAS v1"], ["kill", "Tank_Kral", "Kurt'u öldürdü (T-72B3)"]];
const SQ_LBL = { chat: "Sohbet", kill: "Ölüm", conn: "Bağlantı", admin: "Admin", tk: "Takım hasarı", layer: "Layer" };
SCREENS["mod-dashboard"] = s => {
  const html = `
    ${H.figs([["Layer", "Narva RAAS v1"], ["Takım 1", "TRK Kara Kuvvetleri, 32"], ["Takım 2", "RGF, 31"], ["Maç süresi", "41 dk"], ["Kuyruk", "3"]])}
    <div class="cols2 wide-left">
      <section class="sec">
        ${H.head("Canlı akış", "", H.search("Oyuncu, ID, mesaj, silah veya layer ara...", "sqFeed", "260px"))}
        ${H.seg([["all", "Tümü"], ["chat", "Sohbet"], ["conn", "Bağlantı"], ["kill tk", "Ölüm"], ["admin", "Admin"], ["tk", "Takım hasarı"]], "sqFeed", 0, "k")}
        <ul class="tl" id="sqFeed">${SQ_FEED.map(([k, who, m], i) => `<li data-k="${k}${k === "tk" ? " kill" : ""}"><time class="mono">${clock(-i * 23)}</time><span class="kind ${k === "tk" ? "warn" : k === "admin" ? "cyan" : ""}">${SQ_LBL[k]}</span><span>${who === "Sistem" ? "" : `<button class="plink" data-game="squad" data-player-act="${esc(who)}">${esc(who)}</button> `}${esc(m)}</span></li>`).join("")}</ul>
      </section>
      <aside class="sec">
        ${H.head("Son ayrılan oyuncular")}
        ${H.table("leftT", ["Oyuncu", "Takım", "Manga", "Ayrılma Zamanı"], [["sasha", "2", "ARMOR", clock(-140)], ["kral34", "1", "Bravo", clock(-820)], ["noob_tr", "-", "Bilinmeyen", clock(-1900)]].map(r => [`<button class="plink" data-game="squad" data-player-act="${r[0]}">${r[0]}</button>`, r[1], r[2], `<span class="mono">${r[3]}</span>`]))}
        <div class="dock"><h3>Hızlı aksiyon</h3><label class="f">Yayın (AdminBroadcast)<textarea rows="2" placeholder="Tüm sunucuya gönderilecek mesaj..."></textarea></label><div class="toolbar"><button class="btn sm" data-toast="Yayın gönderildi (örnek)"><i data-lucide="megaphone"></i>Yayınla</button><button class="btn sm" data-game="squad" data-player-act="" data-preset="Uyar"><i data-lucide="gavel"></i>Oyuncu aksiyonu</button></div></div>
      </aside>
    </div>`;
  return { html };
};

SCREENS["mod-stats"] = s => {
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(Date.now() - (13 - i) * 864e5); return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }); });
  const peaks = series(14, 88, 14, 33).map(v => Math.min(100, Math.round(v)));
  const html = `
    ${H.head("Server Stats", "Günlük zirve oyuncu ve doluluk.", H.search("Tarih veya zirve oyuncu ara...", "stT"))}
    <div class="charts one">${H.chart("Günlük zirve", `${peaks.at(-1)}/100`, peaks, { max: 100, from: days[0], mid: days[7], info: "Gün içindeki en yüksek eş zamanlı oyuncu." })}</div>
    ${H.table("stT", ["Tarih", ["Zirve Oyuncu", "r"], ["Ortalama", "r"], ["Seed süresi", "r"], ["Dolu kalma", "r"]], days.slice().reverse().map((d, i) => [d, `<span class="v">${peaks[13 - i]}</span>`, Math.round(peaks[13 - i] * 0.62), `${40 + i * 3} dk`, `${Math.max(0, Math.round((peaks[13 - i] - 70) / 3))} sa`]))}`;
  return { html };
};

const LAYERS = ["Narva_RAAS_v1", "Gorodok_Invasion_v2", "Yehorivka_RAAS_v3", "Fallujah_Invasion_v1", "Harju_RAAS_v2", "Mutaha_Invasion_v1", "AlBasrah_RAAS_v1", "Kohat_RAAS_v1", "Skorpo_Invasion_v1", "Manicouagan_RAAS_v2"];
SCREENS["mod-layerChanges"] = s => {
  const html = `
    ${H.figs([["Şu anki layer", "Narva RAAS v1"], ["Sonraki layer", "Gorodok Invasion v2"], ["Rotasyon", "LayerRotation.cfg, 7 layer"]])}
    <div class="cols2">
      <section class="sec">${H.head("Layer seç", "", H.search("Layer adı ara...", "lyList", "180px"))}
        <ul class="plist" id="lyList">${LAYERS.map((l, i) => `<li><span class="pname"><b class="mono">${l}</b><small>${l.includes("Invasion") ? "Invasion" : "RAAS"}, ${i < 7 ? "rotasyonda" : "rotasyon dışı"}</small></span><span class="row-actions">${H.act("Sonraki yap", "skip-forward", `data-toast="Sonraki layer: ${l}"`)}${H.act("Şimdi değiştir", "replace", `data-confirm="Layer şimdi değiştirilsin mi?|Maç hemen biter ve ${l} yüklenir.|Değiştir"`)}</span></li>`).join("")}</ul></section>
      <section class="sec">${H.head("LayerRotation.cfg", "Sırayı düzenle; kaydedince sunucu sonraki maçta okur.", `<button class="btn sm" data-toast="LayerRotation.cfg kaydedildi (örnek)">Kaydet</button>`)}
        ${H.code(FILE_BODY["LayerRotation.cfg"].map(esc))}</section>
    </div>`;
  return { html };
};

SCREENS["mod-layerHistory"] = s => {
  const html = `
    ${H.head("Layer History", "Biten maçlar, kazanan ve bilet farkı.", H.search("Layer ara", "lhT") + H.select(["Son 24 saat", "Son 7 gün", "Son 30 gün"]))}
    ${H.table("lhT", ["Başlangıç", "Layer", "Mod", ["Süre", "r"], ["Zirve", "r"], "Kazanan", ["Bilet farkı", "r"]], LAYERS.slice(0, 8).map((l, i) => [`<span class="mono">${clock(-(i + 1) * 4100)}</span>`, `<span class="strong mono">${l}</span>`, l.includes("Invasion") ? "Invasion" : "RAAS", `${48 + (i * 7) % 30} dk`, 100 - i * 3, i % 2 ? "Takım 2, RGF" : "Takım 1, TRK", 40 + i * 17]))}
    ${H.pager(482)}`;
  return { html };
};

SCREENS["mod-players"] = s => {
  const team = t => SQ_PLAYERS.filter(p => p[2] === t);
  const tbl = (t, title) => `<section class="sec">${H.head(title, `${team(t).length} oyuncu`)}${H.table(`pl${t}`, ["Player", "Steam ID", "Squad", "Clans", ["Actions", "r"]], team(t).map(([n, id, , sq, cl]) => [`<span class="strong">${esc(n)}</span>${n === "Ghost" ? ` ${H.t("Banlı geçmiş", "warn")}` : ""}`, `<span class="mono">${id}</span>`, sq || "-", cl || "-", `<div class="row-actions">${["Uyar", "At", "Yasakla", "Takım değiştir"].map(a => H.act(a, "", `data-game="squad" data-player-act="${esc(n)}" data-preset="${a}"`)).join("")}</div>`]))}</section>`;
  const html = `
    ${H.head("Player List", "64 oyuncu bağlı, kuyrukta 3", H.search("Search by name or SteamID...", "plAll"))}
    <div id="plAll">${tbl(1, "Team 1: TRK Kara Kuvvetleri")}${tbl(2, "Team 2: RGF")}${tbl(0, "Unassigned")}</div>`;
  const mount = root => root.querySelector("[data-search=plAll]").addEventListener("input", e => { const q = norm(e.target.value); root.querySelectorAll("#plAll tbody tr").forEach(r => r.hidden = q && !norm(r.textContent).includes(q)); });
  return { html, mount };
};

SCREENS["mod-admins"] = s => {
  const html = `
    ${H.figs([["Roller", 4], ["Toplam kullanıcı", 17]])}
    <section class="sec">${H.head("Roller", "Admins.cfg grupları ve oyun izinleri", H.search("Rol, ID veya izin ara...", "adR") + `<button class="btn sm" data-toast="Rol formu (örnek)"><i data-lucide="plus"></i>Rol ekle</button>`)}
      ${H.table("adR", ["Rol Adı", "Oyun izinleri", ["Kullanıcı Sayısı", "r"], ["", "r"]], [["Owner", "changemap, pause, cheat, kick, ban, config, manageserver… (21)", 2], ["Moderator", "changemap, balance, chat, kick, ban, cameraman… (10)", 9], ["Seeder", "reserve", 4], ["Whitelist", "reserve", 2]].map(r => [`<span class="strong">${r[0]}</span>`, `<span class="mono muted">${r[1]}</span>`, r[2], `<div class="row-actions">${H.iact("Düzenle", "pencil", 'data-toast="Rol düzenleme (örnek)"')}${H.iact("Sil", "trash-2", `data-confirm="${r[0]} silinsin mi?|Bu roldeki kullanıcılar rolsüz kalır.|Sil"`)}</div>`]))}</section>
    <section class="sec">${H.head("Kullanıcılar", "", H.search("İsim, SteamID veya email", "adU"))}
      ${H.table("adU", ["Name", "Steam / EOS", "Email", "Rol", "Description", ["", "r"]], [["[TR] Bora", "76561198012345671", "bora@arkonas.net", "Owner", "Kurucu"], ["Selin", "76561198023456782", "selin@arkonas.net", "Moderator", "Gece vardiyası"], ["Mert", "0002a8f1c9e3…", "mert@arkonas.net", "Moderator", ""], ["Kurt", "76561198056789015", "-", "Seeder", "Seed ödülü"]].map(r => [`<span class="strong">${r[0]}</span>`, `<span class="mono">${r[1]}</span>`, r[2], r[3], `<span class="muted">${r[4] || "-"}</span>`, `<div class="row-actions">${H.iact("Düzenle", "pencil", 'data-toast="Kullanıcı düzenleme (örnek)"')}${H.iact("Kaldır", "user-minus", `data-confirm="${r[0]} kaldırılsın mı?|Admins.cfg'den silinir.|Kaldır"`)}</div>`]))}
      <form class="inline-form" onsubmit="event.preventDefault();toast('Kullanıcı eklendi (örnek)')">${H.input("", "name")}${H.input("", "EOSID, SteamID veya email", "text", 'class="mono"')}${H.input("", "email")}${H.sel(["Owner", "Moderator", "Seeder", "Whitelist"], "Moderator")}${H.input("", "description")}<button class="btn-game">Ekle</button></form></section>`;
  return { html };
};

SCREENS["mod-whitelist"] = s => {
  const html = `
    ${H.head("Whitelist Manager", "Rezerve slot ve whitelist kayıtları.", H.swl(true, "Whitelist aktif") + H.search("Whitelist oyuncu, ID, ekleyen veya durum ara...", "wlT", "260px"))}
    ${H.table("wlT", ["Oyuncu Adı", "Steam ID", "EOS ID", "Ekleyen", "Eklenme Tarihi", "Bitiş Tarihi", ["", "r"]], [["Kurt", "76561198056789015", "0002c1…", "Seed ödülü", "12 Eyl", "19 Eyl"], ["Ghost", "76561198045678904", "0002f9…", "Selin", "1 Eyl", "Kalıcı"], ["Dmitri", "76561198078901237", "0002aa…", "Seed ödülü", "14 Eyl", H.t("bugün", "warn")], ["mehmet55", "76561198034567893", "-", "Bora", "20 Ağu", "Kalıcı"]].map(r => [`<span class="strong">${r[0]}</span>`, `<span class="mono">${r[1]}</span>`, `<span class="mono">${r[2]}</span>`, r[3], r[4], r[5], `<div class="row-actions">${H.iact("Süre uzat", "calendar-plus", 'data-toast="Süre uzatıldı (örnek)"')}${H.iact("Kaldır", "trash-2", `data-confirm="${r[0]} whitelist'ten çıkarılsın mı?||Kaldır"`)}</div>`]))}
    <form class="inline-form" onsubmit="event.preventDefault();toast('Whitelist kaydı eklendi (örnek)')">${H.input("", "Oyuncu adı")}${H.input("", "SteamID veya EOS ID", "text", 'class="mono"')}${H.sel(["Kalıcı", "1 gün", "7 gün", "30 gün"], "7 gün")}<button class="btn-game">Ekle</button></form>`;
  return { html };
};

SCREENS["mod-filter"] = s => {
  const html = `
    ${H.figs([["Toplam filtre", 6], ["Aktif filtre", 5]])}
    ${H.head("Filtering System", "Sohbet, bağlantı ve manga adlarında eşleşen metinler için otomatik sonuç.", H.search("Filtre adı, metni, sonuç veya olay türü ara...", "flT", "280px") + `<button class="btn sm" data-toast="Filtre formu (örnek)"><i data-lucide="plus"></i>Filtre ekle</button>`)}
    ${H.table("flT", ["Filtre Adı", "Filtre Metni", "Olay türleri", "Sonuç", "Aktif"], [["Küfür listesi", "a**, s***…", "Sohbet mesajı", "Uyar", true], ["Reklam", "discord.gg/", "Sohbet mesajı", "At", true], ["Irkçı manga adı", "regex: (n[i1]g|…)", "Manga oluşturma", "Manga dağıt", true], ["Klon isim", "Bora|B0ra", "Oyuncu bağlantısı", "At", true], ["Caps", ">70% büyük harf", "Sohbet mesajı", "Uyar", false], ["Admin taklidi", "[ADMIN]", "Oyuncu bağlantısı", "Yasakla", true]].map(r => [`<span class="strong">${r[0]}</span>`, `<span class="mono">${esc(r[1])}</span>`, r[2], r[3] === "Yasakla" ? H.t(r[3], "bad") : r[3], H.sw(r[4], r[0])]))}`;
  return { html };
};

SCREENS["mod-rules"] = s => {
  const cats = [["A", "Davranış", [["A1", "Hakaret ve küfür yasaktır.", "UYARI"], ["A2", "Bilerek takım hasarı vermek yasaktır.", "KICK"], ["A3", "Irkçı söylem.", "BAN 7 GÜN"]]], ["B", "Manga", [["B1", "Manga liderinin mikrofonu olmalıdır.", "UYARI"], ["B4", "Sebepsiz manga kilidi yasaktır.", "UYARI"]]], ["C", "Hile ve istismar", [["C1", "Hile ve üçüncü parti yazılım.", "KALICI BAN"], ["C2", "Harita istismarı.", "BAN 3 GÜN"]]]];
  const html = `
    ${H.head("Server Rules", `Kurallar ceza diyaloglarında kural kodu olarak kullanılır. <a class="link" href="#/kurallar/${s.id}">Herkese açık kural sayfası</a>`, H.search("Kural, kategori, kod veya sonuç ara...", "ruAll") + `<button class="btn sm" data-toast="Kural formu (örnek)"><i data-lucide="plus"></i>Kural ekle</button>`)}
    ${H.figs([["Kategoriler", 3], ["Alt kategoriler", 0], ["Kurallar", 7]])}
    <div id="ruAll">${cats.map(([c, n, rules]) => `<section class="sec"><h3>${c}. ${n}</h3>${H.table("ru" + c, [["Kod", ""], "Kural", "Sonuç", ["", "r"]], rules.map(r => [`<span class="mono strong">${r[0]}</span>`, r[1], H.t(r[2], r[2].includes("BAN") ? "bad" : r[2] === "KICK" ? "warn" : ""), `<div class="row-actions">${H.iact("Düzenle", "pencil", 'data-toast="Kural düzenleme (örnek)"')}</div>`]))}</section>`).join("")}</div>`;
  const mount = root => root.querySelector("[data-search=ruAll]").addEventListener("input", e => { const q = norm(e.target.value); root.querySelectorAll("#ruAll tbody tr").forEach(r => r.hidden = q && !norm(r.textContent).includes(q)); });
  return { html, mount };
};

SCREENS["mod-searchPlayers"] = s => {
  const html = `
    ${H.head("Search Players", "Steam, EOS ve panel profillerinde arar; ML ban ve BattleMetrics ban durumunu gösterir.")}
    <label class="field big"><i data-lucide="search"></i><input placeholder="SteamID, EOSID, oyuncu adı veya profil ID ara..." value="Ghost" aria-label="Oyuncu ara"></label>
    <div class="split">
      <div class="list"><div>${[["Ghost", "76561198045678904", "Canlı, Team 1, Bravo", true], ["Ghost_TR", "76561198111111111", "Canlı listede yok", false], ["ghostrider", "76561198122222222", "Canlı listede yok", false]].map((r, i) => `<div class="li" aria-selected="${i === 0}" tabindex="0"><b>${r[0]}${r[3] ? ` ${H.t("ML Banlı", "bad")}` : ""}</b><small class="mono">${r[1]}</small><small>${r[2]}</small></div>`).join("")}</div></div>
      <div class="detail">
        <div class="prof-head"><span class="face lg">G</span><div><h2>Ghost</h2><p class="muted">Profil ID <span class="mono">P-10442</span>, ${H.dotT("Canlı", "ok")}, Team 1, Bravo</p></div><div class="toolbar">${["Uyar", "At", "Yasakla", "Flag ekle", "Not ekle"].map(a => `<button class="btn sm" data-game="squad" data-player-act="Ghost" data-preset="${a}">${a}</button>`).join("")}</div></div>
        ${H.figs([["Skor", "1.284"], ["Banlı", "Hayır"], ["ML Ban", "Evet", "t-bad"], ["Flag", "2", "t-warn"]])}
        ${H.kv([["SteamID", '<span class="mono">76561198045678904</span>'], ["EOSID", '<span class="mono">0002f9a3c1e04b7d9e2f11c4a8b6d3e0</span>'], ["İlk Görülme", "3 Mar 2026"], ["Son Görülme", "şimdi"], ["BattleMetrics ban", H.t("1 kayıt, başka sunucu", "warn")], ["Son not", "Selin: manga kilitliyor, uyarıldı"]])}
        <section class="sec">${H.head("Olaylar", "", H.seg([["all", "Tüm eventler"], ["nodmg", "Hasar hariç"]], "", 0))}
          ${H.table("spEv", ["Zaman", "Event", "Faction", "Manga", "Aksiyon"], [[clock(-60), "Admin uyarısı: manga kilidi", "TRK", "Bravo", "AdminWarn"], [clock(-300), "Kurt'a takım hasarı", "TRK", "Bravo", "-"], [clock(-900), "Bağlandı", "-", "-", "-"]].map(r => [`<span class="mono">${r[0]}</span>`, r[1], r[2], r[3], r[4]]))}</section>
      </div>
    </div>`;
  return { html };
};

SCREENS["mod-searchSquads"] = s => {
  const html = `
    ${H.head("Search Squads", "Bir mangayı ve geçmişini bul; manga adı, lider veya oyuncuya göre.", H.search("Manga adı veya oyuncu", "sqsT") + H.select(["Bu maç", "Son 24 saat", "Son 7 gün"]))}
    ${H.table("sqsT", ["Zaman", "Manga", "Oyuncu", "Olay"], [[clock(-1200), "Alpha, Team 1", "[TR] Bora", "Manga oluşturdu"], [clock(-1180), "Alpha, Team 1", "Selin", "Mangaya katıldı"], [clock(-900), "ARMOR, Team 2", "sasha", "Manga oluşturdu"], [clock(-600), "Bravo, Team 1", "Ghost", "Mangayı kilitledi"], [clock(-300), "Bravo, Team 1", "Ghost", "Admin: manga dağıtıldı"]].map(r => [`<span class="mono">${r[0]}</span>`, `<span class="strong">${r[1]}</span>`, `<button class="plink" data-game="squad" data-player-act="${r[2]}">${r[2]}</button>`, r[3]]))}
    <section class="sec"><h3>Manga bilgisi olmayan oyuncular</h3><p class="muted">yeni_oyuncu, Kurt (maç bilgisi bekleniyor)</p></section>`;
  return { html };
};

SCREENS["mod-requests"] = s => {
  const html = `
    ${H.head("Admin Requests", "Oyun içi !admin çağrıları. Üstlenen yetkili oyuncuya bildirilir.", H.search("İsim, ID veya mesaj ile arayın...", "rqT"))}
    ${H.seg([["all", "Tümü"], ["open", "Bekliyor"], ["mine", "Üstlendiklerim"], ["done", "Kapandı"]], "rqT", 1, "st")}
    ${H.table("rqT", ["Zaman", "Oyuncu", "Mesaj", "Durum", ["", "r"]], [["open", "mehmet55", "Bravo manga kilitli ve trolluyor"], ["open", "Kurt", "takım hasarı yapan var mehmet55"], ["mine", "Dmitri", "russian squad need admin pls"], ["done", "yeni_oyuncu", "nasıl manga açılır"]].map(([st, p, m], i) => ({ attrs: `data-st="${st}"`, cells: [`<span class="mono">${clock(-i * 200)}</span>`, `<button class="plink" data-game="squad" data-player-act="${p}">${p}</button>`, esc(m), st === "open" ? H.dotT("Bekliyor", "warn") : st === "mine" ? H.dotT(`Üstlendi: ${DATA.user.name}`, "ok") : H.dotT("Kapandı", "idle"), `<div class="row-actions">${st === "open" ? H.act("Üstlen", "hand", 'data-toast="Çağrı üstlenildi, oyuncuya bildirildi (örnek)"') : ""}${st !== "done" ? H.act("Kapat", "check", 'data-toast="Çağrı kapandı (örnek)"') : ""}</div>`] })))}`;
  const mount = root => root.querySelector('[data-seg=rqT] button[data-v="open"]').click();
  return { html, mount };
};

SCREENS["mod-seedSettings"] = s => {
  const html = `
    ${H.head("Seed Settings", "Sunucu boşken seed modu, eşik ve ödül kuralları.")}
    <div class="form-stack">
      <div class="setrow"><div><b>Jensen Seeding Modu</b><p>Oyuncu eşiğine kadar seed layer'larında döner, sonra normal rotasyona geçer.</p></div>${H.sw(true, "Jensen Seeding Modu")}</div>
      <div class="setrow"><div><b>Oyuncu Eşiği</b><p>Bu sayıya ulaşınca seed biter.</p></div><input class="num" value="40" inputmode="numeric" aria-label="Oyuncu Eşiği"></div>
      <div class="setrow"><div><b>Seed layer havuzu</b><p>Seed sırasında seçilecek layer'lar.</p></div><select aria-label="Seed layer havuzu"><option>Skirmish + Seed (6)</option><option>Yalnız Seed (3)</option></select></div>
      <div class="setrow"><div><b>Ödül olarak Whitelist ver</b><p>Seed'de kalan oyuncuya süreli rezerve slot.</p></div>${H.sw(true, "Ödül olarak Whitelist ver")}</div>
      <div class="setrow"><div><b>Ödül eşiği</b><p>Gerekli seed süresi ve ödül süresi.</p></div><span class="toolbar"><input class="num" value="60" aria-label="Gerekli dakika"> dk için <input class="num" value="7" aria-label="Ödül gün"> gün</span></div>
      <div class="setrow"><div><b>Seed duyurusu</b><p>Seed sırasında 5 dakikada bir yayınlanır.</p></div><input value="Seed devam ediyor! 40 oyuncuda normal maç başlar." aria-label="Seed duyurusu" style="width:min(420px,100%)"></div>
    </div>
    <div><button class="btn-game" data-toast="Seed ayarları kaydedildi (örnek)">Kaydet</button></div>`;
  return { html };
};

SCREENS["mod-seedManager"] = s => {
  const rows = [["Kurt", 6, "4 sa 10 dk", 250, 100, true], ["Dmitri", 4, "2 sa 40 dk", 160, 100, true], ["mehmet55", 2, "48 dk", 48, 80, false], ["yeni_oyuncu", 1, "22 dk", 22, 36, true], ["sasha", 3, "1 sa 30 dk", 90, 100, false]];
  const html = `
    ${H.figs([["Şu an seed'de", "12 oyuncu"], ["Seed bitişine", "28 oyuncu"], ["Bu hafta ödül", "9"]])}
    ${H.head("Seed Manager", "Seed katılımı ve ödül ilerlemesi.", H.search("Oyuncu", "smT") + H.seg([["all", "Tüm Durumlar"], ["a", "Aktif"], ["p", "Pasif"]], "smT", 0, "st"))}
    ${H.table("smT", ["Oyuncu", ["Katılım", "r"], ["Süre", "r"], ["Puan", "r"], "İlerleme", "Durum", ["Aksiyon", "r"]], rows.map(([n, k, d, p, pr, a]) => ({ attrs: `data-st="${a ? "a" : "p"}"`, cells: [`<span class="strong">${n}</span>`, k, d, p, meter(pr, `%${pr}`), a ? H.dotT("Aktif", "ok") : H.dotT("Pasif", "idle"), `<div class="row-actions">${pr >= 100 ? H.act("Ödülü ver", "gift", 'data-toast="Whitelist ödülü verildi (örnek)"') : ""}${H.iact("Sıfırla", "rotate-ccw", `data-confirm="${n} ilerlemesi sıfırlansın mı?||Sıfırla"`)}</div>`] })))}`;
  return { html };
};

SCREENS["mod-tickets"] = s => {
  const html = `
    ${H.head("Ticket System", "Oyun içi ve panelden açılan Squad ticketları.", H.search("Ticket, oyuncu, ID veya mesaj ara...", "tkT") + `<button class="btn-game" id="tkNew"><i data-lucide="plus"></i>Ticket aç</button>`)}
    ${H.seg([["all", "Tümü"], ["Açık", "Açık"], ["İnceleniyor", "İnceleniyor"], ["Devam", "Devam Ediyor"], ["Kapalı", "Kapalı"]], "tkT", 0, "st")}
    ${H.table("tkT", ["#", "Başlık", "Oyuncu", "SteamID", "Öncelik", "Durum", "Güncelleme"], [["T-311", "Haksız kick itirazı", "mehmet55", "76561198034567893", "Normal", "Açık"], ["T-310", "Takım hasarı videosu", "Kurt", "76561198056789015", "Acil", "İnceleniyor"], ["T-305", "VIP slot çalışmıyor", "Dmitri", "76561198078901237", "Normal", "Devam"], ["T-298", "Ban itirazı", "Ghost", "76561198045678904", "Normal", "Kapalı"]].map(r => ({ attrs: `data-st="${r[5]}"`, cells: [`<span class="mono">${r[0]}</span>`, `<span class="strong">${r[1]}</span>`, r[2], `<span class="mono">${r[3]}</span>`, r[4] === "Acil" ? H.t("Acil", "bad") : "Normal", H.dotT(r[5] === "Devam" ? "Devam Ediyor" : r[5], r[5] === "Kapalı" ? "idle" : r[5] === "Açık" ? "warn" : "ok"), "bugün"] })))}`;
  const mount = root => root.querySelector("#tkNew").onclick = () => openLayer(`<div class="dialog wide" role="dialog" aria-modal="true" aria-labelledby="tkD"><div class="dialog-head"><div><h2 id="tkD">Ticket aç</h2><p>Oyuncu adına veya operatör notu olarak.</p></div></div>
    <div class="dialog-body"><div class="form-grid">${H.field("Başlık", H.input("", "Kısa ticket başlığı"), "span")}${H.field("Oyuncu", H.input("", "Oyuncu adı"))}${H.field("Öncelik", H.sel(["Normal", "Acil"]))}${H.field("SteamID", H.input("", "7656...", "text", 'class="mono"'))}${H.field("EOS ID", H.input("", "EOS ID", "text", 'class="mono"'))}<label class="f span">Mesaj<textarea rows="4" placeholder="Kanıt, bağlam veya operatör notu"></textarea></label></div></div>
    <div class="dialog-foot"><button class="btn ghost" id="tkC">Vazgeç</button><button class="btn-game" id="tkGo">Oluştur</button></div></div>`, sc => { sc.querySelector("#tkC").onclick = closeLayer; sc.querySelector("#tkGo").onclick = () => { closeLayer(); toast("Ticket açıldı (örnek)"); }; });
  return { html, mount };
};

const SQ_PLUGINS = [["auto-tk-warn", "Takım hasarında otomatik uyarı", true], ["seeding-mode", "Jensen seed modu", true], ["discord-admin-request", "!admin çağrılarını Discord'a gönderir", true], ["team-randomizer", "Maç sonunda takımları karıştırır", false], ["auto-kick-unassigned", "Mangasız oyuncuyu 10 dk sonra atar", true], ["discord-killfeed", "Ölüm akışını Discord'a yazar", false], ["arkonas-panel-bridge", "Panel olay köprüsü", true]];
SCREENS["mod-plugins"] = (orig => s => s.game === "squad" ? (() => {
  const html = `
    ${H.figs([["Toplam eklenti", SQ_PLUGINS.length], ["Aktif eklenti", SQ_PLUGINS.filter(p => p[2]).length], ["Çalıştığı yer", "SquadJS, Arkonas üzerinde"]])}
    <div class="split">
      <div class="list"><div class="list-tools">${H.search("Eklenti, kategori, durum veya ayar ara...", "sqPl", "100%")}</div><div id="sqPl">${SQ_PLUGINS.map((p, i) => `<div class="li" tabindex="0" data-i="${i}" aria-selected="${i === 0}"><b class="mono">${p[0]}</b><small>${p[1]}, ${p[2] ? H.t("aktif", "ok") : "pasif"}</small></div>`).join("")}</div></div>
      <div class="detail" id="sqPlD"></div>
    </div>`;
  const show = (root, i) => { const p = SQ_PLUGINS[i]; const d = root.querySelector("#sqPlD"); d.innerHTML = `<div class="prof-head"><div><h2 class="mono">${p[0]}</h2><p class="muted">${p[1]}</p></div>${H.swl(p[2], "Etkin")}</div><div class="edit-head"><b>CONFIG JSON</b><div class="toolbar" style="margin-left:auto"><button class="btn sm" data-toast="Kaydedildi, SquadJS yeniden yükleniyor (örnek)">Kaydet</button></div></div>${H.code(['{', `  <span class="k">"plugin"</span>: <span class="s">"${p[0]}"</span>,`, `  <span class="k">"enabled"</span>: <span class="b">${p[2]}</span>,`, '  <span class="k">"channelID"</span>: <span class="s">"1182…"</span>,', '  <span class="k">"interval"</span>: <span class="n">300000</span>', '}'])}`; bindCommon(d); icons(); };
  const mount = root => { show(root, 0); root.querySelectorAll("#sqPl .li").forEach(li => li.onclick = () => { root.querySelectorAll("#sqPl .li").forEach(x => x.setAttribute("aria-selected", x === li)); show(root, +li.dataset.i); }); };
  return { html, mount };
})() : orig(s))(SCREENS["mod-plugins"]);

SCREENS["mod-flags"] = s => {
  const html = `
    ${H.figs([["Toplam işaret", 5], ["Aktif işaret", 4]])}
    ${H.head("Flag Manager", "Oyunculara iliştirilen işaretler; profil ve canlı listede görünür.", H.search("İşaret, oyuncu, ID veya açıklama ara...", "fgT", "260px") + `<button class="btn sm" data-toast="İşaret formu (örnek)"><i data-lucide="plus"></i>İşaret ekle</button>`)}
    ${H.table("fgT", ["İşaret Adı", "Açıklama", ["Etkilenen oyuncular", "r"], "Oluşturan", "Aktif"], [["Troll", "oklch(.76 .14 22)", "Sürekli trol, gözle", 6, "Selin", true], ["Yeni oyuncu", "oklch(.865 .127 207)", "İlk hafta, sabırlı ol", 41, "Sistem", true], ["Klan lideri", "oklch(.85 .12 164)", "", 8, "Bora", true], ["Hile şüphesi", "oklch(.86 .12 80)", "Demo kaydı istenecek", 2, "Mert", true], ["Eski admin", "oklch(.7 .03 256)", "", 3, "Bora", false]].map(r => [`<span class="pname"><span class="swatch" style="background:${r[1]}"></span><b>${r[0]}</b></span>`, `<span class="muted">${r[2] || "-"}</span>`, r[3], r[4], H.sw(r[5], r[0])]))}`;
  return { html };
};

const banTable = (id, rows, sl) => H.table(id, ["Oyuncu", "SteamID", "Sebep", ...(sl ? [] : ["Kural kodu"]), "Banlayan", "Başlangıç", "Bitiş", ["", "r"]], rows.map(r => ({ attrs: `data-exp="${r.exp ? 1 : 0}"${r.exp ? " hidden" : ""}`, cells: [`<span class="strong">${r.n}</span>`, `<span class="mono">${r.id}</span>`, r.why, ...(sl ? [] : [`<span class="mono">${r.code}</span>`]), r.by, r.from, r.exp ? H.t(r.to, "") : r.to === "Kalıcı" ? H.t("Kalıcı", "bad") : r.to, r.exp ? "" : `<div class="row-actions">${H.act("Kaldır", "undo-2", `data-unban="${r.n}"`)}</div>`] })));
function unbanBind(root) {
  root.querySelectorAll("[data-unban]").forEach(b => b.onclick = () => openLayer(`<div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="ubT"><div class="dialog-head"><div><h2 id="ubT">${b.dataset.unban} yasağı kaldırılsın mı?</h2><p>Onaylamak için aşağıdaki kodu yaz: <b class="mono" style="color:var(--ink)">4821</b></p></div></div>
    <div class="dialog-body"><label class="f">Onay kodu<input class="mono" id="ubIn" placeholder="Onay kodu" inputmode="numeric"></label></div>
    <div class="dialog-foot"><button class="btn ghost" id="ubC">Vazgeç</button><button class="btn danger" id="ubGo" disabled>Yasağı kaldır</button></div></div>`, sc => { const i = sc.querySelector("#ubIn"), g = sc.querySelector("#ubGo"); i.oninput = () => g.disabled = i.value !== "4821"; sc.querySelector("#ubC").onclick = closeLayer; g.onclick = () => { closeLayer(); toast("Yasak kaldırıldı (örnek)"); }; }));
  const t = root.querySelector("[data-show-exp]");
  if (t) t.addEventListener("click", () => setTimeout(() => { const on = t.querySelector(".sw").getAttribute("aria-checked") === "true"; root.querySelectorAll("tr[data-exp='1']").forEach(r => r.hidden = !on); }, 0));
}
SCREENS["mod-bans"] = s => {
  const rows = [{ n: "griefer_sq", id: "76561198999000111", why: "Takım hasarı (tekrarlı)", code: "A2", by: "Selin", from: "18 Eyl", to: "25 Eyl" }, { n: "cheater99", id: "76561198999000222", why: "Hile", code: "C1", by: "Bora", from: "2 Eyl", to: "Kalıcı" }, { n: "toxic_tr", id: "76561198999000333", why: "Irkçı söylem", code: "A3", by: "Mert", from: "12 Eyl", to: "19 Eyl" }, { n: "oldban", id: "76561198999000444", why: "Hakaret", code: "A1", by: "Selin", from: "1 Ağu", to: "2 Ağu", exp: true }];
  const html = `
    ${H.head("Ban Manager", "Bans.cfg ve panel banları. Kaldırma onay kodu ister.", H.search("Ban, oyuncu, ID, sebep veya kural ara...", "bnT", "260px") + `<button class="btn-game" data-game="squad" data-player-act="" data-preset="Yasakla"><i data-lucide="plus"></i>Yeni ban</button>`)}
    <label class="swl" data-show-exp>${H.sw(false, "Pasif / süresi dolmuş banları göster")}<span>Pasif / süresi dolmuş banları göster</span></label>
    ${banTable("bnT", rows)}`;
  return { html, mount: unbanBind };
};
SCREENS["mod-slban"] = s => {
  const rows = [{ n: "cheater99", id: "76561198999000222", why: "Hile (topluluk listesi)", by: "SquadLeague", from: "2 Eyl", to: "Kalıcı" }, { n: "ddos_guy", id: "76561198999000555", why: "Sunucu saldırısı", by: "SquadLeague", from: "20 Ağu", to: "Kalıcı" }, { n: "smurf12", id: "76561198999000666", why: "Ban kaçağı", by: "SquadLeague", from: "1 Tem", to: "1 Eyl", exp: true }];
  const html = `
    ${H.figs([["Aktif", 2], ["Toplam", 3]])}
    ${H.head("SLBan Manager", "Ortak ban listesinden gelen kayıtlar.", H.search("SL ban, oyuncu, ID veya sebep ara...", "slT", "260px"))}
    <label class="swl" data-show-exp>${H.sw(false, "Süresi dolmuş banları göster")}<span>Süresi dolmuş banları göster</span></label>
    ${banTable("slT", rows, true)}`;
  return { html, mount: unbanBind };
};

const AUDIT_SECTIONS = [["kullanicilar", "Kullanıcılar", "users"], ["roller", "Roller ve izinler", "shield-check"], ["oyun-yetkilileri", "Oyun yetkilileri", "gamepad-2"], ["gunluk", "Denetim günlüğü", "scroll-text"], ["isler", "İşler ve görevler", "list-checks"]];
const PANEL_PERMS = [["Sunucu", ["Sunucu Oluşturma", "Sunucu Silme", "Sunucu İçe Aktarma", "Yedekten Geri Yükleme", "Sunucu Yöneticisi / Admin"]], ["Kullanıcı", ["Kullanıcı Yönetimi", "Panel Rol Yönetimi", "Denetim Günlüğü Okuma"]], ["Sistem", ["Sistem ve Node Ayarları"]], ["Oyun", ["Minecraft Oyuncu Rolleri", "Moderasyon: ceza", "Moderasyon: profil okuma", "Plugin config düzenleme"]]];
const USERS = [["Aydoğan", "owner@arkonas.net", "Sahip", "Tüm sunucular", "şimdi", "ok"], ["Mert", "mert@arkonas.net", "Moderatör", "SMP, Skyblock, Squad #1", "12 dk önce", "ok"], ["Selin", "selin@arkonas.net", "Moderatör", "Squad #1", "dün", "ok"], ["Bora", "bora@arkonas.net", "Operatör", "Tüm sunucular", "3 gün önce", "ok"], ["eski_mod", "eski@arkonas.net", "İzleyici (Salt Okunur)", "-", "2 ay önce", "idle"]];
const AUDIT_SCREENS = {
  kullanicilar: () => ({
    html: `${H.head("Kullanıcı Hesapları", "Panel hesapları, roller ve sunucu erişimi.", H.search("İsim, e-posta veya ID ile ara...", "usT", "240px") + `<button class="btn-game" id="usNew"><i data-lucide="user-plus"></i>Yeni kullanıcı</button>`)}
      ${H.table("usT", ["Ad", "E-posta", "Rol", "Sunucu erişimi", "Son giriş", "Durum", ["", "r"]], USERS.map(u => [`<span class="pname"><span class="face" aria-hidden="true">${u[0][0].toUpperCase()}</span><b>${u[0]}</b></span>`, u[1], u[2], `<span class="muted">${u[3]}</span>`, u[4], u[5] === "ok" ? H.dotT("Aktif", "ok") : H.dotT("Askıda", "idle"),
        u[2] === "Sahip" ? "" : `<div class="row-actions">${H.iact("Düzenle", "pencil", 'data-toast="Kullanıcı düzenleme (örnek)"')}${H.iact("Parola sıfırlama bağlantısı", "key-round", 'data-toast="Sıfırlama bağlantısı oluşturuldu (örnek)"')}${H.iact("Tüm Oturumları Kapat", "log-out", `data-confirm="${u[0]} tüm oturumlardan çıkarılsın mı?||Oturumları kapat"`)}${H.iact(u[5] === "ok" ? "Hesabı Askıya Al" : "Hesabı Yeniden Aktifleştir", u[5] === "ok" ? "user-x" : "user-check", `data-confirm="${u[5] === "ok" ? "Hesap askıya alınsın mı?|" + u[0] + " panele giriş yapamaz.|Askıya al" : "Hesap yeniden aktifleştirilsin mi?||Aktifleştir"}"`)}</div>`]))}
      <section class="sec">${H.head("Panel Rol Atamaları", "Kullanıcı başına doğrudan tanımlı özel izinler de burada görünür.")}
        ${H.kv([["Sahip", "1 kullanıcı"], ["Operatör", "1 kullanıcı"], ["Moderatör", "2 kullanıcı"], ["İzleyici (Salt Okunur)", "1 kullanıcı"], ["Özel Panel İzinleri (Doğrudan Tanımlı)", "Mert: Plugin config düzenleme"]], "narrow")}</section>`,
    mount: root => root.querySelector("#usNew").onclick = openUserWizard
  }),
  roller: () => {
    const roles = [["sahip", "Sahip", "Tüm izinler, değiştirilemez", 1], ["operator", "Operatör", "Sunucu yaşam döngüsü ve node", 1], ["moderator", "Moderatör", "Oyun içi moderasyon", 2], ["izleyici", "İzleyici (Salt Okunur)", "Yalnız okuma", 1]];
    const perms = r => PANEL_PERMS.map(([g, ps]) => `<fieldset class="perm"><legend>${g}</legend>${ps.map((p, i) => `<label class="chk"><input type="checkbox" ${r === 0 || (r === 1 && g !== "Kullanıcı") || (r === 2 && g === "Oyun") || (r === 3 && p === "Denetim Günlüğü Okuma") ? "checked" : ""} ${r === 0 ? "disabled" : ""}>${p}</label>`).join("")}</fieldset>`).join("");
    return {
      html: `${H.head("Panel Rolleri ve İzinleri", "Rol builder: izinleri seç, kullanıcıya ata.", `<button class="btn sm" data-toast="Yeni rol taslağı (örnek)"><i data-lucide="plus"></i>Yeni rol</button>`)}
        <div class="split"><div class="list" id="rlList">${roles.map((r, i) => `<div class="li" tabindex="0" data-i="${i}" aria-selected="${i === 2}"><b>${r[1]}</b><small>${r[2]}, ${r[3]} kullanıcı</small></div>`).join("")}</div>
        <div class="detail" id="rlD"></div></div>`,
      mount: root => {
        const show = i => { const r = roles[i]; root.querySelector("#rlD").innerHTML = `<div class="form-grid">${H.field("İsim", H.input(r[1], "", "text", i === 0 ? "disabled" : ""))}${H.field("Anahtar (değişmez)", H.input(r[0], "ornek-moderator", "text", 'disabled class="mono"'))}${H.field("Açıklama", H.input(r[2]), "span")}</div>${i === 0 ? `<p class="hint">Salt okunur. Sahip rolü düzenlenemez.</p>` : ""}<div class="perms">${perms(i)}</div>${i === 0 ? "" : `<div class="toolbar"><button class="btn-game" data-toast="Rol kaydedildi (örnek)">Kaydet</button><button class="btn danger" data-confirm="Rol silinsin mi?|Bu role atanmış kullanıcılar İzleyici olur.|Sil">Rolü sil</button></div>`}`; bindCommon(root.querySelector("#rlD")); icons(); };
        show(2); root.querySelectorAll("#rlList .li").forEach(li => li.onclick = () => { root.querySelectorAll("#rlList .li").forEach(x => x.setAttribute("aria-selected", x === li)); show(+li.dataset.i); });
      }
    };
  },
  "oyun-yetkilileri": () => ({
    html: `${H.head("Panele Kayıtsız Oyun Yetkilileri", "Oyun içinde yetkisi olan ama panel hesabı olmayan kişiler. Hesap açınca kimlik eşleşir.", H.search("İsim veya ID", "oyT"))}
      ${H.table("oyT", ["Kişi", "Sunucu", "Oyun rolü", "Kimlik", ["", "r"]], [["Kurt", "Squad #1", "Seeder", '<span class="mono">76561198056789015</span>'], ["Tarkan_", "SMP", "kaptan (LuckPerms)", '<span class="mono">5e4d3c2b…</span>'], ["helper_ali", "Skyblock", "helper", '<span class="mono">a1b2c3d4…</span>']].map(r => [`<span class="strong">${r[0]}</span>`, r[1], r[2], r[3], `<div class="row-actions">${H.act("Hesap aç", "user-plus", 'data-open-wizard')}</div>`]))}`,
    mount: root => root.querySelectorAll("[data-open-wizard]").forEach(b => b.onclick = openUserWizard)
  }),
  gunluk: () => ({
    html: `${H.head("Denetim Günlüğü", "Sistem ve yetki değişiklikleri geçmişi.", H.search("Kullanıcı, işlem veya hedef", "lgT") + H.select(["Tüm işlemler", "Sunucu yaşam döngüsü", "Moderasyon", "Kullanıcı ve rol", "Dosya ve config"]) + H.select(["Son 24 saat", "Son 7 gün", "Son 30 gün"]))}
      ${H.table("lgT", ["Zaman", "Kullanıcı", "İşlem", "Hedef", "Değişiklik Özeti"], [["Mert", "moderation:action", "SMP, griefer_tr", "Ban 7 gün, Grief"], ["Aydoğan", "server:restart", "Skyblock", "Zamanlanmış görev dışı"], ["Selin", "moderation:action", "Squad #1, Ghost", "AdminWarn: manga kilidi"], ["Aydoğan", "file:write", "Skyblock, bukkit.yml", "connection-throttle 4000 → -1"], ["Bora", "role:update", "Moderatör", "+ Plugin config düzenleme"], ["Aydoğan", "user:suspend", "eski_mod", "Hesap askıya alındı"]].map((r, i) => [`<span class="mono">${clock(-i * 1700)}</span>`, r[0], `<span class="mono">${r[1]}</span>`, r[2], `<span class="muted">${esc(r[3])}</span>`]))}
      ${H.pager(9214)}`
  }),
  isler: () => ({
    html: `${H.head("İşler ve Görevler", "Arka plan iş kuyruğu ve işlem geçmişi.", H.seg([["all", "Tümü"], ["run", "Çalışıyor"], ["q", "Kuyrukta"], ["done", "Bitti"], ["fail", "Hata"]], "isT", 0, "st"))}
      ${H.table("isT", ["İş", "Sunucu", "İsteyen", "Durum", "Başlangıç", ["Süre", "r"], ["", "r"]], [["run", "Dünya optimizasyonu", "SMP", "Aydoğan", "%62"], ["q", "Yedek", "Skyblock", "Zamanlanmış", ""], ["done", "Yeniden başlat", "Lobby", "Mert", ""], ["fail", "Güncelleme", "Reforger Test", "Bora", "steamcmd zaman aşımı"], ["done", "Node bootstrap", "arkonas-proxy", "Aydoğan", ""]].map(([st, a, b, c, d], i) => ({ attrs: `data-st="${st}"`, cells: [`<span class="strong">${a}</span>`, b, `<span class="muted">İsteyen: ${c}</span>`, st === "run" ? H.dotT(`Çalışıyor ${d}`, "ok") : st === "q" ? H.dotT("Kuyrukta", "idle") : st === "done" ? H.dotT("Bitti", "ok") : H.dotT(`Hata: ${d}`, "bad"), `<span class="mono">${clock(-i * 900)}</span>`, st === "q" ? "-" : `${2 + i * 3} dk`, `<div class="row-actions">${st === "fail" ? H.act("Tekrar dene", "rotate-cw", 'data-toast="İş yeniden kuyruğa alındı"') : ""}${st === "q" || st === "run" ? H.act("İptal", "x", 'data-confirm="İş iptal edilsin mi?||İptal et"') : ""}${H.iact("Günlük", "scroll-text", 'data-toast="İş günlüğü (örnek)"')}</div>`] })))}`
  })
};

function openUserWizard() {
  const steps = ["Hesap", "Rol", "Sunucu erişimi", "Oyun kimlikleri"];
  let st = 0;
  const body = () => [
    `<div class="form-grid">${H.field("Email *", H.input("", "ornek@alanadi.com", "email"), "span")}${H.field("Görünen ad", H.input("", "Örn: Mert"))}${H.field("Geçici parola", H.input("", "boş bırakılırsa davet bağlantısı", "password"))}</div>`,
    `<div class="radios">${["Operatör", "Moderatör", "İzleyici (Salt Okunur)", "Erişim Yok"].map((r, i) => `<label class="chk"><input type="radio" name="rl" ${i === 1 ? "checked" : ""}>${r}</label>`).join("")}</div><p class="hint">İzinleri ince ayarlamak için Roller ve izinler bölümünü kullan.</p>`,
    `<div class="radios">${DATA.servers.map(s => `<label class="chk"><input type="checkbox" ${["smp", "skyblock"].includes(s.id) ? "checked" : ""}>${esc(s.name)} <span class="muted">${DATA.games[s.game].label}</span></label>`).join("")}</div>`,
    `<div class="form-grid">${H.field("Steam64ID", H.input("", "Örn: 76561198...", "text", 'class="mono"'))}${H.field("EOSID", H.input("", "Örn: 0002...", "text", 'class="mono"'))}${H.field("Minecraft Oyuncu Adı / Görünen Ad *", H.input("", "Örn: Steve, Notch veya İsim"))}${H.field("Minecraft UUID", H.input("", "Örn: 853c8bb3-4c42-4952-9603-9cf65a1cb5b6", "text", 'class="mono"'))}${H.field("Discord ID", H.input("", "Örn: 123456789012345678", "text", 'class="mono"'))}</div>`
  ][st];
  const draw = sc => {
    sc.querySelector("#uwSteps").innerHTML = steps.map((x, i) => `<li aria-current="${i === st ? "step" : "false"}" class="${i < st ? "done" : ""}"><span>${i + 1}</span>${x}</li>`).join("");
    sc.querySelector("#uwBody").innerHTML = body();
    sc.querySelector("#uwBack").disabled = st === 0;
    sc.querySelector("#uwNext").textContent = st === steps.length - 1 ? "Kullanıcıyı oluştur" : "İleri";
  };
  openLayer(`<div class="dialog wide" role="dialog" aria-modal="true" aria-labelledby="uwT"><div class="dialog-head"><div><h2 id="uwT">Yeni kullanıcı</h2><p>Panel hesabı, rol, sunucu erişimi ve oyun kimlikleri.</p></div><button class="btn icon ghost" id="uwX" aria-label="Kapat"><i data-lucide="x"></i></button></div>
    <ol class="steps" id="uwSteps"></ol><div class="dialog-body" id="uwBody"></div>
    <div class="dialog-foot"><button class="btn ghost" id="uwBack">Geri</button><button class="btn-game" id="uwNext">İleri</button></div></div>`, sc => {
    draw(sc);
    sc.querySelector("#uwX").onclick = closeLayer;
    sc.querySelector("#uwBack").onclick = () => { st--; draw(sc); };
    sc.querySelector("#uwNext").onclick = () => { if (st === steps.length - 1) { closeLayer(); toast("Kullanıcı oluşturuldu, davet gönderildi (örnek)"); return; } st++; draw(sc); };
  });
}

const TICKETS = [
  { id: "#1042", who: "deniz_07", sid: "76561198012340001", t: "Eşyalarım silindi (crash sonrası)", st: "Yanıt Bekleniyor", pr: "Acil", srv: "SMP", msgs: [["p", "Dün akşam sunucu çökünce sandığımdaki netherit set gitti", "21:40"], ["p", "Ekran görüntüsü ekledim", "21:41"]], ev: 2 },
  { id: "#1041", who: "Ghost", sid: "76561198045678904", t: "Ban itirazı", st: "Açık", pr: "Normal", srv: "Squad #1", msgs: [["p", "Manga kilidi yüzünden uyarıldım ama kilitli değildi", "19:02"], ["me", "Demo kaydını inceliyoruz, yarın dönüş yapacağız.", "19:20"]], ev: 0 },
  { id: "#1039", who: "Efe_Can", sid: "-", t: "Bedrock'tan menü açılmıyor", st: "Yanıtlandı", pr: "Normal", srv: "Lobby", msgs: [["p", "Pusula menüsü açılmıyor", "dün"], ["me", "Güncelleme yaptık, tekrar dener misin?", "dün"]], ev: 1 },
  { id: "#1031", who: "mehmet55", sid: "76561198034567893", t: "VIP slot", st: "Kapalı", pr: "Normal", srv: "Squad #1", msgs: [["p", "VIP aldım slot çalışmıyor", "3 gün önce"], ["me", "Admins.cfg'ye eklendi.", "3 gün önce"]], ev: 0 }
];
function ticketDetail(t) {
  return `<div class="prof-head"><div><h2>${esc(t.t)} <span class="mono muted">${t.id}</span></h2><p class="muted">${t.srv}, ${t.pr === "Acil" ? H.t("Acil", "bad") : "Normal"}, ${t.st}</p></div>
      <div class="toolbar"><label class="field sel"><span class="sr">Durum</span><select>${["Açık", "Yanıt Bekleniyor", "Yanıtlandı", "Kapalı"].map(x => `<option${x === t.st ? " selected" : ""}>${x}</option>`).join("")}</select></label><button class="btn sm" data-toast="Ticket sana atandı (örnek)">Üstlen</button></div></div>
    <div class="ident"><span class="face">${t.who[0].toUpperCase()}</span><div><b>${esc(t.who)}</b><small class="mono">Steam ${t.sid}</small></div><a class="link" href="#/sunucu/${t.srv === "Squad #1" ? "squad1/mod-searchPlayers" : "smp/mod-profiles"}">Profili aç</a></div>
    <div class="chat" aria-live="polite">${t.msgs.map(([w, m, tm]) => `<div class="msg ${w === "me" ? "me" : ""}"><p>${esc(m)}</p><time>${w === "me" ? DATA.user.name + ", " : ""}${tm}</time></div>`).join("") || `<p class="muted">Henüz mesaj yok.</p>`}</div>
    ${t.ev ? `<div class="evid"><h3>Kanıtlar</h3><div class="thumbs">${Array.from({ length: t.ev }, (_, i) => `<button class="thumb" aria-label="Kanıt ${i + 1}"><i data-lucide="image"></i><span>ekran-${i + 1}.png</span></button>`).join("")}</div></div>` : ""}
    <form class="composer" onsubmit="event.preventDefault();toast('Yanıt gönderildi (örnek)')"><textarea rows="3" placeholder="Yanıt yaz. Oyuncu ticket sayfasında anında görür." aria-label="Yanıt"></textarea><div class="toolbar"><button type="button" class="btn sm ghost" data-toast="Dosya seçici (örnek)"><i data-lucide="paperclip"></i>Kanıt ekle</button><span class="muted" style="margin-right:auto;font-size:12px">MinIO'ya yüklenir, 25 MB'a kadar</span><button class="btn-game">Gönder</button></div></form>`;
}

const AREA_SCREENS = {
  denetim: sub => {
    const k = AUDIT_SECTIONS.some(x => x[0] === sub) ? sub : "kullanicilar";
    return { title: "Denetim", crumb: AUDIT_SECTIONS.find(x => x[0] === k)[1], ...AUDIT_SCREENS[k]() };
  },
  destek: () => ({
    title: "Destek",
    html: `${H.head("Destek", "ticket.arkonas.net üzerinden açılan ticketlar, tek havuz.", H.search("Ticket, oyuncu veya ID", "tkList"))}
      <div class="split tall"><div class="list"><div class="list-tools">${H.seg([["all", "Tümü"], ["Açık", "Açık"], ["Yanıt", "Yanıt Bekleniyor"], ["Yanıtlandı", "Yanıtlandı"], ["Kapalı", "Kapalı"]], "tkList", 0, "st")}</div>
        <div id="tkList">${TICKETS.map((t, i) => `<div class="li" tabindex="0" data-i="${i}" data-st="${t.st.split(" ")[0]}" aria-selected="${i === 0}"><b>${esc(t.t)}${t.pr === "Acil" ? ` ${H.t("Acil", "bad")}` : ""}</b><small>${t.id}, ${esc(t.who)}, ${t.srv}</small><small>${t.st === "Yanıt Bekleniyor" ? H.t(t.st, "warn") : t.st}</small></div>`).join("")}</div></div>
        <div class="detail" id="tkD">${ticketDetail(TICKETS[0])}</div></div>`,
    mount: root => root.querySelectorAll("#tkList .li").forEach(li => li.onclick = () => { root.querySelectorAll("#tkList .li").forEach(x => x.setAttribute("aria-selected", x === li)); const d = root.querySelector("#tkD"); d.innerHTML = ticketDetail(TICKETS[+li.dataset.i]); bindCommon(d); icons(); })
  }),
  yeni: game => game && WIZARDS[game] ? WIZARDS[game]() : ({
    title: "Yeni sunucu",
    html: `${H.head("Yeni sunucu", "Oyunu seç; kurulum sihirbazı node, kaynak ve ayarları sorar, sonra ön kontrol yapar.")}
      <ul class="pick">${[["minecraft", "Minecraft", "Paper, Purpur, Fabric, Vanilla ya da Velocity proxy. Şablonlar: Standart, Yoğun SMP, Modlu."], ["squad", "Squad", "SteamCMD ile kurulum, SquadJS ve RCON otomatik bağlanır."], ["arma", "Arma Reforger", "Senaryo ID ve Workshop modlarıyla kurulum."]].map(([k, l, d]) => `<li><a href="#/yeni/${k}"><span class="mark">${gameMark(k)}</span><span><b>${l}</b><small>${d}</small></span><i data-lucide="arrow-right"></i></a></li>`).join("")}</ul>
      <section class="sec">${H.head("Node durumu", "Kurulum yapılabilecek makineler")}${H.table("nsT", ["Node", "Boş RAM", "Boş disk", "Durum"], DATA.nodes.map(n => [`<span class="strong">${n.name}</span> <span class="mono muted">${n.host}</span>`, n.id === "main" ? "4,3 GB" : "5,0 GB", n.id === "main" ? "403 GB" : "126 GB", H.dotT("Hazır", "ok")]))}</section>
      <section class="sec"><h3>Kurulum rehberi</h3><ol class="guide"><li>Node seç; agent yanıt vermiyorsa önce Nodelar'dan bootstrap et.</li><li>Kaynakları belirle; node'daki boş RAM'in %80'inden fazlasını verme.</li><li>Ön kontrol port çakışmasını, disk alanını ve EULA'yı denetler.</li><li>İlk başlatmadan sonra sunucu panelde Durduruldu olarak görünür.</li></ol></section>`
  })
};

const WIZ = {
  minecraft: { label: "Minecraft", steps: [
    ["Şablon", () => `<div class="chips big">${[["Standart", "4 GB, 50 oyuncu"], ["Yoğun SMP", "10 GB, 200 oyuncu"], ["Modlu", "8 GB, Fabric"], ["Proxy", "Velocity, 1 GB"]].map(([n, d], i) => `<button type="button" class="chip" aria-pressed="${i === 1}"><b>${n}</b><small>${d}</small></button>`).join("")}</div><p class="hint">Hazır Başlangıç Şablonları değerleri doldurur; her alan sonra değiştirilebilir.</p>`],
    ["Çekirdek ve sürüm", () => `<div class="form-grid">${H.field("Sunucu Çekirdeği (Software / Flavor)", H.sel(["Paper", "Purpur", "Fabric", "Vanilla", "Velocity"], "Paper"))}${H.field("Minecraft Sürümü", H.sel(["1.21.8", "1.21.7", "1.21.4", "1.20.6"]))}${H.field("Kurulum kanalı", H.sel(["stable", "latest"]))}${H.field("Çalışma Altyapısı (Runtime)", H.sel(["Doğrudan (screen + systemd)", "Docker"]))}</div><div class="perms"><fieldset class="perm"><legend>Eklentiler</legend>${["LuckPerms", "EssentialsX", "ViaVersion", "GeyserMC & Floodgate"].map((p, i) => `<label class="chk"><input type="checkbox" ${i < 2 ? "checked" : ""}>${p}</label>`).join("")}</fieldset></div>`],
    ["Kaynaklar", () => `<div class="form-grid">${H.field("Node", H.sel(DATA.nodes.map(n => n.name)))}${H.field("Panel adı", H.input("", "Örn: Event Sunucusu"))}${H.field("Bellek (MB)", H.input("10240", "", "text", 'inputmode="numeric"'))}${H.field("Disk (GB)", H.input("40", "", "text", 'inputmode="numeric"'))}${H.field("Port", H.input("25570", "", "text", 'class="mono"'))}${H.field("Root path", H.input("/root/event", "", "text", 'class="mono"'))}${H.field("Oyuncu kapasitesi", H.input("200"))}${H.field("Yedek saklama (gün)", H.input("7"))}</div>`],
    ["Oyun ayarları", () => `<div class="form-grid">${H.field("Sunucu Başlığı (MOTD)", H.input("§b§lARKONAS §8» §7Event"), "span")}${H.field("Görüş Mesafesi (View Distance)", H.input("8"))}${H.field("Doğma Koruması (Spawn Protection Çapı)", H.input("0"))}${H.field("Dünya Tohumu (World Seed - Opsiyonel)", H.input("", "Boş bırakılırsa rastgele oluşturulur"), "span")}<label class="chk span"><input type="checkbox">Minecraft EULA kabul edildi (Zorunlu)</label></div><details class="adv"><summary>Gelişmiş Java ve Runtime Ayarları</summary><div class="form-grid">${H.field("JVM bayrakları", H.input("Aikar (önerilen)"))}${H.field("Java", H.sel(["21 (Temurin)", "25"]))}</div></details>`]
  ] },
  squad: { label: "Squad", steps: [
    ["Kaynaklar", () => `<div class="form-grid">${H.field("Node", H.sel(DATA.nodes.map(n => n.name)))}${H.field("Panel adı", H.input("", "Örn: Arkonas Squad #2"))}${H.field("Genel sunucu adı", H.input("[TR] Arkonas Squad #2"), "span")}${H.field("Root path", H.input("/home/squad/arkonas2", "", "text", 'class="mono"'))}${H.field("Oyuncu kapasitesi", H.input("100"))}</div>`],
    ["Portlar", () => `<div class="form-grid">${H.field("Game port", H.input("7797", "", "text", 'class="mono"'))}${H.field("Query port", H.input("27175", "", "text", 'class="mono"'))}${H.field("Beacon port", H.input("15010", "", "text", 'class="mono"'))}${H.field("RCON port", H.input("21124", "", "text", 'class="mono"'))}${H.field("Maks tick rate", H.input("50"))}${H.field("Maks FPS", H.input("60"))}</div>`],
    ["Entegrasyonlar", () => `<div class="perms"><fieldset class="perm"><legend>Kurulacaklar</legend>${["SquadJS", "Arkonas panel köprüsü", "Seed modu", "Discord admin çağrıları"].map((p, i) => `<label class="chk"><input type="checkbox" ${i < 3 ? "checked" : ""}>${p}</label>`).join("")}</fieldset></div>${H.field("Mod ID listesi (isteğe bağlı)", H.input("", "virgülle ayır"))}`]
  ] },
  arma: { label: "Arma Reforger", steps: [
    ["Kaynaklar", () => `<div class="form-grid">${H.field("Node", H.sel(DATA.nodes.map(n => n.name)))}${H.field("Panel adı", H.input("", "Örn: Reforger Etkinlik"))}${H.field("Bellek (MB)", H.input("8192"))}${H.field("Disk (GB)", H.input("60"))}${H.field("Port", H.input("2001", "", "text", 'class="mono"'))}${H.field("Protokol", H.sel(["UDP"]))}</div>`],
    ["Senaryo ve modlar", () => `<div class="form-grid">${H.field("Senaryo ID", H.input("{ECC61978EDCC2B5A}Missions/23_Campaign.conf", "", "text", 'class="mono"'), "span")}${H.field("Workshop mod ID listesi", H.input("", "591AF5BDA9F7CE8B, 5965550F24A0C152"), "span")}${H.field("Oyuncu kapasitesi", H.input("64"))}${H.field("Etiket", H.input("", "Örn: PvE"))}</div>`]
  ] }
};
const WIZARDS = {};
Object.entries(WIZ).forEach(([g, w]) => {
  WIZARDS[g] = () => {
    const steps = [...w.steps, ["Ön kontrol", () => `<ul class="checks">${[["Node yanıt veriyor", "ok"], ["Port boşta", "ok"], ["Disk alanı yeterli (403 GB boş)", "ok"], ["Bellek: node'da 4,3 GB boş, istenen 10 GB", "warn"], [g === "minecraft" ? "EULA onayı" : "SteamCMD erişimi", g === "minecraft" ? "bad" : "ok"]].map(([t, s]) => `<li>${H.dotT(t, s)}</li>`).join("")}</ul><p class="hint">Kurulum kapısı: kırmızı madde varken kurulum başlamaz; sarı maddeler uyarıdır.</p>`]];
    let cur = 0;
    const html = `${H.head(`Yeni ${w.label} sunucusu`, `<a class="link" href="#/yeni">Oyun seçimine dön</a>`)}
      <div class="wizard"><ol class="steps vertical" id="wzSteps"></ol><section><div id="wzBody" class="wz-body"></div>
      <div class="toolbar wz-foot"><button class="btn" id="wzBack">Geri</button><span class="muted" id="wzPos" style="margin-right:auto"></span><button class="btn-game" id="wzNext">İleri</button></div></section></div>`;
    const mount = root => {
      const draw = () => {
        root.querySelector("#wzSteps").innerHTML = steps.map(([t], i) => `<li aria-current="${i === cur ? "step" : "false"}" class="${i < cur ? "done" : ""}"><button type="button" data-step="${i}"><span>${i < cur ? '<i data-lucide="check"></i>' : i + 1}</span>${t}</button></li>`).join("");
        root.querySelector("#wzBody").innerHTML = `<h2>${steps[cur][0]}</h2>` + steps[cur][1]();
        root.querySelector("#wzBack").disabled = cur === 0;
        root.querySelector("#wzPos").textContent = `Adım ${cur + 1}/${steps.length}`;
        root.querySelector("#wzNext").innerHTML = cur === steps.length - 1 ? '<i data-lucide="rocket"></i>Kurulumu başlat' : "İleri";
        root.querySelectorAll("[data-step]").forEach(b => b.onclick = () => { cur = +b.dataset.step; draw(); });
        root.querySelectorAll(".chips.big .chip").forEach(c => c.onclick = () => root.querySelectorAll(".chips.big .chip").forEach(x => x.setAttribute("aria-pressed", x === c)));
        bindCommon(root.querySelector("#wzBody")); icons();
      };
      root.querySelector("#wzBack").onclick = () => { cur--; draw(); };
      root.querySelector("#wzNext").onclick = () => { if (cur === steps.length - 1) { toast("Kurulum işi kuyruğa alındı (örnek)"); location.hash = "#/denetim/isler"; return; } cur++; draw(); };
      draw();
    };
    return { title: "Yeni sunucu", crumb: w.label, html, mount };
  };
});

const BARE = {
  giris: () => `<main class="auth"><form class="auth-card" onsubmit="event.preventDefault();location.hash='#/dashboard'">
      <img src="assets/arkonas-logo.png" alt="" width="64" height="58"><h1>Arkonas paneline giriş</h1>
      <label class="f">E-posta<input type="email" autocomplete="username" placeholder="ornek@alanadi.com"></label>
      <label class="f">Parola<input type="password" autocomplete="current-password"></label>
      <div class="turnstile"><i data-lucide="shield-check"></i>Cloudflare doğrulaması tamam</div>
      <button class="btn-game full">Giriş yap</button>
      <button type="button" class="btn full" onclick="toast('Passkey penceresi (örnek)')"><i data-lucide="key-round"></i>Passkey ile giriş</button>
      <p class="hint">Yeni cihazda passkey yoksa, parolayla girdikten sonra bu cihaz için passkey eklenir. <a class="link" href="#/sifre-sifirla">Parolamı unuttum</a></p>
    </form></main>`,
  "sifre-sifirla": () => `<main class="auth"><form class="auth-card" onsubmit="event.preventDefault();toast('Parola güncellendi (örnek)');location.hash='#/giris'">
      <img src="assets/arkonas-logo.png" alt="" width="64" height="58"><h1>Yeni parola belirle</h1><p class="hint">Bağlantı 30 dakika geçerli. Tüm diğer oturumlar kapatılır.</p>
      <label class="f">Yeni parola<input type="password" autocomplete="new-password"></label>
      <label class="f">Yeni parola (tekrar)<input type="password" autocomplete="new-password"></label>
      <button class="btn-game full">Parolayı güncelle</button><a class="link" href="#/giris">Girişe dön</a>
    </form></main>`,
  kurallar: () => `<main class="rules-page"><header><img src="assets/arkonas-logo.png" alt="" width="44" height="40"><div><h1>Arkonas Squad #1 kuralları</h1><p class="muted">Son güncelleme 14 Eylül 2026, Ceza kodları yetkili kararlarında kullanılır.</p></div></header>
      ${[["A. Davranış", [["A1", "Hakaret ve küfür yasaktır.", "Uyarı"], ["A2", "Bilerek takım hasarı vermek yasaktır.", "Kick"], ["A3", "Irkçı söylem.", "7 gün ban"]]], ["B. Manga", [["B1", "Manga liderinin mikrofonu olmalıdır.", "Uyarı"], ["B4", "Sebepsiz manga kilidi yasaktır.", "Uyarı"]]], ["C. Hile ve istismar", [["C1", "Hile ve üçüncü parti yazılım.", "Kalıcı ban"], ["C2", "Harita istismarı.", "3 gün ban"]]]].map(([h, rs]) => `<section><h2>${h}</h2><ol>${rs.map(r => `<li><span class="mono">${r[0]}</span><p>${r[1]}</p><small>${r[2]}</small></li>`).join("")}</ol></section>`).join("")}
      <p class="hint"><a class="link" href="#/dashboard">Panele dön</a></p></main>`
};

function openTour() {
  const steps = [["Gezinme sidebarda", "Sunucu seçili değilken sunucu listesini, bir sunucudayken o sunucunun tüm bölümlerini gösterir."], ["Ctrl K", "Sunucuya, bölüme ya da işleme yazarak git: \"sky cezalar\", \"smp yeniden başlat\"."], ["Riskli işlemler onay ister", "Durdurma, silme ve ban kaldırma onay penceresi açar; ban kaldırma onay kodu ister."], ["Canlı veri", "Sağ üstteki Canlı göstergesi WebSocket akışının ne zaman güncellendiğini söyler."]];
  let i = 0;
  const draw = sc => { sc.querySelector("#trT").textContent = steps[i][0]; sc.querySelector("#trP").textContent = steps[i][1]; sc.querySelector("#trN").textContent = i === steps.length - 1 ? "Bitir" : "İleri"; sc.querySelector("#trPos").textContent = `${i + 1}/${steps.length}`; };
  openLayer(`<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="trT"><div class="dialog-head"><div><h2 id="trT"></h2><p id="trP"></p></div></div><div class="dialog-foot"><span class="note" id="trPos"></span><button class="btn ghost" id="trS">Atla</button><button class="btn-game" id="trN"></button></div></div>`, sc => { draw(sc); sc.querySelector("#trS").onclick = closeLayer; sc.querySelector("#trN").onclick = () => { if (i === steps.length - 1) return closeLayer(); i++; draw(sc); }; });
}
