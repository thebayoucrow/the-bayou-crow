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
   const card=document.createElement('article');card.className='product-card';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','View photos and details for '+product.name);
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
   const view=document.createElement('span');view.className='product-view';view.textContent='VIEW ALL PHOTOS ↗';info.appendChild(view);
   card.addEventListener('click',event=>{if(event.target.closest('a'))return;openProduct(product)});
   card.addEventListener('keydown',event=>{if(event.target.closest('a'))return;if(event.key==='Enter'||event.key===' '){event.preventDefault();openProduct(product)}});
   card.appendChild(info);grid.appendChild(card);
  });
  if(grid.childElementCount){wrap.append(title,grid);section.appendChild(wrap);}
 }catch(error){console.warn('Product catalog unavailable:',error);}
}
loadProducts();

/* Accessible product detail dialog with selectable thumbnails and enlarged image. */
let lastProductFocus=null;
function openProduct(product){
 const images=[product.photo,...(Array.isArray(product.photos)?product.photos:[])].filter(Boolean);
 lastProductFocus=document.activeElement;
 const dialog=document.createElement('div');dialog.className='product-overlay';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label',product.name+' product details');
 const panel=document.createElement('div');panel.className='product-dialog';
 const close=document.createElement('button');close.type='button';close.className='product-close';close.setAttribute('aria-label','Close product details');close.textContent='×';
 const gallery=document.createElement('div');gallery.className='detail-gallery';
 const stage=document.createElement('div');stage.className='detail-stage';
 const main=document.createElement('img');main.alt=product.name;main.className='detail-main';
 const prev=document.createElement('button');prev.type='button';prev.className='detail-arrow previous';prev.textContent='‹';prev.setAttribute('aria-label','Previous photo');
 const next=document.createElement('button');next.type='button';next.className='detail-arrow next';next.textContent='›';next.setAttribute('aria-label','Next photo');
 const count=document.createElement('span');count.className='detail-count';
 const thumbs=document.createElement('div');thumbs.className='detail-thumbs';
 let current=0;
 const buttons=images.map((src,i)=>{const b=document.createElement('button');b.type='button';b.className='detail-thumb';b.setAttribute('aria-label','Show photo '+(i+1));const img=document.createElement('img');img.src=src;img.alt='';img.loading='lazy';b.appendChild(img);b.addEventListener('click',()=>show(i));thumbs.appendChild(b);return b});
 function show(i){if(!images.length)return;current=(i+images.length)%images.length;main.src=images[current];main.alt=product.name+' photo '+(current+1)+' of '+images.length;count.textContent=(current+1)+' / '+images.length;buttons.forEach((b,j)=>{b.classList.toggle('selected',j===current);b.setAttribute('aria-pressed',String(j===current))});}
 if(images.length){stage.append(main);if(images.length>1){stage.append(prev,next,count);gallery.append(stage,thumbs)}else gallery.append(stage);show(0)}
 else{stage.classList.add('empty-photo');stage.textContent='Photo coming soon';gallery.append(stage)}
 prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
 const details=document.createElement('div');details.className='detail-info';
 const category=document.createElement('span');category.className='product-category';category.textContent=product.category||'THE COLLECTION';
 const title=document.createElement('h2');title.textContent=product.name;title.id='product-dialog-title';dialog.setAttribute('aria-labelledby',title.id);dialog.removeAttribute('aria-label');
 const description=document.createElement('p');description.textContent=product.description||'';details.append(category,title,description);
 if(product.price!==undefined&&product.price!==null&&product.price!==''){const price=document.createElement('strong');price.className='product-price';price.textContent='$'+Number(product.price).toFixed(2);details.appendChild(price)}
 const status=document.createElement('p');status.className='product-status';status.textContent=product.available===false?'Currently unavailable':'Message us on Facebook to order';details.appendChild(status);
 if(product.available!==false){const link=document.createElement('a');link.className='button detail-order';link.href=document.querySelector('.facebook-link')?.href||'https://www.facebook.com/';link.target='_blank';link.rel='noopener';link.textContent='Ask about this item ↗';details.appendChild(link)}
 panel.append(close,gallery,details);dialog.appendChild(panel);document.body.appendChild(dialog);document.body.classList.add('dialog-open');
 function dismiss(){document.removeEventListener('keydown',onKey);dialog.remove();document.body.classList.remove('dialog-open');lastProductFocus?.focus()}
 function onKey(event){if(event.key==='Escape')dismiss();else if(event.key==='ArrowLeft'&&images.length>1)show(current-1);else if(event.key==='ArrowRight'&&images.length>1)show(current+1);else if(event.key==='Tab'){const focusables=[...dialog.querySelectorAll('button,a[href]')].filter(el=>el.offsetParent!==null);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}}
 close.addEventListener('click',dismiss);dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss()});document.addEventListener('keydown',onKey);close.focus();
}
