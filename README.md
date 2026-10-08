# GBO2 PS 出擊時刻表

《機動戰士鋼彈 激戰任務 2》PS 版分級戰、快速戰的非官方查詢 POC。
提供目前時段與每日時刻表、COST／戰場／地圖篩選，以及台北、日本、UTC 時區切換。
可顯示泛用／突擊／支援機限定，以及情境名稱與兩隊固定機體清單。
支援繁體中文、日本語、English；介面、地圖、規則、特殊場次與情境機體名稱都會切換。

## 語言

右上角可選擇語言，切換時會保留日期、COST、地圖、模式與時區。
瀏覽器會記住選擇；首次使用參考瀏覽器語言，未支援的語言預設繁體中文。
分享網址可加上 `?lang=ja`、`?lang=en` 或 `?lang=zh-Hant`；網址指定優先於已記住的選擇。
顯示語言與時區分別設定，日本語或 English 不會自動改變時間基準。

用語參考[官方日文公告](https://bo2.ggame.jp/jp/info/?p=198257)、
[官方英文公告](https://bo2.ggame.jp/en/info/?p=198269)、
[官方日文地圖清單](https://bo2.ggame.jp/jp/ms_stage/stage.php)，
情境名稱與機體則核對[日文情境公告](https://bo2.ggame.jp/jp/info/?p=126085)與
[英文情境公告](https://bo2.ggame.jp/en/info/?p=126760)，並參考遊戲語言表。
例如英文使用官方公告的「Rating Match／Quick Match」，「超越之力」為
「超越する力／The Power to Transcend」。

翻譯集中在 `i18n.mjs`。未知情境顯示「情境戰 ID」，缺少日英機體名稱時保留中文，
不會因此中止更新。之後可補上官方名稱；新地圖與規則仍需補齊日英翻譯。
發布時需包含 `i18n.mjs`，不需要原始語言檔或額外套件。

網站使用本機更新指令產生的 PS 快照；版本與資料日期由 JSON 顯示。
排程以日本 UTC+9 計算；曾以 PS5 分級戰 COST 300、6 對 6、基本戰、宇宙要塞內部校準一個時段。
尚未逐場核對整週。特殊場次依遊戲活動開放，隨機地圖顯示候選池，實際場次以遊戲為準。
特殊場次優先採用已核對的官方活動期間。缺少期間或已過期時，依原始週輪替表
顯示並標記「活動期間待確認」；這些日期是推算，需以遊戲或公告確認。
情境機體資料為目前版本的專用配置，日期查詢不會還原歷史機體性能。

## 發布

把本目錄的檔案放在 GitHub 儲存庫根目錄。
在 **Settings → Pages** 選 **Deploy from a branch → main → /(root)**，儲存後等待發布。
免費帳號可透過公開儲存庫使用 GitHub Pages。
[GitHub 官方設定說明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

純靜態 HTML／JavaScript，不需安裝套件、建置或後端服務。
相對路徑可直接用在 GitHub Pages 的專案子目錄。

## 更新資料

在已配置的本機雙擊 `update.cmd`，或執行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\update.ps1
```

指令會取得最新 PS 快照、驗證版本與雜湊、解包、解析排程、輸出公開欄位，
並執行 `node check.mjs`。全部通過後才替換 `schedule-data.json`；未改變時不重寫。
失敗會保留上一份資料。**不會提交、推送或發布**，這些由你決定。

首次配置：把 `update.local.example.json` 複製成 `update.local.json`，填入本機保存專案與
Python 路徑。需要 Node.js，以及保存專案內的下載、解包、語言與解析工具。
`update.local.json` 已加入 Git 忽略清單，不能上傳。朋友只看網站，不需要這些工具。

需要離線重建已保存的版本時：

```powershell
.\update.ps1 -SavedVersion 02132278
```

一般輪替與新情境可自動更新，不必先補公告。未知情境使用 ID；缺少或過期的
活動期間輸出 `windows: null`，由網站標示為週輪替推算，不會套用舊活動期間。
若要顯示官方名稱與精確活動期間，可記錄於本機保存專案的
`ps-match-schedule-poc/schedule-events.json`。
網站每分鐘更新目前時段的顯示，新快照發布後需重新整理網頁。

本儲存庫是網站後續維護的主目錄。取得新的 PS 資料快照後，先核對輪替、
機體類別限制、情境與官方活動期間，再更新本目錄的網頁及資料檔。
下載、解包與解析工具留在本機保存專案；GitHub 只保存可公開的網站資料。

提交前執行 `node check.mjs`，檢查公開欄位清單、敏感資訊、情境機體、活動截止與時區邊界。
提交並推送到 `main` 後，已設定的 GitHub Pages 會重新發布。

公開 JSON 只包含版本／資料日期／時區、排程、地圖名稱、特殊場次標籤／開放期間、
情境名稱與兩隊機體名稱／COST。輸出與檢查均採固定欄位清單。
下載點、來源識別碼、雜湊、抓取紀錄、原始旗標、內部文字鍵值與機體性能留在本機保存專案。
儲存庫不含 CPK、原始封包或登入憑證。
此 POC 與遊戲官方無隸屬關係。
