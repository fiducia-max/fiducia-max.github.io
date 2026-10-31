/* Site enhancements: team photos, hero/section images, and article content blocks
   (images, galleries, videos, quotes, callouts, buttons) – all edited in Pages CMS. */
(function () {
  const css = `
  .pb{margin:2rem 0}
  .pb figure{margin:0}
  .pb img{width:100%;height:auto;display:block;margin:0!important}
  .pb figcaption{font-size:.85rem;color:var(--muted);margin-top:.6rem;text-align:center}
  .pb-image.normal{max-width:520px;margin-left:auto;margin-right:auto}
  .pb-image.wide{margin-left:-3rem;margin-right:-3rem}
  .pb-gallery .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.6rem}
  .pb-gallery .g a{display:block;aspect-ratio:1;overflow:hidden;cursor:zoom-in}
  .pb-gallery .g img{width:100%;height:100%;object-fit:cover;transition:.3s}
  .pb-gallery .g a:hover img{transform:scale(1.04)}
  .pb-video .v{position:relative;aspect-ratio:16/9;background:#000}
  .pb-video .v.vert{aspect-ratio:9/16;max-width:360px;margin:0 auto}
  .pb-video iframe,.pb-video video{position:absolute;inset:0;width:100%;height:100%;border:0}
  .pb-quote{border-left:3px solid var(--gold);padding:.4rem 0 .4rem 1.5rem}
  .pb-quote p{font-family:var(--serif);font-size:1.6rem;line-height:1.35;color:var(--ink)!important;font-style:italic}
  .pb-quote cite{display:block;margin-top:.6rem;font-style:normal;font-size:.85rem;color:var(--muted);letter-spacing:.06em}
  .pb-callout{background:var(--paper);border:1px solid var(--line);border-left:4px solid var(--gold);padding:1.3rem 1.5rem}
  .pb-callout b{display:block;font-family:var(--serif);font-size:1.25rem;margin-bottom:.3rem}
  .pb-callout p{margin:0!important}
  .pb-button{text-align:center}
  .pb-button a{text-decoration:none!important;color:var(--ink)!important}
  .pb-divider{border:0;border-top:1px solid var(--line);margin:2.5rem 0}
  #lightbox{position:fixed;inset:0;background:rgba(10,12,15,.92);z-index:200;display:none;align-items:center;justify-content:center;padding:4vh 4vw;cursor:zoom-out}
  #lightbox.open{display:flex}
  #lightbox img{max-width:100%;max-height:100%;object-fit:contain}
  @media(max-width:720px){.pb-image.wide{margin-left:-1.5rem;margin-right:-1.5rem}}
  /* team photos */
  .member .av.has-photo{width:100%;height:auto;aspect-ratio:4/5;border-radius:0;margin:-2.2rem -2.2rem 1.6rem;width:calc(100% + 4.4rem);max-width:none;background:var(--char)}
  .member .av.has-photo img{width:100%;height:100%;object-fit:cover;object-position:center top;transition:transform .6s}
  .member{overflow:hidden}
  .member:hover .av.has-photo img{transform:scale(1.03)}
  .portrait img{object-position:center top}
  .portrait.has-photo .cap{z-index:3;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.6)}
  .portrait.has-photo::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 60%,rgba(20,23,28,.55));z-index:1}
  /* hero background photo */
  .hero .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.22;filter:grayscale(.35)}
  .hero .hero-bg::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--ink) 15%,rgba(31,35,41,.55) 60%,rgba(31,35,41,.85))}
  /* section image (How it works) */
  .process-img{position:relative;margin-bottom:3.5rem;aspect-ratio:21/8;overflow:hidden}
  .process-img img{width:100%;height:100%;object-fit:cover}
  .process-img::after{content:"";position:absolute;inset:14px;border:1px solid rgba(226,200,143,.55);pointer-events:none}
  @media(max-width:720px){.process-img{aspect-ratio:4/3}.member .av.has-photo{margin:-2.2rem -2.2rem 1.4rem}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const lb = document.createElement('div'); lb.id = 'lightbox'; lb.innerHTML = '<img alt="">';
  lb.onclick = () => lb.classList.remove('open'); document.body.appendChild(lb);

  const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const m = p => p ? String(p).replace(/^\/(?=media\/)/, '') : '';
  const cap = c => c ? `<figcaption>${e(c)}</figcaption>` : '';

  // Turn a YouTube / Vimeo / Facebook / TikTok / Google Drive / .mp4 link into an embed
  function embed(url) {
    url = String(url || '').trim(); if (!url) return '';
    let x;
    if ((x = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([\w-]{11})/)))
      return `<div class="v"><iframe src="https://www.youtube-nocookie.com/embed/${x[1]}?rel=0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy" title="Video"></iframe></div>`;
    if ((x = url.match(/youtube\.com\/shorts\/([\w-]{11})/)))
      return `<div class="v vert"><iframe src="https://www.youtube-nocookie.com/embed/${x[1]}" allowfullscreen loading="lazy" title="Video"></iframe></div>`;
    if ((x = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)))
      return `<div class="v"><iframe src="https://player.vimeo.com/video/${x[1]}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" title="Video"></iframe></div>`;
    if ((x = url.match(/tiktok\.com\/.*\/video\/(\d+)/)))
      return `<div class="v vert"><iframe src="https://www.tiktok.com/embed/v2/${x[1]}" allowfullscreen loading="lazy" title="Video"></iframe></div>`;
    if (/facebook\.com|fb\.watch/.test(url))
      return `<div class="v"><iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" allowfullscreen loading="lazy" title="Video"></iframe></div>`;
    if ((x = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)))
      return `<div class="v"><iframe src="https://drive.google.com/file/d/${x[1]}/preview" allow="autoplay" allowfullscreen loading="lazy" title="Video"></iframe></div>`;
    if (/\.(mp4|webm|mov)(\?|$)/i.test(url) || /^\/?media\//.test(url))
      return `<div class="v"><video src="${e(m(url))}" controls playsinline preload="metadata"></video></div>`;
    return '';
  }
  window.videoEmbed = embed;

  function block(b) {
    const t = b.type || b._block;
    switch (t) {
      case 'text': return `<div class="pb pb-text">${typeof rich === 'function' ? rich(b.body) : (b.body || '')}</div>`;
      case 'image': return b.image ? `<div class="pb pb-image ${e(b.size || 'full')}"><figure>${b.link ? `<a href="${e(b.link)}" target="_blank" rel="noopener">` : ''}<img src="${e(m(b.image))}" alt="${e(b.alt || b.caption || '')}" loading="lazy">${b.link ? '</a>' : ''}${cap(b.caption)}</figure></div>` : '';
      case 'gallery': {
        const it = (b.images || []).filter(i => i && i.image);
        return it.length ? `<div class="pb pb-gallery"><div class="g">${it.map(i => `<a data-full="${e(m(i.image))}"><img src="${e(m(i.image))}" alt="${e(i.caption || '')}" loading="lazy"></a>`).join('')}</div>${cap(b.caption)}</div>` : '';
      }
      case 'video': {
        const v = embed(b.video_file || b.url);
        return v ? `<div class="pb pb-video"><figure>${v}${cap(b.caption)}</figure></div>` : '';
      }
      case 'quote': return b.text ? `<div class="pb pb-quote"><p>${e(b.text)}</p>${b.author ? `<cite>— ${e(b.author)}</cite>` : ''}</div>` : '';
      case 'callout': return `<div class="pb pb-callout">${b.title ? `<b>${e(b.title)}</b>` : ''}<p>${e(b.text)}</p></div>`;
      case 'button': return b.label ? `<div class="pb pb-button"><a class="btn btn-gold" href="${e(b.url || '#contact')}" ${/^https?:/.test(b.url || '') ? 'target="_blank" rel="noopener"' : 'onclick="closePost()"'}>${e(b.label)} &rarr;</a></div>` : '';
      case 'divider': return '<hr class="pb-divider">';
    }
    return '';
  }

  // Video links pasted on their own line inside the text editor become players too
  function autoEmbed(root) {
    root.querySelectorAll('p').forEach(p => {
      const txt = p.textContent.trim();
      if (!/^https?:\/\/\S+$/.test(txt)) return;
      const v = embed(txt); if (v) { const d = document.createElement('div'); d.className = 'pb pb-video'; d.innerHTML = v; p.replaceWith(d); }
    });
  }

  // Photos for founder/team, hero background and section image (fields in Pages CMS)
  function decorate() {
    if (typeof S === 'undefined') return;
    document.querySelectorAll('.member .av').forEach(a => { if (a.querySelector('img')) a.classList.add('has-photo'); });
    const pt = document.getElementById('portrait');
    if (pt && pt.querySelector('img')) { pt.classList.add('has-photo'); if (!pt.querySelector('.cap')) pt.insertAdjacentHTML('beforeend', '<span class="cap">Founder · CPA</span>'); }
    const bg = S.hero && S.hero.background_image, hero = document.querySelector('.hero');
    if (hero && bg && !hero.querySelector('.hero-bg')) { const d = document.createElement('div'); d.className = 'hero-bg'; d.style.backgroundImage = `url("${m(bg)}")`; hero.prepend(d); }
    const pi = S.process_image, proc = document.querySelector('#process .wrap');
    if (proc && pi && !proc.querySelector('.process-img')) proc.querySelector('.head').insertAdjacentHTML('afterend', `<div class="process-img"><img src="${e(m(pi))}" alt="${e(S.process_image_alt || 'Consultation with our team')}" loading="lazy"></div>`);
  }
  const ort = window.renderTeam;
  window.renderTeam = function (l) { ort(l); decorate(); };
  const ors = window.renderSite;
  window.renderSite = function () { ors(); decorate(); };

  const original = window.openPost;
  window.openPost = function (i, noHash) {
    original(i, noHash);
    const p = typeof POSTS !== 'undefined' ? POSTS[i] : null; if (!p) return;
    const box = document.getElementById('mContent');
    if (p.video_url && !p.cover) document.getElementById('mCover').innerHTML = `<div class="pb-video" style="margin:0">${embed(p.video_url)}</div>`;
    else if (p.video_url) box.insertAdjacentHTML('afterbegin', `<div class="pb pb-video" style="margin-top:0">${embed(p.video_url)}</div>`);
    if (Array.isArray(p.blocks) && p.blocks.length) box.insertAdjacentHTML('beforeend', p.blocks.map(block).join(''));
    autoEmbed(box);
    box.querySelectorAll('.pb-gallery a[data-full], .pb-image img').forEach(a => {
      if (a.closest('a[href]')) return;
      a.style.cursor = 'zoom-in';
      a.onclick = () => { lb.querySelector('img').src = a.dataset.full || a.src; lb.classList.add('open'); };
    });
  };
  const oc = window.closePost;
  window.closePost = function () { document.querySelectorAll('#modal iframe, #modal video').forEach(f => f.remove()); oc(); };

  // Cards: use the YouTube thumbnail as cover when a post has a video but no cover image
  const orp = window.renderPosts;
  window.renderPosts = function () {
    orp();
    document.querySelectorAll('#posts .post').forEach(card => {
      const i = +(card.getAttribute('onclick') || '').replace(/\D/g, ''); const p = POSTS[i];
      if (!p || p.cover || !p.video_url) return;
      const y = String(p.video_url).match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
      const c = card.querySelector('.cover'); if (!c) return;
      c.classList.add('has-img');
      const big = c.querySelector('.big'); if (big) big.remove();
      c.insertAdjacentHTML('afterbegin', (y ? `<img src="https://i.ytimg.com/vi/${y[1]}/hqdefault.jpg" alt="" loading="lazy">` : '') +
        '<span style="position:absolute;inset:0;display:grid;place-items:center;z-index:1"><span style="width:58px;height:58px;border-radius:50%;background:rgba(0,0,0,.55);display:grid;place-items:center;color:#fff;font-size:1.3rem;padding-left:4px">&#9654;</span></span>');
    });
  };
  if (typeof POSTS !== 'undefined' && POSTS.length) window.renderPosts();
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape') lb.classList.remove('open'); });
})();
