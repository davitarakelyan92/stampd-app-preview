/* Stampd — Pin Stamp (Route B). THE only mark.
   Construction (100-unit grid): perforated stamp square + map-pin silhouette + 4-point spark in the pin head.
   PRIMARY presentation (locked): white Pin Stamp on coral #FF5B4A (app + main logo).
   Modes are production adaptations of the SAME mark: white, colour, navy, mono, foil (line), small-cut, rubber-stamp, app icon.
   No one-off variants. */
(function(){
let uid=0;
function perfPath(w,h,r,nx,ny,ox=0,oy=0){
  const sx=w/nx, sy=h/ny; const f=v=>(+v).toFixed(2); let d=`M${f(ox+r)} ${f(oy)}`;
  for(let i=1;i<nx;i++){d+=`L${f(ox+i*sx-r)} ${f(oy)}A${r} ${r} 0 0 0 ${f(ox+i*sx+r)} ${f(oy)}`}
  d+=`L${f(ox+w-r)} ${f(oy)}A${r} ${r} 0 0 0 ${f(ox+w)} ${f(oy+r)}`;
  for(let j=1;j<ny;j++){d+=`L${f(ox+w)} ${f(oy+j*sy-r)}A${r} ${r} 0 0 0 ${f(ox+w)} ${f(oy+j*sy+r)}`}
  d+=`L${f(ox+w)} ${f(oy+h-r)}A${r} ${r} 0 0 0 ${f(ox+w-r)} ${f(oy+h)}`;
  for(let i=nx-1;i>0;i--){d+=`L${f(ox+i*sx+r)} ${f(oy+h)}A${r} ${r} 0 0 0 ${f(ox+i*sx-r)} ${f(oy+h)}`}
  d+=`L${f(ox+r)} ${f(oy+h)}A${r} ${r} 0 0 0 ${f(ox)} ${f(oy+h-r)}`;
  for(let j=ny-1;j>0;j--){d+=`L${f(ox)} ${f(oy+j*sy+r)}A${r} ${r} 0 0 0 ${f(ox)} ${f(oy+j*sy-r)}`}
  d+=`L${f(ox)} ${f(oy+r)}A${r} ${r} 0 0 0 ${f(ox+r)} ${f(oy)}Z`;
  return d;
}
window.perfPath=perfPath;
/* Pin silhouette (viewBox 0 0 100 100), tip down — sits inside the stamp live area */
const PIN="M50 18C38.4 18 30 27.2 30 39.2C30 54.5 50 78 50 78S70 54.5 70 39.2C70 27.2 61.6 18 50 18Z";
const PIN_HEAD="M50 28.5a10.5 10.5 0 1 1 0 21a10.5 10.5 0 1 1 0-21"; /* circle approx as path for evenodd */
const SPARK="M50 30.5L52.2 37.2L59 39.5L52.2 41.8L50 48.5L47.8 41.8L41 39.5L47.8 37.2Z";
const SPARK_S="M50 31L51.6 36.2L57 37.8L51.6 39.4L50 44.6L48.4 39.4L43 37.8L48.4 36.2Z"; /* small-cut */
window.WI_PIN=PIN; window.WI_SPARK=SPARK;

function foilGrad(id){return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1DCA6"/><stop offset=".35" stop-color="#C9A363"/><stop offset=".55" stop-color="#F6E6B8"/><stop offset=".8" stop-color="#9C7638"/><stop offset="1" stop-color="#D9B979"/></linearGradient>`}
window.foilGrad=foilGrad; /* kept for non-cover uses only; covers use solid white */

/* modes:
   white   — white stamp, pin cutout, white spark — PRIMARY mark (on coral field / dark cloths / covers)
   colour  — coral stamp on light paper (adaptation when there is no coral plate behind the mark)
   navy    — navy stamp on light paper / print
   mono    — one colour solid; pin + spark knocked out (evenodd)
   foil    — line-only (production foil die; NOT used on passport covers)
   small   — ≤24px: 5 holes, thicker pin, larger spark (navy default)
   small-w — small white for dark / coral UI chrome
*/
window.symbolPin=function({size=120,mode="colour",color}={}){
  const id="pn"+(++uid);
  const small=mode==="small"||mode==="small-w";
  const n=small?5:8, r=small?5.6:3.9;
  const P=perfPath(100,100,r,n,n);
  const open=`<svg width="${size}" height="${size}" viewBox="-4 -4 108 108" xmlns="http://www.w3.org/2000/svg">`;
  const spark=small?SPARK_S:SPARK;
  /* pin as evenodd hole: stamp path + pin path (opposite winding via pin itself) */
  if(mode==="foil"){
    const f=color||`url(#${id}fg)`;
    return `${open}<defs>${foilGrad(id+"fg")}</defs>
      <g fill="none" stroke="${f}" stroke-linejoin="round" stroke-linecap="round">
        <path d="${P}" stroke-width="2.2"/>
        <path d="${PIN}" stroke-width="2.4"/>
        <circle cx="50" cy="39" r="9" stroke-width="1.8"/>
        <path d="${SPARK}" stroke-width="1.6"/>
      </g></svg>`;
  }
  if(mode==="mono"||mode==="small"){
    const c=color||"#1B2747";
    /* stamp filled, pin knocked out, spark filled back in the hole */
    return `${open}<path d="${P} ${PIN}" fill="${c}" fill-rule="evenodd"/>
      <path d="${spark}" fill="${c}"/></svg>`;
  }
  if(mode==="white"||mode==="small-w"){
    /* solid white stamp with pin knocked out (shows cloth), white spark sits in the hole */
    return `${open}<path d="${P} ${PIN}" fill="#FFFFFF" fill-rule="evenodd"/>
      <path d="${spark}" fill="#FFFFFF"/></svg>`;
  }
  /* colour / navy — filled stamp, pin knocked out, spark refilled in stamp colour */
  const body = mode==="navy" ? "#1B2747" : (color||"#FF5B4A");
  return `${open}<path d="${P} ${PIN}" fill="${body}" fill-rule="evenodd"/>
    <path d="${spark}" fill="${body}"/></svg>`;
};

/* Wordmark: Plus Jakarta Sans ExtraBold/Black (wght 900 → font max 800).
   stacked:true = centered under mark (locked primary). stacked:false = horizontal side-by-side (also locked on coral). */
window.stampdWord=function({size=48,color="#1B2747",withSym=true,symMode="colour",gap,stacked=true,symColor}={}){
  const base="font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:900;font-size:"+size+"px;letter-spacing:-.03em;color:"+color+";line-height:1";
  const word=stacked
    ? `<span style="${base};text-align:center;display:block;width:100%">Stampd</span>`
    : `<span style="${base};display:inline-block;white-space:nowrap">Stampd</span>`;
  if(!withSym) return word;
  const symOpts={size:Math.round(size*(stacked?2.2:1.15)),mode:symMode};
  if(symColor) symOpts.color=symColor;
  const sym=symbolPin(symOpts);
  if(stacked){
    return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:${Math.round(size*.35)}px;line-height:1">${sym}${word}</div>`;
  }
  const g=gap!=null?gap:Math.round(size*0.22);
  return `<div style="display:inline-flex;align-items:center;gap:${g}px;line-height:1">${sym}${word}</div>`;
};


/* PRIMARY lockup (locked): white Pin Stamp + white “Stampd” on flat #FF5B4A.
   stacked:true (default) = mark above word, centered · stacked:false = horizontal side-by-side.
   App icon remains mark-only (see appIcon). */
window.primaryLockup=function({size=48,stacked=true,pad}={}){
  const padPx=pad!=null?pad:Math.round(size*1.1);
  const radius=Math.round(size*.55);
  /* Always use stampdWord so weight 900 + centered stack stay in one place */
  const mark=stampdWord({size,color:"#FFFFFF",withSym:true,symMode:"white",stacked});
  return `<div style="display:inline-flex;align-items:center;justify-content:center;background:#FF5B4A;color:#fff;padding:${padPx}px ${Math.round(padPx*1.35)}px;border-radius:${radius}px">${mark}</div>`;
};

/* App icon = main logo (locked): white Pin Stamp on flat #FF5B4A.
   Identical construction to the primary mark — no tilt, no gradient, no sparkle, no crop offset. */
window.appIcon=function({size=180,radius=0.2237}={}){
  const vb=1024, pad=0.19; /* mark occupies ~62% of tile, centred */
  const markSize=vb*(1-2*pad);
  const ox=(vb-markSize)/2, oy=(vb-markSize)/2;
  const scale=markSize/100;
  const mark=symbolPin({size:100,mode:"white"})
    .replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"");
  /* symbolPin viewBox is -4 -4 108 108; place so the 100-unit mark is centred */
  const shift=4*scale; /* compensate -4 origin */
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${vb}" height="${vb}" rx="${vb*radius}" fill="#FF5B4A"/>
    <g transform="translate(${ox-shift} ${oy-shift}) scale(${scale})">${mark}</g>
  </svg>`;
};


/* Light-bg lockups (LOCKED Round 2) — for white/light paper.
   (1) coralCoral  — coral mark + coral word
   (2) coralInk    — coral mark + ink #2A2420 word
   (3) monoInk     — mono dark mark #2A2420 + ink word
   (4) wording     — wordmark only (“Wording logo”), no icon, #2A2420 wt 900
   stacked or horizontal where a mark is present. */
window.LIGHT_BG_LOCKUPS={
  coralCoral:{symMode:"colour", color:"#FF5B4A", label:"Coral mark + coral word"},
  coralInk:  {symMode:"colour", color:"#2A2420", label:"Coral mark + dark word"},
  monoInk:   {symMode:"mono",   color:"#2A2420", symColor:"#2A2420", label:"Mono dark mark + dark word"},
  wording:   {wordOnly:true,    color:"#2A2420", label:"Wording logo"},
};
/* aliases for older board calls */
LIGHT_BG_LOCKUPS.coralNavy=LIGHT_BG_LOCKUPS.coralInk;
LIGHT_BG_LOCKUPS.navyNavy=LIGHT_BG_LOCKUPS.monoInk;
LIGHT_BG_LOCKUPS.monoMono=LIGHT_BG_LOCKUPS.wording;
window.lightBgLockup=function({variant="coralInk", size=48, stacked=true}={}){
  const v=LIGHT_BG_LOCKUPS[variant]||LIGHT_BG_LOCKUPS.coralInk;
  if(v.wordOnly){
    return stampdWord({size, color:v.color, withSym:false, stacked});
  }
  return stampdWord({size, color:v.color, withSym:true, symMode:v.symMode, stacked, symColor:v.symColor});
};

window.STAMPD_SLOGAN="Stamp anywhere you visit.";

/* Cover lockup helper: white Pin Stamp + white Stampd word on a country cloth colour.
   Light-cloth rule (LOCKED): if relative luminance of cloth > 0.55 (incl. lighter blues), use navy type #1B2747 — do not darken the cloth. */
window.coverLockup=function({cloth="#1B2747",size=56,stacked=true,withSlogan=true}={}){
  const lum=(()=>{const h=cloth.replace("#","");const c=[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]})();
  const light=lum>0.55;
  const type=light?"#1B2747":"#FFFFFF";
  const symMode=light?"navy":"white";
  const lock=stampdWord({size,color:type,withSym:true,symMode,stacked});
  if(!withSlogan) return lock;
  const ss=Math.max(9, Math.round(size*0.32));
  const slog=`<span style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:600;font-size:${ss}px;letter-spacing:.02em;color:${type};opacity:.92;text-align:center;display:block;max-width:${Math.round(size*5.2)}px;line-height:1.25">${STAMPD_SLOGAN}</span>`;
  return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:${Math.round(size*.28)}px">${lock}${slog}</div>`;
};
window.coverNeedsDarkType=function(cloth){
  const h=cloth.replace("#","");const c=[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));
  return (.2126*c[0]+.7152*c[1]+.0722*c[2])>0.55;
};

/* Country passport face (Davit Oct 26): country name on cloth — no Stampd logo / Pin Stamp on the cover.
   Same light-cloth type rule as coverLockup. Slogan optional under the name. */
window.coverCountryFace=function({cloth="#1B2747",name="Stampd",size=36,withSlogan=false}={}){
  const lum=(()=>{const h=cloth.replace("#","");const c=[0,2,4].map(i=>parseInt(h.substr(i,2),16)/255).map(v=>v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]})();
  const light=lum>0.55;
  const type=light?"#1B2747":"#FFFFFF";
  const label=(name||"Stampd").replace(/</g,"");
  const title=`<span style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:900;font-size:${size}px;letter-spacing:-.03em;color:${type};line-height:1.05;text-align:center;display:block;max-width:${Math.round(size*6)}px">${label}</span>`;
  if(!withSlogan) return title;
  const ss=Math.max(9, Math.round(size*0.32));
  const slog=`<span style="font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-weight:600;font-size:${ss}px;letter-spacing:.02em;color:${type};opacity:.92;text-align:center;display:block;max-width:${Math.round(size*5.2)}px;line-height:1.25">${STAMPD_SLOGAN}</span>`;
  return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:${Math.round(size*.28)}px">${title}${slog}</div>`;
};

})();
