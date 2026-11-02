# Wearrove verification record

2 November 2026. Engineering observations, not an independent certification, user study or prediction of a judging score.

## Release and automated checks

Wearrove replaces the former public brand throughout the site, package, repository, Vercel project and Devpost overview. The canonical site is https://wearrove.vercel.app/ and public source is https://github.com/adeelfalaksher900-creator/wearrove. Existing data, old invitations and legacy host-only sessions remain compatible. The existing Worker hostname and cookie are deliberately retained as internal compatibility identifiers.

Migration `004-decisions.sql` was applied to the dedicated D1 database before rollout. No unrelated Supabase project or database was changed. The configured key was converted to an encrypted `secret_text` binding and a subsequent settings read confirmed that it remained encrypted. No key is in this repository or these artifacts.

- `npm test`: **49 passed**, zero failed or skipped.
- `npm run check`: **33 JavaScript modules** syntax-checked; recognized credential patterns absent. This is not a comprehensive secret scanner.
- `npm run build`: **12 pages** and static assets.
- PostCSS parsed the complete shared stylesheet. Static output links and referenced icon symbols had no missing targets.
- PR 8 delivered the full redesign and decisions workflow; PR 9 fixed live Cloudflare requests and invitation compatibility. Both passed CI and were squash-merged. The latter production deployment reported READY for `be42ae9d5dc2e2627aeaeeaa9467141139e3234a`, with repository `wearrove`.

Provider mocks test protocol and races, not image quality. SQLite-backed API tests exercise actual database constraints through a D1-compatible adapter.

## Actual live YouCam evidence

A production browser submitted the documented YouCam example portrait and a clearly fictional navy blazer. The request performed live authorization, balance and feature-cost checks, two file registrations/uploads, clothing-v4 inference, status polling and private output retrieval.

| Observation | Result |
| --- | --- |
| Provider task | Succeeded; two API units reserved |
| Actual downloaded output | JPEG, 1024 × 1024, 120,642 bytes |
| Original/result views | Side-by-side and slider displayed real input/output; range keyboard moved 50 to 51 |
| Invalid review | “Usable” without checks rejected; no review falsely accepted |
| Saved review | Concern, two checked observations, private QA note, method `human` |
| Receipt download | Valid 972-byte JSON; expected review values; no external image/provider URL or Bearer text |
| Refresh and reopen | Stored output and review reopened; original correctly absent after refresh |
| Real local upload | JPEG file chooser selection decoded and displayed as “Your selected photograph” |
| Identical re-upload | Same completed job reused, without a replacement task |
| Provider cleanup | Deletion request acknowledged (`cleanup_pending=0`); internal erasure is not independently established |

The public `youcam-blazer-result.jpg` asset is a separately curated recorded reference made from the documented portrait and a fictional garment. The homepage labels it as recorded; moving its slider does not create inference. No private user result is made public. It supports immediate product understanding without spending another unit. It is not the final submission image gallery.

### Runtime failure found and fixed

The initial production failure was incorrectly reported as a timeout. Sanitized connection-stage logs identified an immediate redirect-option error. [Cloudflare's runtime](https://developers.cloudflare.com/workers/runtime-apis/request/) supports `manual` and `follow`, not Fetch's `error` redirect mode. All four server fetch paths now use `manual`; API redirects are explicitly rejected and upload/download redirects fail their non-success checks. Tests reproduce unsupported-mode prevention and credential isolation.

The initial balance reserve also exceeded the actual available balance. Production and documented defaults now use at most two units per accepted feature, a 20-unit balance reserve, 20 total reserved units and ten per day, with existing per-account limits. No paid plan or top-up was enabled. Failed/ambiguous tasks conservatively consume their reservation. No automatic billable replacement is created.

## Revised production browser journeys

- Opened the canonical homepage and create-wardrobe form; verified new complete header/footer destinations and actual create/join entry points.
- Created the labelled fictional example wardrobe, loaded three stored garments, and checked real availability for 2–4 November. All three answers were successful and carried the same date window into piece links.
- Saved two pieces, opened them through Saved, compared actual measurements/condition/care, checked selected availability, and carried the checked dates into the piece request form. Saves persisted across page navigation.
- Updated two fictional account display names. Replaced a QA invitation on the old host, then joined it through the new host into a distinct account. The borrower had member controls; owner actions were absent.
- The newly joined member attempted the owner's private image, review and receipt endpoints: all returned `NOT_FOUND`. Sharing wardrobe membership did not share preview access.
- Submitted a new clearly fictional borrower request through the revised interface and confirmed it as the separate owner. Completed collection and actual-return states through the separate owner account. Reopened history showed Awaiting owner → Dates confirmed → With borrower → Returned, and actual return was 2 November. These are clearly labelled QA transitions, never a real physical handover. A current CSV download contained the three stored QA records and no private preview URL.
- Image and review exports were downloaded and inspected. Earlier backend browser verification also covered original garment upload, conflict rejection, collection/actual return, garment edit, archive/restore, member revocation and JSON/CSV record downloads.

No real garments, physical collections, adoption figures or user-benefit measurements are claimed. Synthetic notes explicitly identify QA activity.

## Design and accessibility scope

Full-page independent viewport captures of the redesigned homepage at 390, 768 and 1440 pixels were visually inspected. The design retained readable hierarchy and its intended phone collection scroll and labelled tab bar, with no page-wide clipping observed. Keyboard interactions were exercised for dialogs, forms, consent, comparison and review. The public recorded-result component is checked again after its final deployment.

This does not establish exhaustive physical-device touch testing, screen-reader compatibility, animation frame times or all browser versions. Native iOS/Android binaries are not provided; this is a responsive web application.

## Review and security scope

Four read-only Review Swarm agents reviewed regression, security, reliability and contracts. Confirmed fixes include: invitation-rejoin races, duplicate billable previews with different page keys, inaccessible saves filling capacity, async event-target lifetime, late recheck responses overwriting a new selection, Back restoration, repeat saved requests and the join event being used as a prefill. Follow-up review found no confirmed security issue in the manual-redirect or exact-origin invitation changes.

Authorization, rate limits, bounded image/body handling, recovery races, secret-free exports and state constraints have automated coverage. This is not an independent penetration-test certificate. Full-account deletion is not automated. Invitation and recovery links are bearer capabilities and must be kept private. Preview access expires after 24 hours and earlier removal is supported.

## Submission and remaining limits

Event registration and the Wearrove Devpost overview are saved. The final story, technologies and links are prepared in DEVPOST.md and saved status must be confirmed from the actual form. Final screenshots and a public 1–3 minute end-to-end video remain the separately approved media phase. Final submission is not authorized in this phase.

The official four equally weighted judging criteria are implementation, design, impact and idea quality. Working flows and evidence improve assessability; no numeric winning score is inferred. The principal impact limitation is the absence of consenting owner/borrower testing. Shipping, payments, deposits, insurance, identity checks and fit guarantees are outside the product scope.

GitHub branch protection was not saved in the earlier session because GitHub requested re-authentication. CI passing on PRs is not the same as enforced protection. The final release must not claim that setting is enabled without a successful settings confirmation.
