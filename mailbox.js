(() => {
  const mailbox=state.mailbox=Object.assign({letters:[],lastDailyDay:0},state.mailbox||{});
  let filter='all',selectedId=null;
  const icons={cafe:'☕',friend:'💌',village:'📮',gift:'🎁'};
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function add(letter){
    if(!letter?.id||mailbox.letters.some(item=>item.id===letter.id))return false;
    mailbox.letters.unshift(Object.assign({day:state.day,read:false,claimed:false,category:'village',sender:'Honeybell Post'},letter));
    mailbox.letters=mailbox.letters.slice(0,60);
    save();updateMailboxBadge();return true;
  }
  function addCafeReport(report={}){
    const day=report.day||state.day,rating=report.rating??state.lastReputationDay?.rating??0,served=report.served??state.lastReputationDay?.served??0,perfect=report.perfect??state.lastReputationDay?.perfect??0;
    add({id:`cafe-report-${day}`,category:'cafe',sender:'Honeybell Café Ledger',subject:`Day ${day} café report`,preview:`${served} customers served · ${rating} stars`,body:`Today Honeybell Bakery served ${served} customer${served===1?'':'s'}. ${perfect} order${perfect===1?' was':'s were'} completed perfectly, and the café earned a ${rating}-star review. Keep improving quality, speed, cleanliness, and friendship to grow your reputation.`});
  }
  function friendshipSnapshot(){
    const special=Object.entries(state.visitorRelations||{}).sort((a,b)=>(b[1].friendship||0)-(a[1].friendship||0))[0];
    if(special){const names={hazel:'Grandma Hazel',lily:'Lily',maple:'Professor Maple'};return {name:names[special[0]]||special[0],points:special[1].friendship||0}}
    const npc=[...(state.npcs||[])].sort((a,b)=>(b.friendship||0)-(a.friendship||0))[0];
    return {name:npc?.name||'Poppy',points:(npc?.friendship||1)*20};
  }
  function createDailyMail(){
    if(mailbox.lastDailyDay===state.day)return;
    mailbox.lastDailyDay=state.day;
    const friend=friendshipSnapshot(),giftDay=state.day%3===0;
    add({id:`friend-${state.day}`,category:'friend',sender:friend.name,subject:giftDay?'A little thank-you gift':'A note from your friend',preview:giftDay?'There is something tucked inside!':'The village feels brighter with you here.',body:`Hello ${state.player?.name||'Baker'}! I wanted to thank you for bringing such a warm bakery to Honeybell. Our friendship is growing, and I hope we can share another peaceful day soon.${giftDay?' I tucked in a few friendship stars for you.':''}`,gift:giftDay?{stars:2,label:'2 friendship stars'}:null});
    add({id:`notice-${state.day}`,category:'village',sender:'Honeybell Village Board',subject:state.day%7===6?'Weekend village events':'Today around Honeybell',preview:state.day%7===6?'Festival crowds and park activities are expected.':'Shops, friendships, and park activities are ready.',body:state.day%7===6?'The village expects a busy weekend. Willow Park has games and tea parties, while the bakery may receive festival visitors. Remember that the bakery closes at 7:00 PM.':'Visit friends, check the market for ingredients and cleaning supplies, tend the park gardens, or open the bakery when you are ready. The bakery closes at 7:00 PM.'});
    if(state.lastReputationDay)addCafeReport({...state.lastReputationDay,day:state.lastCafeReportDay||Math.max(1,state.day-1)});
    save();
  }
  function filtered(){return mailbox.letters.filter(letter=>filter==='all'||letter.category===filter)}
  function unread(){return mailbox.letters.filter(letter=>!letter.read).length}
  function giftMarkup(letter){
    if(!letter.gift)return'';
    return `<button class="mail-gift ${letter.claimed?'claimed':''}" data-mail-claim="${esc(letter.id)}" ${letter.claimed?'disabled':''}><span>🎁</span><b>${letter.claimed?'Gift collected':esc(letter.gift.label)}</b><small>${letter.claimed?'Safely added to your inventory':'Open attachment'}</small></button>`;
  }
  function render(){
    createDailyMail();
    const letters=filtered(),selected=mailbox.letters.find(letter=>letter.id===selectedId)||letters[0];
    selectedId=selected?.id||null;
    modal(`<div class="cottage-mailbox"><header><div><small>ROSEMARY COTTAGE POST</small><h2>Your Mailbox</h2><p>${unread()} unread letter${unread()===1?'':'s'} · Spring Day ${state.day}</p></div><span class="mailbox-stamp">HB<br>POST</span></header><nav>${[['all','All mail'],['cafe','Café'],['friend','Friends'],['village','Village']].map(([id,label])=>`<button data-mail-filter="${id}" class="${filter===id?'active':''}">${label}<i>${id==='all'?unread():mailbox.letters.filter(item=>item.category===id&&!item.read).length}</i></button>`).join('')}<button data-mail-read-all>Read all</button></nav><div class="mailbox-layout"><aside>${letters.length?letters.map(letter=>`<button class="mail-list-item ${letter.id===selectedId?'selected':''} ${letter.read?'':'unread'}" data-mail-open="${esc(letter.id)}"><i>${icons[letter.category]||'✉'}</i><span><small>${esc(letter.sender)} · Day ${letter.day}</small><b>${esc(letter.subject)}</b><em>${esc(letter.preview||letter.body)}</em></span>${letter.gift&&!letter.claimed?'<strong>🎁</strong>':''}</button>`).join(''):'<div class="mail-empty">No letters in this section yet.</div>'}</aside><article>${selected?`<div class="mail-letter-heading"><i>${icons[selected.category]||'✉'}</i><div><small>FROM ${esc(selected.sender).toUpperCase()}</small><h3>${esc(selected.subject)}</h3><span>Spring Day ${selected.day}</span></div></div><p>${esc(selected.body)}</p>${giftMarkup(selected)}<footer><button data-mail-archive="${esc(selected.id)}">Archive letter</button></footer>`:'<div class="mail-empty"><b>📭</b>Select a letter to read it.</div>'}</article></div></div>`);
    if(selected&&!selected.read){selected.read=true;save();setTimeout(updateMailboxBadge,0)}
  }
  function claim(id){
    const letter=mailbox.letters.find(item=>item.id===id);if(!letter?.gift||letter.claimed)return;
    if(letter.gift.coins)state.coins+=letter.gift.coins;
    if(letter.gift.stars)state.stars+=letter.gift.stars;
    Object.entries(letter.gift.items||{}).forEach(([name,count])=>state.inventory[name]=(state.inventory[name]||0)+count);
    letter.claimed=true;updateHUD();save();toast(`${letter.gift.label} collected`);render();
  }
  function updateMailboxBadge(){
    const object=[...document.querySelectorAll('.physical-object')].find(item=>item.querySelector('.object-name')?.textContent.trim()==='Mailbox');
    if(!object)return;const count=unread();object.classList.toggle('mailbox-has-mail',count>0);object.dataset.unreadMail=String(count);
  }

  const previousRender=renderRoom;
  renderRoom=function(){previousRender();setTimeout(updateMailboxBadge,0)};
  const previousInteract=interactPhysical;
  interactPhysical=function(object){
    const name=object?.querySelector('.object-name')?.textContent.trim()||'',action=object?.dataset.actionName||'';
    if(current==='cottage'&&currentTab==='Exterior'&&(name==='Mailbox'||action==='Check Mail')){render();return}
    previousInteract(object);
  };
  document.addEventListener('click',event=>{
    const open=event.target.closest('[data-mail-open]');if(open){selectedId=open.dataset.mailOpen;const letter=mailbox.letters.find(item=>item.id===selectedId);if(letter)letter.read=true;save();render();return}
    const tab=event.target.closest('[data-mail-filter]');if(tab){filter=tab.dataset.mailFilter;selectedId=null;render();return}
    if(event.target.closest('[data-mail-read-all]')){mailbox.letters.forEach(letter=>letter.read=true);save();render();return}
    const gift=event.target.closest('[data-mail-claim]');if(gift){claim(gift.dataset.mailClaim);return}
    const archive=event.target.closest('[data-mail-archive]');if(archive){mailbox.letters=mailbox.letters.filter(letter=>letter.id!==archive.dataset.mailArchive);selectedId=null;save();render()}
  });
  if(!mailbox.letters.length){
    add({id:'welcome-post',category:'village',day:1,sender:'Mayor Poppy',subject:'Welcome to Honeybell!',preview:'Your cottage mailbox is ready.',body:'Welcome to your new home! This mailbox will receive café reports, letters from friends, village announcements, event invitations, and occasional gifts. Check it whenever the little red notification appears.',gift:{coins:50,label:'Welcome gift · 50 coins'}});
  }
  window.honeybellMail={open:render,add,addCafeReport,updateBadge:updateMailboxBadge};
})();
