/* World Icons — stamp component.
   One component, two renderers:
   inkStamp()     physical rubber-stamp ink: 1 colour, imperfect ink, shape = category
   digitalStamp() app stamp: full colour, perforated, states earned/locked/gifted/seasonal/resting
   Both use the same WI_ICONS line art. */
(function(){
let uid=0;
const SHAPE_BY_CHAPTER={Monuments:"circle",Fountains:"oval","Natural wonders":"octagon",Foods:"ticket",Festivals:"scallop",Visit:"rounded"};
/* Seasonal is NOT a shape — use digitalStamp state:'seasonal' only */
window.WI_SHAPE_BY_CHAPTER=SHAPE_BY_CHAPTER;
window.wiInkFilter=(id,seed,rough)=>inkFilter(id,seed,rough);

function inkFilter(id,seed,rough=1){
  return `<filter id="${id}" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
   <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="${seed}" result="n"/>
   <feDisplacementMap in="SourceGraphic" in2="n" scale="${2.4*rough}" xChannelSelector="R" yChannelSelector="G" result="d"/>
   <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="${seed+11}" result="b"/>
   <feColorMatrix in="b" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.6 0 0 0 2.25" result="bm"/>
   <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="${seed+3}" result="s"/>
   <feColorMatrix in="s" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -12 0 0 0 8.2" result="sm"/>
   <feComposite in="d" in2="bm" operator="in" result="d2"/>
   <feComposite in="d2" in2="sm" operator="in"/>
  </filter>`;
}
function scallopPath(cx,cy,r,n,depth){
  let d="";
  for(let i=0;i<n;i++){
    const a0=(i/n)*Math.PI*2, a1=((i+1)/n)*Math.PI*2, am=(a0+a1)/2;
    const p0=[cx+r*Math.cos(a0),cy+r*Math.sin(a0)], p1=[cx+r*Math.cos(a1),cy+r*Math.sin(a1)];
    const c=[cx+(r+depth)*Math.cos(am),cy+(r+depth)*Math.sin(am)];
    d+=(i?"":`M${p0[0].toFixed(2)} ${p0[1].toFixed(2)}`)+`Q${c[0].toFixed(2)} ${c[1].toFixed(2)} ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
  }
  return d+"Z";
}
function polyPath(cx,cy,r,n,rot=0){
  let d="";for(let i=0;i<n;i++){const a=rot+i/n*Math.PI*2;d+=(i?"L":"M")+(cx+r*Math.cos(a)).toFixed(2)+" "+(cy+r*Math.sin(a)).toFixed(2)}return d+"Z";
}
function ticketPath(x,y,w,h,c){ // rectangle with concave (punched) corners
  return `M${x+c} ${y}H${x+w-c}A${c} ${c} 0 0 0 ${x+w} ${y+c}V${y+h-c}A${c} ${c} 0 0 0 ${x+w-c} ${y+h}H${x+c}A${c} ${c} 0 0 0 ${x} ${y+h-c}V${y+c}A${c} ${c} 0 0 0 ${x+c} ${y}Z`;
}

/* ── physical ink stamp ─────────────────────────────────────── */
window.inkStamp=function({icon="colosseum",shape,city="ROMA",country="ITALIA",date="12 OCT 2026",ink="#2B3F73",rot=0,seed=3,size=220,serial="",opacity=.9,rough=1,top:topOverride="",font="Barlow Condensed",fw=600,fk=0.47,fstyle=""}={}){
  const id="ink"+(++uid), ch=wiIconDef(icon).chapter; shape=shape||SHAPE_BY_CHAPTER[ch]||"circle";
  const top=(topOverride||`${city} · ${country}`).toUpperCase();
  const maxW={circle:200,scallop:190,oval:230,octagon:112,ticket:150,rounded:170}[shape||SHAPE_BY_CHAPTER[ch]||"circle"];
  let tsz=18,tls=2.2; while(top.length*(tsz*fk+tls)>maxW && tsz>11){tsz-=0.5; tls=Math.max(1,tls-0.15);}
  let W=200,H=200,body="",txt="";
  const T=(s,sz=17,ls=2.2)=>`font-family="${font}" font-weight="${fw}" style="${fstyle}" font-size="${sz}" letter-spacing="${ls}" fill="${ink}"`;
  const D=(sz=14)=>`font-family="Plus Jakarta Sans" font-weight="600" font-size="${sz}" letter-spacing="0.6" fill="${ink}"`;
  if(shape==="circle"||shape==="scallop"){
    const cx=100,cy=100;
    if(shape==="circle") body=`<circle cx="100" cy="100" r="93" stroke-width="4.5"/><circle cx="100" cy="100" r="67" stroke-width="1.6"/>`;
    else body=`<path d="${scallopPath(100,100,88,22,9)}" stroke-width="4"/><circle cx="100" cy="100" r="64" stroke-width="1.6" stroke-dasharray="1 4.2"/>`;
    const rt= shape==="circle"?73:70, rb= shape==="circle"?87:84;
    txt=`<path id="${id}t" d="M${cx-rt} ${cy}A${rt} ${rt} 0 0 1 ${cx+rt} ${cy}" fill="none" stroke="none"/>
         <path id="${id}b" d="M${cx-rb} ${cy}A${rb} ${rb} 0 0 0 ${cx+rb} ${cy}" fill="none" stroke="none"/>
         <text ${T(top,tsz,tls)} stroke="none"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">${top}</textPath></text>
         <text ${D(14)} stroke="none"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${date}</textPath></text>
         <path d="M${cx-80} ${cy+4}l3 0 M${cx+77} ${cy+4}l3 0" stroke-width="3"/>`;
    body+= wiIconG(icon,{x:56,y:55,size:88,stroke:ink,sw:2.55});
  } else if(shape==="oval"){
    W=240;H=180; const cx=120,cy=90;
    body=`<ellipse cx="120" cy="90" rx="114" ry="84" stroke-width="4.5"/><ellipse cx="120" cy="90" rx="88" ry="60" stroke-width="1.6"/>`;
    const ax=97,ay=67,bx=106,by=76;
    txt=`<path id="${id}t" d="M${cx-ax} ${cy}A${ax} ${ay} 0 0 1 ${cx+ax} ${cy}" fill="none" stroke="none"/>
         <path id="${id}b" d="M${cx-bx} ${cy}A${bx} ${by} 0 0 0 ${cx+bx} ${cy}" fill="none" stroke="none"/>
         <text ${T(top,tsz,tls)} stroke="none"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">${top}</textPath></text>
         <text ${D(14)} stroke="none"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${date}</textPath></text>`;
    body+= wiIconG(icon,{x:84,y:53,size:72,stroke:ink,sw:2.55});
    /* cancellation waves – the "postmark" detail for water icons */
    body+=`<path d="M2 70q7-5 14 0t14 0 M2 82q7-5 14 0t14 0 M210 98q7-5 14 0t14 0 M210 110q7-5 14 0t14 0" stroke-width="2.6"/>`;
  } else if(shape==="octagon"){
    body=`<path d="${polyPath(100,100,98,8,Math.PI/8)}" stroke-width="4.5"/><path d="${polyPath(100,100,84,8,Math.PI/8)}" stroke-width="1.6"/>
          <path d="M34 62H166 M34 140H166" stroke-width="1.6"/>`;
    txt=`<text x="100" y="56" text-anchor="middle" ${T(top,tsz,tls)} stroke="none">${top}</text>
         <text x="100" y="160" text-anchor="middle" ${D(14)} stroke="none">${date}</text>`;
    body+= wiIconG(icon,{x:61,y:63,size:78,stroke:ink,sw:2.55});
  } else if(shape==="ticket"){
    W=210;H=190;
    body=`<path d="${ticketPath(4,4,202,182,20)}" stroke-width="4.5"/><path d="${ticketPath(15,15,180,160,13)}" stroke-width="1.6"/>
          <path d="M15 52H195 M15 142H195" stroke-width="1.6"/>`;
    txt=`<text x="105" y="40" text-anchor="middle" ${T(top,tsz,tls)} stroke="none">${top}</text>
         <text x="105" y="164" text-anchor="middle" ${D(14)} stroke="none">${date}</text>`;
    body+= wiIconG(icon,{x:68,y:60,size:74,stroke:ink,sw:2.55});
  } else if(shape==="rounded"){
    /* Visit chapter — soft rounded-rect; corner radius ≈ 18% of min side */
    const x=8,y=8,w=184,h=184,r=Math.round(Math.min(w,h)*0.18);
    body=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" stroke-width="4.5"/>
          <rect x="${x+12}" y="${y+12}" width="${w-24}" height="${h-24}" rx="${Math.round(r*0.72)}" ry="${Math.round(r*0.72)}" stroke-width="1.6"/>
          <path d="M28 52H172 M28 150H172" stroke-width="1.6"/>`;
    txt=`<text x="100" y="44" text-anchor="middle" ${T(top,tsz,tls)} stroke="none">${top}</text>
         <text x="100" y="168" text-anchor="middle" ${D(14)} stroke="none">${date}</text>`;
    body+= wiIconG(icon,{x:61,y:62,size:78,stroke:ink,sw:2.55});
  }
  const ser = serial?`<text x="${W/2}" y="${H-1}" text-anchor="middle" ${D(9)} stroke="none">${serial}</text>`:"";
  return `<svg class="ink-stamp" width="${size*W/200}" height="${size*H/200}" viewBox="-6 -6 ${W+12} ${H+12}" style="transform:rotate(${rot}deg);mix-blend-mode:multiply;opacity:${opacity}">
    <defs>${inkFilter(id+"f",seed,rough)}</defs>
    <g filter="url(#${id}f)" fill="none" stroke="${ink}">${body}${txt}${ser}</g></svg>`;
};

/* ── digital perforated stamp ───────────────────────────────── */
function perfMask(id,w,h,r,step){
  let c="";
  const nx=Math.round(w/step), ny=Math.round(h/step), sx=w/nx, sy=h/ny;
  for(let i=0;i<=nx;i++){c+=`<circle cx="${(i*sx).toFixed(2)}" cy="0" r="${r}"/><circle cx="${(i*sx).toFixed(2)}" cy="${h}" r="${r}"/>`}
  for(let j=1;j<ny;j++){c+=`<circle cx="0" cy="${(j*sy).toFixed(2)}" r="${r}"/><circle cx="${w}" cy="${(j*sy).toFixed(2)}" r="${r}"/>`}
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="${w+40}" height="${h+40}"><rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/><g fill="#000">${c}</g></mask>`;
}
window.wiPerfMask=perfMask;
const COL={coral:["#FF5B4A","#FFDCD5","#FFF1EE","#C8372A"],sunny:["#FFA234","#FFE3BD","#FFF5E6","#A35A00"],
           sky:["#2E9BEA","#CDE7FA","#EAF5FD","#1471B8"],mint:["#34D1A0","#C6F1E1","#E8FAF3","#0F7F5F"],
           twilight:["#6B3FC4","#E6DCFA","#F3EEFD","#6B3FC4"]};
window.WI_COL=COL;
const NAVY="#1B2747";
function badge(kind,x,y){
  const bg={earned:"#0F7F5F",locked:"#7A8296",gifted:"#C8372A",seasonal:"#6B3FC4",resting:"#1B2747"}[kind];
  const g={earned:`<path d="M-5 0.5l3.4 3.4L5.5-3.8" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    locked:`<rect x="-5" y="-1" width="10" height="7.5" rx="1.8" fill="#fff"/><path d="M-3-1v-2.2a3 3 0 0 1 6 0V-1" stroke="#fff" stroke-width="1.9" fill="none"/>`,
    gifted:`<rect x="-5.5" y="-2.2" width="11" height="8" rx="1.2" fill="#fff"/><path d="M0-2.2V5.8" stroke="${bg}" stroke-width="1.6"/><path d="M0-2.4C-2-6.5-6-5-3.4-2.6M0-2.4C2-6.5 6-5 3.4-2.6" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    seasonal:`<path d="M0-6.5L1.7-1.7L6.5 0L1.7 1.7L0 6.5L-1.7 1.7L-6.5 0L-1.7-1.7Z" fill="#fff"/>`,
    resting:`<circle r="5.4" stroke="#fff" stroke-width="1.8" fill="none"/><path d="M0-2.8V0.4L2.2 1.8" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round"/>`}[kind];
  return `<g transform="translate(${x} ${y})"><circle r="13" fill="#fff"/><circle r="11" fill="${bg}"/>${g}</g>`;
}
window.digitalStamp=function({icon="colosseum",name,color="coral",state="earned",w=156,h=192,level=0,from="",note="",P=14,here=false,labelFont="Nunito",labelW=900,labelSize=12.5,hard=false,labelStyle="",hideLabel=false}={}){
  const id="ds"+(++uid); const [c4,c1,c0,c7]=COL[color]; name=(name||wiIconDef(icon).label).toUpperCase();
  const locked=state==="locked", seasonal=state==="seasonal";
  const pad=11, iw=w-pad*2, ih=hideLabel?(h-pad*2):(h-pad*2-34);
  const paper= locked?"#F7F8FA":"#FFFFFF";
  const tileTop= locked?"#EEF0F4":c0, tileBot= locked?"#E3E6EC":c1;
  const ink= locked?"#A3AABA":NAVY;
  const iconSize=Math.min(iw,ih)*0.78, ix=pad+(iw-iconSize)/2, iy=pad+(ih-iconSize)/2+4;
  const sunR=iconSize*0.2;
  const tile=`<rect x="${pad}" y="${pad}" width="${iw}" height="${ih}" rx="8" fill="url(#${id}g)"/>
    ${locked?"":`<circle cx="${pad+iw*0.76}" cy="${pad+ih*0.27}" r="${sunR}" fill="${seasonal?"#6B3FC4":c4}" opacity="${seasonal?.22:.28}"/>`}
    <rect x="${pad}" y="${pad+ih*0.8}" width="${iw}" height="${ih*0.2}" fill="${locked?"#DADDE4":c4}" opacity="${locked?1:.35}"/>
    ${wiIconG(icon,{x:ix,y:iy,size:iconSize,stroke:ink,sw:2.3,fill:locked?null:(seasonal?"#ffffff":c4),offset:locked?0:iconSize*0.06})}`;
  const label=hideLabel?"":`<text x="${w/2}" y="${h-pad-15}" text-anchor="middle" font-family="${labelFont}" font-weight="${labelW}" font-size="${labelSize}" letter-spacing=".6" style="${labelStyle}" fill="${locked?"#5C6680":NAVY}">${name}</text>`;
  const sub = (!hideLabel && note)?`<text x="${w/2}" y="${h-pad-1}" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="600" font-size="10" fill="${locked?"#5C6680":(state==="resting"?"#5C6680":c7)}">${note}</text>`:"";
  const lvl = level>1?`<g transform="translate(${pad+8} ${pad+8})"><rect width="30" height="19" rx="9.5" fill="${NAVY}"/><text x="15" y="13.6" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="800" font-size="11" fill="#fff">×${level}</text></g>`:"";
  const ribbon = seasonal?`<g transform="translate(${pad+8} ${pad+8})"><rect width="72" height="19" rx="9.5" fill="#6B3FC4"/><text x="36" y="13.4" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="800" font-size="10" letter-spacing=".5" fill="#fff">SEASONAL</text></g>`:"";
  const giftFrame = state==="gifted"?`<rect x="${pad-4}" y="${pad-4}" width="${iw+8}" height="${h-pad*2+8}" rx="10" fill="none" stroke="${c7}" stroke-width="1.4" stroke-dasharray="4 3"/>`:"";
  /* Seasonal (locked): no glow/sparkles. Double violet frame + SEASONAL badge + soft violet paper. */
  const seasonalFrame = seasonal?`<rect x="-3" y="-3" width="${w+6}" height="${h+6}" rx="14" fill="none" stroke="#6B3FC4" stroke-width="2"/><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="11" fill="none" stroke="#6B3FC4" stroke-width="1" opacity=".35"/>`:"";
  return `<svg class="d-stamp" width="${w+2*P}" height="${h+2*P}" viewBox="${-P} ${-P} ${w+2*P} ${h+2*P}">
   <defs>${perfMask(id+"m",w,h,5.2,13)}
     <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tileTop}"/><stop offset="1" stop-color="${tileBot}"/></linearGradient>
     <filter id="${id}sh" x="-20%" y="-20%" width="140%" height="140%">${hard?`<feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="#1B2747" flood-opacity="${locked?.25:1}"/>`:`<feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1B2747" flood-opacity="${locked?.08:.16}"/>`}</filter>
     ${seasonal?`<linearGradient id="${id}sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7F3FF"/><stop offset="1" stop-color="#EEE7FA"/></linearGradient>`:""}
   </defs>
   ${seasonalFrame}
   <g filter="url(#${id}sh)"><rect width="${w}" height="${h}" fill="${seasonal?`url(#${id}sg)`:paper}" mask="url(#${id}m)"/></g>
   ${here?`<rect x="-5" y="-5" width="${w+10}" height="${h+10}" rx="10" fill="none" stroke="#FF5B4A" stroke-width="2.5" stroke-dasharray="6 5"/>`:""}
   ${tile}${giftFrame}${label}${sub}${lvl}${ribbon}
   ${badge(state,w-16,h-16)}
  </svg>`;
};
})();
