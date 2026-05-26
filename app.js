(() => {
  const config = window.HMVEITUR_CONFIG || {};
  const seed = window.HMVEITUR_SEED || { players: [], matches: [], predictions: [] };
  const remoteMode = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  const scoring = { exact: 5, outcome: 3, goal: 1, ...(config.scoring || {}) };
  const keys = { data: "hmveitur-local-data-v1", session: "hmveitur-session-v1" };
  const state = { players: [], matches: [], predictions: [], player: null, filter: "all", query: "" };
  const el = (selector) => document.querySelector(selector);
  const dom = {
    session: el("#sessionControls"),
    login: el("#loginPanel"),
    podium: el("#podium"),
    table: el("#leaderboardTable"),
    matches: el("#matchesList"),
    setup: el("#setupInfo"),
    toast: el("#toast"),
    search: el("#matchSearch")
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  async function init() {
    state.player = readJson(keys.session, null);
    bindControls();
    await loadData();
    render();
  }

  function bindControls() {
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
        renderMatches();
      });
    });
    dom.search.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      renderMatches();
    });
  }

  async function loadData() {
    if (remoteMode) {
      const data = await rpc("hm_public_state", {});
      state.players = data.players || [];
      state.matches = (data.matches || []).map((match) => ({
        id: match.id,
        startsAt: match.starts_at || match.startsAt,
        stage: match.stage,
        groupName: match.group_name || match.groupName || "",
        homeTeam: match.home_team || match.homeTeam,
        awayTeam: match.away_team || match.awayTeam,
        venue: match.venue,
        homeScore: match.home_score ?? match.homeScore,
        awayScore: match.away_score ?? match.awayScore,
        status: match.status
      }));
      state.predictions = data.predictions || [];
      if (state.player) {
        const fresh = state.players.find((player) => player.id === state.player.id);
        state.player = fresh ? { ...state.player, ...fresh } : state.player;
      }
      return;
    }

    const data = readJson(keys.data, null) || seed;
    state.players = data.players || [];
    state.matches = data.matches || [];
    state.predictions = data.predictions || [];
  }

  function persistLocal() {
    if (!remoteMode) {
      localStorage.setItem(keys.data, JSON.stringify({ players: state.players, matches: state.matches, predictions: state.predictions }));
    }
  }

  async function login(code) {
    const inviteCode = String(code || "").trim().toUpperCase();
    if (!inviteCode) return toast("Sláðu inn boðskóða.");
    try {
      if (remoteMode) {
        const player = await rpc("hm_login", { p_invite_code: inviteCode });
        state.player = { ...player, inviteCode };
      } else {
        const player = state.players.find((item) => item.inviteCode.toUpperCase() === inviteCode);
        if (!player) throw new Error("Kóðinn fannst ekki.");
        state.player = { ...player, inviteCode };
      }
      localStorage.setItem(keys.session, JSON.stringify(state.player));
      await loadData();
      render();
      toast(`Velkomin(n), ${state.player.name}.`);
    } catch (error) {
      toast(error.message || "Innskráning mistókst.");
    }
  }

  function logout() {
    state.player = null;
    localStorage.removeItem(keys.session);
    render();
  }

  async function savePrediction(matchId, home, away) {
    if (!state.player) return toast("Þú þarft boðskóða áður en þú vistar spá.");
    const match = state.matches.find((item) => item.id === matchId);
    if (!match || locked(match)) return toast("Þessi leikur er læstur.");
    const homeGoals = scoreValue(home);
    const awayGoals = scoreValue(away);
    if (homeGoals === null || awayGoals === null) return toast("Settu inn markatölu fyrir bæði lið.");

    try {
      if (remoteMode) {
        await rpc("hm_save_prediction", {
          p_player_id: state.player.id,
          p_invite_code: state.player.inviteCode,
          p_match_id: matchId,
          p_home_goals: homeGoals,
          p_away_goals: awayGoals
        });
        await loadData();
      } else {
        state.predictions = state.predictions.filter((item) => !(item.playerId === state.player.id && item.matchId === matchId));
        state.predictions.push({ playerId: state.player.id, matchId, homeGoals, awayGoals, updatedAt: new Date().toISOString() });
        persistLocal();
      }
      render();
      toast("Spáin var vistuð.");
    } catch (error) {
      toast(error.message || "Ekki tókst að vista spána.");
    }
  }

  async function saveResult(matchId, home, away) {
    if (!state.player?.isAdmin) return toast("Aðeins admin getur skráð úrslit.");
    const homeScore = scoreValue(home);
    const awayScore = scoreValue(away);
    if (homeScore === null || awayScore === null) return toast("Settu inn úrslit fyrir bæði lið.");

    try {
      if (remoteMode) {
        await rpc("hm_set_result", {
          p_admin_player_id: state.player.id,
          p_invite_code: state.player.inviteCode,
          p_match_id: matchId,
          p_home_score: homeScore,
          p_away_score: awayScore
        });
        await loadData();
      } else {
        state.matches = state.matches.map((match) => match.id === matchId ? { ...match, homeScore, awayScore, status: "finished" } : match);
        persistLocal();
      }
      render();
      toast("Úrslit vistuð og stigataflan uppfærð.");
    } catch (error) {
      toast(error.message || "Ekki tókst að vista úrslit.");
    }
  }

  function render() {
    renderSession();
    renderLogin();
    renderLeaderboard();
    renderMatches();
    dom.setup.innerHTML = `<p>Gagnahamur: <strong>${remoteMode ? "Supabase" : "Demo í vafra"}</strong>. ${remoteMode ? "Allar spár vistast miðlægt." : "Sameiginlegar spár þurfa Supabase tengingu."}</p><p>Stig: ${scoring.exact} fyrir nákvæm úrslit, ${scoring.outcome} fyrir rétt merki, ${scoring.goal} fyrir rétta markatölu annars liðs.</p>`;
  }

  function renderSession() {
    dom.session.innerHTML = state.player
      ? `<span class="session-name">${safe(state.player.name)}</span><button class="small-button light" type="button" data-logout>Skipta um kóða</button>`
      : `<span class="session-name">Ekki skráð(ur)</span>`;
    dom.session.querySelector("[data-logout]")?.addEventListener("click", logout);
  }

  function renderLogin() {
    if (state.player) {
      dom.login.innerHTML = `<div class="notice-card"><div><h3>Þú ert inni sem ${safe(state.player.name)}</h3><p class="muted">Spár vistast ${remoteMode ? "í sameiginlega gagnagrunninum" : "í þessum vafra í demo-ham"}.</p></div><a class="small-button primary" href="#matches">Spá í næsta leik</a></div>`;
      return;
    }
    dom.login.innerHTML = `<div class="login-card"><div><h3>Sláðu inn boðskóða</h3><p class="muted">Demo-kóðar eru HAFDIS-ADMIN, HM-1001, HM-1002 og HM-1003.</p></div><form class="login-form"><label class="sr-only" for="inviteCode">Boðskóði</label><input id="inviteCode" name="inviteCode" autocomplete="one-time-code" placeholder="Boðskóði"><button class="small-button primary" type="submit">Opna</button></form></div>`;
    dom.login.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      login(new FormData(event.currentTarget).get("inviteCode"));
    });
  }

  function renderLeaderboard() {
    const rows = leaderboard();
    const medals = ["gold", "silver", "bronze"];
    dom.podium.innerHTML = rows.slice(0, 3).map((row, index) => `<article class="podium-card"><span class="rank-pill ${medals[index]}">${index + 1}</span><h3>${safe(row.name)}</h3><div class="player-score">${row.points}</div><p class="muted">${row.predictions} spár · ${row.exact} nákvæmar</p></article>`).join("") || `<p class="muted">Engir leikmenn komnir inn.</p>`;
    dom.table.innerHTML = `<table><thead><tr><th>Sæti</th><th>Nafn</th><th>Stig</th><th>Spár</th><th>Nákvæmar</th></tr></thead><tbody>${rows.map((row, index) => `<tr><td>${index + 1}</td><td>${safe(row.name)}</td><td><strong>${row.points}</strong></td><td>${row.predictions}</td><td>${row.exact}</td></tr>`).join("")}</tbody></table>`;
  }

  function renderMatches() {
    const now = Date.now();
    const matches = [...state.matches].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt)).filter((match) => {
      const text = `${match.homeTeam} ${match.awayTeam} ${match.groupName} ${match.stage} ${match.venue}`.toLowerCase();
      if (state.query && !text.includes(state.query)) return false;
      if (state.filter === "upcoming") return !hasResult(match) && new Date(match.startsAt).getTime() >= now;
      if (state.filter === "finished") return hasResult(match);
      if (state.filter === "mine") return state.player && prediction(state.player.id, match.id);
      return true;
    });
    dom.matches.innerHTML = matches.map(matchCard).join("") || `<p class="muted">Engir leikir passa við þessa síu.</p>`;
    dom.matches.querySelectorAll("[data-save-prediction]").forEach((button) => button.addEventListener("click", () => {
      const card = button.closest("[data-match-id]");
      savePrediction(card.dataset.matchId, card.querySelector("[name='homeGoals']").value, card.querySelector("[name='awayGoals']").value);
    }));
    dom.matches.querySelectorAll("[data-save-result]").forEach((button) => button.addEventListener("click", () => {
      const card = button.closest("[data-match-id]");
      saveResult(card.dataset.matchId, card.querySelector("[name='homeScore']").value, card.querySelector("[name='awayScore']").value);
    }));
  }

  function matchCard(match) {
    const mine = state.player ? prediction(state.player.id, match.id) : null;
    const finished = hasResult(match);
    const isLocked = locked(match);
    const playerRows = state.players.map((player) => {
      const pick = prediction(player.id, match.id);
      return `<tr><td>${safe(player.name)}</td><td>${pick ? `${pick.homeGoals} - ${pick.awayGoals}` : "Engin spá"}</td><td>${finished && pick ? pointsFor(pick, match) : "-"}</td></tr>`;
    }).join("");
    return `<article class="match-card" data-match-id="${safe(match.id)}"><div class="match-topline"><span class="stage-pill">${safe(match.stage)}${match.groupName ? ` · Riðill ${safe(match.groupName)}` : ""}</span><span>${dateLabel(match.startsAt)} · ${safe(match.venue)}</span></div><div class="match-main"><div class="teams"><div class="team-line"><span class="team-name">${safe(match.homeTeam)}</span><span class="result-score">${finished ? match.homeScore : ""}</span></div><div class="team-line"><span class="team-name">${safe(match.awayTeam)}</span><span class="result-score">${finished ? match.awayScore : ""}</span></div></div><span class="prediction-chip">${isLocked ? "Læstur" : "Opinn"}${finished ? " · Úrslit komin" : ""}</span></div><div class="match-actions"><div class="prediction-grid"><span class="muted">Þín spá</span><input class="score-input" name="homeGoals" type="number" min="0" max="20" value="${mine?.homeGoals ?? ""}" ${!state.player || isLocked ? "disabled" : ""} aria-label="Mörk heimaliðs"><input class="score-input" name="awayGoals" type="number" min="0" max="20" value="${mine?.awayGoals ?? ""}" ${!state.player || isLocked ? "disabled" : ""} aria-label="Mörk útiliðs"><button class="small-button primary" type="button" data-save-prediction ${!state.player || isLocked ? "disabled" : ""}>Vista spá</button></div>${state.player?.isAdmin ? `<div class="result-row"><span class="muted">Úrslit</span><input class="score-input" name="homeScore" type="number" min="0" max="20" value="${match.homeScore ?? ""}"><input class="score-input" name="awayScore" type="number" min="0" max="20" value="${match.awayScore ?? ""}"><button class="small-button danger" type="button" data-save-result>Vista úrslit</button></div>` : ""}</div><div class="predictions-table"><table><thead><tr><th>Leikmaður</th><th>Spá</th><th>Stig</th></tr></thead><tbody>${playerRows}</tbody></table></div></article>`;
  }

  function leaderboard() {
    return state.players.map((player) => {
      const picks = state.predictions.filter((item) => item.playerId === player.id);
      const points = picks.reduce((sum, pick) => {
        const match = state.matches.find((item) => item.id === pick.matchId);
        return sum + (match && hasResult(match) ? pointsFor(pick, match) : 0);
      }, 0);
      const exact = picks.filter((pick) => {
        const match = state.matches.find((item) => item.id === pick.matchId);
        return match && hasResult(match) && Number(pick.homeGoals) === Number(match.homeScore) && Number(pick.awayGoals) === Number(match.awayScore);
      }).length;
      return { ...player, points, predictions: picks.length, exact };
    }).sort((a, b) => b.points - a.points || b.exact - a.exact || b.predictions - a.predictions || a.name.localeCompare(b.name, "is"));
  }

  function pointsFor(pick, match) {
    const ph = Number(pick.homeGoals), pa = Number(pick.awayGoals), ah = Number(match.homeScore), aa = Number(match.awayScore);
    if (ph === ah && pa === aa) return scoring.exact;
    return (outcome(ph, pa) === outcome(ah, aa) ? scoring.outcome : 0) + (ph === ah ? scoring.goal : 0) + (pa === aa ? scoring.goal : 0);
  }
  function outcome(home, away) { return home > away ? "home" : home < away ? "away" : "draw"; }
  function prediction(playerId, matchId) { return state.predictions.find((item) => item.playerId === playerId && item.matchId === matchId); }
  function hasResult(match) { return match.homeScore !== null && match.homeScore !== undefined && match.awayScore !== null && match.awayScore !== undefined; }
  function locked(match) { return hasResult(match) || new Date(match.startsAt).getTime() <= Date.now(); }
  function scoreValue(value) { const n = Number(value); return value === "" || !Number.isInteger(n) || n < 0 || n > 20 ? null : n; }
  function dateLabel(value) { return new Intl.DateTimeFormat("is-IS", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Atlantic/Reykjavik" }).format(new Date(value)); }
  function readJson(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
  function safe(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
  function toast(message) { dom.toast.textContent = message; dom.toast.classList.add("is-visible"); clearTimeout(toast.timer); toast.timer = setTimeout(() => dom.toast.classList.remove("is-visible"), 2800); }
  async function rpc(name, payload) {
    const response = await fetch(`${config.supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: config.supabaseAnonKey, Authorization: `Bearer ${config.supabaseAnonKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) throw new Error(data?.message || data?.error || "Supabase beiðni mistókst.");
    return data;
  }
})();
