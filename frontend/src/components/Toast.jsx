import React,{useEffect}from'react';
export default function Toast({toast,onClose}){useEffect(()=>{if(!toast)return;const t=setTimeout(onClose,2200);return()=>clearTimeout(t)},[toast,onClose]); if(!toast)return null; return <div style={s.wrap}>{toast}</div>}
const s={wrap:{position:'fixed',right:22,bottom:22,zIndex:100,padding:'12px 16px',borderRadius:16,background:'rgba(15,23,42,.96)',border:'1px solid rgba(96,165,250,.25)',color:'#fff',boxShadow:'0 24px 60px rgba(0,0,0,.45)',fontWeight:850}};
