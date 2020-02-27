// Flying Pages
const toPrefetch=new Set,alreadyPrefetched=new Set,prefetcher=document.createElement("link"),isNativePrefetchSupported=prefetcher.relList&&prefetcher.relList.supports&&prefetcher.relList.supports("prefetch"),isSlowConnection=navigator.connection&&(navigator.connection.saveData||(navigator.connection.effectiveType||"").includes("2g")),prefetch=e=>isNativePrefetchSupported?new Promise((t,r)=>{const o=document.createElement("link");o.rel="prefetch",o.href=e,o.onload=t,o.onerror=r,document.head.appendChild(o)}):new Promise((t,r)=>{const o=new XMLHttpRequest;o.open("GET",e,o.withCredentials=!0),o.onload=(()=>{200===o.status?t():r()}),o.send()}),prefetchWithTimeout=e=>{const t=setTimeout(()=>stopPreloading(),5e3);prefetch(e).catch(()=>stopPreloading()).finally(()=>clearTimeout(t))},addUrlToQueue=(e,t=!1)=>{if(alreadyPrefetched.has(e)||toPrefetch.has(e)){return}const r=window.location.origin;if(e.substring(0,r.length)===r&&window.location.href!==e){for(let t=0;t<window.FPConfig.ignoreKeywords.length;t+=1){if(e.includes(window.FPConfig.ignoreKeywords[t])){return}}t?(prefetchWithTimeout(e),alreadyPrefetched.add(e)):toPrefetch.add(e)}},observer=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){const t=e.target.href;addUrlToQueue(t,!window.FPConfig.maxRPS)}})}),startQueue=()=>setInterval(()=>{Array.from(toPrefetch).slice(0,window.FPConfig.maxRPS).forEach(e=>{prefetchWithTimeout(e),alreadyPrefetched.add(e),toPrefetch.delete(e)})},1e3);let hoverTimer=null;const mouseOverListener=e=>{const t=e.target.closest("a");t&&t.href&&!alreadyPrefetched.has(t.href)&&(hoverTimer=setTimeout(()=>{addUrlToQueue(t.href,!0)},window.FPConfig.hoverDelay))},touchStartListener=e=>{const t=e.target.closest("a");t&&t.href&&!alreadyPrefetched.has(t.href)&&addUrlToQueue(t.href,!0)},mouseOutListener=e=>{const t=e.target.closest("a");t&&t.href&&!alreadyPrefetched.has(t.href)&&clearTimeout(hoverTimer)},requestIdleCallback=window.requestIdleCallback||function(e){const t=Date.now();return setTimeout(function(){e({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-t))}})},1)},stopPreloading=()=>{document.querySelectorAll("a").forEach(e=>observer.unobserve(e)),toPrefetch.clear(),document.removeEventListener("mouseover",mouseOverListener,!0),document.removeEventListener("mouseout",mouseOutListener,!0),document.removeEventListener("touchstart",touchStartListener,!0)};function flyingPages(e={}){if(isSlowConnection){return}window.FPConfig=Object.assign({delay:0,ignoreKeywords:[],maxRPS:3,hoverDelay:50},e),startQueue(),requestIdleCallback(()=>setTimeout(()=>document.querySelectorAll("a").forEach(e=>observer.observe(e)),1e3*window.FPConfig.delay));const t={capture:!0,passive:!0};document.addEventListener("mouseover",mouseOverListener,t),document.addEventListener("mouseout",mouseOutListener,t),document.addEventListener("touchstart",touchStartListener,t)}window.addEventListener("load",()=>{flyingPages()});