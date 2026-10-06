(function(){
var t=document.getElementById('toast'),tm,KEY='bbc_cart';
function say(m){t.textContent=m;t.className='on';clearTimeout(tm);tm=setTimeout(function(){t.className='';},2600);}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[];}catch(e){return [];}}
function save(c){try{localStorage.setItem(KEY,JSON.stringify(c));}catch(e){}}
function sync(){var n=load().reduce(function(a,i){return a+i.q;},0);document.querySelectorAll('[data-cart-count]').forEach(function(el){el.textContent=n;});}
document.querySelectorAll('[data-add]').forEach(function(b){b.addEventListener('click',function(){
var p=b.getAttribute('data-add').split('|'),c=load(),f=c.filter(function(i){return i.id===p[0];})[0];
if(f){f.q++;}else{c.push({id:p[0],name:p[1],q:1});}
save(c);sync();say('Added to your cart.');});});
document.querySelectorAll('[data-demo]').forEach(function(b){b.addEventListener('click',function(){say('Checkout is not connected yet. This is a preview.');});});
var list=document.getElementById('cart-list');
function render(){
if(!list)return;
var c=load();list.textContent='';
var empty=document.getElementById('cart-empty'),sum=document.getElementById('cart-sum');
if(empty)empty.hidden=c.length>0;if(sum)sum.hidden=c.length===0;
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
document.querySelectorAll('[data-social]').forEach(function(a){var k=a.getAttribute('data-social'),v=CFG[k];if(!v)return;a.href=k==='email'?'mailto:'+v:v;a.hidden=false;});
document.querySelectorAll('[data-email-text]').forEach(function(el){if(!CFG.email)return;el.textContent=CFG.email;var w=el.closest('[data-email-wrap]');if(w)w.hidden=false;});
document.querySelectorAll('.photo img').forEach(function(img){
function chk(){if(img.complete&&img.naturalWidth===0){img.parentNode.classList.add('empty');}}
img.addEventListener('error',function(){img.parentNode.classList.add('empty');});
chk();});
var chips=document.querySelectorAll('.chip[data-cat]');
chips.forEach(function(c){c.addEventListener('click',function(){
chips.forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false');});
var cat=c.getAttribute('data-cat');
document.querySelectorAll('.tcard').forEach(function(card){card.hidden=!(cat==='All'||card.getAttribute('data-cat')===cat);});
});});
sync();render();
})();
