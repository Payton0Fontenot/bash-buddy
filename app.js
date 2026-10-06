(function(){
var t=document.getElementById('toast'),tm;
function say(m){t.textContent=m;t.className='on';clearTimeout(tm);tm=setTimeout(function(){t.className='';},2600);}
document.querySelectorAll('[data-demo]').forEach(function(b){b.addEventListener('click',function(){say('Checkout is not set up yet. This is a preview.');});});
var f=document.getElementById('signup');
if(f){f.addEventListener('submit',function(ev){ev.preventDefault();say('Signup is not connected yet.');});}
var chips=document.querySelectorAll('.chip');
chips.forEach(function(c){c.addEventListener('click',function(){
chips.forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false');});
var cat=c.getAttribute('data-cat');
document.querySelectorAll('.tcard').forEach(function(card){card.hidden=!(cat==='All'||card.getAttribute('data-cat')===cat);});
});});
})();
