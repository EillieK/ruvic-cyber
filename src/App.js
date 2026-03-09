import { useState, useEffect, useMemo, useRef } from "react";

/* ══════════════════════════════════════════════════════
   CONFIG
══════════════════════════════════════════════════════ */
const DEFAULT_PASSWORD = "ruvic2024";
const PAYBILL    = "880100";
const ACCOUNT_NO = "21248";
const BIZ_NAME   = "RUVIC CYBER";

const SERVICES = [
  { id:"internet",  name:"Internet Access",     emoji:"🌐", unit:"hr",   price:50  },
  { id:"print_bw",  name:"Print — B&W",          emoji:"🖨️", unit:"pg",   price:10  },
  { id:"print_col", name:"Print — Color",         emoji:"🎨", unit:"pg",   price:30  },
  { id:"photocopy", name:"Photocopy",             emoji:"📄", unit:"pg",   price:5   },
  { id:"scanning",  name:"Scanning",              emoji:"🔍", unit:"pg",   price:20  },
  { id:"typing",    name:"Typing / Doc Prep",     emoji:"⌨️", unit:"pg",   price:50  },
  { id:"govt",      name:"eCitizen / KRA",         emoji:"🏛️", unit:"svc",  price:200 },
  { id:"jobs",      name:"Job Applications",      emoji:"📋", unit:"svc",  price:150 },
  { id:"binding",   name:"Binding & Lamination",  emoji:"📎", unit:"item", price:100 },
  { id:"email",     name:"Email & Accounts",      emoji:"✉️", unit:"svc",  price:100 },
  { id:"forms",     name:"Online Form Filling",   emoji:"📝", unit:"svc",  price:200 },
  { id:"it",        name:"IT Support",            emoji:"🔧", unit:"svc",  price:300 },
  { id:"other",     name:"Other / Accessories",   emoji:"🛍️", unit:"item", price:0   },
];

const EXP_CATS = ["Electricity","Rent","Internet Bill","Equipment","Stationery","Staff","Maintenance","Other"];
const PAYMENTS = ["Cash","M-Pesa","NCBA Bank","Other"];

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
const ksh   = n  => "KSh " + Number(n||0).toLocaleString("en-KE",{minimumFractionDigits:2,maximumFractionDigits:2});
const today = () => new Date().toISOString().split("T")[0];
const uid   = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);
const ls    = {
  get:(k,fb)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):fb; }catch{ return fb; }},
  set:(k,v) =>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} },
};

/* ══════════════════════════════════════════════════════
   PALETTE — Steel / Ice / Matrix
   #0c1316  bg
   #748B91  steel (primary)
   #C1D1CF  ice (bright)
   #666B64  warm gray
   #636467  mid gray
   #171F22  dark
   #3dffaa  matrix neon (accent only)
══════════════════════════════════════════════════════ */
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:     #0c1316;
  --surface:#111c20;
  --card:   #141f24;
  --cardAlt:#0f191d;
  --steel:  #748B91;
  --steelL: #8fa9b0;
  --steelD: #4a6068;
  --ice:    #C1D1CF;
  --iceD:   #8fa9b0;
  --warm:   #666B64;
  --mid:    #636467;
  --dark:   #171F22;
  --matrix: #3dffaa;
  --matrixD:#1a8a5c;
  --border: #1e2d32;
  --borderL:#2d4048;
  --text:   #b8cace;
  --textL:  #C1D1CF;
  --textMid:#748B91;
  --textDim:#3d5058;
  --red:    #ff6060;
  --green:  #3dffaa;
  --amber:  #ffb84d;
  --disp:   'Orbitron', monospace;
  --body:   'Share Tech Mono', monospace;
}
body{
  background:var(--bg);
  color:var(--text);
  font-family:var(--body);
  font-size:13px;
  line-height:1.7;
  position:relative;
}
button{cursor:pointer;font-family:var(--body);transition:all .2s ease;}
button:active{transform:scale(.96);}
input,select{font-family:var(--body);font-size:13px;}
input::placeholder{color:var(--textDim);}
select option{background:var(--card);color:var(--text);}
input:focus,select:focus{outline:none;border-color:var(--steel)!important;box-shadow:0 0 0 3px rgba(116,139,145,.18);}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--steelD);border-radius:3px;}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes popIn{from{opacity:0;transform:scale(.88);}to{opacity:1;transform:scale(1);}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(116,139,145,.55);}70%{box-shadow:0 0 0 10px rgba(116,139,145,0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes slideFade{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
@keyframes matrixPulse{0%,100%{opacity:1;}50%{opacity:.8;}}
@keyframes confBounce{0%{transform:scale(.3) translateY(40px);opacity:0;}55%{transform:scale(1.06);}100%{transform:scale(1);opacity:1;}}
@keyframes confLine{from{width:0;}to{width:100%;}}
@keyframes scan{0%{top:-4px;}100%{top:100%;}}
@keyframes glitch{
  0%,89%,100%{transform:translate(0);filter:none;}
  90%{transform:translate(-3px,1px);filter:hue-rotate(90deg);}
  92%{transform:translate(3px,-2px);filter:hue-rotate(-90deg);}
  94%{transform:translate(-2px,3px);}
  96%{transform:translate(2px,-1px);filter:none;}
}
@keyframes rotorSpin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}

.fadeUp{animation:fadeUp .32s ease forwards;}
.popIn{animation:popIn .28s cubic-bezier(.34,1.56,.64,1) forwards;}
.pulseDot{animation:pulse 2.2s infinite;}
`;

/* ══════════════════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════════════════ */
const T = {
  lbl:{ display:"block", fontSize:10, fontWeight:700, color:"var(--steelL)", textTransform:"uppercase", letterSpacing:2.5, marginBottom:6, fontFamily:"var(--disp)" },
  inp:{ width:"100%", background:"rgba(20,31,36,.8)", border:"1px solid var(--border)", borderRadius:6, color:"var(--textL)", padding:"12px 14px", fontSize:13, transition:"border .2s,box-shadow .2s", fontFamily:"var(--body)" },
  card:{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:10, padding:"22px 20px", marginBottom:16, position:"relative" },
  cardSteel:{ background:"linear-gradient(135deg,var(--cardAlt),var(--card))", border:"1px solid var(--borderL)", borderRadius:10, padding:"22px 20px", marginBottom:16, boxShadow:"0 4px 30px rgba(0,0,0,.4)", position:"relative" },
  btnPrimary:{ width:"100%", background:"linear-gradient(135deg,var(--steelD),var(--steel))", border:"1px solid var(--steelL)", borderRadius:8, color:"var(--ice)", fontWeight:700, fontSize:13, padding:"15px 22px", letterSpacing:2, fontFamily:"var(--disp)", boxShadow:"0 4px 20px rgba(116,139,145,.2)" },
  btnMatrix:{ width:"100%", background:"rgba(61,255,170,.08)", border:"1px solid var(--matrix)", borderRadius:8, color:"var(--matrix)", fontWeight:700, fontSize:13, padding:"15px 22px", letterSpacing:2, fontFamily:"var(--disp)", boxShadow:"0 0 20px rgba(61,255,170,.12)" },
  btnGhost:{ background:"none", border:"1px solid var(--border)", borderRadius:6, color:"var(--textMid)", fontWeight:600, fontSize:12, padding:"11px 16px", fontFamily:"var(--body)", letterSpacing:1 },
  btnDanger:{ width:"100%", background:"rgba(255,96,96,.08)", border:"1px solid rgba(255,96,96,.4)", borderRadius:8, color:"var(--red)", fontWeight:700, fontSize:13, padding:"15px 22px", letterSpacing:2, fontFamily:"var(--disp)" },
  sec:{ fontFamily:"var(--disp)", fontSize:11, color:"var(--steelL)", letterSpacing:4, marginBottom:18, display:"flex", alignItems:"center", gap:10, textTransform:"uppercase" },
  th:{ textAlign:"left", padding:"9px 12px", fontSize:9, color:"var(--steelD)", textTransform:"uppercase", letterSpacing:2.5, fontWeight:700, borderBottom:"1px solid var(--border)", fontFamily:"var(--disp)" },
  td:{ padding:"13px 12px", borderBottom:"1px solid rgba(30,45,50,.7)", fontSize:12, verticalAlign:"middle" },
  badge:(c="var(--steel)")=>({ display:"inline-flex", alignItems:"center", gap:4, background:`rgba(116,139,145,.1)`, color:c, border:`1px solid ${c}44`, borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:700, fontFamily:"var(--disp)", letterSpacing:1 }),
  stat:(c)=>({ background:"var(--card)", border:`1px solid ${c}25`, borderLeft:`3px solid ${c}`, borderRadius:10, padding:"18px 16px", position:"relative" }),
};

/* ══════════════════════════════════════════════════════
   CORNER BRACKET — techy card accent
══════════════════════════════════════════════════════ */
function Corners({ color="var(--steel)", size=10 }) {
  const s = { position:"absolute", width:size, height:size };
  const b = `1.5px solid ${color}`;
  return (
    <>
      <span style={{ ...s, top:6, left:6,  borderTop:b, borderLeft:b  }}/>
      <span style={{ ...s, top:6, right:6, borderTop:b, borderRight:b }}/>
      <span style={{ ...s, bottom:6, left:6,  borderBottom:b, borderLeft:b  }}/>
      <span style={{ ...s, bottom:6, right:6, borderBottom:b, borderRight:b }}/>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   ROBOT SVG — background silhouette
══════════════════════════════════════════════════════ */
function RobotBg({ opacity=0.05, style={} }) {
  return (
    <svg viewBox="0 0 400 520" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ position:"absolute", pointerEvents:"none", ...style }}>
      {/* Helmet dome */}
      <path d="M70 210 Q68 90 200 65 Q332 90 330 210 L330 285 Q328 328 200 342 Q72 328 70 285 Z"
        stroke="#C1D1CF" strokeWidth="1.5" fill="none"/>
      {/* Large eye lens — outer ring */}
      <circle cx="200" cy="192" r="68" stroke="#748B91" strokeWidth="1.5" fill="none"/>
      {/* Eye mid ring */}
      <circle cx="200" cy="192" r="52" stroke="#C1D1CF" strokeWidth="1" fill="none"/>
      {/* Eye inner ring */}
      <circle cx="200" cy="192" r="36" stroke="#748B91" strokeWidth="1.2" fill="none"/>
      {/* Eye iris */}
      <circle cx="200" cy="192" r="20" stroke="#748B91" strokeWidth="1" fill="none"/>
      {/* Eye pupil */}
      <circle cx="200" cy="192" r="8" fill="#748B91" opacity="0.6"/>
      {/* Eye horizontal scan line */}
      <line x1="132" y1="192" x2="268" y2="192" stroke="#C1D1CF" strokeWidth="0.6" opacity="0.7"/>
      {/* Eye vertical line */}
      <line x1="200" y1="124" x2="200" y2="260" stroke="#748B91" strokeWidth="0.5" opacity="0.5"/>
      {/* Left cheek panel */}
      <path d="M70 228 L34 224 L22 276 L58 282 L70 268" stroke="#748B91" strokeWidth="1.2" fill="none"/>
      <line x1="34" y1="240" x2="58" y2="244" stroke="#748B91" strokeWidth="0.7" opacity="0.6"/>
      <line x1="29" y1="258" x2="54" y2="262" stroke="#748B91" strokeWidth="0.7" opacity="0.6"/>
      {/* Right cheek panel */}
      <path d="M330 228 L366 224 L378 276 L342 282 L330 268" stroke="#748B91" strokeWidth="1.2" fill="none"/>
      <line x1="366" y1="240" x2="342" y2="244" stroke="#748B91" strokeWidth="0.7" opacity="0.6"/>
      <line x1="371" y1="258" x2="346" y2="262" stroke="#748B91" strokeWidth="0.7" opacity="0.6"/>
      {/* Top head detail */}
      <circle cx="200" cy="57" r="10" stroke="#748B91" strokeWidth="1.2" fill="none"/>
      <line x1="155" y1="67" x2="160" y2="92" stroke="#748B91" strokeWidth="1" opacity="0.5"/>
      <line x1="245" y1="67" x2="240" y2="92" stroke="#748B91" strokeWidth="1" opacity="0.5"/>
      <line x1="120" y1="100" x2="128" y2="118" stroke="#748B91" strokeWidth="0.8" opacity="0.4"/>
      <line x1="280" y1="100" x2="272" y2="118" stroke="#748B91" strokeWidth="0.8" opacity="0.4"/>
      {/* Neck */}
      <path d="M158 342 L150 386 L250 386 L242 342" stroke="#748B91" strokeWidth="1.2" fill="none"/>
      <line x1="152" y1="355" x2="248" y2="355" stroke="#748B91" strokeWidth="0.8" opacity="0.5"/>
      <line x1="153" y1="366" x2="247" y2="366" stroke="#748B91" strokeWidth="0.8" opacity="0.5"/>
      <line x1="151" y1="377" x2="249" y2="377" stroke="#748B91" strokeWidth="0.8" opacity="0.5"/>
      {/* Left shoulder */}
      <path d="M42 450 Q90 388 150 386 L152 420 Q96 422 48 480 Z" stroke="#748B91" strokeWidth="1.2" fill="none"/>
      <line x1="88" y1="393" x2="82" y2="432" stroke="#748B91" strokeWidth="0.7" opacity="0.4"/>
      <line x1="115" y1="389" x2="112" y2="428" stroke="#748B91" strokeWidth="0.7" opacity="0.4"/>
      <line x1="135" y1="387" x2="134" y2="425" stroke="#748B91" strokeWidth="0.7" opacity="0.4"/>
      {/* Right shoulder */}
      <path d="M358 450 Q310 388 250 386 L248 420 Q304 422 352 480 Z" stroke="#748B91" strokeWidth="1.2" fill="none"/>
      <line x1="312" y1="393" x2="318" y2="432" stroke="#748B91" strokeWidth="0.7" opacity="0.4"/>
      <line x1="285" y1="389" x2="288" y2="428" stroke="#748B91" strokeWidth="0.7" opacity="0.4"/>
      <line x1="265" y1="387" x2="266" y2="425" stroke="#748B91" strokeWidth="0.7" opacity="0.4"/>
      {/* Chest panel */}
      <path d="M152 420 Q200 430 248 420 L252 480 Q200 492 148 480 Z" stroke="#C1D1CF" strokeWidth="1" fill="none" opacity="0.7"/>
      <rect x="178" y="435" width="44" height="22" rx="3" stroke="#748B91" strokeWidth="0.8" fill="none"/>
      <circle cx="200" cy="446" r="6" stroke="#748B91" strokeWidth="1" fill="none"/>
      <circle cx="200" cy="446" r="3" fill="#748B91" opacity="0.5"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   CIRCUIT OVERLAY
══════════════════════════════════════════════════════ */
function CircuitBg() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      {/* Scanlines */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px)", opacity:1 }}/>
      {/* Circuit SVG pattern */}
      <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:0.03 }}>
        <defs>
          <pattern id="circ" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M20 0v20H0M80 20H60v20M20 80V60h20M80 60H60V40M40 0v15M40 80V65M0 40h15M80 40H65" stroke="#748B91" strokeWidth="1" fill="none"/>
            <circle cx="20" cy="20" r="2.5" fill="#748B91"/>
            <circle cx="60" cy="20" r="2.5" fill="#748B91"/>
            <circle cx="20" cy="60" r="2.5" fill="#748B91"/>
            <circle cx="60" cy="60" r="2.5" fill="#748B91"/>
            <circle cx="40" cy="40" r="3" fill="#C1D1CF" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circ)"/>
      </svg>
      {/* Robot bg - top right corner */}
      <RobotBg opacity={0.05} style={{ top:"-40px", right:"-60px", width:"420px", height:"540px", opacity:0.05 }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MATRIX RAIN — login background
══════════════════════════════════════════════════════ */
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const cols = Math.floor(W / 18);
    const drops = Array(cols).fill(0).map(() => Math.random() * -50);
    const chars = "アイウエオカキクケコ01サシスセソタチツテト10ナニヌネノハヒフへホABCDEF0123456789";
    let frame;
    const draw = () => {
      ctx.fillStyle = "rgba(12,19,22,.06)";
      ctx.fillRect(0, 0, W, H);
      drops.forEach((y, i) => {
        const idx = Math.floor(Math.random() * chars.length);
        const bright = Math.random() > 0.9;
        ctx.fillStyle = bright ? "rgba(193,209,207,.7)" : "rgba(116,139,145,.25)";
        ctx.font = `${bright ? "bold " : ""}14px 'Share Tech Mono', monospace`;
        ctx.fillText(chars[idx], i * 18, y * 18);
        if (y * 18 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"fixed", top:0, left:0, zIndex:0, opacity:.55 }}/>;
}

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
function Modal({ open, onClose, children, width=490 }) {
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(8,14,18,.94)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(8px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--card)",border:"1px solid var(--borderL)",borderRadius:12,padding:"32px 28px",maxWidth:width,width:"100%",boxShadow:"0 0 80px rgba(116,139,145,.15)",animation:"popIn .25s ease",maxHeight:"92vh",overflowY:"auto",position:"relative" }}>
        <Corners color="var(--steel)" size={11}/>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MPESA MODAL — logic unchanged, steel theme
══════════════════════════════════════════════════════ */
function MpesaModal({ open, amount, desc, onConfirm, onCancel }) {
  const [mode,    setMode]    = useState(null);
  const [phone,   setPhone]   = useState("");
  const [ref,     setRef]     = useState("");
  const [loading, setLoading] = useState(false);
  const [stkSent, setStkSent] = useState(false);

  function reset() { setMode(null); setPhone(""); setRef(""); setLoading(false); setStkSent(false); onCancel(); }
  function confirm() { onConfirm({ phone, ref }); reset(); }

  function sendStk() {
    if (!phone.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStkSent(true); }, 2000);
  }

  const paybillToShow = ls.get("ruvic_paybill", PAYBILL);
  const accToShow = ls.get("ruvic_acc", ACCOUNT_NO);

  return (
    <Modal open={open} onClose={reset}>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:32, marginBottom:8 }}>📱</div>
        <div style={{ fontFamily:"var(--disp)", fontSize:22, color:"var(--ice)", letterSpacing:5, marginBottom:4 }}>M-PESA PAYMENT</div>
        <div style={{ fontFamily:"var(--disp)", fontSize:36, color:"var(--matrix)", letterSpacing:2, margin:"6px 0", textShadow:"0 0 20px rgba(61,255,170,.4)" }}>{ksh(amount)}</div>
        {desc && <div style={{ fontSize:12, color:"var(--textMid)" }}>{desc}</div>}
      </div>

      {/* Paybill always visible */}
      <div style={{ background:"rgba(15,25,29,.8)", border:"1px solid var(--borderL)", borderRadius:8, padding:"14px 16px", marginBottom:22, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, position:"relative" }}>
        <Corners color="var(--steel)" size={8}/>
        {[["Paybill", paybillToShow],["Account", accToShow],["Business", ls.get("ruvic_biz", BIZ_NAME)],["Amount", ksh(amount)]].map(([l,v]) => (
          <div key={l}>
            <div style={{ fontSize:9, color:"var(--textDim)", textTransform:"uppercase", letterSpacing:2, marginBottom:3, fontFamily:"var(--disp)" }}>{l}</div>
            <div style={{ fontFamily:l==="Paybill"||l==="Account"?"var(--disp)":"var(--body)", fontSize:l==="Paybill"||l==="Account"?18:13, color:"var(--textL)", letterSpacing:l==="Paybill"||l==="Account"?2:0, fontWeight:700 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Mode select */}
      {!mode && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <button onClick={()=>setMode("stk")} style={{ background:"rgba(61,255,170,.05)", border:"1px solid rgba(61,255,170,.3)", borderRadius:8, padding:"20px 12px", textAlign:"center", cursor:"pointer", position:"relative" }}>
            <Corners color="var(--matrix)" size={8}/>
            <div style={{ fontSize:28, marginBottom:6 }}>⚡</div>
            <div style={{ fontFamily:"var(--disp)", fontSize:13, color:"var(--matrix)", letterSpacing:2, marginBottom:4 }}>STK PUSH</div>
            <div style={{ fontSize:11, color:"var(--textMid)", lineHeight:1.5, fontFamily:"var(--body)" }}>Send prompt to customer's phone</div>
          </button>
          <button onClick={()=>setMode("manual")} style={{ background:"rgba(116,139,145,.05)", border:"1px solid var(--border)", borderRadius:8, padding:"20px 12px", textAlign:"center", cursor:"pointer", position:"relative" }}>
            <Corners color="var(--steelD)" size={8}/>
            <div style={{ fontSize:28, marginBottom:6 }}>✋</div>
            <div style={{ fontFamily:"var(--disp)", fontSize:13, color:"var(--ice)", letterSpacing:2, marginBottom:4 }}>MANUAL</div>
            <div style={{ fontSize:11, color:"var(--textMid)", lineHeight:1.5, fontFamily:"var(--body)" }}>Customer paid via Paybill already</div>
          </button>
        </div>
      )}

      {/* STK flow */}
      {mode==="stk" && !stkSent && (
        <div style={{ animation:"slideFade .25s ease" }}>
          <div style={{ marginBottom:16 }}>
            <label style={T.lbl}>Customer Phone Number</label>
            <input style={T.inp} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XX XXX XXX" type="tel" autoFocus/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:10 }}>
            <button onClick={()=>setMode(null)} style={T.btnGhost}>← BACK</button>
            <button onClick={sendStk} disabled={loading||!phone.trim()} style={{ ...T.btnMatrix, opacity:loading||!phone.trim()?.5:1 }}>
              {loading
                ? <span style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                    <span style={{ width:14,height:14,border:"2px solid rgba(61,255,170,.3)",borderTop:"2px solid var(--matrix)",borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block" }}/>
                    SENDING...
                  </span>
                : "⚡  SEND PROMPT"}
            </button>
          </div>
        </div>
      )}

      {mode==="stk" && stkSent && (
        <div style={{ textAlign:"center", animation:"slideFade .25s ease" }}>
          <div style={{ fontSize:46, marginBottom:10 }}>📲</div>
          <div style={{ fontFamily:"var(--disp)", fontSize:16, color:"var(--matrix)", letterSpacing:4, marginBottom:8 }}>PROMPT SENT</div>
          <div style={{ fontSize:13, color:"var(--textMid)", marginBottom:5, fontFamily:"var(--body)" }}>Request sent to <strong style={{ color:"var(--textL)" }}>{phone}</strong></div>
          <div style={{ fontSize:12, color:"var(--textDim)", marginBottom:22 }}>Customer should enter M-Pesa PIN now.</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <button onClick={reset} style={T.btnGhost}>CANCEL</button>
            <button onClick={confirm} style={T.btnMatrix}>✓ CONFIRM RECEIVED</button>
          </div>
        </div>
      )}

      {/* Manual flow */}
      {mode==="manual" && (
        <div style={{ animation:"slideFade .25s ease" }}>
          <div style={{ marginBottom:16 }}>
            <label style={T.lbl}>M-Pesa Reference Code <span style={{ textTransform:"none",letterSpacing:0,color:"var(--textDim)",fontFamily:"var(--body)" }}>(optional)</span></label>
            <input style={T.inp} value={ref} onChange={e=>setRef(e.target.value)} placeholder="e.g. SFK2X8Y9A1"/>
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={T.lbl}>Customer Phone <span style={{ textTransform:"none",letterSpacing:0,color:"var(--textDim)",fontFamily:"var(--body)" }}>(optional)</span></label>
            <input style={T.inp} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XX XXX XXX" type="tel"/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:10 }}>
            <button onClick={()=>setMode(null)} style={T.btnGhost}>← BACK</button>
            <button onClick={confirm} style={T.btnPrimary}>✓  RECORD PAYMENT</button>
          </div>
        </div>
      )}

      {!mode && (
        <button onClick={reset} style={{ ...T.btnGhost, width:"100%", marginTop:12, textAlign:"center" }}>CANCEL</button>
      )}
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
function Toast({ t }) {
  if (!t?.msg) return null;
  const ok = t.type === "ok";
  return (
    <div style={{ background:ok?"rgba(61,255,170,.07)":"rgba(255,96,96,.07)", border:`1px solid ${ok?"rgba(61,255,170,.35)":"rgba(255,96,96,.35)"}`, borderRadius:6, padding:"12px 18px", color:ok?"var(--green)":"var(--red)", fontSize:12, fontWeight:700, marginBottom:16, textAlign:"center", fontFamily:"var(--disp)", letterSpacing:1 }}>
      {t.msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════════ */
function Login({ onLogin }) {
  const [pw,   setPw]   = useState("");
  const [show, setShow] = useState(false);
  const [err,  setErr]  = useState("");
  const [scanY,setScanY]= useState(0);

  useEffect(() => {
    let y = 0, raf;
    const tick = () => { y = (y + 0.3) % 103; setScanY(y); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function attempt() {
    const stored = ls.get("ruvic_pw", DEFAULT_PASSWORD);
    if (pw === stored) { sessionStorage.setItem("ruvic_auth","1"); onLogin(); }
    else { setErr("ACCESS DENIED — INVALID CODE"); setPw(""); setTimeout(() => setErr(""), 3200); }
  }

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", padding:20 }}>
      <MatrixRain/>
      {/* Large robot behind the card */}
      <div style={{ position:"absolute", right:"-5%", top:"50%", transform:"translateY(-50%)", width:"55vw", maxWidth:520, opacity:.08, zIndex:1 }}>
        <RobotBg opacity={1} style={{ position:"relative", width:"100%", height:"auto" }}/>
      </div>

      {/* Login card */}
      <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:420 }}>
        <Corners color="var(--steel)" size={14}/>
        <div style={{ background:"rgba(14,22,27,.92)", border:"1px solid var(--borderL)", borderRadius:12, padding:"44px 36px", backdropFilter:"blur(16px)", boxShadow:"0 0 80px rgba(116,139,145,.15)", overflow:"hidden", position:"relative" }}>
          {/* Scan line */}
          <div style={{ position:"absolute", left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(193,209,207,.12),transparent)", top:`${scanY}%`, zIndex:20, pointerEvents:"none" }}/>

          {/* Logo */}
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
              {/* Rotating ring around logo */}
              <div style={{ position:"absolute", width:72, height:72, border:"1px solid var(--steelD)", borderRadius:"50%", borderTopColor:"var(--steel)", animation:"rotorSpin 6s linear infinite" }}/>
              <div style={{ position:"absolute", width:56, height:56, border:"1px dashed var(--steelD)", borderRadius:"50%", animation:"rotorSpin 10s linear infinite reverse", opacity:.5 }}/>
              <div style={{ width:48, height:48, background:"rgba(116,139,145,.12)", border:"1px solid var(--steel)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>⬡</div>
            </div>
            <div style={{ fontFamily:"var(--disp)", fontSize:26, color:"var(--ice)", letterSpacing:8, marginBottom:4 }}>RUVIC</div>
            <div style={{ fontFamily:"var(--disp)", fontSize:11, color:"var(--steelL)", letterSpacing:6 }}>CYBER OPERATIONS</div>
            <div style={{ fontSize:10, color:"var(--textDim)", letterSpacing:2, marginTop:6, fontFamily:"var(--body)" }}>POS SYSTEM v6.0</div>
          </div>

          {/* Error */}
          {err && (
            <div style={{ background:"rgba(255,96,96,.08)", border:"1px solid rgba(255,96,96,.3)", borderRadius:6, padding:"10px 14px", color:"var(--red)", fontSize:11, fontWeight:700, marginBottom:16, textAlign:"center", fontFamily:"var(--disp)", letterSpacing:2 }}>
              {err}
            </div>
          )}

          {/* Access code */}
          <div style={{ marginBottom:20 }}>
            <label style={{ ...T.lbl, marginBottom:8 }}>ACCESS CODE</label>
            <div style={{ position:"relative" }}>
              <input
                style={{ ...T.inp, paddingRight:46, letterSpacing:show?0:4, fontSize:show?13:18 }}
                type={show ? "text" : "password"}
                value={pw}
                onChange={e=>setPw(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&attempt()}
                placeholder="········"
                autoFocus
              />
              <button onClick={()=>setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", fontSize:15, color:"var(--textDim)", padding:0 }}>
                {show ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button onClick={attempt} style={{ ...T.btnPrimary, fontSize:12, letterSpacing:4, padding:"15px 22px" }}>
            AUTHENTICATE
          </button>

          {/* Footer grid lines */}
          <div style={{ marginTop:28, display:"flex", gap:4, justifyContent:"center" }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{ width:6, height:6, background:"var(--steelD)", borderRadius:1, opacity:0.4 + i*0.1 }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   HEADER
══════════════════════════════════════════════════════ */
function Header({ onLogout }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(()=>setTime(new Date()), 1000); return ()=>clearInterval(t); }, []);

  return (
    <div style={{ background:"rgba(10,17,21,.96)", borderBottom:"1px solid var(--border)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:100 }}>
      {/* Top accent line */}
      <div style={{ height:2, background:"linear-gradient(90deg,transparent,var(--steelD),var(--steel),var(--steelD),transparent)" }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px" }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:34, height:34, border:"1.5px solid var(--steel)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, position:"relative" }}>
            ⬡
            <div style={{ position:"absolute", inset:-3, border:"1px solid var(--steelD)", borderRadius:8, opacity:.4 }}/>
          </div>
          <div>
            <div style={{ fontFamily:"var(--disp)", fontSize:15, color:"var(--ice)", letterSpacing:5 }}>RUVIC CYBER</div>
            <div style={{ fontSize:9, color:"var(--textDim)", letterSpacing:2, fontFamily:"var(--body)" }}>POS OPERATIONS TERMINAL</div>
          </div>
        </div>

        {/* Right — clock + logout */}
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"var(--disp)", fontSize:14, color:"var(--steelL)", letterSpacing:2 }}>
              {time.toLocaleTimeString("en-KE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </div>
            <div style={{ fontSize:9, color:"var(--textDim)", letterSpacing:1.5 }}>
              {time.toLocaleDateString("en-KE",{weekday:"short",day:"numeric",month:"short",year:"numeric"}).toUpperCase()}
            </div>
          </div>
          <div style={{ width:1, height:30, background:"var(--border)" }}/>
          <button onClick={onLogout} style={{ background:"none", border:"1px solid var(--border)", borderRadius:5, color:"var(--textDim)", fontWeight:700, fontSize:9, padding:"7px 13px", letterSpacing:2, fontFamily:"var(--disp)" }}>
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════ */
const TABS = [
  { id:"dash",     label:"Dashboard", icon:"▦" },
  { id:"sale",     label:"New Sale",  icon:"+" },
  { id:"expense",  label:"Expenses",  icon:"↓" },
  { id:"records",  label:"Records",   icon:"☰" },
  { id:"reports",  label:"Reports",   icon:"▲" },
  { id:"settings", label:"Settings",  icon:"⚙" },
];

function Nav({ view, setView }) {
  return (
    <div style={{ display:"flex", background:"rgba(11,19,22,.95)", borderBottom:"1px solid var(--border)", overflowX:"auto", backdropFilter:"blur(8px)" }}>
      {TABS.map(t => {
        const a = view === t.id;
        return (
          <button key={t.id} onClick={()=>setView(t.id)} style={{
            display:"flex", alignItems:"center", gap:7,
            padding:"13px 18px",
            border:"none",
            background:a?"rgba(116,139,145,.08)":"none",
            color:a?"var(--ice)":"var(--textDim)",
            fontSize:10, fontWeight:700, fontFamily:"var(--disp)",
            borderBottom:`2px solid ${a?"var(--steel)":"transparent"}`,
            whiteSpace:"nowrap", letterSpacing:1.5, transition:"all .2s"
          }}>
            <span style={{ fontSize:12, opacity: a ? 1 : 0.6 }}>{t.icon}</span>
            {t.label.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════ */
function Stat({ label, value, sub, color }) {
  return (
    <div style={{ ...T.stat(color), overflow:"hidden" }}>
      <Corners color={color} size={8}/>
      <div style={{ fontSize:9, color:"var(--textDim)", textTransform:"uppercase", letterSpacing:2.5, fontWeight:700, marginBottom:10, fontFamily:"var(--disp)" }}>{label}</div>
      <div style={{ fontFamily:"var(--disp)", fontSize:18, color, letterSpacing:1, marginBottom:4, animation:"matrixPulse 3s ease infinite" }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"var(--textDim)", fontFamily:"var(--body)" }}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════ */
function Settings() {
  const [curPw,   setCurPw]  = useState("");
  const [newPw,   setNewPw]  = useState("");
  const [confPw,  setConfPw] = useState("");
  const [showPw,  setShowPw] = useState(false);
  const [pwMsg,   setPwMsg]  = useState({type:"",msg:""});
  const [bizName, setBizName]= useState(()=>ls.get("ruvic_biz", BIZ_NAME));
  const [paybill, setPaybill]= useState(()=>ls.get("ruvic_paybill", PAYBILL));
  const [accNo,   setAccNo]  = useState(()=>ls.get("ruvic_acc", ACCOUNT_NO));
  const [bizMsg,  setBizMsg] = useState({type:"",msg:""});

  function toast(s,type,msg){ s({type,msg}); setTimeout(()=>s({type:"",msg:""}),4000); }

  function changePw() {
    const stored = ls.get("ruvic_pw", DEFAULT_PASSWORD);
    if (!curPw)         return toast(setPwMsg,"err","Enter your current password");
    if (curPw!==stored) return toast(setPwMsg,"err","Current password is incorrect");
    if (newPw.length<4) return toast(setPwMsg,"err","New password must be at least 4 characters");
    if (newPw!==confPw) return toast(setPwMsg,"err","Passwords don't match");
    ls.set("ruvic_pw", newPw);
    setCurPw(""); setNewPw(""); setConfPw("");
    toast(setPwMsg,"ok","✓ PASSWORD UPDATED");
  }

  function saveBiz() {
    ls.set("ruvic_biz", bizName); ls.set("ruvic_paybill", paybill); ls.set("ruvic_acc", accNo);
    toast(setBizMsg,"ok","✓ SETTINGS SAVED");
  }

  const secLabel = (icon, text) => (
    <div style={{ ...T.sec, marginBottom:18, paddingBottom:10, borderBottom:"1px solid var(--border)" }}>
      <span style={{ color:"var(--steelL)" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );

  return (
    <div className="fadeUp">
      <div style={{ ...T.card, position:"relative" }}>
        <Corners color="var(--steelD)"/>
        {secLabel("🔒", "CHANGE PASSWORD")}
        <Toast t={pwMsg}/>
        <div style={{ marginBottom:14 }}>
          <label style={T.lbl}>Current Password</label>
          <div style={{ position:"relative" }}>
            <input style={{ ...T.inp,paddingRight:46 }} type={showPw?"text":"password"} value={curPw} onChange={e=>setCurPw(e.target.value)} placeholder="Current password"/>
            <button onClick={()=>setShowPw(!showPw)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:15,color:"var(--textDim)",padding:0 }}>{showPw?"🙈":"👁️"}</button>
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={T.lbl}>New Password</label>
          <input style={T.inp} type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="Minimum 4 characters"/>
        </div>
        <div style={{ marginBottom:22 }}>
          <label style={T.lbl}>Confirm New Password</label>
          <input style={{ ...T.inp, borderColor:confPw&&confPw!==newPw?"var(--red)":undefined }} type="password" value={confPw} onChange={e=>setConfPw(e.target.value)} placeholder="Repeat new password"/>
          {confPw&&confPw!==newPw&&<div style={{ fontSize:11,color:"var(--red)",marginTop:5,letterSpacing:1,fontFamily:"var(--disp)" }}>PASSWORDS DO NOT MATCH</div>}
        </div>
        <button style={T.btnPrimary} onClick={changePw}>UPDATE PASSWORD</button>
      </div>

      <div style={{ ...T.card, position:"relative" }}>
        <Corners color="var(--steelD)"/>
        {secLabel("🏪", "BUSINESS SETTINGS")}
        <Toast t={bizMsg}/>
        <div style={{ marginBottom:14 }}>
          <label style={T.lbl}>Business Name</label>
          <input style={T.inp} value={bizName} onChange={e=>setBizName(e.target.value)}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:22 }}>
          <div>
            <label style={T.lbl}>M-Pesa Paybill</label>
            <input style={T.inp} value={paybill} onChange={e=>setPaybill(e.target.value)}/>
          </div>
          <div>
            <label style={T.lbl}>Account Number</label>
            <input style={T.inp} value={accNo} onChange={e=>setAccNo(e.target.value)}/>
          </div>
        </div>
        <button style={T.btnPrimary} onClick={saveBiz}>SAVE SETTINGS</button>
      </div>

      <div style={{ ...T.card, position:"relative" }}>
        <Corners color="var(--steelD)"/>
        {secLabel("💾", "DATA MANAGEMENT")}
        <div style={{ fontSize:12, color:"var(--textDim)", lineHeight:1.8, marginBottom:20, fontFamily:"var(--body)" }}>
          Records are stored locally in this browser. Proceed to Step 4 for cloud storage setup.
        </div>
        <button style={{ ...T.btnDanger, maxWidth:260 }} onClick={()=>{ if(window.confirm("⚠️ Delete ALL records permanently?")){ ls.set("ruvic_sales",[]); ls.set("ruvic_exp",[]); alert("All records cleared."); } }}>
          ⚠️  CLEAR ALL RECORDS
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [auth,      setAuth]      = useState(() => sessionStorage.getItem("ruvic_auth") === "1");
  const [view,      setView]      = useState("dash");
  const [sales,     setSales]     = useState(() => ls.get("ruvic_sales", []));
  const [expenses,  setExpenses]  = useState(() => ls.get("ruvic_exp", []));
  const [soldFlash, setSoldFlash] = useState(false);

  useEffect(() => ls.set("ruvic_sales",  sales),    [sales]);
  useEffect(() => ls.set("ruvic_exp",    expenses), [expenses]);

  /* Sale state */
  const [selSvc,   setSelSvc]   = useState(SERVICES[0]);
  const [qty,      setQty]      = useState("1");
  const [price,    setPrice]    = useState(String(SERVICES[0].price));
  const [desc,     setDesc]     = useState(SERVICES[0].name);
  const [note,     setNote]     = useState("");
  const [saleDate, setSaleDate] = useState(today());
  const [payMeth,  setPayMeth]  = useState("Cash");
  const [saleMsg,  setSaleMsg]  = useState({type:"",msg:""});
  const [mpesaOpen,setMpesaOpen]= useState(false);

  /* Expense state */
  const [expCat,  setExpCat]  = useState(EXP_CATS[0]);
  const [expDesc, setExpDesc] = useState("");
  const [expAmt,  setExpAmt]  = useState("");
  const [expDate, setExpDate] = useState(today());
  const [expMsg,  setExpMsg]  = useState({type:"",msg:""});

  /* Records filter */
  const [recQ,    setRecQ]    = useState("");
  const [recSvc,  setRecSvc]  = useState("all");
  const [recFrom, setRecFrom] = useState(() => { const d=new Date(); d.setDate(1); return d.toISOString().split("T")[0]; });
  const [recTo,   setRecTo]   = useState(today());

  /* Reports */
  const [range,   setRange]   = useState("today");
  const [repFrom, setRepFrom] = useState(today());
  const [repTo,   setRepTo]   = useState(today());

  function toast(s,type,msg,ms=4000){ s({type,msg}); setTimeout(()=>s({type:"",msg:""}),ms); }
  function pickSvc(sv){ setSelSvc(sv); setPrice(String(sv.price)); setDesc(sv.name); setQty("1"); }

  function commitSale(mpesaData={}) {
    const q = Math.max(1, parseInt(qty)||1);
    const p = Math.max(0, parseFloat(price)||0);
    setSales(prev => [{ id:uid(), date:saleDate, svc:selSvc.id,
      desc:desc.trim()||selSvc.name, note:note.trim(),
      qty:q, unitPrice:p, amount:q*p, pay:payMeth,
      mpesaPhone:mpesaData.phone||"", mpesaRef:mpesaData.ref||"",
    }, ...prev]);
    setNote(""); setQty("1");
    setSoldFlash(true);
    setTimeout(() => { setSoldFlash(false); setView("dash"); }, 2200);
  }

  function handleSale() {
    const p = parseFloat(price)||0, q = parseInt(qty)||0;
    if (q < 1)                        return toast(setSaleMsg,"err","QTY MUST BE AT LEAST 1");
    if (p <= 0 && selSvc.id!=="other") return toast(setSaleMsg,"err","ENTER A VALID PRICE");
    if (payMeth === "M-Pesa")          setMpesaOpen(true);
    else                               commitSale();
  }

  function handleExpense() {
    const a = parseFloat(expAmt);
    if (!expDesc.trim()) return toast(setExpMsg,"err","DESCRIPTION REQUIRED");
    if (!a || a <= 0)    return toast(setExpMsg,"err","ENTER A VALID AMOUNT");
    setExpenses(prev => [{ id:uid(), date:expDate, cat:expCat, desc:expDesc.trim(), amount:a }, ...prev]);
    setExpDesc(""); setExpAmt("");
    toast(setExpMsg,"ok","✓ EXPENSE LOGGED — "+ksh(a));
  }

  function repDates() {
    const n = new Date();
    if (range==="today") return { f:today(), t:today() };
    if (range==="week")  { const d=new Date(n); d.setDate(d.getDate()-6); return { f:d.toISOString().split("T")[0], t:today() }; }
    if (range==="month") { const d=new Date(n.getFullYear(),n.getMonth(),1); return { f:d.toISOString().split("T")[0], t:today() }; }
    return { f:repFrom, t:repTo };
  }

  const {f:rf,t:rt} = repDates();
  const rSales  = useMemo(() => sales.filter(s=>s.date>=rf&&s.date<=rt),    [sales,range,repFrom,repTo]);
  const rExp    = useMemo(() => expenses.filter(e=>e.date>=rf&&e.date<=rt), [expenses,range,repFrom,repTo]);
  const totInc  = rSales.reduce((a,s)=>a+s.amount,0);
  const totExp  = rExp.reduce((a,e)=>a+e.amount,0);
  const netP    = totInc - totExp;

  const todSales  = sales.filter(s=>s.date===today());
  const todInc    = todSales.reduce((a,s)=>a+s.amount,0);
  const todExp2   = expenses.filter(e=>e.date===today()).reduce((a,e)=>a+e.amount,0);
  const todProfit = todInc - todExp2;

  const svcBreak = useMemo(() => {
    const m = {};
    rSales.forEach(s => { if(!m[s.svc]) m[s.svc]={total:0,count:0}; m[s.svc].total+=s.amount; m[s.svc].count++; });
    return Object.entries(m).map(([id,v])=>({id,...v,svc:SERVICES.find(x=>x.id===id)})).sort((a,b)=>b.total-a.total);
  }, [rSales]);

  const payBreak = useMemo(() => {
    const m = {};
    rSales.forEach(s => { m[s.pay]=(m[s.pay]||0)+s.amount; });
    return Object.entries(m).sort((a,b)=>b[1]-a[1]);
  }, [rSales]);

  const filtRec = useMemo(() =>
    sales.filter(s => {
      const sv = SERVICES.find(x=>x.id===s.svc);
      const q  = recQ.toLowerCase();
      return (recSvc==="all"||s.svc===recSvc)&&s.date>=recFrom&&s.date<=recTo&&
        (q===""||s.desc.toLowerCase().includes(q)||(sv?.name||"").toLowerCase().includes(q)||(s.note||"").toLowerCase().includes(q));
    })
  , [sales, recQ, recSvc, recFrom, recTo]);

  const svc = id => SERVICES.find(x=>x.id===id);

  if (!auth) return <><style>{GS}</style><Login onLogin={()=>setAuth(true)}/></>;

  const secLabel = (icon, text) => (
    <div style={{ ...T.sec, marginBottom:18, paddingBottom:10, borderBottom:"1px solid var(--border)" }}>
      <span style={{ color:"var(--steelL)" }}>{icon}</span>
      <span>{text}</span>
    </div>
  );

  return (
    <>
      <style>{GS}</style>
      <CircuitBg/>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", zIndex:1 }}>

        {/* ══ CONFIRMED FLASH ══ */}
        {soldFlash && (
          <div style={{ position:"fixed",inset:0,zIndex:3000,background:"rgba(8,14,18,.97)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",backdropFilter:"blur(10px)" }}>
            {/* Corner brackets full screen */}
            <div style={{ position:"absolute", top:30, left:30, width:40, height:40, borderTop:"2px solid var(--matrix)", borderLeft:"2px solid var(--matrix)" }}/>
            <div style={{ position:"absolute", top:30, right:30, width:40, height:40, borderTop:"2px solid var(--matrix)", borderRight:"2px solid var(--matrix)" }}/>
            <div style={{ position:"absolute", bottom:30, left:30, width:40, height:40, borderBottom:"2px solid var(--matrix)", borderLeft:"2px solid var(--matrix)" }}/>
            <div style={{ position:"absolute", bottom:30, right:30, width:40, height:40, borderBottom:"2px solid var(--matrix)", borderRight:"2px solid var(--matrix)" }}/>

            <div style={{ fontFamily:"var(--disp)", fontSize:11, color:"var(--matrixD)", letterSpacing:8, marginBottom:14, fontWeight:700 }}>TRANSACTION</div>
            <div style={{ fontFamily:"var(--disp)", fontSize:72, color:"var(--matrix)", letterSpacing:6, animation:"confBounce .55s cubic-bezier(.34,1.56,.64,1) forwards", textShadow:"0 0 60px rgba(61,255,170,.7)", lineHeight:1 }}>CONFIRMED</div>
            <div style={{ marginTop:22, width:220, height:2, background:"var(--matrix)", animation:"confLine .8s ease forwards", boxShadow:"0 0 12px rgba(61,255,170,.5)" }}/>
            <div style={{ fontFamily:"var(--disp)", fontSize:10, color:"var(--steelL)", letterSpacing:5, marginTop:16 }}>SALE RECORDED</div>
          </div>
        )}

        <MpesaModal
          open={mpesaOpen}
          amount={(parseInt(qty)||1)*(parseFloat(price)||0)}
          desc={desc}
          onConfirm={d=>{ setMpesaOpen(false); commitSale(d); }}
          onCancel={()=>setMpesaOpen(false)}
        />

        <Header onLogout={()=>{ sessionStorage.removeItem("ruvic_auth"); setAuth(false); }}/>
        <Nav view={view} setView={setView}/>

        <div style={{ flex:1, padding:"20px 16px", maxWidth:980, margin:"0 auto", width:"100%" }}>

          {/* ══════ DASHBOARD ══════ */}
          {view==="dash" && (
            <div className="fadeUp">
              {/* Hero banner */}
              <div style={{ background:"linear-gradient(135deg,rgba(22,32,38,.95),rgba(30,45,52,.95))", border:"1px solid var(--borderL)", borderRadius:10, padding:"22px 26px", marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 8px 40px rgba(0,0,0,.4)", position:"relative", overflow:"hidden" }}>
                <Corners color="var(--steel)" size={12}/>
                {/* Faint robot in hero corner */}
                <div style={{ position:"absolute", right:-20, top:-10, width:160, opacity:.06, pointerEvents:"none" }}>
                  <RobotBg opacity={1} style={{ position:"relative", width:"100%", height:"auto" }}/>
                </div>
                <div style={{ position:"relative", zIndex:2 }}>
                  <div style={{ fontSize:9, color:"var(--textDim)", letterSpacing:4, marginBottom:6, fontFamily:"var(--disp)" }}>TODAY'S INCOME</div>
                  <div style={{ fontFamily:"var(--disp)", fontSize:36, color:"var(--ice)", letterSpacing:2 }}>{ksh(todInc)}</div>
                  <div style={{ fontSize:11, color:"var(--textDim)", marginTop:4 }}>{todSales.length} transaction{todSales.length!==1?"s":""} today</div>
                </div>
                <div style={{ textAlign:"right", position:"relative", zIndex:2 }}>
                  <div style={{ fontSize:9, color:"var(--textDim)", letterSpacing:4, marginBottom:6, fontFamily:"var(--disp)" }}>PROFIT</div>
                  <div style={{ fontFamily:"var(--disp)", fontSize:28, color:todProfit>=0?"var(--matrix)":"var(--amber)", textShadow:todProfit>=0?"0 0 20px rgba(61,255,170,.35)":"none" }}>{ksh(todProfit)}</div>
                  <div style={{ fontSize:11, color:"var(--textDim)", marginTop:4 }}>After {ksh(todExp2)} expenses</div>
                </div>
              </div>

              {/* Stat cards */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
                <Stat label="Transactions"  value={String(todSales.length)} sub="Today"                              color="var(--steelL)"/>
                <Stat label="Expenses"      value={ksh(todExp2)}            sub={`${expenses.filter(e=>e.date===today()).length} entries`} color="var(--red)"/>
                <Stat label="Total Sales"   value={String(sales.length)}    sub="All time"                           color="var(--textMid)"/>
              </div>

              {/* Quick actions */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                <button onClick={()=>setView("sale")} style={{ ...T.btnMatrix, padding:"16px 20px", fontSize:11 }}>
                  +  RECORD SALE
                </button>
                <button onClick={()=>setView("expense")} style={{ ...T.btnGhost, padding:"16px 20px", fontSize:10, fontFamily:"var(--disp)", letterSpacing:2, color:"var(--textMid)" }}>
                  ↓  LOG EXPENSE
                </button>
              </div>

              {/* Today's transactions */}
              <div style={{ ...T.card, position:"relative" }}>
                <Corners color="var(--steelD)"/>
                {secLabel("▦", "TODAY'S TRANSACTIONS")}
                {todSales.length === 0
                  ? <div style={{ textAlign:"center", color:"var(--textDim)", padding:"36px 0", fontSize:12, fontFamily:"var(--body)" }}>
                      No sales recorded today — hit RECORD SALE to start.
                    </div>
                  : <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr>
                          <th style={T.th}>Service</th>
                          <th style={T.th}>Description</th>
                          <th style={T.th}>Qty</th>
                          <th style={T.th}>Amount</th>
                          <th style={T.th}>Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todSales.map(s => (
                          <tr key={s.id} style={{ transition:"background .15s" }}>
                            <td style={T.td}><span style={T.badge("var(--steelL)")}>{svc(s.svc)?.emoji} {svc(s.svc)?.name||s.svc}</span></td>
                            <td style={{ ...T.td, color:"var(--textMid)" }}>{s.desc}</td>
                            <td style={{ ...T.td, color:"var(--textDim)" }}>{s.qty}</td>
                            <td style={{ ...T.td, fontFamily:"var(--disp)", fontSize:13, color:"var(--ice)", letterSpacing:1 }}>{ksh(s.amount)}</td>
                            <td style={T.td}><span style={T.badge(s.pay==="M-Pesa"?"var(--matrix)":s.pay==="Cash"?"var(--steelL)":"var(--textDim)")}>{s.pay}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                }
              </div>
            </div>
          )}

          {/* ══════ NEW SALE ══════ */}
          {view==="sale" && (
            <div className="fadeUp">
              <Toast t={saleMsg}/>

              {/* Service grid */}
              <div style={{ ...T.cardSteel, position:"relative" }}>
                <Corners color="var(--steel)" size={11}/>
                {secLabel("①", "SELECT SERVICE")}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(118px,1fr))", gap:8 }}>
                  {SERVICES.map(sv => {
                    const sel = selSvc.id === sv.id;
                    return (
                      <button key={sv.id} onClick={()=>pickSvc(sv)} style={{
                        background:sel?"rgba(116,139,145,.15)":"rgba(15,25,29,.7)",
                        border:`1px solid ${sel?"var(--steel)":"var(--border)"}`,
                        borderRadius:8, padding:"14px 8px", textAlign:"center",
                        transition:"all .18s",
                        boxShadow:sel?"0 0 20px rgba(116,139,145,.25),inset 0 0 20px rgba(116,139,145,.05)":"none",
                        position:"relative"
                      }}>
                        {sel && <Corners color="var(--steel)" size={6}/>}
                        <div style={{ fontSize:22, marginBottom:6 }}>{sv.emoji}</div>
                        <div style={{ fontSize:10, fontWeight:700, color:sel?"var(--ice)":"var(--textDim)", lineHeight:1.4, marginBottom:4, fontFamily:"var(--disp)" }}>{sv.name}</div>
                        <div style={{ fontSize:9, color:sel?"var(--steelL)":"var(--textDim)", fontFamily:"var(--body)" }}>KSh {sv.price}/{sv.unit}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sale details */}
              <div style={{ ...T.card, position:"relative" }}>
                <Corners color="var(--steelD)"/>
                {secLabel("②", "SALE DETAILS")}
                <div style={{ marginBottom:14 }}>
                  <label style={T.lbl}>Description</label>
                  <input style={T.inp} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Auto-filled — edit if needed"/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={T.lbl}>Quantity <span style={{ textTransform:"none",letterSpacing:0,color:"var(--steelD)",fontFamily:"var(--body)" }}>({selSvc.unit})</span></label>
                    <input style={T.inp} type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)}/>
                  </div>
                  <div>
                    <label style={T.lbl}>Unit Price (KSh)</label>
                    <input style={T.inp} type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)}/>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={T.lbl}>Payment Method</label>
                    <select style={T.inp} value={payMeth} onChange={e=>setPayMeth(e.target.value)}>
                      {PAYMENTS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={T.lbl}>Date</label>
                    <input style={T.inp} type="date" value={saleDate} onChange={e=>setSaleDate(e.target.value)}/>
                  </div>
                </div>
                <div style={{ marginBottom:18 }}>
                  <label style={T.lbl}>Customer Note <span style={{ textTransform:"none",letterSpacing:0,fontWeight:600,color:"var(--textDim)",fontFamily:"var(--body)" }}>(optional)</span></label>
                  <input style={T.inp} value={note} onChange={e=>setNote(e.target.value)} placeholder="Name, phone, request..."/>
                </div>

                {/* Total */}
                <div style={{ background:"rgba(10,18,22,.8)", border:"1px solid var(--borderL)", borderRadius:8, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, position:"relative" }}>
                  <Corners color="var(--steelD)" size={8}/>
                  <div>
                    <div style={{ fontSize:9, color:"var(--textDim)", textTransform:"uppercase", letterSpacing:2.5, marginBottom:4, fontFamily:"var(--disp)" }}>Total Amount</div>
                    <div style={{ fontSize:11, color:"var(--textDim)", fontFamily:"var(--body)" }}>{qty||1} {selSvc.unit} × KSh {price||0}</div>
                  </div>
                  <div style={{ fontFamily:"var(--disp)", fontSize:30, color:"var(--ice)", letterSpacing:2 }}>
                    {ksh((parseInt(qty)||0)*(parseFloat(price)||0))}
                  </div>
                </div>

                <button onClick={handleSale} style={{ ...T.btnMatrix, fontSize:12, padding:"18px 28px", letterSpacing:4 }}>
                  {payMeth==="M-Pesa" ? "📱  M-PESA PAYMENT" : "✓  RECORD SALE"}
                </button>
              </div>
            </div>
          )}

          {/* ══════ EXPENSES ══════ */}
          {view==="expense" && (
            <div className="fadeUp">
              <Toast t={expMsg}/>
              <div style={{ ...T.card, position:"relative" }}>
                <Corners color="var(--steelD)"/>
                {secLabel("↓", "LOG EXPENSE")}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={T.lbl}>Category</label>
                    <select style={T.inp} value={expCat} onChange={e=>setExpCat(e.target.value)}>
                      {EXP_CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={T.lbl}>Date</label>
                    <input style={T.inp} type="date" value={expDate} onChange={e=>setExpDate(e.target.value)}/>
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={T.lbl}>Description</label>
                  <input style={T.inp} value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder='e.g. "KPLC token 500"'/>
                </div>
                <div style={{ marginBottom:22 }}>
                  <label style={T.lbl}>Amount (KSh)</label>
                  <input style={T.inp} type="number" min="0" value={expAmt} onChange={e=>setExpAmt(e.target.value)} placeholder="0.00"/>
                </div>
                <button style={T.btnDanger} onClick={handleExpense}>↓  LOG EXPENSE</button>
              </div>

              <div style={{ ...T.card, position:"relative" }}>
                <Corners color="var(--steelD)"/>
                {secLabel("☰", `ALL EXPENSES (${expenses.length})`)}
                {expenses.length === 0
                  ? <div style={{ textAlign:"center",color:"var(--textDim)",padding:"32px 0",fontSize:12 }}>No expenses logged yet.</div>
                  : <table style={{ width:"100%",borderCollapse:"collapse" }}>
                      <thead><tr>
                        <th style={T.th}>Date</th><th style={T.th}>Category</th><th style={T.th}>Description</th><th style={T.th}>Amount</th><th style={T.th}></th>
                      </tr></thead>
                      <tbody>{expenses.map(e => (
                        <tr key={e.id}>
                          <td style={{ ...T.td,color:"var(--textDim)",fontSize:11 }}>{e.date}</td>
                          <td style={T.td}><span style={T.badge("var(--red)")}>{e.cat}</span></td>
                          <td style={{ ...T.td,color:"var(--textMid)" }}>{e.desc}</td>
                          <td style={{ ...T.td,fontFamily:"var(--disp)",fontSize:12,color:"var(--red)",letterSpacing:1 }}>{ksh(e.amount)}</td>
                          <td style={T.td}><button onClick={()=>setExpenses(p=>p.filter(x=>x.id!==e.id))} style={{ background:"none",border:"none",color:"var(--textDim)",fontSize:16,cursor:"pointer" }}>✕</button></td>
                        </tr>
                      ))}</tbody>
                    </table>
                }
              </div>
            </div>
          )}

          {/* ══════ RECORDS ══════ */}
          {view==="records" && (
            <div className="fadeUp">
              <div style={{ ...T.card, position:"relative" }}>
                <Corners color="var(--steelD)"/>
                {secLabel("⊟", "FILTER RECORDS")}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
                  <div>
                    <label style={T.lbl}>Search</label>
                    <input style={T.inp} value={recQ} onChange={e=>setRecQ(e.target.value)} placeholder="Description, service, note..."/>
                  </div>
                  <div>
                    <label style={T.lbl}>Service</label>
                    <select style={T.inp} value={recSvc} onChange={e=>setRecSvc(e.target.value)}>
                      <option value="all">All Services</option>
                      {SERVICES.map(sv => <option key={sv.id} value={sv.id}>{sv.name}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <div><label style={T.lbl}>From</label><input style={T.inp} type="date" value={recFrom} onChange={e=>setRecFrom(e.target.value)}/></div>
                  <div><label style={T.lbl}>To</label><input style={T.inp} type="date" value={recTo} onChange={e=>setRecTo(e.target.value)}/></div>
                </div>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, padding:"0 2px" }}>
                <div style={{ fontSize:11,color:"var(--textDim)",fontFamily:"var(--body)" }}>{filtRec.length} of {sales.length} records</div>
                <div style={{ fontFamily:"var(--disp)",fontSize:13,color:"var(--steelL)",letterSpacing:1 }}>{ksh(filtRec.reduce((a,s)=>a+s.amount,0))}</div>
              </div>

              <div style={{ ...T.card, position:"relative" }}>
                <Corners color="var(--steelD)"/>
                {secLabel("☰", "SALES RECORDS")}
                {filtRec.length === 0
                  ? <div style={{ textAlign:"center",color:"var(--textDim)",padding:"32px 0",fontSize:12 }}>No records match your filter.</div>
                  : <table style={{ width:"100%",borderCollapse:"collapse" }}>
                      <thead><tr>
                        <th style={T.th}>Date</th><th style={T.th}>Service</th><th style={T.th}>Description</th><th style={T.th}>Qty</th><th style={T.th}>Amount</th><th style={T.th}>Pay</th><th style={T.th}></th>
                      </tr></thead>
                      <tbody>{filtRec.map(s => (
                        <tr key={s.id}>
                          <td style={{ ...T.td,fontSize:11,color:"var(--textDim)" }}>{s.date}</td>
                          <td style={T.td}><span style={T.badge("var(--steelL)")}>{svc(s.svc)?.emoji} {svc(s.svc)?.name||s.svc}</span></td>
                          <td style={{ ...T.td,color:"var(--textMid)" }}>
                            <div>{s.desc}</div>
                            {s.note && <div style={{ fontSize:10,color:"var(--textDim)",marginTop:2 }}>{s.note}</div>}
                          </td>
                          <td style={{ ...T.td,color:"var(--textDim)" }}>{s.qty}</td>
                          <td style={{ ...T.td,fontFamily:"var(--disp)",fontSize:12,color:"var(--ice)",letterSpacing:1 }}>{ksh(s.amount)}</td>
                          <td style={T.td}>
                            <span style={T.badge(s.pay==="M-Pesa"?"var(--matrix)":s.pay==="Cash"?"var(--steelL)":"var(--textDim)")}>{s.pay}</span>
                            {s.mpesaRef && <div style={{ fontSize:10,color:"var(--textDim)",marginTop:2 }}>Ref: {s.mpesaRef}</div>}
                          </td>
                          <td style={T.td}><button onClick={()=>setSales(p=>p.filter(x=>x.id!==s.id))} style={{ background:"none",border:"none",color:"var(--textDim)",fontSize:16,cursor:"pointer" }}>✕</button></td>
                        </tr>
                      ))}</tbody>
                    </table>
                }
              </div>
            </div>
          )}

          {/* ══════ REPORTS ══════ */}
          {view==="reports" && (
            <div className="fadeUp">
              {/* Range selector */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18, alignItems:"center" }}>
                {[["today","Today"],["week","7 Days"],["month","Month"],["custom","Custom"]].map(([v,l]) => (
                  <button key={v} onClick={()=>setRange(v)} style={{
                    background:range===v?"rgba(116,139,145,.15)":"rgba(15,25,29,.6)",
                    border:`1px solid ${range===v?"var(--steel)":"var(--border)"}`,
                    borderRadius:6, padding:"8px 16px",
                    color:range===v?"var(--ice)":"var(--textDim)",
                    fontSize:10, fontWeight:700, fontFamily:"var(--disp)", letterSpacing:1.5
                  }}>{l.toUpperCase()}</button>
                ))}
                {range==="custom" && <>
                  <input style={{ ...T.inp, width:150 }} type="date" value={repFrom} onChange={e=>setRepFrom(e.target.value)}/>
                  <input style={{ ...T.inp, width:150 }} type="date" value={repTo}   onChange={e=>setRepTo(e.target.value)}/>
                </>}
              </div>

              {/* Hero metrics */}
              <div style={{ background:"linear-gradient(135deg,rgba(20,31,36,.98),rgba(26,40,46,.98))", border:"1px solid var(--borderL)", borderRadius:10, padding:"22px 26px", marginBottom:14, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, boxShadow:"0 8px 40px rgba(0,0,0,.4)", position:"relative" }}>
                <Corners color="var(--steel)" size={11}/>
                {[
                  ["INCOME",   ksh(totInc),  rSales.length+" transactions", "var(--steelL)"],
                  ["EXPENSES", ksh(totExp),  rExp.length+" entries",        "var(--red)"],
                  [netP>=0?"PROFIT":"LOSS", ksh(Math.abs(netP)), `Margin: ${totInc>0?((netP/totInc)*100).toFixed(1):0}%`, netP>=0?"var(--matrix)":"var(--amber)"],
                ].map(([l,v,s,c]) => (
                  <div key={l}>
                    <div style={{ fontSize:9, color:"var(--textDim)", letterSpacing:2.5, textTransform:"uppercase", marginBottom:6, fontFamily:"var(--disp)" }}>{l}</div>
                    <div style={{ fontFamily:"var(--disp)", fontSize:18, color:c, letterSpacing:1, marginBottom:4, textShadow:l==="PROFIT"&&netP>=0?"0 0 15px rgba(61,255,170,.4)":"none" }}>{v}</div>
                    <div style={{ fontSize:10, color:"var(--textDim)", fontFamily:"var(--body)" }}>{s}</div>
                  </div>
                ))}
              </div>

              {/* Payment methods */}
              {payBreak.length > 0 && (
                <div style={{ ...T.card, position:"relative" }}>
                  <Corners color="var(--steelD)"/>
                  {secLabel("📱", "PAYMENT METHODS")}
                  {payBreak.map(([pay,tot]) => (
                    <div key={pay} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid rgba(30,45,50,.5)" }}>
                      <span style={T.badge(pay==="M-Pesa"?"var(--matrix)":pay==="Cash"?"var(--steelL)":"var(--textDim)")}>{pay}</span>
                      <span style={{ fontFamily:"var(--disp)", fontSize:14, color:"var(--ice)", letterSpacing:1 }}>{ksh(tot)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Income by service */}
              <div style={{ ...T.card, position:"relative" }}>
                <Corners color="var(--steelD)"/>
                {secLabel("▲", "INCOME BY SERVICE")}
                {svcBreak.length === 0
                  ? <div style={{ textAlign:"center",color:"var(--textDim)",padding:"28px 0",fontSize:12 }}>No data for this period.</div>
                  : svcBreak.map(s => (
                    <div key={s.id} style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:12, fontWeight:700, color:"var(--textMid)", fontFamily:"var(--body)" }}>{s.svc?.emoji} {s.svc?.name||s.id}</span>
                        <span style={{ fontFamily:"var(--disp)", fontSize:12, color:"var(--ice)", letterSpacing:1 }}>{ksh(s.total)}</span>
                      </div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <div style={{ flex:1, height:4, background:"rgba(30,45,50,.8)", borderRadius:2, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${totInc>0?(s.total/totInc)*100:0}%`, background:"linear-gradient(90deg,var(--steelD),var(--steelL))", borderRadius:2, transition:"width .5s ease", boxShadow:"0 0 8px rgba(116,139,145,.4)" }}/>
                        </div>
                        <span style={{ fontSize:10, color:"var(--textDim)", width:34, textAlign:"right", fontFamily:"var(--disp)" }}>{totInc>0?((s.total/totInc)*100).toFixed(0):0}%</span>
                      </div>
                      <div style={{ fontSize:10, color:"var(--textDim)", marginTop:3 }}>{s.count} sale{s.count!==1?"s":""}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* ══════ SETTINGS ══════ */}
          {view==="settings" && <Settings/>}

        </div>
      </div>
    </>
  );
}
