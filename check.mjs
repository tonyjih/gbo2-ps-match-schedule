import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dateStart, dayKey, slotAt, slotsForDay, matchesFilter} from './schedule.mjs';
import {languages, messages, gameNames, translate, gameName, chooseLanguage} from './i18n.mjs';
const text = readFileSync(process.argv[2] ?? new URL('./schedule-data.json', import.meta.url), 'utf8');
const data = JSON.parse(text);
const keys = (value, allowed) => assert.deepEqual(Object.keys(value).sort(), allowed.split(' ').sort());
keys(data, 'schemaVersion version updatedAt scheduleOffsetMinutes maps modes situations activities');
assert.equal(data.schemaVersion, 1);
assert.equal(typeof data.version, 'string');
assert.match(data.version, /^[0-9]{8}$/);
assert.ok(Number.isFinite(Date.parse(data.updatedAt)));
assert.equal(data.scheduleOffsetMinutes, 540);
assert.ok(!/https?:|\.tss\b|\.cpk\b|NPWR[0-9]|[a-f0-9]{64}/i.test(text), 'Public JSON contains source/download metadata');
keys(data.modes, 'rated quick');
const usedMaps = new Set(), usedActivities = new Set(), usedSituations = new Set();
for (const blocks of Object.values(data.modes)) {
  assert.ok(blocks.length >= 1 && blocks.length <= 2);
  for (const block of blocks) {
    keys(block, 'anchor days');
    dateStart(block.anchor, 540);
    assert.equal(new Date(block.anchor + 'T00:00:00Z').getUTCDay(), 0);
    assert.equal(block.days.length, 7);
    for (const day of block.days) {
      assert.deepEqual([...new Set(day.map(row => row.hour))].sort((a,b) => a-b), Array.from({length:12}, (_,i) => i*2));
      for (const row of day) {
        keys(row, 'hour rule cost teamSize maps environment special weekend restriction situationId activityKey');
        assert.ok(Number.isInteger(row.hour) && row.hour >= 0 && row.hour < 24 && row.hour % 2 === 0);
        assert.ok(typeof row.rule === 'string' && row.rule.length);
        assert.ok(Number.isInteger(row.cost) && row.cost >= 0 && row.cost <= 1000);
        assert.ok(Number.isInteger(row.teamSize) && row.teamSize >= 1 && row.teamSize <= 6);
        assert.ok(row.maps.length >= 1 && row.maps.length <= 8 && new Set(row.maps).size === row.maps.length);
        for (const id of row.maps) {
          assert.ok(Number.isInteger(id) && typeof data.maps[id] === 'string' && data.maps[id].length);
          assert.equal(row.environment, id >= 50000 ? 'space' : 'ground');
          usedMaps.add(String(id));
        }
        assert.equal(typeof row.special, 'boolean');
        assert.equal(typeof row.weekend, 'boolean');
        assert.ok(['', '泛用機限定', '突擊機限定', '支援機限定'].includes(row.restriction));
        assert.ok(Number.isInteger(row.situationId) && row.situationId >= 0);
        assert.equal(typeof row.activityKey, 'string');
        if (row.activityKey) { assert.ok(data.activities[row.activityKey]); usedActivities.add(row.activityKey); }
        if (row.restriction || row.situationId) assert.ok(row.activityKey);
        if (row.situationId) {
          const situation = data.situations[row.situationId];
          assert.ok(situation);
          for (const team of Object.values(situation.teams)) assert.equal(team.length, row.teamSize);
          usedSituations.add(String(row.situationId));
        }
      }
    }
  }
}
assert.deepEqual(Object.keys(data.maps).sort(), [...usedMaps].sort());
assert.deepEqual(Object.keys(data.activities).sort(), [...usedActivities].sort());
assert.deepEqual(Object.keys(data.situations).sort(), [...usedSituations].sort());
for (const situation of Object.values(data.situations)) {
  keys(situation, 'title teams'); keys(situation.teams, 'A B');
  assert.ok(typeof situation.title === 'string' && situation.title.length);
  for (const team of Object.values(situation.teams)) for (const unit of team) {
    keys(unit, 'name cost');
    assert.ok(typeof unit.name === 'string' && unit.name.length);
    assert.ok(Number.isInteger(unit.cost) && unit.cost >= 0 && unit.cost <= 1000);
  }
}
for (const activity of Object.values(data.activities)) {
  keys(activity, 'windows');
  if (activity.windows === null) continue; // Explicitly unverified; use native weekly rotation.
  assert.ok(Array.isArray(activity.windows) && activity.windows.length > 0);
  for (const window of activity.windows) {
    assert.equal(window.length, 2);
    assert.ok(Number.isFinite(Date.parse(window[0])) && Date.parse(window[0]) < Date.parse(window[1]));
  }
}
const at = Date.parse('2026-10-04T13:59:01Z'), slot = slotAt(data, at);
assert.equal(slot.start, Date.parse('2026-10-04T13:00:00Z'));
assert.equal(slot.end, Date.parse('2026-10-04T15:00:00Z'));
if (data.version === '02132278') {
  const rated = slot.matches.find(row => row.mode === 'rated');
  assert.deepEqual([rated.cost, rated.teamSize, rated.rule, rated.maps], [300, 6, '基本戰', [50200]]);
  const limited = data.modes.quick[0].days[0].find(row => row.hour === 22 && row.restriction);
  assert.deepEqual([limited.restriction, limited.cost, limited.teamSize, limited.maps], ['支援機限定', 500, 4, [10500]]);
  assert.equal(data.situations['85'].title, '超越之力');
  assert.deepEqual(data.situations['85'].teams.A[0], {name:'蒼藍命運１號機', cost:500});
}
// Exercise period boundaries independently of announcements that may be extended.
const eventSample = {scheduleOffsetMinutes:540,
  modes:{quick:[{anchor:'2019-01-06',days:Array.from({length:7}, () => Array.from({length:12}, (_,i) => ({hour:i*2,activityKey:'test'})))}]},
  activities:{test:{windows:[['2026-10-03T15:00:00Z','2026-10-03T17:00:00Z']]}}};
assert.equal(slotAt(eventSample, Date.parse('2026-10-03T14:59:59Z')).matches.length, 0);
assert.equal(slotAt(eventSample, Date.parse('2026-10-03T15:00:00Z')).matches.length, 1);
assert.equal(slotAt(eventSample, Date.parse('2026-10-03T16:59:59Z')).matches.length, 1);
assert.equal(slotAt(eventSample, Date.parse('2026-10-03T17:00:00Z')).matches.length, 0);
assert.equal(slotAt(eventSample, Date.parse('2026-10-10T15:00:00Z')).matches.length, 0);
eventSample.activities.test.windows = null;
assert.equal(slotAt(eventSample, Date.parse('2026-10-10T15:00:00Z')).matches.length, 1);
const taipei = slotsForDay(data, '2026-10-04', 480);
assert.equal(taipei.length, 13);
assert.equal(dayKey(taipei[0].start, 480), '2026-10-03');
assert.equal(taipei.at(-1).end, Date.parse('2026-10-04T17:00:00Z'));
assert.equal(slotsForDay(data, '2026-10-04', 540).length, 12);
assert.throws(() => dateStart('2026-02-30', 480));
assert.throws(() => dateStart('2026-10-04<script>', 480));
const random = data.modes.rated[0].days.flat().find(row => row.maps.length > 1);
assert.equal(matchesFilter([random], {map:String(random.maps[1])}).length, 1);
assert.equal(matchesFilter([random], {environment:random.environment === 'ground' ? 'space' : 'ground'}).length, 0);
assert.equal(matchesFilter([random], {cost:'999'}).length, 0);
for (const offset of [0, 480, 540]) for (const date of ['2026-10-04', '2026-12-31', '2027-01-01']) {
  for (const s of slotsForDay(data, date, offset)) {
    assert.equal(s.end - s.start, 7200000);
    for (const mode of ['rated', 'quick']) assert.ok(s.matches.filter(m => m.mode === mode).length <= 4);
  }
}
const rows = Object.values(data.modes).flatMap(blocks=>blocks.flatMap(block=>block.days.flat()));
const validText = (value,label) => assert.ok(typeof value==='string' && value.length && !/\uFFFD|@\w+\(/.test(value), `Missing or invalid translation: ${label}`);
assert.ok(!/https?:|\.tss\b|\.cpk\b|NPWR[0-9]|[a-f0-9]{64}/i.test(JSON.stringify(gameNames)), 'Translations contain source/download metadata');
for (const language of languages) {
  assert.deepEqual(Object.keys(messages[language]).sort(), Object.keys(messages['zh-Hant']).sort());
  for (const key of Object.keys(messages[language])) validText(translate(language,key),`${language}/messages/${key}`);
  if (language==='zh-Hant') continue;
  for (const id of Object.keys(data.maps)) validText(gameNames[language].maps[id],`${language}/maps/${id}`);
  for (const row of rows) {
    validText(gameNames[language].rules[row.rule],`${language}/rules/${row.rule}`);
    if (row.restriction) validText(gameNames[language].restrictions[row.restriction],`${language}/restrictions/${row.restriction}`);
  }
  for (const [id,situation] of Object.entries(data.situations)) {
    validText(gameName(language,'situations',id,situation.title),`${language}/situations/${id}`);
    for (const team of Object.values(situation.teams)) for (const unit of team) validText(gameName(language,'units',unit.name,unit.name),`${language}/units/${unit.name}`);
  }
}
assert.equal(translate('en','players',{size:5}), '5 vs 5');
assert.equal(gameName('zh-Hant','situations',999,'情境戰 ID 999'), '情境戰 ID 999');
assert.equal(gameName('ja','situations',999,'情境戰 ID 999'), 'シチュエーションバトル ID 999');
assert.equal(gameName('en','situations',999,'情境戰 ID 999'), 'Situation Battle ID 999');
assert.equal(gameName('en','situations',85,'超越之力'), 'The Power to Transcend');
assert.equal(gameName('en','units','未翻譯機體','未翻譯機體'), '未翻譯機體');
assert.equal(chooseLanguage('?lang=ja','en',['zh-TW']), 'ja');
assert.equal(chooseLanguage('?lang=invalid','en',['ja-JP']), 'en');
assert.equal(chooseLanguage('',null,['fr-FR','ja-JP']), 'ja');
assert.equal(chooseLanguage('',null,['en-US']), 'en');
assert.equal(chooseLanguage('',null,['zh-TW']), 'zh-Hant');
assert.equal(chooseLanguage('',null,['fr-FR']), 'zh-Hant');
console.log('PASS: public field allowlist, privacy, schedules, event windows, timezones, filters, three-language coverage and language selection.');
