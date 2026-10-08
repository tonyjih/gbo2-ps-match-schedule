const HOUR = 3600000;
const DAY = 24 * HOUR;

export function dayKey(instant, offsetMinutes) {
  return new Date(instant + offsetMinutes * 60000).toISOString().slice(0, 10);
}

export function dateStart(date, offsetMinutes) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('請選擇有效日期。');
  const stamp = Date.parse(date + 'T00:00:00Z');
  if (!Number.isFinite(stamp) || dayKey(stamp, 0) !== date) throw new Error('請選擇有效日期。');
  return stamp - offsetMinutes * 60000;
}

export function slotAt(data, instant) {
  if (!Number.isFinite(instant)) throw new Error('時間格式錯誤。');
  const shifted = instant + data.scheduleOffsetMinutes * 60000;
  const native = new Date(shifted);
  const start = Math.floor(shifted / (2 * HOUR)) * 2 * HOUR - data.scheduleOffsetMinutes * 60000;
  const hour = Math.floor(native.getUTCHours() / 2) * 2;
  const day = native.getUTCDay();
  const matches = [];
  for (const [mode, blocks] of Object.entries(data.modes)) {
    // Native client uses a matching seven-day WEEK block, otherwise block 1.
    let block = blocks[0];
    for (const candidate of blocks) {
      const anchor = dateStart(candidate.anchor, data.scheduleOffsetMinutes);
      if (instant >= anchor && instant < anchor + 7 * DAY) block = candidate;
    }
    const entries = block.days[day].filter(entry => entry.hour === hour).slice(0, 4).filter(entry => {
      const activity = data.activities?.[entry.activityKey];
      return !activity || activity.windows === null || activity.windows.some(([begin, end]) => instant >= Date.parse(begin) && instant < Date.parse(end));
    });
    matches.push(...entries.map(entry => ({...entry, mode})));
  }
  return {start, end: start + 2 * HOUR, matches};
}

export function matchesFilter(matches, {mode = 'all', cost = 'all', environment = 'all', map = 'all'} = {}) {
  return matches.filter(match => (mode === 'all' || match.mode === mode)
    && (cost === 'all' || match.cost === Number(cost))
    && (environment === 'all' || match.environment === environment)
    && (map === 'all' || match.maps.includes(Number(map))));
}

export function slotsForDay(data, date, offsetMinutes, filters = {}) {
  const begin = dateStart(date, offsetMinutes);
  const end = begin + DAY;
  const result = [];
  for (let start = slotAt(data, begin).start; start < end; start += 2 * HOUR) {
    const slot = slotAt(data, start);
    const matches = matchesFilter(slot.matches, filters);
    if (matches.length) result.push({...slot, matches});
  }
  return result;
}
