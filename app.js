(function(){
var t=document.getElementById('toast'),tm,KEY='bbc_cart';
function say(m){t.textContent=m;t.className='on';clearTimeout(tm);tm=setTimeout(function(){t.className='';},2600);}
function load(){try{return (JSON.parse(localStorage.getItem(KEY))||[]).filter(function(i){return !(/-3$/.test(i.id)&&!i.opts);});}catch(e){return [];}}
function save(c){try{localStorage.setItem(KEY,JSON.stringify(c));}catch(e){}}
function sync(){var n=load().reduce(function(a,i){return a+i.q;},0);document.querySelectorAll('[data-cart-count]').forEach(function(el){el.textContent=n;});}
document.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){
var p=b.getAttribute('data-add').split('|'),c=load(),f=c.filter(function(i){return i.id===p[0];})[0];
var ex=b.getAttribute('data-excl');if(ex){c=c.filter(function(i){return i.id!==ex;});f=c.filter(function(i){return i.id===p[0];})[0];}
if(f){if(!ex)f.q++;}else{c.push({id:p[0],name:p[1],q:1});}
save(c);sync();say('Added to your cart.');});});
document.querySelectorAll('[data-demo]').forEach(function(b){b.addEventListener('click',function(){say('Checkout is not connected yet. This is a preview.');});});
var bd=document.getElementById('banner-dlg');
if(bd){var bf=document.getElementById('banner-form');
document.querySelectorAll('[data-banner]').forEach(function(b){b.addEventListener('click',function(){if(bd.showModal){bd.showModal();}else{bd.setAttribute('open','');}});});
document.getElementById('b-cancel').addEventListener('click',function(){bd.close();});
bf.addEventListener('submit',function(ev){ev.preventDefault();
var g=function(n){return (bf.elements[n].value||'').trim();},txt=g('text');
if(!txt){document.getElementById('b-msg').textContent='Please add a name or message.';return;}
var o={template:g('template'),text:txt,line2:g('line2'),colors:g('colors'),date:g('date'),notes:g('notes')},c=load();
c.push({id:bf.getAttribute('data-slug')+'-3',name:bf.getAttribute('data-name')+': Custom banner',q:1,opts:o});
save(c);sync();bf.reset();bd.close();say(hasBox(c)?'Banner added to your cart.':'Banner added. Add a party box to check out.');});
var bx=document.getElementById('b-x');if(bx)bx.addEventListener('click',function(){bd.close();});
bd.addEventListener('click',function(e){var r=bd.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)bd.close();});
(function(){var p=document.getElementById('b-prev');if(!p)return;var f=bf.elements,fl=document.getElementById('b-flags'),bo=document.getElementById('b-body'),h1=document.getElementById('b-h1'),h2=document.getElementById('b-h2');
function pal(){var cs=getComputedStyle(bd),a=(cs.getPropertyValue('--c1')||'#D6006F').trim(),b=(cs.getPropertyValue('--c2')||'#FFD60A').trim(),t=(cs.getPropertyValue('--tx')||'#fff').trim(),k=f.colors.value;
if(k==='Pastels')return{bg:'#FADADD',tx:'#5B3F73',fl:['#F7B6D2','#C9B6F2','#B6E3F2','#FFE3B3','#BFEBD3']};
if(k==='Bold and bright')return{bg:'#E6007A',tx:'#FFFFFF',fl:['#7B2FF7','#FF8A00','#00A3FF','#FFFFFF','#FFD60A']};
if(k==='Black and gold')return{bg:'#141414',tx:'#F2C14E',fl:['#141414','#F2C14E','#141414','#F2C14E','#141414']};
return{bg:a,tx:t,fl:[a,b,a,b,a]};}
function draw(){var P=pal(),tp=f.template.value,m=(f.text.value||'').trim(),l2=(f.line2.value||'').trim(),head,sub;
var ph=/\[[^\]]+\]/.test(tp);
if(/^Something else/.test(tp)){head=m||'Your message here';sub=l2;}
else if(ph){head=tp.replace(/\[[^\]]+\]/,m||tp.match(/\[[^\]]+\]/)[0]);sub=l2;}
else{head=tp;sub=[m,l2].filter(Boolean).join(' | ');}
h1.textContent=head;h2.textContent=sub;bo.style.background=P.bg;bo.style.color=P.tx;
fl.innerHTML='';for(var i=0;i<7;i++){var e=document.createElement('i');e.style.background=P.fl[i%P.fl.length];fl.appendChild(e);}}
['template','text','line2','colors'].forEach(function(n){f[n].addEventListener('input',draw);f[n].addEventListener('change',draw);});
bf.addEventListener('reset',function(){setTimeout(draw,0);});
document.querySelectorAll('[data-banner]').forEach(function(b){b.addEventListener('click',draw);});
draw();})();
}
var cb=document.getElementById('checkout-btn');
function guestsOk(c){return c.every(function(g){var m=g.id.match(/^(.+)-[67]$/);if(!m)return true;var n=c.filter(function(i){return i.id===m[1];}).reduce(function(a,i){return a+i.q;},0);return n>=1&&g.q<=n;});}
function hasBox(c){return c.some(function(i){return !/-\d$/.test(i.id);});}
if(cb){cb.addEventListener('click',function(){
var m=document.getElementById('checkout-msg'),c=load();
if(!c.length){m.textContent='Your cart is empty.';return;}
if(!hasBox(c)){m.textContent='Add-ons can only be bought with a party box. Add a box to your cart first.';return;}
if(!guestsOk(c)){m.textContent='Extra guests go with a box of the same theme, up to 16 guests per box. Add another box for a bigger party.';return;}
cb.disabled=true;m.textContent='Taking you to secure checkout...';
fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:c.map(function(i){return {id:i.id,q:i.q,opts:i.opts};})})})
.then(function(r){return r.text().then(function(t){var d=null;try{d=JSON.parse(t);}catch(e){}
if(r.status===404||!d){throw new Error('Checkout is not set up on the site yet. The api folder has not been uploaded.');}
if(!r.ok||!d.url){throw new Error(d.error||'Checkout could not start. Please try again.');}
return d;});})
.then(function(d){window.location.href=d.url;})
.catch(function(e){cb.disabled=false;m.textContent=(e&&e.message)?e.message:'Checkout could not start. Please try again.';});
});}
if(document.body.hasAttribute('data-clear-cart')){save([]);}
var list=document.getElementById('cart-list');
function render(){
if(!list)return;
var c=load();list.textContent='';
var empty=document.getElementById('cart-empty'),sum=document.getElementById('cart-sum');
if(empty)empty.hidden=c.length>0;if(sum)sum.hidden=c.length===0;
var nb=document.getElementById('checkout-msg');
if(cb&&nb){if(c.length&&!hasBox(c)){cb.disabled=true;nb.innerHTML='Add-ons can only be bought with a party box. <a href="shop.html">Pick a box</a> to check out.';}else{cb.disabled=false;if(nb.querySelector('a'))nb.textContent='';}}
c.forEach(function(it){
var row=document.createElement('div');row.className='cart-row';
var nm=document.createElement('b');nm.textContent=it.name;
var q=document.createElement('div');q.className='qty';
function btn(label,aria,fn,cls){var x=document.createElement('button');x.type='button';x.textContent=label;x.setAttribute('aria-label',aria);if(cls)x.className=cls;x.addEventListener('click',fn);return x;}
var n=document.createElement('span');n.textContent=it.q;n.setAttribute('aria-live','polite');
q.appendChild(btn('-','Decrease quantity of '+it.name,function(){it.q--;if(it.q<1){c=c.filter(function(i){return i!==it;});}save(c);sync();render();}));
q.appendChild(n);
q.appendChild(btn('+','Increase quantity of '+it.name,function(){it.q++;save(c);sync();render();}));
q.appendChild(btn('Remove','Remove '+it.name,function(){c=c.filter(function(i){return i!==it;});save(c);sync();render();},'rm'));
if(it.opts){var sm=document.createElement('small');sm.textContent=[it.opts.template,'Text: '+it.opts.text,it.opts.line2,it.opts.colors].filter(Boolean).join(' | ');nm.appendChild(sm);}
if(it.opts){q.removeChild(q.children[2]);q.removeChild(q.children[0]);q.removeChild(q.children[0]);}
row.appendChild(nm);row.appendChild(q);list.appendChild(row);});
}
document.querySelectorAll('form[data-endpoint]').forEach(function(f){f.addEventListener('submit',function(ev){
ev.preventDefault();
var ep=f.getAttribute('data-endpoint'),m=f.querySelector('.msg');
if(!ep){say('This form is not connected yet.');return;}
fetch(ep,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}}).then(function(r){
if(!r.ok)throw new Error('bad');
f.reset();m.textContent='Thanks! We got it.';
}).catch(function(){m.textContent='Something went wrong. Please try again.';});
});});
var CFG=window.BBC||{};
document.querySelectorAll('[data-reel]').forEach(function(a){var u=(CFG.reels||[])[Number(a.getAttribute('data-reel'))-1]||CFG.instagram;if(u){a.href=u;a.target='_blank';a.rel='noopener';}else{a.addEventListener('click',function(e){e.preventDefault();say('Instagram link coming soon.');});}});
document.querySelectorAll('[data-social=instagram]').forEach(function(a){if(!CFG.instagram){a.addEventListener('click',function(e){e.preventDefault();say('Instagram link coming soon.');});}else{a.target='_blank';a.rel='noopener';}});
document.querySelectorAll('[data-social]').forEach(function(a){var k=a.getAttribute('data-social'),v=CFG[k];if(!v)return;a.href=k==='email'?'mailto:'+v:v;a.hidden=false;});
document.querySelectorAll('[data-email-text]').forEach(function(el){if(!CFG.email)return;el.textContent=CFG.email;var w=el.closest('[data-email-wrap]');if(w)w.hidden=false;});
var __art=0;
var TH={
'21st-birthday':{c:['#D6006F','#FFD60A','#FF7BC8','#FFFFFF'],m:'twentyone'},
'friendsgiving':{c:['#B5481A','#FFC83D','#7A8F3A','#FFF4E0'],m:'harvest'},
'christmas':{c:['#B3122B','#2E8B57','#FFD166','#FFFFFF'],m:'tree'},
'halloween':{c:['#2B1055','#FF7A1A','#8E5BD9','#FFF2D6'],m:'pumpkin'},
'get-wild':{c:['#1E7A3C','#FFC83D','#5A3A22','#FFFFFF'],m:'paw'},
'cowgirl-western':{c:['#A0522D','#F4D7A1','#E86AA6','#FFFFFF'],m:'hat'},
'coquette':{c:['#F7B2CC','#CFE3FF','#FFFFFF','#E57BA6'],m:'bow'},
'slumber-party':{c:['#6B2BD9','#FFB3D9','#FFE27A','#FFFFFF'],m:'moon'},
'paint-and-sip':{c:['#0B6E99','#FFD60A','#FF6B6B','#FFFFFF'],m:'palette'},
'beach-luau':{c:['#00A6A6','#FF8A5B','#FFD60A','#FFFFFF'],m:'pineapple'},
'game-day':{c:['#1F5E2E','#FFC83D','#8B4A22','#FFFFFF'],m:'football'},
'graduation':{c:['#7A1530','#F2B705','#FFFFFF','#F6D77A'],m:'cap'}
};
var INK='#2B1B6B',SW=2.5,FONT="'Bowlby One',sans-serif";
var ST='stroke="'+INK+'" stroke-width="'+SW+'" stroke-linejoin="round" stroke-linecap="round"';
function motif(m,c){
var o='';
if(m==='twentyone'){o='<text y="20" text-anchor="middle" font-family="'+FONT+'" font-size="56" fill="'+c[1]+'" stroke="'+INK+'" stroke-width="2.5" paint-order="stroke">21</text>';}
else if(m==='harvest'){var lf='M0-26 C16-16 18 6 0 26 C-18 6 -16-16 0-26Z';
o='<path d="'+lf+'" fill="'+c[0]+'" '+ST+' transform="translate(-14 0) rotate(-28)"/><path d="'+lf+'" fill="'+c[1]+'" '+ST+' transform="translate(14 2) rotate(28)"/><path d="'+lf+'" fill="'+c[2]+'" '+ST+' transform="translate(0 6) scale(.8)"/>';}
else if(m==='tree'){o='<rect x="-5" y="16" width="10" height="11" fill="#8B4A22" '+ST+'/><polygon points="0,-30 20,-6 -20,-6" fill="'+c[1]+'" '+ST+'/><polygon points="0,-14 26,16 -26,16" fill="'+c[1]+'" '+ST+'/><circle cx="-9" cy="8" r="4" fill="'+c[0]+'" '+ST+'/><circle cx="10" cy="4" r="4" fill="'+c[2]+'" '+ST+'/><circle cx="2" cy="-6" r="3.5" fill="'+c[3]+'" '+ST+'/><path transform="translate(0 -33) scale(.9)" d="M0-10 L2.2-2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2-2.2Z" fill="'+c[2]+'" '+ST+'/>';}
else if(m==='pumpkin'){o='<rect x="-3" y="-30" width="7" height="12" rx="2" fill="#4C7A2B" '+ST+'/><ellipse cx="0" cy="0" rx="28" ry="23" fill="'+c[1]+'" '+ST+'/><ellipse cx="0" cy="0" rx="12" ry="23" fill="none" stroke="'+INK+'" stroke-width="1.6"/><polygon points="-14,-6 -6,-6 -10,-14" fill="'+INK+'"/><polygon points="6,-6 14,-6 10,-14" fill="'+INK+'"/><polyline points="-14,8 -8,14 -3,8 3,14 8,8 14,14 14,8" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.5"/>';}
else if(m==='paw'){o='<ellipse cx="0" cy="10" rx="17" ry="14" fill="'+c[1]+'" '+ST+'/><circle cx="-19" cy="-8" r="7" fill="'+c[1]+'" '+ST+'/><circle cx="-7" cy="-21" r="7" fill="'+c[1]+'" '+ST+'/><circle cx="7" cy="-21" r="7" fill="'+c[1]+'" '+ST+'/><circle cx="19" cy="-8" r="7" fill="'+c[1]+'" '+ST+'/><circle cx="-4" cy="8" r="2.6" fill="'+c[2]+'"/><circle cx="6" cy="14" r="2.6" fill="'+c[2]+'"/>';}
else if(m==='hat'){o='<path d="M-18 8 C-22-16 -8-22 0-12 C8-22 22-16 18 8Z" fill="'+c[0]+'" '+ST+'/><ellipse cx="0" cy="10" rx="36" ry="9" fill="'+c[0]+'" '+ST+'/><rect x="-18" y="-2" width="36" height="8" fill="'+c[1]+'" '+ST+'/><path transform="translate(0 2) scale(.5)" d="M0-10 L2.9-3 L10-3 L4.3 1.5 L6.2 8.5 L0 4.5 L-6.2 8.5 L-4.3 1.5 L-10-3 L-2.9-3Z" fill="'+c[2]+'"/>';}
else if(m==='bow'){var lobe='M0 0 C-14-24 -36-14 -31 6 C-28 20 -12 15 0 0Z';
o='<polygon points="-4,4 -18,28 -8,24 -2,30" fill="'+c[3]+'" '+ST+'/><polygon points="4,4 18,28 8,24 2,30" fill="'+c[3]+'" '+ST+'/><path d="'+lobe+'" fill="'+c[3]+'" '+ST+'/><path d="'+lobe+'" fill="'+c[3]+'" '+ST+' transform="scale(-1 1)"/><circle cx="0" cy="0" r="7" fill="'+c[0]+'" '+ST+'/>';}
else if(m==='moon'){o='<path d="M12-26 A27 27 0 1 0 12 26 A21 21 0 1 1 12-26Z" fill="'+c[2]+'" '+ST+'/><path transform="translate(22 -14) scale(.9)" d="M0-10 L2.2-2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2-2.2Z" fill="'+c[1]+'" '+ST+'/><path transform="translate(26 14) scale(.55)" d="M0-10 L2.2-2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2-2.2Z" fill="'+c[3]+'" '+ST+'/>';}
else if(m==='palette'){o='<path d="M0-22 C24-24 34 0 24 16 C16 28 4 20 8 10 C12 2 -2 4 -8 14 C-18 28 -36 12 -32-6 C-28-16 -16-22 0-22Z" fill="'+c[3]+'" '+ST+'/><circle cx="-16" cy="-8" r="5" fill="'+c[0]+'" '+ST+'/><circle cx="-3" cy="-13" r="5" fill="'+c[1]+'" '+ST+'/><circle cx="11" cy="-8" r="5" fill="'+c[2]+'" '+ST+'/><circle cx="-18" cy="6" r="5" fill="'+c[2]+'" '+ST+'/><rect x="14" y="-30" width="6" height="34" rx="2" fill="'+c[1]+'" '+ST+' transform="rotate(35 17 -13)"/>';}
else if(m==='pineapple'){o='<path d="M0-18 L-8-34 L-2-26 L0-38 L2-26 L8-34Z" fill="#2E9B4F" '+ST+'/><ellipse cx="0" cy="8" rx="17" ry="23" fill="'+c[2]+'" '+ST+'/><path d="M-10-8 L10 22 M10-8 L-10 22 M-15 4 L15 4 M-13 16 L13 16" stroke="'+INK+'" stroke-width="1.3" fill="none"/>';}
else if(m==='football'){o='<ellipse cx="0" cy="0" rx="31" ry="19" fill="'+c[2]+'" '+ST+' transform="rotate(-22)"/><g transform="rotate(-22)"><path d="M-12-19 Q-17 0 -12 19 M12-19 Q17 0 12 19" fill="none" stroke="#fff" stroke-width="3"/><path d="M-9 0 H9 M-6-5 V5 M0-5 V5 M6-5 V5" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>';}
else if(m==='cap'){o='<path d="M-19 4 V20 Q0 30 19 20 V4Z" fill="'+c[3]+'" '+ST+'/><polygon points="0,-18 36,-2 0,14 -36,-2" fill="'+c[3]+'" '+ST+'/><path d="M26 0 V20" stroke="'+c[1]+'" stroke-width="3.5" stroke-linecap="round"/><circle cx="26" cy="23" r="4.5" fill="'+c[1]+'" '+ST+'/><circle cx="0" cy="-2" r="3.5" fill="'+c[0]+'"/>';}
return o;}
function art(src,uid){
if(/reel-/.test(src)){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="g'+uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD0EC"/><stop offset="1" stop-color="#C9CFFF"/></linearGradient></defs><rect width="400" height="500" fill="url(#g'+uid+')"/><circle cx="200" cy="230" r="78" fill="#D6006F" stroke="#2B1B6B" stroke-width="6"/><path d="M180 195l60 35-60 35z" fill="#fff"/><path d="M330 90l8 22 22 8-22 8-8 22-8-22-22-8 22-8z" fill="#C9B8FF" stroke="#2B1B6B" stroke-width="4"/></svg>';}
if(/ambassador/.test(src)){return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="g'+uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD0EC"/><stop offset="1" stop-color="#C9CFFF"/></linearGradient></defs><rect width="400" height="500" fill="url(#g'+uid+')"/><circle cx="200" cy="190" r="70" fill="#fff" stroke="#2B1B6B" stroke-width="6"/><path d="M60 460c0-90 60-150 140-150s140 60 140 150z" fill="#D6006F" stroke="#2B1B6B" stroke-width="6"/><path d="M330 90l8 22 22 8-22 8-8 22-8-22-22-8 22-8z" fill="#C9B8FF" stroke="#2B1B6B" stroke-width="4"/></svg>';}

var mm=src.match(/images\/(.+?)-(box|setup|party)\.jpg/),slug=mm?mm[1]:'21st-birthday',T=TH[slug]||TH['21st-birthday'],c=T.c,mo=T.m;
var k=/setup/.test(src)?'setup':(/box|unboxing/.test(src)?'box':'party');
function balloon(x,y,rad,fill,sy){sy=sy||60;var b=y+rad*1.15,o='<g>';
o+='<path d="M'+x+' '+b+' Q'+(x-6)+' '+(b+sy/2)+' '+(x+2)+' '+(b+sy)+'" fill="none" stroke="'+INK+'" stroke-width="1.4"/>';
o+='<ellipse cx="'+x+'" cy="'+y+'" rx="'+rad+'" ry="'+(rad*1.15)+'" fill="'+fill+'" '+ST+'/>';
o+='<path d="M'+(x-3)+' '+b+' l3 5 l3 -5z" fill="'+INK+'"/>';
o+='<ellipse cx="'+(x-rad*0.35)+'" cy="'+(y-rad*0.4)+'" rx="'+(rad*0.2)+'" ry="'+(rad*0.34)+'" fill="#fff" opacity=".75" transform="rotate(25 '+(x-rad*0.35)+' '+(y-rad*0.4)+')"/>';
return o+'</g>';}
function star(x,y,z,fill){return '<path transform="translate('+x+' '+y+') scale('+z+')" d="M0-10 L2.2-2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2-2.2Z" fill="'+fill+'"/>';}
function setting(x,y,z){return '<g transform="translate('+x+' '+y+') scale('+z+')"><rect x="-34" y="-14" width="16" height="30" rx="3" fill="'+c[2]+'" '+ST+'/><circle cx="0" cy="0" r="19" fill="'+c[3]+'" '+ST+'/><circle cx="0" cy="0" r="11" fill="none" stroke="'+c[1]+'" stroke-width="2.5"/><rect x="22" y="-10" width="13" height="18" rx="3" fill="'+c[0]+'" '+ST+'/></g>';}
function flags(y,x0,x1,n,drop){var mid=(x0+x1)/2,o='<path d="M'+x0+' '+y+' Q'+mid+' '+(y+drop)+' '+x1+' '+y+'" fill="none" stroke="'+INK+'" stroke-width="1.5"/>';
for(var i=1;i<=n;i++){var t=i/(n+1),u=1-t,x=u*u*x0+2*u*t*mid+t*t*x1,yy=u*u*y+2*u*t*(y+drop)+t*t*y;
o+='<polygon points="'+(x-10)+','+yy+' '+(x+10)+','+yy+' '+x+','+(yy+22)+'" fill="'+c[i%3]+'" '+ST+'/>';}
return o;}
function mo2(x,y,z){return '<g transform="translate('+x+' '+y+') scale('+z+')">'+motif(mo,c)+'</g>';}
var p=[[28,42],[366,52],[352,252],[34,262],[200,30],[108,286],[296,284],[172,150],[60,170],[340,170]],conf='';
for(var i=0;i<p.length;i++){conf+=star(p[i][0],p[i][1],0.7+(i%3)*0.25,c[i%3]);}
var d='<defs><linearGradient id="gr'+uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4FB"/><stop offset="1" stop-color="#E8EEFF"/></linearGradient></defs>';
var bg='<rect width="400" height="300" fill="url(#gr'+uid+')"/><rect width="400" height="300" fill="'+c[1]+'" opacity=".22"/><circle cx="360" cy="30" r="90" fill="'+c[0]+'" opacity=".14"/><circle cx="30" cy="290" r="80" fill="'+c[2]+'" opacity=".14"/>',body='<g>';
if(k==='box'){
body+=balloon(120,80,24,c[0],54)+balloon(182,62,28,c[1],70)+balloon(250,84,22,c[2],50);
body+=flags(40,60,340,6,26);
body+='<polygon points="62,128 338,128 322,100 78,100" fill="'+c[1]+'" '+ST+'/>';
body+='<rect x="62" y="128" width="276" height="140" rx="18" fill="'+c[0]+'" '+ST+'/>';
body+=setting(296,120,0.9);
body+=mo2(180,196,1.15);
body+='<text x="200" y="250" text-anchor="middle" font-family="Sora,sans-serif" font-size="12" font-weight="700" letter-spacing="3" fill="#fff">PARTY BOX</text>';
}else if(k==='setup'){
body+='<rect x="40" y="36" width="320" height="170" rx="22" fill="'+c[1]+'" '+ST+'/>';
for(var j=0;j<14;j++){var t=j/13,x=46+t*308,y=76-Math.sin(t*Math.PI)*32,rad=9+(j%3)*4;body+='<circle cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="'+c[j%4]+'" '+ST+'/>';}
body+=mo2(200,142,1.7);
body+='<rect x="24" y="206" width="352" height="52" rx="10" fill="'+c[2]+'" '+ST+'/>';
body+=setting(100,234,0.8)+setting(200,234,0.8)+setting(300,234,0.8);
}else{
body+=flags(18,16,384,9,22);
body+=balloon(58,128,30,c[0],70)+balloon(104,100,26,c[2],70)+balloon(344,124,30,c[1],70)+balloon(298,92,24,c[0],70);
body+='<circle cx="200" cy="108" r="58" fill="#fff" '+ST+'/><circle cx="200" cy="108" r="47" fill="none" stroke="'+c[0]+'" stroke-width="2" stroke-dasharray="3 6"/>';
body+=mo2(200,108,1.25);
body+='<rect x="30" y="226" width="340" height="38" rx="10" fill="'+c[1]+'" '+ST+'/>';
body+=setting(110,238,0.6)+setting(200,238,0.6)+setting(290,238,0.6);
}
body+='</g>';
return '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+d+bg+body+conf+'</svg>';}
document.querySelectorAll('.tcard').forEach(function(a){var h=(a.getAttribute('href')||'').replace('.html',''),t=TH[h],top=a.querySelector('.top');if(!t||!top)return;top.insertAdjacentHTML('beforeend','<svg class="tmotif" viewBox="-40 -40 80 80" aria-hidden="true">'+motif(t.m,t.c)+'</svg>');});
function markEmpty(img){var fig=img.parentNode;if(fig.classList.contains('empty'))return;fig.classList.add('empty');fig.insertAdjacentHTML('afterbegin',art(img.getAttribute('src')||'',__art++));}
document.querySelectorAll('.photo img').forEach(function(img){
function chk(){if(img.complete&&img.naturalWidth===0){markEmpty(img);}}
img.addEventListener('error',function(){markEmpty(img);});
chk();});
var chips=document.querySelectorAll('.chip[data-cat]');
chips.forEach(function(c){c.addEventListener('click',function(){
chips.forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false');});
var cat=c.getAttribute('data-cat');
document.querySelectorAll('.tcard').forEach(function(card){card.hidden=!(cat==='All'||card.getAttribute('data-cat')===cat);});
});});
sync();render();
})();
