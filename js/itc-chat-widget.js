/* ITC Live Chat Widget v1.0 */
(function(){
  if(document.getElementById('itc-chat-widget'))return;
  var API='https://ai.integratechconsulting.es/api/public/chat';
  var sid='web-'+Math.random().toString(36).substr(2,12);
  var css=document.createElement('style');
  css.textContent=`
    #itc-chat-widget{position:fixed;bottom:24px;right:24px;z-index:99999;font-family:'Inter',sans-serif}
    #itc-chat-bubble{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);
      color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 20px rgba(102,126,234,.4);transition:transform .2s}
    #itc-chat-bubble:hover{transform:scale(1.1)}
    #itc-badge{position:absolute;top:-2px;right:-2px;width:18px;height:18px;background:#ef4444;
      border-radius:50%;font-size:10px;display:none;align-items:center;justify-content:center;color:#fff;font-weight:700}
    #itc-chat-box{display:none;width:380px;max-width:calc(100vw - 48px);height:520px;max-height:calc(100vh - 100px);
      background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);flex-direction:column;overflow:hidden;
      position:absolute;bottom:72px;right:0}
    #itc-chat-box.open{display:flex}
    .itc-hdr{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}
    .itc-hdr .av{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:1.2rem}
    .itc-hdr h3{font-size:.95rem;margin:0;font-weight:600}
    .itc-hdr p{font-size:.75rem;margin:0;opacity:.85}
    .itc-hdr .cls{margin-left:auto;background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer;opacity:.8}
    .itc-hdr .cls:hover{opacity:1}
    .itc-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#f9fafb}
    .itc-m{max-width:85%;padding:10px 14px;border-radius:12px;font-size:.88rem;line-height:1.5;word-wrap:break-word}
    .itc-m.b{background:#fff;border:1px solid #e5e7eb;align-self:flex-start;border-bottom-left-radius:4px}
    .itc-m.u{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;align-self:flex-end;border-bottom-right-radius:4px}
    .itc-m.t .ds{display:flex;gap:4px}
    .itc-m.t .ds span{width:7px;height:7px;background:#667eea;border-radius:50%;animation:itcB .6s infinite alternate}
    .itc-m.t .ds span:nth-child(2){animation-delay:.2s}
    .itc-m.t .ds span:nth-child(3){animation-delay:.4s}
    @keyframes itcB{from{opacity:.3;transform:translateY(0)}to{opacity:1;transform:translateY(-4px)}}
    .itc-inp{display:flex;padding:12px;gap:8px;border-top:1px solid #e5e7eb;background:#fff;flex-shrink:0}
    .itc-inp input{flex:1;border:1.5px solid #e5e7eb;border-radius:24px;padding:10px 16px;font-size:.88rem;font-family:inherit;outline:none;transition:border-color .2s}
    .itc-inp input:focus{border-color:#667eea}
    .itc-inp button{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
    .itc-inp button:disabled{opacity:.5;cursor:not-allowed}
    .itc-pw{text-align:center;padding:6px;font-size:.7rem;color:#9ca3af;background:#fff;flex-shrink:0}
    .itc-pw a{color:#667eea;text-decoration:none}
    @media(max-width:480px){#itc-chat-box{width:100vw;height:100vh;max-height:100vh;bottom:0;right:0;border-radius:0;position:fixed}}
  `;
  document.head.appendChild(css);
  var w=document.createElement('div');w.id='itc-chat-widget';
  w.innerHTML='<div id="itc-chat-box"><div class="itc-hdr"><div class="av">\uD83C\uDFA7</div><div><h3>Soporte ITC</h3><p>Asistente virtual \u2022 Online</p></div><button class="cls" id="itc-close">\u00D7</button></div><div class="itc-msgs" id="itc-msgs"><div class="itc-m b">\u00A1Hola! \uD83D\uDC4B Soy el asistente de Integra Tech Consulting. \u00BFEn qu\u00E9 puedo ayudarte?</div></div><div class="itc-inp"><input type="text" id="itc-in" placeholder="Escribe tu pregunta..." autocomplete="off" maxlength="2000"><button id="itc-snd">\u27A4</button></div><div class="itc-pw">Powered by <a href="https://web.integratechconsulting.es/agente-gratis.html" target="_blank">ITC AI</a></div></div><button id="itc-chat-bubble"><span style="font-size:1.5rem">\uD83D\uDCAC</span><span id="itc-badge">1</span></button>';
  document.body.appendChild(w);
  var box=document.getElementById('itc-chat-box'),bub=document.getElementById('itc-chat-bubble'),
      msgs=document.getElementById('itc-msgs'),inp=document.getElementById('itc-in'),
      snd=document.getElementById('itc-snd'),cls=document.getElementById('itc-close'),
      bdg=document.getElementById('itc-badge'),isOpen=false,busy=false;
  bub.onclick=function(){isOpen=!isOpen;box.classList.toggle('open',isOpen);bub.style.display=isOpen?'none':'flex';if(isOpen){inp.focus();bdg.style.display='none'}};
  cls.onclick=function(){isOpen=false;box.classList.remove('open');bub.style.display='flex'};
  function fmtMd(t){var e=document.createElement('div');e.textContent=t;var s=e.innerHTML;s=s.replace(/\[MSG:[^\]]*\]/g,'');s=s.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');s=s.replace(/\*(.*?)\*/g,'<em>$1</em>');s=s.replace(/`(.*?)`/g,'<code>$1</code>');s=s.replace(/\n/g,'<br>');return s}
  function addM(t,c){var d=document.createElement('div');d.className='itc-m '+c;if(c==='u'){d.textContent=t}else{d.innerHTML=fmtMd(t)};msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
  function typing(on){var el=document.getElementById('itc-typ');if(on&&!el){var d=document.createElement('div');d.className='itc-m b t';d.id='itc-typ';d.innerHTML='<div class="ds"><span></span><span></span><span></span></div>';msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight}if(!on&&el)el.remove()}
  async function send(){var t=inp.value.trim();if(!t||busy)return;busy=true;snd.disabled=true;inp.value='';addM(t,'u');typing(true);
    try{var r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,session_id:sid})});var d=await r.json();typing(false);addM(d.reply||'Error','b')}
    catch(e){typing(false);addM('Error de conexion.','b')}busy=false;snd.disabled=false;inp.focus()}
  snd.onclick=send;inp.onkeydown=function(e){if(e.key==='Enter')send()};
  setTimeout(function(){if(!isOpen){bdg.style.display='flex'}},30000);
})();
