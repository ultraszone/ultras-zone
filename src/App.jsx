import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set, get } from "firebase/database";

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
:root{
  --bg:#06080b;--bg2:#0d1117;--bg3:#141b24;--border:#1e2d3d;
  --red:#e53935;--gold:#ffc107;--white:#ffffff;--muted:#7a8fa0;
  --green:#00e676;--blue:#448aff;
  --font:'Barlow',sans-serif;--display:'Oswald',sans-serif;--cond:'Barlow Condensed',sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--bg);color:var(--white);font-family:var(--font);}
.app{max-width:430px;margin:0 auto;min-height:100vh;background:var(--bg);}

/* TRIBUNE ROWS - very visible */
.tribune-bg {
  background-color: #06080b;
  background-image:
    repeating-linear-gradient(
      180deg,
      rgba(255,255,255,0.0) 0px,
      rgba(255,255,255,0.0) 18px,
      rgba(60,80,120,0.35) 18px,
      rgba(60,80,120,0.35) 22px,
      rgba(255,255,255,0.0) 22px,
      rgba(255,255,255,0.0) 38px,
      rgba(40,55,90,0.25) 38px,
      rgba(40,55,90,0.25) 42px
    );
}

/* SPLASH */
.splash{
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  background-color:#06080b;
  background-image:
    repeating-linear-gradient(
      180deg,
      transparent 0px, transparent 18px,
      rgba(60,80,130,0.4) 18px, rgba(60,80,130,0.4) 22px,
      transparent 22px, transparent 38px,
      rgba(40,55,100,0.3) 38px, rgba(40,55,100,0.3) 42px
    ),
    radial-gradient(ellipse at 50% 40%, rgba(229,57,53,0.25) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 20%, rgba(255,193,7,0.1) 0%, transparent 45%);
}
.splash-top-light{
  position:absolute;top:0;left:0;right:0;height:4px;
  background:linear-gradient(90deg,transparent,var(--red),var(--gold),var(--red),transparent);
}
.splash-content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;}
.splash-badge{
  background:var(--red);color:#fff;
  font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;
  padding:4px 14px;border-radius:2px;margin-bottom:16px;
}
.splash-logo{font-family:var(--display);font-size:68px;font-weight:700;letter-spacing:4px;color:var(--white);line-height:1;}
.splash-logo .dot{color:var(--red);}
.splash-logo .zone{color:var(--gold);}
.splash-line{width:90%;height:3px;background:linear-gradient(90deg,transparent,var(--red),var(--gold),transparent);margin:14px 0;}
.splash-sub{font-family:var(--cond);font-size:13px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:var(--muted);margin-bottom:32px;}
.name-input{
  background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
  border-radius:4px;padding:12px 20px;font-size:15px;color:var(--white);
  font-family:var(--font);outline:none;width:260px;text-align:center;margin-bottom:14px;
  transition:border-color .2s;
}
.name-input::placeholder{color:rgba(255,255,255,0.3);}
.name-input:focus{border-color:var(--red);}
.splash-enter{
  background:var(--red);color:#fff;border:none;padding:16px 56px;
  font-family:var(--display);font-size:20px;font-weight:700;letter-spacing:4px;text-transform:uppercase;
  cursor:pointer;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
  transition:all .2s;margin-bottom:36px;
}
.splash-enter:hover{background:#c62828;transform:scale(1.03);}
.splash-stats{display:flex;gap:36px;}
.splash-stat{text-align:center;}
.splash-stat-val{font-family:var(--display);font-size:28px;font-weight:700;color:var(--gold);}
.splash-stat-lbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-top:2px;}

/* HEADER */
.header{
  padding:14px 18px;display:flex;align-items:center;justify-content:space-between;
  border-bottom:1px solid var(--border);
  background:rgba(6,8,11,0.96);
  position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);
}
.logo{font-family:var(--display);font-size:26px;font-weight:700;letter-spacing:2px;color:var(--white);}
.logo .dot{color:var(--red);}
.logo .zone{color:var(--gold);}
.live-pill{
  display:flex;align-items:center;gap:5px;
  background:rgba(229,57,53,0.15);border:1px solid rgba(229,57,53,0.4);
  border-radius:3px;padding:4px 10px;
  font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:#ff7070;text-transform:uppercase;
}
.live-pill::before{content:'';width:6px;height:6px;background:var(--red);border-radius:50%;animation:pulse 1s infinite;}

/* SECTIONS */
.section-header{display:flex;align-items:center;gap:10px;padding:14px 16px 8px;}
.section-tag{font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--muted);}
.section-hr{flex:1;height:1px;background:var(--border);}
.live-tag{display:flex;align-items:center;gap:5px;font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:2px;color:#ff7070;text-transform:uppercase;}
.live-tag::before{content:'';width:6px;height:6px;background:var(--red);border-radius:50%;animation:pulse 1s infinite;}

/* MATCH CARDS */
.match-list{padding:0 14px;display:flex;flex-direction:column;gap:8px;padding-bottom:24px;}
.match-card{
  background:linear-gradient(135deg,#0e1825 0%,#0a1018 100%);
  border:1px solid var(--border);border-radius:10px;overflow:hidden;
  cursor:pointer;position:relative;transition:all .18s;
}
.match-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--border);transition:background .18s;}
.match-card.live-card::before{background:var(--red);}
.match-card:hover{border-color:rgba(229,57,53,0.5);transform:translateX(2px);}
.match-card:active{transform:scale(.98);}
.mc-league{display:flex;align-items:center;gap:6px;padding:8px 14px 0 16px;}
.mc-league-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.mc-league-name{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--muted);}
.mc-body{display:flex;align-items:center;padding:10px 14px 12px 16px;gap:8px;}
.mc-team{flex:1;display:flex;align-items:center;gap:8px;}
.mc-team.right{flex-direction:row-reverse;}
.mc-badge{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;font-family:var(--cond);background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);flex-shrink:0;color:var(--white);}
.mc-name{font-family:var(--cond);font-size:14px;font-weight:800;text-transform:uppercase;color:var(--white);letter-spacing:0.5px;}
.mc-team.right .mc-name{text-align:right;}
.mc-center{text-align:center;min-width:72px;}
.mc-score{font-family:var(--display);font-size:30px;font-weight:700;letter-spacing:6px;color:var(--white);line-height:1;}
.mc-status-live{display:inline-flex;align-items:center;gap:4px;background:var(--red);color:#fff;font-family:var(--cond);font-size:10px;font-weight:800;padding:2px 8px;border-radius:2px;margin-top:4px;text-transform:uppercase;}
.mc-status-live::before{content:'';width:4px;height:4px;background:#fff;border-radius:50%;animation:pulse .8s infinite;}
.mc-footer{border-top:1px solid var(--border);padding:7px 16px;display:flex;align-items:center;}
.mc-viewers{font-size:11px;font-weight:600;color:var(--muted);display:flex;align-items:center;gap:5px;}
.mc-vdot{width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}
.mc-cmts{margin-left:auto;font-size:11px;color:var(--muted);}

/* MATCH SCREEN */
.ms-header{
  padding:14px 16px;display:flex;align-items:center;gap:12px;
  border-bottom:1px solid var(--border);
  background:rgba(6,8,11,0.96);position:sticky;top:0;z-index:100;backdrop-filter:blur(12px);
}
.back{width:36px;height:36px;background:rgba(255,255,255,0.07);border:1px solid var(--border);border-radius:6px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--white);transition:all .15s;}
.back:hover{background:rgba(255,255,255,0.14);}
.ms-info{flex:1;}
.ms-league{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:2px;}
.ms-teams{font-family:var(--cond);font-size:17px;font-weight:800;text-transform:uppercase;color:var(--white);}

/* SCORE CARD - Tribune style */
.score-card{
  margin:14px;border-radius:12px;overflow:hidden;
  position:relative;border:1px solid rgba(255,255,255,0.08);border-top:3px solid var(--red);
}
.score-card-bg{
  position:absolute;inset:0;
  background-color:#0d1e35;
  background-image:
    repeating-linear-gradient(
      180deg,
      transparent 0px, transparent 14px,
      rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 17px,
      transparent 17px, transparent 30px,
      rgba(255,255,255,0.025) 30px, rgba(255,255,255,0.025) 33px
    );
}
.score-inner{display:flex;align-items:center;padding:22px 16px 18px;gap:8px;position:relative;z-index:1;}
.sc-team{flex:1;text-align:center;}
.sc-badge{width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;font-family:var(--cond);background:rgba(255,255,255,0.07);border:2px solid rgba(255,255,255,0.14);margin:0 auto 10px;color:var(--white);}
.sc-name{font-family:var(--cond);font-size:14px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.75);}
.sc-mid{text-align:center;}
.sc-score{font-family:var(--display);font-size:64px;font-weight:700;letter-spacing:8px;color:var(--white);line-height:1;text-shadow:0 0 30px rgba(229,57,53,0.4);}
.sc-time-live{background:var(--red);color:#fff;font-family:var(--cond);font-size:12px;font-weight:800;padding:3px 12px;border-radius:2px;margin-top:6px;display:inline-block;}

/* REACTIONS */
.react-wrap{padding:0 14px 14px;overflow-x:auto;scrollbar-width:none;}
.react-wrap::-webkit-scrollbar{display:none;}
.react-inner{display:flex;gap:8px;width:max-content;}
.react-btn{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:7px 14px;cursor:pointer;color:var(--white);font-family:var(--cond);font-size:13px;font-weight:700;white-space:nowrap;transition:all .15s;}
.react-btn:hover,.react-btn.on{background:rgba(229,57,53,0.15);border-color:var(--red);color:#ff8a80;transform:translateY(-2px);}

/* POLL - Tribune background */
.poll{
  margin:0 14px 14px;border-radius:10px;overflow:hidden;
  border:1px solid rgba(255,193,7,0.25);border-left:3px solid var(--gold);
  position:relative;
}
.poll-bg{
  position:absolute;inset:0;
  background-color:#0c1a08;
  background-image:
    repeating-linear-gradient(
      180deg,
      transparent 0px, transparent 14px,
      rgba(255,255,255,0.04) 14px, rgba(255,255,255,0.04) 17px,
      transparent 17px, transparent 28px,
      rgba(255,255,255,0.025) 28px, rgba(255,255,255,0.025) 31px
    );
}
.poll-inner-wrap{position:relative;z-index:1;padding:14px 16px;}
.poll-head{font-family:var(--cond);font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:6px;}
.poll-q{font-size:16px;font-weight:700;color:var(--white);margin-bottom:12px;}
.poll-opts{display:flex;gap:8px;}
.poll-opt{flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:12px 6px;text-align:center;cursor:pointer;font-family:var(--cond);font-size:13px;font-weight:800;color:var(--white);position:relative;overflow:hidden;text-transform:uppercase;letter-spacing:0.5px;transition:all .2s;}
.poll-opt-bar{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(229,57,53,0.3),rgba(229,57,53,0.1));transition:width .6s ease;border-radius:8px;}
.poll-opt.voted{border-color:var(--red);color:#ff8a80;}
.poll-opt.winner{border-color:var(--gold);color:var(--gold);}
.poll-opt-content{position:relative;z-index:1;}
.poll-pct{display:block;font-family:var(--display);font-size:22px;color:var(--white);margin-top:4px;}
.poll-total{text-align:right;font-family:var(--cond);font-size:10px;color:var(--muted);letter-spacing:1px;margin-top:8px;}

/* FEED - Tribune rows */
.feed-wrap{
  background-image:
    repeating-linear-gradient(
      180deg,
      transparent 0px, transparent 18px,
      rgba(40,60,100,0.2) 18px, rgba(40,60,100,0.2) 22px,
      transparent 22px, transparent 38px,
      rgba(30,45,80,0.15) 38px, rgba(30,45,80,0.15) 42px
    );
}
.feed-header{display:flex;align-items:center;gap:10px;padding:12px 16px 8px;}
.feed-title{font-family:var(--cond);font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--muted);}
.feed-hr{flex:1;height:1px;background:var(--border);}
.online-pill{display:flex;align-items:center;gap:5px;font-family:var(--cond);font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);}
.od{width:5px;height:5px;background:var(--green);border-radius:50%;animation:pulse 2s infinite;}
.feed{padding:0 14px;display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--border) transparent;}
.msg{display:flex;gap:10px;animation:fadeIn .3s ease;}
.msg-av{width:36px;height:36px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:var(--cond);font-size:14px;font-weight:800;flex-shrink:0;border:1px solid rgba(255,255,255,0.1);color:var(--white);}
.msg-body{flex:1;}
.msg-top{display:flex;align-items:center;gap:6px;margin-bottom:3px;}
.msg-name{font-family:var(--cond);font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:var(--white);}
.msg-flag{font-size:13px;}
.msg-time{font-size:10px;color:var(--muted);margin-left:auto;font-family:var(--cond);font-weight:700;}
.msg-text{font-size:14px;color:rgba(255,255,255,0.85);line-height:1.45;}

/* INPUT */
.input-bar{padding:10px 14px 16px;display:flex;gap:9px;border-top:1px solid var(--border);background:rgba(6,8,11,0.97);position:sticky;bottom:0;backdrop-filter:blur(12px);}
.input-bar input{flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);border-radius:24px;padding:11px 18px;font-size:14px;color:var(--white);font-family:var(--font);outline:none;transition:border-color .15s;}
.input-bar input:focus{border-color:var(--red);}
.input-bar input::placeholder{color:rgba(255,255,255,0.3);}
.send{width:44px;height:44px;background:var(--red);border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:17px;color:#fff;flex-shrink:0;transition:all .15s;}
.send:hover{background:#c62828;transform:scale(1.06);}

.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#b71c1c;color:#fff;font-family:var(--cond);font-size:13px;font-weight:800;letter-spacing:1px;text-transform:uppercase;padding:10px 20px;border-radius:3px;z-index:9999;white-space:nowrap;animation:toastPop .3s ease;}
.loading{text-align:center;padding:40px 20px;color:var(--muted);font-family:var(--cond);font-size:12px;letter-spacing:2px;text-transform:uppercase;}

@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes toastPop{from{opacity:0;transform:translateX(-50%) scale(.9)}to{opacity:1;transform:translateX(-50%) scale(1)}}
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
  const [pollVoted, setPollVoted] = useState(null);
  const [pollData, setPollData] = useState({ 0: 58, 1: 27, 2: 15 });
  const [notified, setNotified] = useState({});
  const [userName, setUserName] = useState("");
  const [tempName, setTempName] = useState("");
  const unsubRef = useRef(null);
  const unsubPollRef = useRef(null);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://free-api-live-football-data.p.rapidapi.com/football-current-live", {
        headers: { "x-rapidapi-key": API_KEY, "x-rapidapi-host": API_HOST }
      });
      const data = await res.json();
      const live = (data?.response?.live || []).slice(0, 50).map(m => ({
        id: `match_${m.id}`,
        status: "LIVE",
        time: m.elapsed ? `${m.elapsed}'` : "LIVE",
        league: m.leagueName || "Football",
        leagueColor: "#e53935",
        home: { name: m.home?.name || "Home", short: (m.home?.name || "HOM").slice(0,3).toUpperCase(), badge: (m.home?.name || "H").slice(0,2).toUpperCase() },
        away: { name: m.away?.name || "Away", short: (m.away?.name || "AWY").slice(0,3).toUpperCase(), badge: (m.away?.name || "A").slice(0,2).toUpperCase() },
        score: [m.home?.score ?? 0, m.away?.score ?? 0],
        viewers: Math.floor(Math.random() * 15000) + 1000,
      }));
      setMatches(live);
    } catch(e) { console.error(e); }
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
    if (!active) return;
    if (unsubRef.current) unsubRef.current();
    const commentsRef = ref(db, `comments/${active.id}`);
    const unsub = onValue(commentsRef, snap => {
      const data = snap.val();
      if (data) {
        const list = Object.values(data).sort((a,b) => b.ts - a.ts).slice(0, 50);
        setComments(p => ({ ...p, [active.id]: list }));
      } else {
        setComments(p => ({ ...p, [active.id]: [] }));
      }
    });
    unsubRef.current = unsub;
    return () => unsub();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (unsubPollRef.current) unsubPollRef.current();
    setPollVoted(null);
    setPollData({ 0: 58, 1: 27, 2: 15 });
    const pollRef = ref(db, `polls/${active.id}`);
    const unsub = onValue(pollRef, snap => {
      const data = snap.val();
      if (data) setPollData(data);
    });
    unsubPollRef.current = unsub;
    return () => unsub();
  }, [active]);

  const openMatch = m => { setActive(m); setScreen("match"); };
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
      text: input.trim(), time: active.time, likes: 0, ts: Date.now()
    });
    setInput("");
  };

  const votePoll = async i => {
    if (pollVoted !== null) return;
    setPollVoted(i);
    const pollRef = ref(db, `polls/${active.id}`);
    const snap = await get(pollRef);
    const current = snap.val() || { 0: 58, 1: 27, 2: 15 };
    current[i] = (current[i] || 0) + 1;
    await set(pollRef, current);
  };

  const today = new Date().toLocaleDateString("en-US", { weekday:"short", day:"numeric", month:"short" }).toUpperCase();
  const pollTotal = Object.values(pollData).reduce((a,b) => a+b, 0);
  const msgs = active ? (comments[active.id] || []) : [];
  const winnerIdx = pollVoted !== null ? String(Object.keys(pollData).reduce((a,b) => (pollData[a]||0) > (pollData[b]||0) ? a : b)) : null;

  if (screen === "splash") return (
    <>
      <style>{S}</style>
      <div className="app">
        <div className="splash">
          <div className="splash-top-light" />
          <div className="splash-content">
            <div className="splash-badge">⚽ The Ultra Experience</div>
            <div className="splash-logo">ULTRAS<span className="dot">.</span><span className="zone">ZONE</span></div>
            <div className="splash-line" />
            <div className="splash-sub">Voice of the Fans · Fire of the Stands</div>
            <input className="name-input" placeholder="Enter your name..." value={tempName} onChange={e => setTempName(e.target.value)} onKeyDown={e => e.key==="Enter" && enterApp()} />
            <button className="splash-enter" onClick={enterApp}>ENTER THE ZONE</button>
            <div className="splash-stats">
              <div className="splash-stat"><div className="splash-stat-val">50M+</div><div className="splash-stat-lbl">Global Fans</div></div>
              <div className="splash-stat"><div className="splash-stat-val">Live</div><div className="splash-stat-lbl">Matches</div></div>
              <div className="splash-stat"><div className="splash-stat-val">Real</div><div className="splash-stat-lbl">Scores</div></div>
            </div>
          </div>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );

  if (screen === "home") return (
    <>
      <style>{S}</style>
      <div className="app tribune-bg">
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
          <div className="loading">No live matches right now</div>
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
          <div className="score-card-bg" />
          <div className="score-inner">
            <div className="sc-team"><div className="sc-badge">{active.home.badge}</div><div className="sc-name">{active.home.name}</div></div>
            <div className="sc-mid"><div className="sc-score">{active.score[0]}–{active.score[1]}</div><div className="sc-time-live">{active.time}</div></div>
            <div className="sc-team"><div className="sc-badge">{active.away.badge}</div><div className="sc-name">{active.away.name}</div></div>
          </div>
        </div>
        <div className="react-wrap">
          <div className="react-inner">
            {reacts.map((r,i) => (
              <button key={i} className={`react-btn${r.on?" on":""}`} onClick={() => setReacts(p => p.map((x,j) => j===i?{...x,n:x.on?x.n-1:x.n+1,on:!x.on}:x))}>
                <span>{r.e}</span>{r.n.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        <div className="poll">
          <div className="poll-bg" />
          <div className="poll-inner-wrap">
            <div className="poll-head">⚡ Fan Poll — Live Results</div>
            <div className="poll-q">Who wins this match?</div>
            <div className="poll-opts">
              {[active.home.short, active.away.short, "Draw"].map((opt,i) => {
                const pct = pollTotal > 0 ? Math.round(((pollData[i]||0)/pollTotal)*100) : 0;
                const isWinner = winnerIdx !== null && String(i) === winnerIdx;
                return (
                  <div key={i} className={`poll-opt${pollVoted===i?" voted":""}${isWinner?" winner":""}`} onClick={() => votePoll(i)} style={{cursor:pollVoted!==null?"default":"pointer"}}>
                    <div className="poll-opt-bar" style={{width:pollVoted!==null?`${pct}%`:"0%"}} />
                    <div className="poll-opt-content">
                      <span>{opt}</span>
                      {pollVoted!==null && <span className="poll-pct">{pct}%</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            {pollVoted!==null && <div className="poll-total">{pollTotal.toLocaleString()} votes total</div>}
          </div>
        </div>
        <div className="feed-wrap">
          <div className="feed-header">
            <div className="feed-title">🏟️ The Stands</div>
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
        </div>
        <div className="input-bar">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter"&&send()} placeholder="Raise your voice from the stands..." />
          <button className="send" onClick={send}>➤</button>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
