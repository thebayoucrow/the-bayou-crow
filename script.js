// The Bayou Crow Facebook Page URL (provided by the owner).
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/share/14twwq4XcJm/?mibextid=wwXIfr';
document.querySelectorAll('.facebook-link').forEach(a=>a.href=FACEBOOK_PAGE_URL);
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.querySelector('.menu'),nav=document.querySelector('#nav');toggle.addEventListener('click',()=>{let open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}));
/* Editable content from Pages CMS. Layout and branding remain unchanged. */
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setText(selector, value) { const el=document.querySelector(selector); if(el && value!==undefined) el.textContent=value; }
function setHeading(selector, value) {
 const el=document.querySelector(selector); if(!el||!value)return;
 const words=String(value).split(' '),mid=Math.max(1,Math.ceil(words.length/2));
 el.innerHTML=escapeText(words.slice(0,mid).join(' '))+' <em>'+escapeText(words.slice(mid).join(' '))+'</em>';
}
async function loadContent(){
 try {
  const [s,c]=await Promise.all([fetch('content/site.json'),fetch('content/collections.json')]);
  if(!s.ok||!c.ok)throw Error('Content unavailable');
  const site=await s.json(), collections=await c.json();
  setText('.hero .eyebrow',site.eyebrow);
  setHeading('.hero h1',site.headline);
  setText('.hero-copy',site.intro);
  setHeading('.section-head h2',site.collectionHeading);
  setText('.section-head p:last-child',site.collectionIntro);
  setHeading('.shelf-copy h2',site.shelfHeading);
  setText('.shelf-copy>p:not(.eyebrow)',site.shelfDescription);
  setHeading('.story h2',site.storyHeading);
  setText('.story p:not(.eyebrow)',site.story);
  setHeading('.contact h2',site.contactHeading);
  setText('.contact p:not(.eyebrow):not(.small-note)',site.contactText);
  setText('.contact .small-note',site.contactNote);
  if(site.logo)document.querySelector('.hero-logo').src=site.logo;
  if(site.shelfImage)document.querySelector('.shelf-photo').style.backgroundImage='url("'+encodeURI(site.shelfImage)+'")';
  if(site.facebook)document.querySelectorAll('.facebook-link').forEach(a=>a.href=site.facebook);
  const grid=document.querySelector('.collection-grid');
  if(grid && Array.isArray(collections)) {
   grid.innerHTML='';
   collections.forEach((item,i)=>{
    const article=document.createElement(i===0?'a':'article');
    article.className='collection'+(i===0?' featured':'');
    if(i===0)article.href='#shelves';
    const photo=document.createElement('div');
    photo.className='collection-img';
    if(item.image)photo.style.backgroundImage='url("'+encodeURI(item.image)+'")';
    else {photo.className='placeholder '+(i===1?'jewelry':'pins');photo.innerHTML='<span>'+(i===1?'✧':'✦')+'</span>';}
    article.appendChild(photo);
    const t=document.createElement('div');t.className='collection-text';
    const small=document.createElement('span');small.textContent=item.subtitle||'';
    const h=document.createElement('h3');h.textContent=item.title||'';
    const p=document.createElement('p');p.textContent=item.description||'';
    const b=document.createElement('b');b.textContent=item.status||'';if(i!==0)b.className='soon';
    t.append(small,h,p,b);article.appendChild(t);
    if(Array.isArray(item.photos)&&item.photos.length){
      const gallery=document.createElement('div');gallery.className='gallery-thumbs';
      item.photos.filter(Boolean).forEach(src=>{const im=document.createElement('img');im.src=src;im.alt=(item.title||'Merchandise')+' photo';im.loading='lazy';gallery.appendChild(im)});
      article.appendChild(gallery);
    }
    grid.appendChild(article);
   });
  }
 }catch(err){console.warn('Using original website content:',err)}
}
loadContent();

/* Individual merchandise cards. An empty catalog leaves the original layout unchanged. */
async function loadProducts(){
 try {
  const response=await fetch('content/products.json');
  if(!response.ok)return;
  const products=await response.json();
  if(!Array.isArray(products)||!products.length)return;
  const section=document.querySelector('#collections');
  if(!section)return;
  const wrap=document.createElement('div');wrap.className='products-wrap';
  const title=document.createElement('h3');title.className='products-title';title.textContent='Available Treasures';
  const grid=document.createElement('div');grid.className='product-grid';
  products.forEach(product=>{
   if(!product.name)return;
   const card=document.createElement('article');card.className='product-card';
   if(product.photo){const img=document.createElement('img');img.src=product.photo;img.alt=product.name;img.loading='lazy';card.appendChild(img);}
   const info=document.createElement('div');info.className='product-info';
   const category=document.createElement('span');category.className='product-category';category.textContent=product.category||'THE COLLECTION';
   const name=document.createElement('h4');name.textContent=product.name;
   const desc=document.createElement('p');desc.textContent=product.description||'';
   info.append(category,name,desc);
   if(product.price!==undefined&&product.price!==null&&product.price!==''){
    const price=document.createElement('strong');price.className='product-price';price.textContent='$'+Number(product.price).toFixed(2);info.appendChild(price);
   }
   const status=document.createElement('div');status.className='product-status';status.textContent=product.available===false?'Currently unavailable':'Message us on Facebook to order';
   info.appendChild(status);
   if(product.available!==false){
    const link=document.createElement('a');link.className='product-link';link.target='_blank';link.rel='noopener';
    link.href=(document.querySelector('.facebook-link')?.href)||'https://www.facebook.com/';
    link.textContent='Ask about this item ↗';info.appendChild(link);
   }
   if(Array.isArray(product.photos)&&product.photos.length){
    const photos=document.createElement('div');photos.className='product-photos';
    product.photos.filter(Boolean).forEach(src=>{const image=document.createElement('img');image.src=src;image.loading='lazy';image.alt=product.name+' additional photo';photos.appendChild(image);});
    info.appendChild(photos);
   }
   card.appendChild(info);grid.appendChild(card);
  });
  if(grid.childElementCount){wrap.append(title,grid);section.appendChild(wrap);}
 }catch(error){console.warn('Product catalog unavailable:',error);}
}
loadProducts();
