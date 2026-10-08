export const languages = ['zh-Hant', 'ja', 'en'];

export const messages = {
  'zh-Hant': {
    pageTitle:'GBO2 PS 出擊時刻表', title:'出擊時刻表', language:'語言', snapshot:'輪替快照',
    dataDate:'{date} 資料 · 日本時間基準已實機核對',
    all:'全部場次', rated:'分級戰', quick:'快速戰', clear:'清除篩選',
    filterLabel:'場次篩選', modeLabel:'戰鬥模式', cost:'COST', allCosts:'全部 COST', freeCost:'無限制／固定機體',
    environment:'戰場', both:'地上與宇宙', ground:'地上', space:'宇宙', mapLabel:'地圖（含隨機地圖池）', allMaps:'全部地圖',
    timezone:'顯示時區', taipei:'台北 UTC+8', tokyo:'日本 UTC+9', utc:'UTC',
    hint:'依 PS 輪替表推算，正式服更新後可能變動。隨機場次顯示候選地圖，並非每場抽選結果。',
    loading:'讀取排程中…', current:'目前時段', daily:'當日時刻表', previous:'前一天', next:'後一天', today:'今天', queryDate:'查詢日期',
    footerNote:'特殊場次優先採用已核對的官方期間；期間待確認時依週輪替表推算並標示。情境機體採用目前快照的專用配置。此 POC 不會即時確認維護、活動變更或最新排程。',
    unofficial:'非官方查詢 POC · PS TSS', news:'活動公告', official:'官方網站',
    noscript:'請啟用 JavaScript，以查詢不同日期與篩選場次。',
    randomGround:'地上隨機', randomSpace:'宇宙隨機', sortieMs:'出擊機體', fixedMs:'固定機體', unrestricted:'無限制',
    weekend:'週末限定戰', special:'特殊場次', roster:'情境機體 · A／B 隊', team:'{team} 隊',
    rosterNote:'系統配發固定機體，採用情境專用性能。未翻譯的機體名稱保留中文。', players:'{size} 對 {size}', mapPool:'候選地圖 · {count} 張',
    situationId:'情境戰 ID {id}', periodUnverified:'活動期間待確認 · 依週輪替表推算',
    matchCount:'{count} 個場次', currentEmpty:'此時段沒有符合篩選的場次。', empty:'沒有符合的場次',
    dayEmpty:'此日期沒有符合篩選的場次。試試其他 COST 或地圖，或清除篩選。',
    countdown:'下次切換 {time} · 約 {minutes} 分鐘後', stats:'{slots} 個時段 · {matches} 個場次',
    previousDay:'前日開始', nextDay:'跨至翌日', fetchError:'排程資料讀取失敗，請重新整理。',
    dataError:'排程資料格式不正確。', invalidDate:'請選擇有效日期。', invalidQuery:'查詢欄位或內容不正確。',
    description:'查詢 GBO2 PS 版分級戰、快速戰的 COST 與地圖輪替，支援日期、地上與宇宙篩選及台北／日本時間。'
  },
  ja: {
    pageTitle:'GBO2 PS 出撃スケジュール', title:'出撃スケジュール', language:'言語', snapshot:'ローテーションデータ',
    dataDate:'{date} 更新 · 日本時間基準を実機で確認済み',
    all:'すべて', rated:'レーティングマッチ', quick:'クイックマッチ', clear:'条件をリセット',
    filterLabel:'出撃条件', modeLabel:'マッチ種別', cost:'COST', allCosts:'すべてのCOST', freeCost:'無制限／固定MS',
    environment:'戦場', both:'地上・宇宙', ground:'地上', space:'宇宙', mapLabel:'MAP（ランダム候補を含む）', allMaps:'すべてのMAP',
    timezone:'表示タイムゾーン', taipei:'台北 UTC+8', tokyo:'日本 UTC+9', utc:'UTC',
    hint:'PS版のローテーションデータから予測しています。更新により変更される場合があります。ランダムMAPは候補一覧であり、実際に選ばれるMAPではありません。',
    loading:'スケジュールを読み込み中…', current:'現在の時間帯', daily:'1日のスケジュール', previous:'前日', next:'翌日', today:'今日', queryDate:'検索日',
    footerNote:'特別戦は確認済みの公式開催期間を優先します。期間未確認の場合は週間ローテーションによる予測として表示します。MSは現在のデータにある専用仕様です。このPOCはメンテナンス、イベント変更や最新スケジュールをリアルタイムで確認しません。',
    unofficial:'非公式スケジュール POC · PS TSS', news:'イベント情報', official:'公式サイト',
    noscript:'日付の検索や条件の絞り込みにはJavaScriptを有効にしてください。',
    randomGround:'地上ランダム', randomSpace:'宇宙ランダム', sortieMs:'出撃MS', fixedMs:'固定MS', unrestricted:'無制限',
    weekend:'週末限定戦', special:'特別戦', roster:'出撃MS · A／Bチーム', team:'{team}チーム',
    rosterNote:'MSは自動で割り当てられ、シチュエーション専用の性能になります。未翻訳のMS名は中国語で表示します。', players:'{size} vs {size}', mapPool:'候補MAP · {count}種類',
    situationId:'シチュエーションバトル ID {id}', periodUnverified:'開催期間未確認 · 週間ローテーションによる予測',
    matchCount:'{count}件', currentEmpty:'この時間帯に条件に合うマッチはありません。', empty:'条件に合うマッチはありません',
    dayEmpty:'この日に条件に合うマッチはありません。COSTやMAPを変更するか、条件をリセットしてください。',
    countdown:'次の切り替え {time} · あと約{minutes}分', stats:'{slots}枠 · {matches}件',
    previousDay:'前日から開始', nextDay:'翌日まで継続', fetchError:'スケジュールを読み込めませんでした。ページを再読み込みしてください。',
    dataError:'スケジュールデータの形式が正しくありません。', invalidDate:'有効な日付を選択してください。', invalidQuery:'検索条件が正しくありません。',
    description:'GBO2 PS版のレーティングマッチ・クイックマッチのCOSTとMAPローテーション。日付、地上・宇宙、MAPで検索し、台北・日本・UTCで表示できます。'
  },
  en: {
    pageTitle:'GBO2 PS Match Schedule', title:'Match Schedule', language:'Language', snapshot:'Rotation snapshot',
    dataDate:'Data: {date} · Japan time checked in game',
    all:'All Matches', rated:'Rating Match', quick:'Quick Match', clear:'Clear filters',
    filterLabel:'Match filters', modeLabel:'Match type', cost:'COST', allCosts:'All COSTs', freeCost:'Unrestricted / Fixed MS',
    environment:'Battlefield', both:'Ground & Space', ground:'Ground', space:'Space', mapLabel:'MAP (including random pools)', allMaps:'All MAPs',
    timezone:'Display time zone', taipei:'Taipei UTC+8', tokyo:'Japan UTC+9', utc:'UTC',
    hint:'Predicted from the PS rotation data and subject to game updates. Random MAPs show the candidate pool, not the MAP selected for each match.',
    loading:'Loading schedule…', current:'Current time slot', daily:'Daily schedule', previous:'Previous day', next:'Next day', today:'Today', queryDate:'Query date',
    footerNote:'Special battles use verified official periods when available; otherwise they are marked as weekly rotation predictions. Situation Battle MS use the current snapshot configurations. This POC does not check maintenance, event changes or the latest schedule in real time.',
    unofficial:'Unofficial schedule POC · PS TSS', news:'Event news', official:'Official website',
    noscript:'Enable JavaScript to select dates and filter matches.',
    randomGround:'Ground Random', randomSpace:'Space Random', sortieMs:'SORTIE MS', fixedMs:'Fixed MS', unrestricted:'Unrestricted',
    weekend:'Weekend Battle', special:'Special Battle', roster:'Assigned MS · Teams A / B', team:'Team {team}',
    rosterNote:'MS are assigned automatically and use Situation Battle-specific stats. Untranslated MS names remain in Chinese.', players:'{size} vs {size}', mapPool:'MAP pool · {count} MAPs',
    situationId:'Situation Battle ID {id}', periodUnverified:'Event period unverified · Weekly rotation prediction',
    matchCount:'Matches: {count}', currentEmpty:'No matches meet your filters in this time slot.', empty:'No matching battles',
    dayEmpty:'No matches meet your filters on this date. Try another COST or MAP, or clear the filters.',
    countdown:'Next rotation {time} · in about {minutes} min', stats:'Time slots: {slots} · Matches: {matches}',
    previousDay:'Starts the previous day', nextDay:'Ends the next day', fetchError:'Unable to load the schedule. Please refresh the page.',
    dataError:'The schedule data format is invalid.', invalidDate:'Please select a valid date.', invalidQuery:'Invalid query fields or values.',
    description:'Check GBO2 PS Rating Match and Quick Match COSTs and MAP rotations. Filter by date, Ground, Space and MAP, with Taipei, Japan and UTC time zones.'
  }
};

// Map/MS names are checked against the official website and client labels.
export const gameNames = {
  ja: {
    rules:{'基本戰':'ベーシック','王牌戰':'エースマッチ','簡易戰':'シンプルバトル','情境戰鬥':'シチュエーションバトル',
      '目標洗牌':'シャッフルターゲット','混合編組':'ミックスアップ','亂鬥戰':'ブロールマッチ','決鬥戰':'デュエルマッチ'},
    restrictions:{'泛用機限定':'汎用機限定','突擊機限定':'強襲機限定','支援機限定':'支援機限定'},
    situations:{85:'超越する力'},
    maps:{"10000":"山岳地帯","10200":"熱帯砂漠","10300":"港湾基地","10301":"港湾基地（早朝）","10302":"港湾基地（注水）","10500":"墜落跡地","10600":"無人都市","10700":"廃墟都市","10800":"北極基地","10900":"塹壕","11100":"密林地帯","11200":"軍事基地","11300":"軍港","11400":"地下基地","11700":"補給基地","11800":"コロニー落下地域","11900":"マスドライバー施設","12000":"峡谷","12100":"リゾート開発区域","12200":"鉱山都市","12300":"コロニー内部","12400":"大質量轍跡地","50000":"暗礁宙域","50100":"資源衛星","50200":"宇宙要塞内部","50300":"廃墟コロニー","50400":"月軌道デブリ帯"},
    units:{"蒼藍命運１號機":"ブルーディスティニー１号機","蒼藍命運２號機":"ブルーディスティニー２号機","蒼藍命運３號機":"ブルーディスティニー３号機","伊弗利特改":"イフリート改","ＦＡ・強襲特裝型":"ＦＡ・ストライカー・カスタム","蒼白騎士[陸戰重裝備規格]":"ペイルライダー[陸戦重装備仕様]","紅騎士":"レッドライダー","白色騎士":"ホワイトライダー","黑色騎士":"ブラックライダー","蒼白騎士兵團型":"ペイルライダー・キャバルリー"}
  },
  en: {
    rules:{'基本戰':'Basic Match','王牌戰':'Ace Match','簡易戰':'Simple Battle','情境戰鬥':'Situation Battle',
      '目標洗牌':'Shuffle Target','混合編組':'Mix-Up','亂鬥戰':'Brawl Match','決鬥戰':'Duel Match'},
    restrictions:{'泛用機限定':'General MS only','突擊機限定':'Raid MS only','支援機限定':'Support MS only'},
    situations:{85:'The Power to Transcend'},
    maps:{"10000":"Mountain","10200":"Tropical Desert","10300":"Port Base","10301":"Port Base (Sunrise)","10302":"Port Base (High Tide)","10500":"Impact Site","10600":"Deserted City","10700":"City Ruins","10800":"Arctic Base","10900":"Trenches","11100":"Jungle","11200":"Military Base","11300":"Military Port","11400":"Underground Base","11700":"Supply Depot","11800":"Colony Drop Area","11900":"Mass Driver Facility","12000":"Ravine","12100":"Resort Development District","12200":"Mining City","12300":"Colony Interior","12400":"Massive Impact Site","50000":"Dark Space","50100":"Resource Satellite","50200":"Space Fortress Interior","50300":"Derelict Colony","50400":"Lunar Debris Belt"},
    units:{"蒼藍命運１號機":"Blue Destiny Unit-1","蒼藍命運２號機":"Blue Destiny Unit-2","蒼藍命運３號機":"Blue Destiny Unit-3","伊弗利特改":"Efreet Custom","ＦＡ・強襲特裝型":"Full Armor Striker Custom","蒼白騎士[陸戰重裝備規格]":"Pale Rider [Ground Heavy Arms]","紅騎士":"Red Rider","白色騎士":"White Rider","黑色騎士":"Black Rider","蒼白騎士兵團型":"Pale Rider Cavalry"}
  }
};

export function translate(language, key, values = {}) {
  const message = messages[language]?.[key];
  if (message === undefined) throw new Error(`Missing translation: ${language}/${key}`);
  return message.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

export function gameName(language, kind, key, fallback) {
  return gameNames[language]?.[kind]?.[key] ?? (kind === 'situations' && language !== 'zh-Hant' ? translate(language,'situationId',{id:key}) : fallback);
}

export function chooseLanguage(search, saved, browserLanguages = []) {
  const requested = new URLSearchParams(search).get('lang');
  if (languages.includes(requested)) return requested;
  if (languages.includes(saved)) return saved;
  for (const name of browserLanguages) {
    if (/^ja(?:-|$)/i.test(name)) return 'ja';
    if (/^en(?:-|$)/i.test(name)) return 'en';
    if (/^zh(?:-|$)/i.test(name)) return 'zh-Hant';
  }
  return 'zh-Hant';
}
