import {dateStart, dayKey, slotAt, slotsForDay, matchesFilter} from './schedule.mjs?v=4';
const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let data;
let mode = 'all';
const offset = () => Number($('timezone').value);
const filters = () => ({mode, cost:$('cost').value, environment:$('environment').value, map:$('map').value});
const modeName = value => value === 'rated' ? '分級戰' : '快速戰';

function clock(instant) {
  return new Date(instant + offset()*60000).toISOString().slice(11,16);
}

function timeRange(slot) {return `${clock(slot.start)}–${clock(slot.end)}`;}

function matchCard(match, compact = false) {
  const situation = data.situations?.[match.situationId];
  const random = match.maps.length > 1;
  const title = random ? (match.environment === 'space' ? '宇宙隨機' : '地上隨機') : data.maps[match.maps[0]];
  const chips = match.maps.map(code => `<span class="${String(code)===$('map').value?'selected':''}">${escape(data.maps[code] || `地圖 ${code}`)}</span>`).join('');
  const tag = match.restriction || (match.weekend ? '週末限定戰' : match.special ? '特殊場次' : '');
  const roster = situation ? `<details><summary>情境機體 · A／B 隊</summary>${Object.entries(situation.teams).map(([team, units])=>`<p class="small" style="margin-top:8px">${escape(team)} 隊</p><div class="pool">${units.map(unit=>`<span>${escape(unit.name)} · COST ${unit.cost}</span>`).join('')}</div>`).join('')}<p class="small" style="margin-top:8px">系統配發固定機體，採用情境專用性能。</p></details>` : '';
  return `<div class="${compact?'compact-match':'match'}"><div><div class="cost-title mono">${situation?'出擊機體':'COST'}</div><div class="cost mono ${match.cost===0?'unlimited':''}">${situation?'固定機體':match.cost||'無限制'}</div></div><div>${situation?`<div class="map-title">${escape(situation.title)}</div><div class="small muted">${escape(title)}</div>`:`<div class="map-title">${escape(title)}</div>`}<div class="match-meta"><span>${match.environment==='space'?'宇宙':'地上'}</span><span>${match.teamSize} 對 ${match.teamSize}</span><span>${escape(match.rule)}</span>${tag?`<span class="tag special">${escape(tag)}</span>`:''}</div>${random?`<details><summary>候選地圖 · ${match.maps.length} 張</summary><div class="pool">${chips}</div></details>`:''}${roster}</div></div>`;
}

function groups(matches, current = false) {
  return ['rated','quick'].filter(value => mode==='all'||mode===value).map(value => {
    const entries = matches.filter(match=>match.mode===value);
    if (current) return `<div class="mode-panel ${value}"><div class="panel-heading"><h3>${modeName(value)}</h3><span class="small muted">${entries.length} 個場次</span></div>${entries.length?entries.map(match=>matchCard(match)).join(''):'<p class="empty">此時段沒有符合篩選的場次。</p>'}</div>`;
    return `<div class="${value}-group"><h3 class="group-title">${modeName(value)} · ${entries.length}</h3>${entries.length?entries.map(match=>matchCard(match,true)).join(''):'<p class="small muted">沒有符合的場次</p>'}</div>`;
  }).join('');
}

function renderCurrent() {
  const now = Date.now();
  const slot = slotAt(data,now);
  $('current-time').textContent = timeRange(slot);
  $('current').innerHTML = groups(matchesFilter(slot.matches,filters()),true);
  $('current').classList.toggle('single',mode!=='all');
  const minutes = Math.max(1,Math.ceil((slot.end-now)/60000));
  $('countdown').innerHTML = `下次切換 <strong class="mono">${clock(slot.end)}</strong> · 約 ${minutes} 分鐘後`;
}

function renderDay() {
  const date = $('date').value;
  const slots = slotsForDay(data,date,offset(),filters());
  const weekday = new Date(date+'T00:00:00Z').getUTCDay();
  $('day-label').textContent = `${date} 星期${'日一二三四五六'[weekday]}`;
  $('result-count').textContent = `${slots.length} 個時段 · ${slots.reduce((sum,slot)=>sum+slot.matches.length,0)} 個場次`;
  $('timeline').innerHTML = slots.length ? slots.map(slot => {
    const active = Date.now()>=slot.start&&Date.now()<slot.end;
    const from = dayKey(slot.start,offset());
    const to = dayKey(slot.end,offset());
    const label = from<date?'前日開始':to>date?'跨至翌日':'';
    return `<article class="time-row${active?' active':''}"><div class="time-label"><div>${label?`<div class="date-fragment">${label}</div>`:''}<span class="mono">${timeRange(slot)}</span></div>${active?'<span class="tag">目前時段</span>':''}</div><div class="timeline-groups${mode!=='all'?' single':''}">${groups(slot.matches)}</div></article>`;
  }).join('') : '<p class="empty">此日期沒有符合篩選的場次。試試其他 COST 或地圖，或清除篩選。</p>';
}

function render() {
  try {renderCurrent();renderDay();$('status').hidden=true;}
  catch(error) {$('status').hidden=false;$('status').className='error';$('status').textContent=error.message;}
}

function populate(select, values) {
  for(const [value,label] of values) {
    const option=document.createElement('option');option.value=String(value);option.textContent=label;select.append(option);
  }
}

async function start() {
  const response=await fetch('schedule-data.json?v=4', {cache:'no-cache'});
  if(!response.ok) throw new Error('排程資料讀取失敗，請重新整理。');
  data=await response.json();
  if(data.schemaVersion!==1||!/^\d{8}$/.test(data.version)||data.scheduleOffsetMinutes!==540||!data.modes?.rated||!data.modes?.quick) throw new Error('排程資料格式不正確。');
  for(const element of document.querySelectorAll('[data-version]')) element.textContent=data.version;
  $('data-date').textContent=`${dayKey(Date.parse(data.updatedAt),540)} 資料 · 日本時間基準已實機核對`;
  const entries=Object.values(data.modes).flatMap(blocks=>blocks[0].days.flat());
  populate($('cost'),[...new Set(entries.map(row=>row.cost))].sort((a,b)=>a-b).map(value=>[value,value===0?'無限制／固定機體':String(value)]));
  const mapIds=[...new Set(entries.flatMap(row=>row.maps))];
  populate($('map'),mapIds.map(id=>[id,data.maps[id]]).sort((a,b)=>a[1].localeCompare(b[1],'zh-Hant')));
  $('date').value=dayKey(Date.now(),offset());
  for(const button of document.querySelectorAll('[data-mode]')) button.addEventListener('click',()=>{
    mode=button.dataset.mode;
    for(const other of document.querySelectorAll('[data-mode]')) other.setAttribute('aria-pressed',String(other===button));
    render();
  });
  for(const id of ['cost','environment','map','date']) $(id).addEventListener('change',render);
  $('timezone').addEventListener('change',render);
  $('reset').addEventListener('click',()=>{
    for(const id of ['cost','environment','map']) $(id).value='all';
    document.querySelector('[data-mode="all"]').click();
  });
  const moveDay=days=>{$('date').value=dayKey(dateStart($('date').value,0)+days*86400000,0);render();};
  $('previous').addEventListener('click',()=>moveDay(-1));
  $('next').addEventListener('click',()=>moveDay(1));
  $('today').addEventListener('click',()=>{$('date').value=dayKey(Date.now(),offset());render();});
  $('current-section').hidden=false;$('day-section').hidden=false;
  render();
  // Query the same snapshot and filtering logic when the browser supports WebMCP.
  const context=document.modelContext;
  if(context?.registerTool) {
    const lifecycle=new AbortController();
    const tool={name:'query_ps_match_schedule',title:'查詢 PS 出擊時刻表',
      description:'Read predicted rated and quick match costs and map pools for a date from the current PS snapshot.',
      inputSchema:{type:'object',properties:{date:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},timezone:{type:'string',enum:['taipei','tokyo','utc']},mode:{type:'string',enum:['all','rated','quick']},cost:{type:'integer',minimum:0,maximum:750},map:{type:'integer'}},required:['date'],additionalProperties:false},
      annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute(input){
        if(!input||typeof input!=='object'||Array.isArray(input)) throw new Error('查詢格式錯誤。');
        if(Object.keys(input).some(key=>!['date','timezone','mode','cost','map'].includes(key))) throw new Error('不支援的查詢欄位。');
        const zones={taipei:480,tokyo:540,utc:0};
        if(input.timezone!==undefined&&!Object.hasOwn(zones,input.timezone)) throw new Error('不支援的時區。');
        if(input.mode!==undefined&&!['all','rated','quick'].includes(input.mode)) throw new Error('不支援的模式。');
        if(input.cost!==undefined&&(!Number.isInteger(input.cost)||!entries.some(row=>row.cost===input.cost))) throw new Error('不支援的 COST。');
        if(input.map!==undefined&&(!Number.isInteger(input.map)||!mapIds.includes(input.map))) throw new Error('不支援的地圖。');
        const query={mode:input.mode??'all',cost:input.cost===undefined?'all':String(input.cost),map:input.map===undefined?'all':String(input.map)};
        return {version:data.version,predicted:true,slots:slotsForDay(data,input.date,zones[input.timezone??'taipei'],query).map(slot=>({start:new Date(slot.start).toISOString(),end:new Date(slot.end).toISOString(),matches:slot.matches.map(row=>({mode:row.mode,cost:row.cost,rule:row.rule,teamSize:row.teamSize,maps:row.maps.map(id=>({id,name:data.maps[id]})),special:row.special,restriction:row.restriction,situation:data.situations?.[row.situationId]??null}))}))};
      }};
    try {Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});} catch {}
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
  // The data remains a fixed snapshot; this timer only advances the displayed time slot.
  setInterval(render,60000);
}

start().catch(error=>{$('status').className='error';$('status').textContent=error.message;});
