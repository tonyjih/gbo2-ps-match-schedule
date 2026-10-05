import {dateStart, dayKey, slotAt, slotsForDay, matchesFilter} from './schedule.mjs?v=5';
import {languages, translate, gameName, chooseLanguage} from './i18n.mjs?v=5';
const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let data;
let entries = [], mapIds = [];
let savedLanguage;
try {savedLanguage=localStorage.getItem('gbo2-language');} catch {}
let language = chooseLanguage(location.search,savedLanguage,navigator.languages);
const t = (key,values) => translate(language,key,values);
const mapName = code => gameName(language,'maps',code,data.maps[code]);
let mode = 'all';
const offset = () => Number($('timezone').value);
const filters = () => ({mode, cost:$('cost').value, environment:$('environment').value, map:$('map').value});
const modeName = value => t(value);

function clock(instant) {
  return new Date(instant + offset()*60000).toISOString().slice(11,16);
}

function timeRange(slot) {return `${clock(slot.start)}–${clock(slot.end)}`;}

function matchCard(match, compact = false) {
  const situation = data.situations?.[match.situationId];
  const random = match.maps.length > 1;
  const title = random ? t(match.environment==='space'?'randomSpace':'randomGround') : mapName(match.maps[0]);
  const chips = match.maps.map(code => `<span class="${String(code)===$('map').value?'selected':''}">${escape(mapName(code))}</span>`).join('');
  const tag = match.restriction ? gameName(language,'restrictions',match.restriction,match.restriction) : match.weekend ? t('weekend') : match.special ? t('special') : '';
  const roster = situation ? `<details><summary>${t('roster')}</summary>${Object.entries(situation.teams).map(([team, units])=>`<p class="small" style="margin-top:8px">${t('team',{team})}</p><div class="pool">${units.map(unit=>`<span>${escape(gameName(language,'units',unit.name,unit.name))} · COST ${unit.cost}</span>`).join('')}</div>`).join('')}<p class="small" style="margin-top:8px">${t('rosterNote')}</p></details>` : '';
  return `<div class="${compact?'compact-match':'match'}"><div><div class="cost-title mono">${situation?t('sortieMs'):'COST'}</div><div class="cost mono ${match.cost===0?'unlimited':''}">${situation?t('fixedMs'):match.cost||t('unrestricted')}</div></div><div>${situation?`<div class="map-title">${escape(gameName(language,'situations',match.situationId,situation.title))}</div><div class="small muted">${escape(title)}</div>`:`<div class="map-title">${escape(title)}</div>`}<div class="match-meta"><span>${t(match.environment)}</span><span>${t('players',{size:match.teamSize})}</span><span>${escape(gameName(language,'rules',match.rule,match.rule))}</span>${tag?`<span class="tag special">${escape(tag)}</span>`:''}</div>${random?`<details><summary>${t('mapPool',{count:match.maps.length})}</summary><div class="pool">${chips}</div></details>`:''}${roster}</div></div>`;
}

function groups(matches, current = false) {
  return ['rated','quick'].filter(value => mode==='all'||mode===value).map(value => {
    const entries = matches.filter(match=>match.mode===value);
    if (current) return `<div class="mode-panel ${value}"><div class="panel-heading"><h3>${modeName(value)}</h3><span class="small muted">${t('matchCount',{count:entries.length})}</span></div>${entries.length?entries.map(match=>matchCard(match)).join(''):`<p class="empty">${t('currentEmpty')}</p>`}</div>`;
    return `<div class="${value}-group"><h3 class="group-title">${modeName(value)} · ${entries.length}</h3>${entries.length?entries.map(match=>matchCard(match,true)).join(''):`<p class="small muted">${t('empty')}</p>`}</div>`;
  }).join('');
}

function renderCurrent() {
  const now = Date.now();
  const slot = slotAt(data,now);
  $('current-time').textContent = timeRange(slot);
  $('current').innerHTML = groups(matchesFilter(slot.matches,filters()),true);
  $('current').classList.toggle('single',mode!=='all');
  const minutes = Math.max(1,Math.ceil((slot.end-now)/60000));
  $('countdown').innerHTML = t('countdown',{time:`<strong class="mono">${clock(slot.end)}</strong>`,minutes});
}

function renderDay() {
  const date = $('date').value;
  const slots = slotsForDay(data,date,offset(),filters());
  const weekday = new Intl.DateTimeFormat(language,{weekday:'long',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'));
  $('day-label').textContent = `${date} ${weekday}`;
  $('result-count').textContent = t('stats',{slots:slots.length,matches:slots.reduce((sum,slot)=>sum+slot.matches.length,0)});
  $('timeline').innerHTML = slots.length ? slots.map(slot => {
    const active = Date.now()>=slot.start&&Date.now()<slot.end;
    const from = dayKey(slot.start,offset());
    const to = dayKey(slot.end,offset());
    const label = from<date?t('previousDay'):to>date?t('nextDay'):'';
    return `<article class="time-row${active?' active':''}"><div class="time-label"><div>${label?`<div class="date-fragment">${label}</div>`:''}<span class="mono">${timeRange(slot)}</span></div>${active?`<span class="tag">${t('current')}</span>`:''}</div><div class="timeline-groups${mode!=='all'?' single':''}">${groups(slot.matches)}</div></article>`;
  }).join('') : `<p class="empty">${t('dayEmpty')}</p>`;
}

function render() {
  try {renderCurrent();renderDay();$('status').hidden=true;}
  catch {$('status').hidden=false;$('status').className='error';$('status').textContent=t('invalidDate');}
}

function populate(select, values) {
  const selected=select.value;
  select.length=1;
  for(const [value,label] of values) {
    const option=document.createElement('option');option.value=String(value);option.textContent=label;select.append(option);
  }
  select.value=[...select.options].some(option=>option.value===selected)?selected:'all';
}

function applyLanguage() {
  document.documentElement.lang=language;
  document.title=t('pageTitle');
  document.querySelector('meta[name="description"]').content=t('description');
  $('language').value=language;
  for(const element of document.querySelectorAll('[data-i18n]')) element.textContent=t(element.dataset.i18n);
  for(const element of document.querySelectorAll('[data-i18n-aria-label]')) element.setAttribute('aria-label',t(element.dataset.i18nAriaLabel));
  const official=`https://bo2.ggame.jp/${language==='ja'?'jp':language==='en'?'en':'tw'}/`;
  $('official-site').href=official;
  $('official-news').href=official+'info/';
  if(data) {
    $('data-date').textContent=t('dataDate',{date:dayKey(Date.parse(data.updatedAt),540)});
    populate($('cost'),[...new Set(entries.map(row=>row.cost))].sort((a,b)=>a-b).map(value=>[value,value===0?t('freeCost'):String(value)]));
    populate($('map'),mapIds.map(id=>[id,mapName(id)]).sort((a,b)=>a[1].localeCompare(b[1],language)));
  }
}

async function start() {
  applyLanguage();
  $('language').addEventListener('change',()=>{
    language=$('language').value;
    try {localStorage.setItem('gbo2-language',language);} catch {}
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
    applyLanguage();
    if(data) render();
    else if($('status').classList.contains('error')) $('status').textContent=t('fetchError');
  });
  const response=await fetch('schedule-data.json?v=5', {cache:'no-cache'});
  if(!response.ok) throw new Error(t('fetchError'));
  const snapshot=await response.json();
  if(snapshot.schemaVersion!==1||!/^\d{8}$/.test(snapshot.version)||snapshot.scheduleOffsetMinutes!==540||!snapshot.modes?.rated||!snapshot.modes?.quick) throw new Error(t('dataError'));
  data=snapshot;
  for(const element of document.querySelectorAll('[data-version]')) element.textContent=data.version;
  entries=Object.values(data.modes).flatMap(blocks=>blocks.flatMap(block=>block.days.flat()));
  mapIds=[...new Set(entries.flatMap(row=>row.maps))];
  applyLanguage();
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
    const tool={name:'query_ps_match_schedule',title:'PS Match Schedule',
      description:'Read predicted rated and quick match costs and map pools for a date from the current PS snapshot.',
      inputSchema:{type:'object',properties:{date:{type:'string',pattern:'^\\d{4}-\\d{2}-\\d{2}$'},language:{type:'string',enum:languages},timezone:{type:'string',enum:['taipei','tokyo','utc']},mode:{type:'string',enum:['all','rated','quick']},cost:{type:'integer',minimum:0,maximum:1000},map:{type:'integer'}},required:['date'],additionalProperties:false},
      annotations:{readOnlyHint:true,untrustedContentHint:false},
      execute(input){
        if(!input||typeof input!=='object'||Array.isArray(input)) throw new Error(t('invalidQuery'));
        if(Object.keys(input).some(key=>!['date','language','timezone','mode','cost','map'].includes(key))) throw new Error(t('invalidQuery'));
        const outputLanguage=input.language??language;
        if(!languages.includes(outputLanguage)) throw new Error(t('invalidQuery'));
        const zones={taipei:480,tokyo:540,utc:0};
        if(input.timezone!==undefined&&!Object.hasOwn(zones,input.timezone)) throw new Error(t('invalidQuery'));
        if(input.mode!==undefined&&!['all','rated','quick'].includes(input.mode)) throw new Error(t('invalidQuery'));
        if(input.cost!==undefined&&(!Number.isInteger(input.cost)||!entries.some(row=>row.cost===input.cost))) throw new Error(t('invalidQuery'));
        if(input.map!==undefined&&(!Number.isInteger(input.map)||!mapIds.includes(input.map))) throw new Error(t('invalidQuery'));
        try {dateStart(input.date,zones[input.timezone??'taipei']);}
        catch {throw new Error(translate(outputLanguage,'invalidDate'));}
        const query={mode:input.mode??'all',cost:input.cost===undefined?'all':String(input.cost),map:input.map===undefined?'all':String(input.map)};
        return {version:data.version,language:outputLanguage,predicted:true,slots:slotsForDay(data,input.date,zones[input.timezone??'taipei'],query).map(slot=>({start:new Date(slot.start).toISOString(),end:new Date(slot.end).toISOString(),matches:slot.matches.map(row=>({mode:row.mode,cost:row.cost,rule:gameName(outputLanguage,'rules',row.rule,row.rule),teamSize:row.teamSize,maps:row.maps.map(id=>({id,name:gameName(outputLanguage,'maps',id,data.maps[id])})),special:row.special,restriction:gameName(outputLanguage,'restrictions',row.restriction,row.restriction),situation:localizedSituation(row.situationId,outputLanguage)}))}))};
      }};
    try {Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});} catch {}
    window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
  // The data remains a fixed snapshot; this timer only advances the displayed time slot.
  setInterval(render,60000);
}

function localizedSituation(id,language) {
  const situation=data.situations?.[id];
  return situation?{title:gameName(language,'situations',id,situation.title),teams:Object.fromEntries(Object.entries(situation.teams).map(([team,units])=>[team,units.map(unit=>({...unit,name:gameName(language,'units',unit.name,unit.name)}))]))}:null;
}

start().catch(()=>{$('status').className='error';$('status').textContent=t('fetchError');});
