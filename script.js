// The Bayou Crow Facebook Page URL (provided by the owner).
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/14twwq4XcJm/?mibextid=wwXIfr';
document.querySelectorAll('.facebook-link').forEach(a=>a.href=FACEBOOK_PAGE_URL);
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.querySelector('.menu'),nav=document.querySelector('#nav');toggle.addEventListener('click',()=>{let open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));