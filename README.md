# GEO 技巧整理（本專案實作）

這份 README 整理本次 dummy 網站中實際使用的 GEO（Generative Engine Optimization）技巧與落點，方便示範與後續擴充。

## 已使用的 GEO 技巧

1. **清楚的內容架構與語意標題**
   - 使用單一 H1，並以 H2/H3 拆分區塊（品牌、產品、GEO 摘要、FAQ）。
   - 讓生成引擎能快速定位「品牌定位、核心產品、服務範圍」等關鍵段落。

2. **可引用的摘要與關鍵句**
   - 在「GEO 快速摘要」「可引用答案範例」中提供明確可引用的句子。
   - 以短句表述品牌/產品/服務，避免模糊敘述。

3. **內部連結建立主題關聯**
   - 導覽列與頁尾提供區塊錨點連結（#products、#faq 等）。
   - 讓生成引擎理解頁面資訊架構與內容關係。

4. **FAQ 內容結構化**
   - 使用 FAQ 區塊呈現問題與回答，強化 Q/A 格式的可引用性。

5. **JSON-LD 結構化資料**
   - `Organization`、`WebSite`、`Product`、`FAQPage` 四類 schema。
   - 提供品牌、產品、價格、FAQ 內容的機器可讀訊號。

6. **SEO/GEO 基礎 meta 資訊**
   - `title`、`description`、`canonical`、Open Graph/Twitter meta。
   - 幫助生成引擎與摘要系統快速理解頁面用途。

## 對應檔案位置

| 技巧 | 檔案 | 區塊/關鍵字 |
| --- | --- | --- |
| 語意標題與段落 | `index.html` | `h1/h2/h3`、`section` |
| 可引用摘要 | `index.html` | `#geo-summary`、`.geo-answer` |
| 內部連結 | `index.html` | `nav`、`#products` `#faq` |
| FAQ | `index.html` | `#faq`、`.faq-item` |
| JSON-LD | `index.html` | `<script type="application/ld+json">` |
| Meta | `index.html` | `<meta name="description">` 等 |

## 後續擴充建議（可選）

- 加入真實圖片並補上精準 `alt` 描述（產品/場景/人物）。
- 若有多語內容，補上 `hreflang` 與語系對應 JSON-LD。
- 若有門市或活動，可加入 `LocalBusiness`、`Event` schema。

