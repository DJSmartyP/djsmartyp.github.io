# JAG Snack Planner

A mobile-friendly, static snack planner for Junior Adventures Group club teams. It creates weekly menus, pack-rounded shopping lists and indicative Tesco cost estimates, with monthly/period budget forecasts.

## Features

- Breakfast, after-school, or combined sessions, with daily attendance and menu choices.
- Whole-club food exclusions. Menus containing excluded ingredients are replaced where possible; impossible combinations are blocked.
- Food totals, delivery/collection and small-order charges displayed separately. One order each week, with editable fees and thresholds.
- Monthly/period budget divided across a chosen number of weeks. Forecast repeats the current week, buying fresh full packs each week rather than assuming leftover carry-forward.
- Editable pack prices, usable pack sizes and existing stock. Whole packs are rounded up after stock is subtracted.
- Site-personalised A4 PDF noticeboard menu: breakfast + after-school or after-school only, plus breakfast-only as an additional option. Staff shopping and budget pages are optional and separate from the noticeboard page.
- Downloadable text shopping lists, clipboard copy, print and browser-local plan saving.

## Run

Run `npm start`, then open http://127.0.0.1:8767/. There is no build or application dependency installation. You can also serve the repository root with any static web server. PDF generation uses the bundled MIT-licensed pdf-lib browser distribution; its licence is in `vendor/`. Screen fonts use Google Fonts, with system fallbacks. The PDF and company logo are local assets.

Run calculation checks with Node 18+:

```sh
npm test
```

## GitHub Pages

GitHub Pages publishes the repository root from `main`, with `index.html` as the site home page. In repository Settings > Pages select **Deploy from a branch**, `main`, `/ (root)`. GitHub Pages eligibility depends on repository visibility and the account plan. Do not add private attendance records or children's names to the repository. The application only stores headcounts locally, and sends no planning data to a server.

To deploy manually, publish the repository root. Asset paths are relative and support repository subpaths.

## Content and cost assumptions

Source: the user's `Approved food Lists.pdf`, supplied 22 October 2026. It has a shared approved-food list and an ideas page, not separately labelled breakfast and after-school policies. The app explicitly explains that the session menus are planning selections from that shared list. This starter models a subset of the approved ingredients.

Portions are estimates, not company portion standards. Condiments are capped at 10g per child per planned day, or 5g in each session for combined clubs. Staff must account for other condiments served in the school day. Extra food percentage is reserve purchasing, not an instruction to increase condiment servings.

Tesco reference prices were researched on 22 October 2026; other products have clearly marked planning allowances. Product links are shown in the shopping list. Prices are not refreshed automatically, no Clubcard promotions are assumed, and availability is not guaranteed. The houmous reference product was listed out of stock during research.

Tesco's minimum-order guidance used for defaults:
https://www.tesco.com/help/pages/online-grocery-faqs/delivery-and-collection-basics/minimum-order-value

Reference guidance: £5 under £50 for standard home delivery; £5 under £25 for Click+Collect. The default delivery slot allowance is £3.50, and collection allowance £1.50; these are placeholders for staff to replace. The planner does not cover Whoosh or multiple orders per week.

Food exclusions operate on ingredients, not on allergens in every packaged product. Staff must check product labels, dietary records, use-by dates and storage. This is a planning aid, not a nutrition assessment or allergen certification system.

## Source layout

- `catalogue.js`: products, reference prices, estimated yields and recipes.
- `planner.js`: calculation engine.
- `app.js`: browser interface, exclusions, saving and exports.
- `pdf-output.js`: branded PDF layouts.
- `assets/`: supplied company logo, including a PNG for PDF embedding.
- `tests/planner.test.cjs`: pack rounding, fee thresholds, budget forecasts, exclusions and combined session checks.

The supplied JAG logo remains the property of its owner. The original approved-food PDF is not included in this repository.
