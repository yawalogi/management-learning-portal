const {lessons,cards,resources}=window.PORTAL;
const main=document.querySelector('main'),nav=document.querySelector('#lessons'),dialog=document.querySelector('dialog');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageUrl=c=>'slides/lesson-'+c.lesson+'-slide-'+c.slide+'.png?v=4';
const youtubeId=url=>{try{const u=new URL(url);return u.searchParams.get('v')||u.pathname.match(/\/(?:live|shorts|embed)\/([^/?]+)/)?.[1]||(u.hostname==='youtu.be'?u.pathname.slice(1):null)}catch{return null}};
const titles=['人が動ける言葉','自分マネジメント','自分の軸','他者尊重と自分軸','問題解決','課題と私のビジョン','建設的な対話','根拠をもって伝える'];
function row(c){
 const links=c.links.map(link=>({link,target:cards.find(t=>t.id===link.id)}));
 return `<article class="topic-row" id="topic-${c.id}" tabindex="-1" aria-labelledby="title-${c.id}"><div class="slide-column"><button class="thumb" data-image="${c.id}" aria-label="${esc(c.title)}のスライドを拡大"><img src="${imageUrl(c)}" alt="第${c.lesson}回 スライド${c.slide}：${esc(c.title)}" width="1200" height="900" loading="lazy"><span class="enlarge">＋ 拡大する</span></button><p class="slide-caption">第${c.lesson}回・スライド ${c.slide}</p></div><div class="lecture-column"><h3 id="title-${c.id}">${esc(c.title)}</h3><p>${esc(c.body[0])}</p><details><summary><span class="expand-label">もっと読む ＋</span><span class="collapse-label">閉じる −</span><span class="sr-only">：${esc(c.title)}</span></summary><div class="expanded-copy">${c.body.slice(1).map(p=>'<p>'+esc(p)+'</p>').join('')}</div></details></div><aside class="connections" aria-label="この話はここにつながる"><p class="mobile-label">この話は、ここにつながる</p>${links.map(({link,target:t})=>`<a class="connection" href="#topic-${t.id}"><span class="rel">第${t.lesson}回 · ${t.lesson<c.lesson?'前の学びを振り返る':t.lesson>c.lesson?'この先で使う':'同じ回で深める'}</span><span class="link-title">${esc(t.title)} →</span><span class="why">${esc(link.why)}</span></a>`).join('')}</aside></article>`;
}
function resourceLinks(l){
 const r=resources[l.n];
 return `<div class="resource-links"><a class="video-button" data-video-window="lecture-${l.n}" href="${esc(r.video)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> 講義アーカイブ動画</a><a class="video-button feedback" data-video-window="feedback-${l.n}" href="${esc(r.feedback)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span> FB回アーカイブ動画</a><a class="materials" href="${esc(r.materials)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">⇩</span> 資料ダウンロード</a></div>`;
}
nav.innerHTML=lessons.map(l=>`<a href="#lesson-${l.n}"><span class="nav-number">第${l.n}回</span><span class="nav-title">${titles[l.n-1]}</span></a>`).join('')+`<a class="next-nav" href="#next-learning"><span class="nav-number">NEXT</span><span class="nav-title">次に学ぶなら</span></a>`;
const nextLearning=`<section class="next-learning" id="next-learning" aria-labelledby="next-learning-title"><div class="next-heading"><p>NEXT LEARNING</p><h2 id="next-learning-title">次に学ぶなら</h2></div><a class="next-card" href="https://www.reservestock.jp/events/YWM3ZTJlMjI3N" target="_blank" rel="noopener noreferrer"><img src="assets/ai-backend-header.png" width="1680" height="945" alt="生成AIとつくる、提案・戦略・報告"><div class="next-copy"><p class="next-label">AIバックエンドのご案内</p><h3>生成AIとつくる、提案・戦略・報告</h3><p>管理職バックエンドで培った「考えを言葉にし、人を通して成果を出す」力を、生成AIとともに提案・戦略・報告へ展開する実践講座です。複雑な仕事を整理し、自分の思考を保ったままAIと成果物に仕上げる方法を学びます。</p><span class="next-button">詳しく見る ↗</span></div></a></section>`;
main.innerHTML=lessons.map(l=>`<section class="lesson-section" id="lesson-${l.n}" aria-labelledby="lesson-title-${l.n}"><div class="lesson-head"><div class="lesson-name"><p class="lesson-number">LESSON ${String(l.n).padStart(2,'0')} <span class="phase">${l.phase<0?'講座全体の入口':['どう感じるか','どう考えるか','どう伝えるか'][l.phase]}</span></p><h2 id="lesson-title-${l.n}">第${l.n}回　${esc(l.title)}</h2></div>${resourceLinks(l)}</div><p class="lesson-intro">${esc(l.intro)}</p>${l.n===8?'<div class="pending-note"><span class="pending-tag">講義後に追加</span><h3>キースライドと、講師の言葉から</h3><p>第8回は講義骨子をもとに位置づけを紹介しています。スライドと書き起こしが揃い次第、3つのキーポイントを追加します。</p><p class="resource-note">動画・資料は、公開や追加の状況に応じてリンク先でご確認ください。</p></div>':'<div class="columns-labels" aria-hidden="true"><span>キースライド</span><span>講師の言葉から</span><span>この話は、ここにつながる</span></div>'+cards.filter(c=>c.lesson===l.n).map(row).join('')}<div class="lesson-bridge"><h3>この回がつなぐもの</h3><p>${esc(l.bridge)}</p></div></section>`).join('')+nextLearning;
main.addEventListener('click',e=>{
 const video=e.target.closest('[data-video-window]');
 if(video){
  const id=youtubeId(video.href);
  if(id){e.preventDefault();window.open('https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?autoplay=1&rel=0',video.dataset.videoWindow,'popup,width=1200,height=760,noopener,noreferrer')}
  return;
 }
 const b=e.target.closest('[data-image]');if(!b)return;
 const c=cards.find(c=>c.id===b.dataset.image);
 document.querySelector('#large-slide').src=imageUrl(c);
 document.querySelector('#large-slide').alt=c.title;
 document.querySelector('#image-title').textContent='第'+c.lesson+'回・スライド'+c.slide+'　'+c.title;
 dialog.showModal();
});
document.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function followHash(){
 let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
 const target=document.getElementById(id);if(!target)return;
 if(id.startsWith('topic-')){target.querySelector('details').open=true;target.focus({preventScroll:true})}
 target.scrollIntoView({block:'start',behavior:'auto'});
}
window.addEventListener('hashchange',followHash);
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a&&a.getAttribute('href')===location.hash){e.preventDefault();followHash()}});
let scheduled=false;
function updateNav(){
 scheduled=false;let current='lesson-1';
 const threshold=document.querySelector('.navigation').getBoundingClientRect().height+70;
 document.querySelectorAll('.lesson-section,.next-learning').forEach(s=>{if(s.getBoundingClientRect().top<=threshold)current=s.id});
 nav.querySelectorAll('a').forEach(a=>{if(a.getAttribute('href')==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
}
window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateNav)}},{passive:true});
new ResizeObserver(entries=>{document.documentElement.style.setProperty('--nav-height',entries[0].target.offsetHeight+'px')}).observe(document.querySelector('.navigation'));
window.addEventListener('load',()=>{followHash();updateNav()});
updateNav();
