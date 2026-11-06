import{a as e,l as t,n,r,t as i,u as a}from"./SceneCanvas-CQi5sDvk.js";import{K as o,U as s,V as c,Y as l,a as u,c as d,i as f,n as p,o as m,r as h,s as g,t as _,z as v}from"./index-DvbT39jj.js";var y=l(o(),1),b=`
  attribute vec3 noise;
  attribute vec3 tint;
  attribute float delay;
  attribute float size;
  uniform float uTime;
  uniform float uTurn;
  uniform vec2 uRadius;
  uniform vec3 uSpread;
  uniform float uPixels;
  uniform vec2 uDepth;
  uniform vec3 uPaper;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float t = clamp((uTime - delay) / ${1.25.toFixed(2)}, 0.0, 1.0);
    float settled = 1.0 - pow(1.0 - t, 3.0);
    float angle = position.x + uTurn;
    vec3 onRing = vec3(
      uRadius.x * position.y * cos(angle),
      uRadius.y * position.y * sin(angle),
      uRadius.y * position.z
    );
    vec3 local = mix(noise * uSpread, onRing, settled);
    vec4 view = modelViewMatrix * vec4(local, 1.0);
    float far = clamp((-view.z - uDepth.x) / (uDepth.y - uDepth.x), 0.0, 1.0);
    vColor = mix(tint, uPaper, 0.1 + 0.5 * far);
    vAlpha = mix(0.3, 1.0, settled) * (1.0 - 0.35 * far);
    gl_PointSize = uPixels * size * (${10 .toFixed(1)} / -view.z);
    gl_Position = projectionMatrix * view;
  }
`,x=`
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float distance = length(gl_PointCoord - 0.5) * 2.0;
    float alpha = vAlpha * uOpacity * (1.0 - smoothstep(0.3, 1.0, distance));
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
    #include <colorspace_fragment>
  }
`,S=1.6,C=`
  uniform float uTime;
  uniform float uTurn;
  uniform vec2 uRadius;
  uniform float uPixels;
  varying float vAlpha;

  void main() {
    float angle = position.x + uTurn;
    vec3 onRing = vec3(uRadius.x * cos(angle), uRadius.y * sin(angle), 0.0);
    vAlpha = smoothstep(${S.toFixed(2)}, ${2.1.toFixed(2)}, uTime);
    gl_PointSize = uPixels;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(onRing, 1.0);
  }
`,w=`
  uniform vec3 uNode;
  uniform vec3 uEdge;
  uniform float uBorder;
  varying float vAlpha;

  void main() {
    vec2 offset = abs(gl_PointCoord - 0.5);
    float border = step(0.5 - uBorder, max(offset.x, offset.y));
    if (vAlpha < 0.01) discard;
    gl_FragColor = vec4(mix(uNode, uEdge, border), vAlpha);
    #include <colorspace_fragment>
  }
`;function T(e){return 20*Math.tan(35*Math.PI/360)/Math.max(1,e)}function E(e,n,r){let i=e?.uniforms[n];i&&(typeof r==`number`?i.value=r:(i.value instanceof t||i.value instanceof a)&&i.value.fromArray(r))}function D(t){let n=new Float32Array(3*t.length),r=u.map(t=>new e(t));return t.forEach((e,t)=>{r[e]?.toArray(n,3*t)}),n}function O(e){return Float32Array.from(Array.from(e).flatMap(e=>[e,1,0]))}var k=1.5,A=90;function j(e){return e-2*Math.PI*Math.round(e/(2*Math.PI))}function M(e){let t=e.style.touchAction;return e.style.touchAction=`pan-y pinch-zoom`,()=>{e.style.touchAction=t}}function N({spin:e,ring:t,layout:n,sectionRef:r,canFling:i,onWake:a}){(0,y.useEffect)(()=>{let o=r?.current,s=n?.frameRef.current;if(!o||!s||!t)return;let c=e.current,l=M(o),u=-1,d=!1,f=0,m=0,h=0;function g(e,t){return p(t,e.clientX-m,e.clientY-h)}function _(e){if(e.pointerId!==u||!t)return;let n=g(e,t),r=j(n-c.lastAngle),i=Math.max(.001,(e.timeStamp-c.lastTime)/1e3);c.turn+=r,c.fling=r/i*.6+.4*c.fling,d=!0,c.lastAngle=n,c.lastTime=e.timeStamp,a()}function v(e){if(e.pointerId!==u)return;u=-1;let t=e.type===`pointerup`&&e.timeStamp-c.lastTime<A;c.dragging=!1,c.velocity=i&&t?Math.max(-1.5,Math.min(k,c.fling)):0,d||(c.velocity=f),Math.abs(c.velocity)>.05&&(c.drift=Math.sign(c.velocity)),y(),a()}function y(){window.removeEventListener(`pointermove`,_),window.removeEventListener(`pointerup`,v),window.removeEventListener(`pointercancel`,v)}function b(e){let{target:r}=e,i=r instanceof Node&&n?.introRef.current?.contains(r),o=r instanceof Element&&r.closest(`a, button`);u>=0||e.button>0||i||o||!t||!s||({left:m,top:h}=s.getBoundingClientRect(),u=e.pointerId,d=!1,f=c.velocity,c.dragging=!0,c.velocity=0,c.fling=0,c.lastAngle=g(e,t),c.lastTime=e.timeStamp,e.pointerType===`mouse`&&e.preventDefault(),window.addEventListener(`pointermove`,_),window.addEventListener(`pointerup`,v),window.addEventListener(`pointercancel`,v),a())}return o.addEventListener(`pointerdown`,b),()=>{o.removeEventListener(`pointerdown`,b),y(),u>=0&&(c.dragging=!1),l()}},[e,t,n,r,i,a])}var P=2*Math.PI/120,F=.9,I=.001,L=.05;function R({reducedMotion:e,openingSeconds:t,startTurn:i,replay:a,onRest:o,onFrame:s}){let c=r(e=>e.invalidate),l=(0,y.useRef)(e?t:0),u=(0,y.useRef)({turn:i,velocity:e?0:P,drift:1,dragging:!1,fling:0,lastAngle:0,lastTime:0}),d=(0,y.useRef)(e),f=(0,y.useRef)(a);(0,y.useEffect)(()=>{a!==f.current&&(f.current=a,e||(l.current=0,c()))},[a,e,c]);let p=(0,y.useCallback)(()=>{d.current&&(d.current=!1,o(!1)),c()},[o,c]);return n((n,r)=>{let i=Math.min(r,L),a=u.current,f=l.current<t;if(l.current=Math.min(t,l.current+i),!a.dragging){let t=e?0:a.drift*P;a.velocity+=(t-a.velocity)*(1-Math.exp(-i/F)),e&&Math.abs(a.velocity)<I&&(a.velocity=0),a.turn+=a.velocity*i}s(l.current,a.turn),f||!e||a.dragging||a.velocity!==0?c():d.current||(d.current=!0,o(!0))}),{spin:u,wake:p}}var z=s(),B=S+.5,V=5,H=7,U=.68,W={antialias:!1},G={fov:35,position:[0,0,10],near:.1,far:100};function K({reducedMotion:n,eventSource:i,onRest:o}){let s=(0,y.useContext)(d),l=r(e=>e.size.width),u=r(e=>e.size.height),p=r(e=>e.viewport.dpr),S=r(e=>e.invalidate),k=(0,y.useRef)(null),A=(0,y.useRef)(null),j=(0,y.useMemo)(()=>g(v(f)),[]),M=(0,y.useMemo)(()=>D(j.cluster),[j]),P=(0,y.useMemo)(()=>O(j.centers),[j]),F=(0,y.useMemo)(()=>m(j),[j]),I=(0,y.useMemo)(()=>({uTime:{value:0},uTurn:{value:0},uRadius:{value:new t},uSpread:{value:new a},uPixels:{value:V},uDepth:{value:new t(9,11)},uPaper:{value:new e(c.paper)},uOpacity:{value:U}}),[]),L=(0,y.useMemo)(()=>({uTime:{value:0},uTurn:{value:0},uRadius:{value:new t},uPixels:{value:H},uBorder:{value:1/H},uNode:{value:new e(c.node)},uEdge:{value:new e(c.edge)}}),[]),W=s?.box??null,G=(0,y.useMemo)(()=>W?h(W):null,[W]),K=(0,y.useCallback)((e,t)=>{E(k.current,`uTime`,e),E(k.current,`uTurn`,t),E(A.current,`uTime`,e),E(A.current,`uTurn`,t)},[]),{spin:q,wake:J}=R({reducedMotion:n,openingSeconds:B,startTurn:F,replay:s?.replay??0,onRest:o,onFrame:K});if(N({spin:q,ring:G,layout:s,sectionRef:i,canFling:!n,onWake:J}),(0,y.useEffect)(()=>{if(!G)return;let e=G.radiusY*(Math.sin(_)+.1)*T(u),t=Math.round(H*p);E(k.current,`uRadius`,[G.radiusX,G.radiusY]),E(k.current,`uSpread`,[.4*l,.4*u,.15*G.radiusY]),E(k.current,`uPixels`,V*p),E(k.current,`uDepth`,[10-e,10+e]),E(A.current,`uRadius`,[G.radiusX,G.radiusY]),E(A.current,`uPixels`,t),E(A.current,`uBorder`,Math.max(1,Math.round(p))/t),S()},[G,l,u,p,S]),!G)return null;let Y=T(u);return(0,z.jsxs)(`group`,{position:[(G.centerX-l/2)*Y,-(G.centerY-u/2)*Y,0],rotation:[-_,0,0],scale:Y,children:[(0,z.jsxs)(`points`,{frustumCulled:!1,children:[(0,z.jsxs)(`bufferGeometry`,{children:[(0,z.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[j.ring,3]}),(0,z.jsx)(`bufferAttribute`,{attach:`attributes-noise`,args:[j.noise,3]}),(0,z.jsx)(`bufferAttribute`,{attach:`attributes-tint`,args:[M,3]}),(0,z.jsx)(`bufferAttribute`,{attach:`attributes-delay`,args:[j.delay,1]}),(0,z.jsx)(`bufferAttribute`,{attach:`attributes-size`,args:[j.size,1]})]}),(0,z.jsx)(`shaderMaterial`,{ref:k,uniforms:I,vertexShader:b,fragmentShader:x,transparent:!0,depthTest:!1,depthWrite:!1})]}),(0,z.jsxs)(`points`,{frustumCulled:!1,renderOrder:1,children:[(0,z.jsx)(`bufferGeometry`,{children:(0,z.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[P,3]})}),(0,z.jsx)(`shaderMaterial`,{ref:A,uniforms:L,vertexShader:C,fragmentShader:w,transparent:!0,depthTest:!1,depthWrite:!1})]})]})}function q({active:e,reducedMotion:t,onContextLost:n,eventSource:r}){let[a,o]=(0,y.useState)(t);return(0,z.jsx)(i,{active:e,onContextLost:n,eventSource:r,renderOnDemand:t||a,gl:W,camera:G,children:(0,z.jsx)(K,{reducedMotion:t,eventSource:r,onRest:o})})}export{q as default};