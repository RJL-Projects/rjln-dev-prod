import{n as e,r as t,t as n,u as r}from"./SceneCanvas-DhoIk_Zb.js";import{B as i,K as a,U as o,V as s,Y as c,d as l,f as u,g as d,h as f,l as p,m,p as h,u as g}from"./index-Dsg1ybY5.js";var _=c(a(),1),v=[i.orange,i.blue,i.green],y=5;function b(e){let t=t=>Number.parseInt(e.slice(t,t+2),16)/255;return[t(1),t(3),t(5)]}function x(e,t,n){return[e[0]+(t[0]-e[0])*n,e[1]+(t[1]-e[1])*n,e[2]+(t[2]-e[2])*n]}function S(e){return Array.from(e.labeled).flatMap((e,t)=>e?[]:[t]).filter((e,t)=>t%y===0)}function C(e){let t=v.map(b),n=S(e),{k:r}=e;return e.draws.map(i=>{let a=new Float32Array(3*e.count);i.shown.forEach((e,n)=>{a.set(t[e]??[0,0,0],3*n)});let o=new Float32Array(6*r*n.length),s=new Float32Array(2*r*n.length);return n.forEach((e,t)=>{for(let n=0;n<r;n+=1){let a=t*r+n,c=i.nearest[e*r+n]??e;o.set(i.positions.subarray(3*e,3*e+3),6*a),o.set(i.positions.subarray(3*c,3*c+3),6*a+3),s.fill(i.sweep[e]??0,2*a,2*a+2)}}),{positions:i.positions,colors:a,sweep:i.sweep,linePositions:o,lineStarts:s}})}function w(e,t){let n=t[0];return{positions:Float32Array.from(n?.positions??[]),prev:Float32Array.from(n?.positions??[]),colors:Float32Array.from(n?.colors??[]),sweep:Float32Array.from(n?.sweep??[]),labeled:Float32Array.from(e.labeled),stagger:Float32Array.from(e.stagger),linePositions:Float32Array.from(n?.linePositions??[]),lineStarts:Float32Array.from(n?.lineStarts??[])}}var T=1.8,E=.7,D=2.6,O=.45,k=.8,A=8.200000000000001,j=T,M=7.4,N=6.2;function P(e){return Math.max(0,Math.floor(e/A))}function F(e){return e-P(e)*A}var I=e=>e.toFixed(3),L=`
  attribute vec3 aPrev;
  attribute vec3 aColor;
  attribute float aLabeled;
  attribute float aSweep;
  attribute float aStagger;
  uniform float uTime;
  uniform float uOpening;
  uniform float uPixels;
  uniform float uRing;
  uniform float uCamera;
  uniform float uReach;
  uniform vec3 uBlank;
  uniform vec3 uRim;
  uniform vec3 uInk;
  varying vec3 vFill;
  varying vec3 vRing;
  varying float vRingWidth;
  varying float vShown;
  varying float vFar;
  varying float vPixels;
  
  float easeInOut(float t) {
    return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }
  float easeOut(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
  }


  void main() {
    float arrive = clamp(
      (uTime - aStagger * ${I(E)}) / ${I(T-E)},
      0.0,
      1.0
    );
    vec3 place = mix(aPrev, position, uOpening > 0.5 ? 1.0 : easeInOut(arrive));
    vShown = uOpening > 0.5 ? easeOut(arrive) : 1.0;

    float colorIn = clamp(
      (uTime - ${I(j)} - aSweep * ${I(D)}) / ${I(O)},
      0.0,
      1.0
    );
    float colorOut = clamp((uTime - ${I(M)}) / ${I(k)}, 0.0, 1.0);
    float classified = aLabeled > 0.5
      ? 1.0
      : smoothstep(0.0, 1.0, colorIn) * (1.0 - smoothstep(0.0, 1.0, colorOut));
    vFill = mix(uBlank, aColor, classified);
    vRing = aLabeled > 0.5 ? aColor : mix(uRim, mix(aColor, uInk, ${I(f)}), classified);

    vec4 view = modelViewMatrix * vec4(place, 1.0);
    float depth = -view.z;
    vFar = clamp((depth - (uCamera - uReach)) / (2.0 * uReach), 0.0, 1.0);
    float size = uPixels * (aLabeled > 0.5 ? ${I(m)} : 1.0) * (uCamera / depth);
    size *= mix(0.35, 1.0, vShown);
    vPixels = size;
    vRingWidth = uRing / max(0.5 * size, 1.0);
    gl_PointSize = size;
    gl_Position = projectionMatrix * view;
  }
`,R=`
  uniform vec3 uPaper;
  varying vec3 vFill;
  varying vec3 vRing;
  varying float vRingWidth;
  varying float vShown;
  varying float vFar;
  varying float vPixels;

  void main() {
    float distance = length(gl_PointCoord - 0.5) * 2.0;
    if (distance > 1.0 || vShown < 0.02) discard;
    float pixel = 2.0 / max(vPixels, 1.0);
    float inner = 1.0 - vRingWidth;
    vec3 color = mix(vFill, vRing, smoothstep(inner - pixel, inner, distance));
    color = mix(color, uPaper, smoothstep(1.0 - pixel, 1.0, distance));
    color = mix(color, uPaper, ${I(h)} * vFar);
    color = mix(uPaper, color, vShown);
    gl_FragColor = vec4(color, 1.0);
  }
`,z=`
  attribute float aStart;
  uniform float uTime;
  uniform float uCamera;
  uniform float uReach;
  varying float vAlpha;

  void main() {
    float since = uTime - (${I(j)} + aStart * ${I(D)});
    vAlpha = smoothstep(-0.2, 0.05, since) * (1.0 - smoothstep(0.3, 0.75, since));
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    float far = clamp((-view.z - (uCamera - uReach)) / (2.0 * uReach), 0.0, 1.0);
    vAlpha *= 1.0 - 0.5 * far;
    gl_Position = projectionMatrix * view;
  }
`,B=`
  uniform vec3 uLine;
  uniform float uOpacity;
  varying float vAlpha;

  void main() {
    if (vAlpha < 0.01) discard;
    gl_FragColor = vec4(uLine, vAlpha * uOpacity);
  }
`,V=2*Math.PI/60,H=.05;function U(e,t){let n=e.current;n&&t&&(n.array.set(t),n.needsUpdate=!0)}function W(e,t,n){let r=t[n%t.length],i=n===0?r:t[(n-1)%t.length];U(e.position,r?.positions),U(e.prev,i?.positions),U(e.color,r?.colors),U(e.sweep,r?.sweep),U(e.linePosition,r?.linePositions),U(e.lineStart,r?.lineStarts)}function G(e,t,n){for(let r of e){let e=r.current?.uniforms;e?.uTime&&e.uOpening&&(e.uTime.value=t,e.uOpening.value=+!!n)}}function K({active:n,reducedMotion:r,arrivals:i,buffers:a,targets:o,group:s,lines:c,materials:u}){let d=t(e=>e.invalidate),f=(0,_.useRef)({elapsed:0,cycle:0,playing:!1,turn:g}),p=(0,_.useRef)({targets:o,group:s,lines:c,materials:u});(0,_.useEffect)(()=>{p.current={targets:o,group:s,lines:c,materials:u}}),(0,_.useEffect)(()=>{let e=f.current;if(n&&e.playing&&!r)return;let{targets:t,group:i,lines:o,materials:s}=p.current;e.playing=!1,e.elapsed=0,e.cycle=0,e.turn=g,W(t,a,0),G(s,r?N:0,!0),i.current?.rotation.set(l,g,0),o.current&&(o.current.visible=!1),d()},[n,r,a,d]),(0,_.useEffect)(()=>{if(r||i===0)return;let e=f.current;e.playing=!0,e.elapsed=0,e.cycle=0,e.turn=g,W(p.current.targets,a,0),d()},[i,r,a,d]),e((e,t)=>{let n=f.current;if(!n.playing)return;let{targets:r,group:i,lines:o,materials:s}=p.current,c=Math.min(t,H);n.elapsed+=c,n.turn+=c*V;let l=P(n.elapsed),u=F(n.elapsed);l!==n.cycle&&(n.cycle=l,W(r,a,l)),G(s,u,l===0),i.current&&(i.current.rotation.y=n.turn),o.current&&(o.current.visible=u>1.6&&u<5.8),d()})}var q=o(),J=.5,Y=x(b(s.edge),b(s.hairline),.35),X=4.5,Z=8;function Q({active:e,reducedMotion:n}){let i=(0,_.useContext)(d),a=t(e=>e.invalidate),o=t(e=>e.camera),c=t(e=>e.size.width),f=t(e=>e.size.height),m=t(e=>e.viewport.dpr),h=(0,_.useMemo)(()=>p(),[]),v=(0,_.useMemo)(()=>C(h),[h]),y=(0,_.useMemo)(()=>w(h,v),[h,v]),x=(0,_.useMemo)(()=>({uTime:{value:0},uOpening:{value:1},uPixels:{value:6},uRing:{value:1},uCamera:{value:u(1)},uReach:{value:1},uBlank:{value:new r(...b(s.node))},uRim:{value:new r(...Y)},uInk:{value:new r(...b(s.graphite))},uPaper:{value:new r(...b(s.paper))}}),[]),S=(0,_.useMemo)(()=>({uTime:{value:0},uOpening:{value:1},uCamera:{value:u(1)},uReach:{value:1},uLine:{value:new r(...b(s.edge))},uOpacity:{value:J}}),[]),T=(0,_.useRef)(null),E=(0,_.useRef)(null),D=(0,_.useRef)(null),O=(0,_.useRef)(null),k=(0,_.useRef)(null),A=(0,_.useRef)(null),j=(0,_.useRef)(null),M=(0,_.useRef)(null),N=(0,_.useRef)(null),P=(0,_.useRef)(null);return K({active:e,reducedMotion:n,arrivals:i,buffers:v,targets:{position:k,prev:A,color:j,sweep:M,linePosition:N,lineStart:P},group:T,lines:E,materials:[D,O]}),(0,_.useEffect)(()=>{let e=u(c/Math.max(1,f));o.position.set(0,0,e),o.lookAt(0,0,0);let t=Math.min(Z,Math.max(X,Math.min(c,f)/58));for(let n of[D,O]){let r=n.current?.uniforms;r?.uCamera&&(r.uCamera.value=e),r?.uPixels&&r.uRing&&(r.uPixels.value=t*m,r.uRing.value=Math.max(1,1.1*m))}a()},[o,c,f,m,a]),(0,q.jsxs)(`group`,{ref:T,rotation:[l,g,0],children:[(0,q.jsxs)(`points`,{frustumCulled:!1,children:[(0,q.jsxs)(`bufferGeometry`,{children:[(0,q.jsx)(`bufferAttribute`,{ref:k,attach:`attributes-position`,args:[y.positions,3]}),(0,q.jsx)(`bufferAttribute`,{ref:A,attach:`attributes-aPrev`,args:[y.prev,3]}),(0,q.jsx)(`bufferAttribute`,{ref:j,attach:`attributes-aColor`,args:[y.colors,3]}),(0,q.jsx)(`bufferAttribute`,{ref:M,attach:`attributes-aSweep`,args:[y.sweep,1]}),(0,q.jsx)(`bufferAttribute`,{attach:`attributes-aLabeled`,args:[y.labeled,1]}),(0,q.jsx)(`bufferAttribute`,{attach:`attributes-aStagger`,args:[y.stagger,1]})]}),(0,q.jsx)(`shaderMaterial`,{ref:D,uniforms:x,vertexShader:L,fragmentShader:R})]}),(0,q.jsxs)(`lineSegments`,{ref:E,frustumCulled:!1,visible:!1,children:[(0,q.jsxs)(`bufferGeometry`,{children:[(0,q.jsx)(`bufferAttribute`,{ref:N,attach:`attributes-position`,args:[y.linePositions,3]}),(0,q.jsx)(`bufferAttribute`,{ref:P,attach:`attributes-aStart`,args:[y.lineStarts,1]})]}),(0,q.jsx)(`shaderMaterial`,{ref:O,uniforms:S,vertexShader:z,fragmentShader:B,transparent:!0,depthWrite:!1})]})]})}var $={fov:32,position:[0,0,u(1)],near:.1,far:50};function ee({active:e,reducedMotion:t,onContextLost:r}){return(0,q.jsx)(n,{active:e,onContextLost:r,renderOnDemand:!0,camera:$,children:(0,q.jsx)(Q,{active:e,reducedMotion:t})})}export{ee as default};