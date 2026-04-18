import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBHxmw1g5w2nXm7bUP_zdPFiyQegi5nLPY",
  authDomain: "ultras-zone.firebaseapp.com",
  databaseURL: "https://ultras-zone-default-rtdb.firebaseio.com",
  projectId: "ultras-zone",
  storageBucket: "ultras-zone.firebasestorage.app",
  messagingSenderId: "391767236040",
  appId: "1:391767236040:web:bd3486b661ea73596874fd"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const API_KEY = "60958b8d45mshee5408e90b5fb3ap116287jsn6dbc1b620001";
const API_HOST = "free-api-live-football-data.p.rapidapi.com";

const BANNED = ["nigger","nigga","chink","spic","kike","wetback","raghead","coon","gook","faggot","beaner","negro"];
const isRacist = t => BANNED.some(w => t.toLowerCase().includes(w));

const FLAGS = ["🇺🇸","🇧🇷","🇮🇹","🇪🇸","🇩🇪","🇫🇷","🇦🇷","🇳🇬","🇯🇵","🇹🇷","🇬🇧","🇵🇹","🇲🇦","🇸🇦","🇷🇺"];
const COLORS = ["#7b1e1e","#1a3a6b","#1a5c2a","#3a1a6b","#6b3a1a","#1a4a3a","#4a1a6b","#6b1a3a","#1a6b5a","#4a3a1a"];

const REACTIONS = [
  {e:"⚽",l:"Goal!",n:2841},{e:"🔥",l:"Fire",n:1923},{e:"😤",l:"Angry",n:1102},
  {e:"😱",l:"Unreal",n:1567},{e:"🤣",l:"LOL",n:887},{e:"👏",l:"Clap",n:643},
  {e:"🍺",l:"Cheers!",n:512},{e:"💔",l:"Pain",n:421},{e:"🚩",l:"Foul!",n:334},
];

const S = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=swap');
:root{--bg:#06080b;--bg2:#0d1117;--bg3:#141b24;--border:#1e2d3d;--red:#e53935;--gold:#ffc107;--white:#eaf0f7;--muted:#4a5e72;--green:#00c853;--blue:#448aff;--font:'Barlow',sans-serif;--display:'Oswald',sans-serif;--cond:'Barlow Condensed',sans-serif;}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--white);font-family:var(--font);}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);}
.splash{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at 20% 50%,rgba(229,57,53,.18) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(255,193,7,.08) 0%,transparent 50%),var(--bg);}
.splash-logo{font-family:var(--display);font-size:64px;font-weight:700;letter-spacing:4px;color:var(--white);line-height:1;}
.splash-logo .dot{color:var(--red);} .splash-logo .zone{color:var(--gold);}
.splash-line{width:80%;height:3px;background:linear-gradient(90deg,transparent,var(--red),var(--gold),transparent);margin:14px 0;}
.splash-sub{font-family:var(--cond);font-size:13px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:var(--muted);margin-bottom:32px;}
.splash-enter{background:var(--red);color:#fff;border:none;padding:16px 56px;font-family:var(--display);font-size:20px;font-weight:700;letter-spacing:4px;text-transform:uppercase;cursor:pointer;margin-bottom:16px;}
.name-input{background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:10px 16px;font-size:14px;color:var(--white);font-family:var(--font);outline:none;width:240px;text-align:center;margin-bottom:32px;}
.splash-stats{display:flex;gap:32px;}
.splash-stat{text-align:center;}
.splash-stat-val{font-family:var(--display);font-size:28px;font-weight:700;color:var(--gold);}
.splash-stat-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
.header{padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:100;}
.logo{font-family:var(--display);font-size:26px;font-weight:700;letter-spacing:2px;color:var(--white);}
.logo .dot{color:var(--red);} .logo .zone{color:var(--gold);}
.live-pill{display:flex;align-items:center;gap:5px;background:rgba(229,57,53,.12);border:1px solid rgba(229,57,53,.3);border-radius:3px;padding:4px 10px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:var(--red);text-transform:uppercase;}
.section-header{display:flex;align-items:center;gap:10px;padding:16px 16px 8px;}
.section-tag{font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--muted);}
.section-hr{flex:1;height:1px;background:var(--border);}
.live-tag{display:flex;align-items:center;gap:5px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:var(--red);text-transform:uppercase;}
.match-list{padding:0 14px;display:flex;flex-direction:column;gap:8px;padding-bottom:20px;}
.match-card{background:var(--bg2);border:1px solid var(--border);border-radius:8px;overflow:hidden;cursor:pointer;position:relative;}
.match-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--border);}
.match-card.live-card::before{background:var(--red);}
.mc-league{display:flex;align-items:center;gap:6px;padding:8px 14px 0 16px;}
.mc-league-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.mc-league-name{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
.mc-body{display:flex;align-items:center;padding:10px 14px 12px 16px;gap:8px;}
.mc-team{flex:1;display:flex;align-items:center;gap:8px;}
.mc-team.right{flex-direction:row-reverse;}
.mc-badge{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;background:var(--bg3);border:1px solid var(--border);flex-shrink:0;font-family:var(--cond);font-weight:800;color:var(--muted);}
.mc-name{font-family:var(--cond);font-size:15px;font-weight:800;text-transform:uppercase;color:var(--white);}
.mc-team.right .mc-name{text-align:right;}
.mc-center{text-align:center;min-width:72px;}
.mc-score{font-family:var(--display);font-size:30px;font-weight:700;letter-spacing:6px;color:var(--white);line-height:1;}
.mc-status-live{display:inline-flex;align-items:center;gap:4px;background:var(--red);color:#fff;font-family:var(--cond);font-size:10px;font-weight:800;padding:2px 8px;border-radius:2px;margin-top:4px;text-transform:uppercase;}
.mc-status-ft{font-family:var(--cond);font-size:12px;font-weight:800;color:var(--muted);margin-top:4px;display:block;}
.mc-status-upcoming{font-family:var(--display);font-size:18px;font-weight:700;color:var(--muted);}
.mc-kickoff{font-family:var(--cond);font-size:10px;font-weight:700;color:var(--blue);margin-top:3px;display:block;text-transform:uppercase;}
.mc-footer{border-top:1px solid var(--border);padding:7px 16px;display:flex;align-items:center;}
.mc-viewers{font-size:11px;font-weight:600;color:var(--muted);display:flex;align-items:center;gap:5px;}
.mc-vdot{width:5px;height:5px;background:var(--green);border-radius:50%;}
.mc-cmts{margin-left:auto;font-size:11px;color:var(--muted);}
.ms-header{padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:0;z-index:100;}
.back{width:36px;height:36px;background:var(--bg3);border:1px solid var(--border);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--white);}
.ms-info{flex:1;}
.ms-league{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:2px;}
.ms-teams{font-family:var(--cond);font-size:17px;font-weight:800;text-transform:uppercase;color:var(--white);}
.score-card{margin:14px;background:linear-gradient(135deg,#0f1923 0%,#0a1420 100%);border:1px solid var(--border);border-top:3px solid var(--red);border-radius:8px;overflow:hidden;}
.sc-inner{display:flex;align-items:center;padding:20px 16px 16px;gap:8px;}
.sc-team{flex:1;text-align:center;}
.sc-badge{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;font-family:var(--cond);background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.08);margin:0 auto 10px;color:var(--muted);}
.sc-name{font-family:var(--cond);font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#7a93a8;}
.sc-mid{text-align:center;}
.sc-score{font-family:var(--display);font-size:62px;font-weight:700;letter-spacing:8px;color:var(--white);line-height:1;}
.sc-time-live{background:var(--red);color:#fff;font-family:var(--cond);font-size:12px;font-weight:800;padding:3px 12px;border-radius:2px;margin-top:6px;display:inline-block;}
.sc-time-ft{font-family:var(--cond);font-size:14px;font-weight:800;color:var(--muted);margin-top:6px;display:inline-block;}
.sc-stats{display:flex;border-top:1px solid rgba(255,255,255,.05);}
.sc-stat{flex:1;text-align:center;padding:10px 0;border-right:1px solid rgba(255,255,255,.05);}
.sc-stat:last-child{border-right:none;}
.sc-stat-val{font-family:var(--display);font-size:20px;font-weight:700;color:var(--white);}
.sc-stat-lbl{font-family:var(--cond);font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);}
.react-wrap{padding:0 14px 14px;overflow-x:auto;scrollbar-width:none;}
.react-inner{display:flex;gap:8px;width:max-content;}
.react-btn{display:flex;align-items:center;gap:6px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:7px 12px;cursor:pointer;color:var(--white);font-family:var(--cond);font-size:13px;font-weight:700;white-space:nowrap;}
.react-btn.on{background:rgba(229,57,53,.12);border-color:var(--red);color:var(--red);}
.poll{margin:0 14px 14px;background:var(--bg2);border:1px solid var(--border);border-left:3px solid var(--gold);border-radius:0 8px 8px 0;padding:14px 16px;}
.poll-head{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:8px;}
.poll-q{font-size:15px;font-weight:700;color:var(--white);margin-bottom:12px;}
.poll-opts{display:flex;gap:8px;}
.poll-opt{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:10px 6px;text-align:center;cursor:pointer;font-family:var(--cond);font-size:13px;font-weight:700;color:var(--white);position:relative;overflow:hidden;text-transform:uppercase;}
.poll-opt .bar{position:absolute;left:0;top:0;bottom:0;background:rgba(229,57,53,.15);}
.poll-opt.voted{border-color:var(--red);}
.poll-inner{position:relative;z-index:1;}
.poll-pct{display:block;font-family:var(--display);font-size:20px;color:var(--red);margin-top:3px;}
.feed-header{display:flex;align-items:center;gap:10px;padding:0 16px 8px;}
.feed-title{font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--muted);}
.feed-hr{flex:1;height:1px;background:var(--border);}
.online-pill{display:flex;align-items:center;gap:5px;font-family:var(--cond);font-size:11px;font-weight:700;color:var(--muted);}
.od{width:5px;height:5px;background:var(--green);border-radius:50%;}
.feed{padding:0 14px;display:flex;flex-direction:column;gap:10px;max-height:320px;overflow-y:auto;}
.msg{display:flex;gap:10px;}
.msg-av{width:36px;height:36px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:var(--cond);font-size:14px;font-weight:800;flex-shrink:0;border:1px solid rgba(255,255,255,.08);}
.msg-body{flex:1;}
.msg-top{display:flex;align-items:center;gap:6px;margin-bottom:3px;}
.msg-name{font-family:var(--cond);font-size:13px;font-weight:800;text-transform:uppercase;color:var(--white);}
.msg-flag{font-size:13px;}
.msg-time{font-size:10px;color:var(--muted);margin-left:auto;}
.hot-badge{background:linear-gradient(90deg,#e53935,#ff6b35);font-family:var(--cond);font-size:8px;font-weight:800;padding:2px 6px;border-radius:2px;color:#fff;text-transform:uppercase;}
.msg-text{font-size:14px;color:#9ab0c4;line-height:1.45;}
.msg-actions{display:flex;gap:14px;margin-top:6px;}
.msg-act{font-size:12px;color:var(--muted);cursor:pointer;background:none;border:none;font-family:var(--cond);font-weight:700;letter-spacing:1px;display:flex;align-items:center;gap:4px;padding:0;text-transform:uppercase;}
.input-bar{padding:10px 14px 16px;display:flex;gap:9px;border-top:1px solid var(--border);background:var(--bg);position:sticky;bottom:0;}
.input-bar input{flex:1;background:var(--bg2);border:1px solid var(--border);border-radius:4px;padding:11px 16px;font-size:14px;color:var(--white);font-family:var(--font);outline:none;}
.send{width:44px;height:44px;background:var(--red);border:none;border-radius:4px;cursor:pointer;font-size:18px;color:#fff;}
.upcoming-card{margin:14px;background:var(--bg2);border:1px solid var(--border);border-top:3px solid var(--blue);border-radius:8px;padding:28px 20px;text-align:center;}
.upcoming-time{font-family:var(--display);font-size:56px;font-weight:700;letter-spacing:6px;color:var(--blue);line-height:1;}
.upcoming-sub{font-family:var(--cond);font-size:13px;font-weight:700;letter-spacing:2px;color:var(--muted);margin-top:8px;text-transform:uppercase;}
.notify-btn{margin-top:18px;background:rgba(68,138,255,.1);border:1px solid rgba(68,138,255,.3);border-radius:4px;padding:10px 24px;font-family:var(--cond);font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--blue);cursor:pointer;}
.notify-btn.notified{border-color:var(--green);color:var(--green);background:rgba(0,200,83,.1);}
.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#b71c1c;color:#fff;font-family:var(--cond);font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:10px 20px;border-radius:3px;z-index:9999;white-space:nowrap;}
.loading{text-align:center;padding:40px 20px;color:var(--muted);font-family:var(--cond);font-size:12px;letter-spacing:2px;text-transform:uppercase;}
.error-msg{text-align:center;padding:20px;color:var(--red);font-family:var(--cond);font-size:12px;letter-spacing:1px;}
`;

export default function UltrasZone() {
  const [screen, setScreen] = useState("splash");
  const [active, setActive] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState({});
  const [reacts, setReacts] = useState(REACTIONS.map(r => ({ ...r, on: false })));
  const [input, setInput] = useState("");
  const [toast, setToast] = useState(null);
  const [poll, setPoll] = useState(null);
  const [pollN, setPollN] = useState([58, 27, 15]);
  const [notified, setNotified] = useState({});
  const [userName, setUserName] = useState("");
  const [tempName, setTempName] = useState("");
  const unsubRef = useRef(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://free-api-live-football-data.p.rapidapi.com/football-current-live", {
        headers: {
          "x-rapidapi-key": API_KEY,
          "x-rapidapi-host": API_HOST
        }
      });
      const data = await res.json();
      const live = (data?.response?.live || []).slice(0, 8).map(m => ({
        id: `match_${m.id}`,
        status: "LIVE",
        time: m.elapsed ? `${m.elapsed}'` : "LIVE",
        league: m.leagueName || "Football",
        leagueColor: "#e53935",
        home: { name: m.home?.name || "Home", short: (m.home?.name || "HOM").slice(0,3).toUpperCase(), badge: (m.home?.name || "H").slice(0,2).toUpperCase() },
        away: { name: m.away?.name || "Away", short: (m.away?.name || "AWY").slice(0,3).toUpperCase(), badge: (m.away?.name || "A").slice(0,2).toUpperCase() },
        score: [m.home?.score ?? 0, m.away?.score ?? 0],
        viewers: Math.floor(Math.random() * 15000) + 1000,
        stats: null,
      }));
      setMatches(live);
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (screen === "home") {
      fetchMatches();
      const t = setInterval(fetchMatches, 60000);
      return () => clearInterval(t);
    }
  }, [screen]);

  useEffect(() => {
    if (!active || active.status === "UPCOMING") return;
    if (unsubRef.current) unsubRef.current();
    const commentsRef = ref(db, `comments/${active.id}`);
    const unsub = onValue(commentsRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.values(data).sort((a, b) => b.ts - a.ts).slice(0, 50);
        setComments(p => ({ ...p, [active.id]: list }));
      } else {
        setComments(p => ({ ...p, [active.id]: [] }));
      }
    });
    unsubRef.current = unsub;
    return () => unsub();
  }, [active]);

  const openMatch = m => { setActive(m); setScreen("match"); setPoll(null); setPollN([58,27,15]); };
  const goBack = () => { setScreen("home"); setActive(null); };
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const enterApp = () => {
    if (!tempName.trim()) { showToast("Enter your name first!"); return; }
    setUserName(tempName.trim());
    setScreen("home");
  };

  const send = async () => {
    if (!input.trim()) return;
    if (isRacist(input)) { showToast("RACIST CONTENT REMOVED"); setInput(""); return; }
    const flag = FLAGS[Math.floor(Math.random() * FLAGS.length)];
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    const initials = userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
    await push(ref(db, `comments/${active.id}`), {
      user: userName, flag, col, av: initials,
      text: input.trim(),
      time: active.time,
      likes: 0, ts: Date.now()
    });
    setInput("");
  };

  const votePoll = i => {
    if (poll !== null) return;
    setPoll(i);
    setPollN(p => p.map((n,j) => j===i ? n+1 : n));
  };

  const today = new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short" }).toUpperCase();
  const pollTotal = pollN.reduce((a,b) => a+b, 0);
  const msgs = active ? (comments[active.id] || []) : [];

  if (screen === "splash") return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="splash">
          <div className="splash-logo">ULTRAS<span className="dot">.</span><span className="zone">ZONE</span></div>
          <div className="splash-line" />
          <div className="splash-sub">The Voice of the Fans</div>
          <input className="name-input" placeholder="Enter your name..." value={tempName} onChange={e => setTempName(e.target.value)} onKeyDown={e => e.key==="Enter" && enterApp()} />
          <button className="splash-enter" onClick={enterApp}>ENTER THE ZONE</button>
          <div className="splash-stats">
            <div className="splash-stat"><div className="splash-stat-val">50M+</div><div className="splash-stat-lbl">Global Fans</div></div>
            <div className="splash-stat"><div className="splash-stat-val">Live</div><div className="splash-stat-lbl">Matches</div></div>
            <div className="splash-stat"><div className="splash-stat-val">Real</div><div className="splash-stat-lbl">Scores</div></div>
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  if (screen === "home") return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="header">
          <div className="logo">ULTRAS<span className="dot">.</span><span className="zone">ZONE</span></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div className="live-pill">{matches.length} Live</div>
            <div style={{fontSize:10,color:"var(--muted)",fontFamily:"var(--cond)",letterSpacing:1}}>{today}</div>
          </div>
        </div>
        {loading ? (
          <div className="loading">⚽ Loading live matches...</div>
        ) : matches.length === 0 ? (
          <div className="loading">No live matches right now. Check back soon!</div>
        ) : (
          <>
            <div className="section-header">
              <div className="live-tag">🔴 Live Matches</div>
              <div className="section-hr" />
              <div className="section-tag">{matches.length} matches</div>
            </div>
            <div className="match-list">
              {matches.map(m => (
                <div className="match-card live-card" key={m.id} onClick={() => openMatch(m)}>
                  <div className="mc-league"><div className="mc-league-dot" style={{background:m.leagueColor}} /><div className="mc-league-name">{m.league}</div></div>
                  <div className="mc-body">
                    <div className="mc-team"><div className="mc-badge">{m.home.badge}</div><div className="mc-name">{m.home.name}</div></div>
                    <div className="mc-center"><div className="mc-score">{m.score[0]}–{m.score[1]}</div><div className="mc-status-live">{m.time}</div></div>
                    <div className="mc-team right"><div className="mc-badge">{m.away.badge}</div><div className="mc-name">{m.away.name}</div></div>
                  </div>
                  <div className="mc-footer">
                    <div className="mc-viewers"><div className="mc-vdot" />{m.viewers.toLocaleString()} watching</div>
                    <div className="mc-cmts">💬 {(comments[m.id]||[]).length}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="ms-header">
          <button className="back" onClick={goBack}>←</button>
          <div className="ms-info"><div className="ms-league">{active.league}</div><div className="ms-teams">{active.home.name} – {active.away.name}</div></div>
          <div className="live-pill">Live</div>
        </div>
        <div className="score-card">
          <div className="sc-inner">
            <div className="sc-team"><div className="sc-badge">{active.home.badge}</div><div className="sc-name">{active.home.name}</div></div>
            <div className="sc-mid"><div className="sc-score">{active.score[0]}–{active.score[1]}</div><div className="sc-time-live">{active.time}</div></div>
            <div className="sc-team"><div className="sc-badge">{active.away.badge}</div><div className="sc-name">{active.away.name}</div></div>
          </div>
        </div>
        <div className="react-wrap">
          <div className="react-inner">
            {reacts.map((r,i) => (
              <button key={i} className={`react-btn${r.on?" on":""}`} onClick={() => setReacts(p => p.map((x,j) => j===i ? {...x,n:x.on?x.n-1:x.n+1,on:!x.on} : x))}>
                <span>{r.e}</span>{r.n.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        <div className="poll">
          <div className="poll-head">⚡ Fan Poll</div>
          <div className="poll-q">Who wins tonight?</div>
          <div className="poll-opts">
            {[active.home.short, active.away.short, "Draw"].map((opt,i) => {
              const pct = poll!==null ? Math.round((pollN[i]/pollTotal)*100) : 0;
              return (
                <div key={i} className={`poll-opt${poll===i?" voted":""}`} onClick={() => votePoll(i)}>
                  <div className="bar" style={{width:poll!==null?`${pct}%`:"0%"}} />
                  <div className="poll-inner">{opt}{poll!==null && <span className="poll-pct">{pct}%</span>}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="feed-header">
          <div className="feed-title">The Stands</div>
          <div className="feed-hr" />
          <div className="online-pill"><div className="od" />{active.viewers.toLocaleString()} live</div>
        </div>
        <div className="feed">
          {msgs.length===0 && <div className="loading">Be the first to comment! 🔥</div>}
          {msgs.map((m,i) => (
            <div className="msg" key={i}>
              <div className="msg-av" style={{background:m.col}}>{m.av}</div>
              <div className="msg-body">
                <div className="msg-top"><span className="msg-name">{m.user}</span><span className="msg-flag">{m.flag}</span><span className="msg-time">{m.time}</span></div>
                <div className="msg-text">{m.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="input-bar">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder="Raise your voice from the stands..." />
          <button className="send" onClick={send}>➤</button>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
