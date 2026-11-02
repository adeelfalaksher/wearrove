# Borrowloom verification record

Last checked: **2 November 2026**. This is an engineering verification record, not an independent certification, a user study, or a prediction of the judges' scores.

## Verified release

- Website: https://borrowloom.vercel.app/
- Public source: https://github.com/adeelfalaksher900-creator/borrowloom
- Product implementation commit: `df1f4d543e621299267fca35442080c2345adeb9`.
- Vercel deployment `dpl_62ZRL5czcyHAnedktcUw1cpBqXFc` reported `READY` for that commit. The documentation-only follow-up does not change the product behavior tested below.
- Dedicated Cloudflare Worker and D1 database serve the same-origin API. No unrelated backend project was modified.

## Automated verification

Fresh local run on 2 November 2026:

| Command | Observed result | Scope |
| --- | --- | --- |
| `npm test` | 32 passed, 0 failed, 0 skipped | Domain rules, actual SQLite constraints, API permissions and provider mocks |
| `npm run check` | 22 JavaScript modules passed syntax checks; no recognized credential patterns | A small pattern check, not a comprehensive secret or vulnerability scanner |
| `npm run build` | 10 pages and static assets built successfully | Static production output |

The API test adapter uses actual SQLite and reproduces D1's array-shaped binary reads. It is not a substitute for the separately exercised production browser journey.

Covered invariants include overlapping approvals, inclusive windows, cleaning boundaries, early return, overdue collection, member isolation, owner-only transitions, invitation rotation, simultaneous recovery claims, stale edits, archive rules, idempotency, bounded inputs, origin checks, rate limiting and export sanitization.

Provider tests cover credential isolation at signed storage, current-cost/balance guards, cancellation during upload/task acceptance/result download, pause and recheck of the same task, private output authorization and fair cleanup retries. **These are mocked protocol tests; they do not establish a successful live YouCam inference or image quality.**

## Production browser journeys

Testing used synthetic QA accounts, a wardrobe explicitly named fictional, and a generated garment photograph. No test record claims a real physical handover.

| Journey | Observed result |
| --- | --- |
| Account display name | Saved and survived page refresh |
| Create a wardrobe | Stored and reopened through the deployed interface |
| Add a garment | Actual file-picker upload, normalized photograph, size, measurements, condition and care notes saved; private photograph rendered after reopening |
| Invitation and isolation | A separate browser origin identity could not read the private wardrobe before joining; the valid invitation granted member access |
| Conflicting requests | Two pending requests were possible; after one approval, an overlapping approval was rejected with the availability conflict message |
| Full borrowing lifecycle | Request, approval, collection and actual return persisted; history showed all four events. The earlier competing owner request was cancelled |
| Exports | CSV and JSON downloaded through the browser and were inspected. CSV included the returned and cancelled records; JSON contained the returned borrower's record and excluded session, recovery, invitation and provider secrets |
| Edit measurements | Changed the fictional garment length, saved, and observed the updated text in the detail view |
| Archive and restore | Archived state removed request/preview actions; restoration brought those actions back |
| Remove a member | Owner's membership list reduced to one; the removed member's garment page showed that the wardrobe was unavailable |
| History with keyboard | Enter opened history. Escape closed it and restored focus to the original `View history` button |
| Missing provider credential | Fitting room showed an explicit unavailability message and disabled `Create private preview`; borrowing remained available |

The owner and borrower sessions were isolated using two allowed production aliases with separate cookies and the same dedicated backend. QA invitation capabilities are not included in documentation, screenshots or source control.

## Interface and accessibility

- A 390-pixel mobile homepage render exposed an image minimum-width overflow. The deployed correction was reviewed at 390 × 3995 pixels: navigation, hero, sections and footer remained within the rendered page. This is a visual review, not a full interactive mobile or real-device test.
- Desktop review used the actual deployed pages. The earlier desktop DOM check had no horizontal overflow.
- The duplicate category ID was replaced with a distinct garment-form ID. The deployed edit dialog now labels the correct category control.
- Native dialog headings use unique IDs. The asynchronous history dialog now receives its initiating button explicitly; focus restoration was retested in production.
- Filters use pressed buttons in a labelled group rather than incomplete tab semantics.
- The observed console errors belonged to the browser extension; the app-origin error/warning filter returned no entries during the checked journey. This is not a guarantee for every browser or path.

Remaining coverage: full keyboard traversal across every page, screen-reader testing, touch on physical iOS/Android devices, slow-network/offline browser tests, animation/frame-time measurement and print output have not been comprehensively verified.

## Security and operations

Four read-only code reviews examined workflow, authorization, provider protocol and reliability. Confirmed findings were fixed with relevant regressions: recovery races, cancellation races, binary handling, stale edits, member revocation, invalid archive actions, provider retry limits, cleanup starvation and mismatched source portraits.

A fresh external HTTP probe on 2 November returned **200**, with no redirects, in **565 ms for that single probe**. This is not a percentile latency benchmark. The response included CSP, HSTS, `nosniff`, frame denial, no-referrer and disabled camera/microphone/geolocation permissions. Public static HTML permits wildcard CORS; credentialed private data remains behind same-origin API authorization.

The live TLS probe reported a matching, unexpired Google Trust Services certificate valid through 29 January 2027. These probes are limited independent observations, **not a penetration test**.

Server implementation uses hashed browser session/recovery capabilities, Secure/HttpOnly/SameSite cookies, parameterized SQL, role and membership checks, request deadlines, quotas and private expiring preview storage. Current limitations include no automated full-account deletion and no independent proof of provider-internal deletion. Scheduled cleanup is configured, but its live provider behavior requires a real task.

GitHub changes have used reviewed pull requests and a passing `verify` workflow. The repository has **no saved branch-protection rule yet**: saving the prepared rule required GitHub re-authentication. PR discipline should not be described as enforced branch protection.

## Hackathon release gates

| Requirement | Current evidence / next action |
| --- | --- |
| Real working application | Borrowing workflow deployed and tested as described above |
| At least one genuine YouCam API integration | Adapter implemented and mock-tested; **account activation, secure credential configuration and a real successful task are still required** |
| Public source and license | Public GitHub repository with MIT license, setup, architecture and test documentation |
| Free judge access | Public website and browser account available; real preview access depends on verified provider units and cost |
| Event registration | Devpost still displayed `Register for this hackathon` on 2 November; Apparel VTO selected in the form, but registration not submitted |
| Project story and links | Prepared in [DEVPOST.md](DEVPOST.md); **not yet saved as a Devpost draft** because event registration blocks project creation |
| Screenshots and public 1–3 minute actual-product video | Reserved for the user's later approval; no final gallery or video created |
| Final submission | Explicitly withheld; not authorized in this phase |

The official event page displayed a deadline of **2 November 2026 at 9:45 pm Pakistan time** during this check. Completing code does not waive the live integration or submission requirements.

## Judging assessment

| Criterion | Evidence available | Main evidence still missing |
| --- | --- | --- |
| Technological implementation | Storage-enforced scheduling, authorized state transitions, private task lifecycle and regression tests | Real YouCam output, current SKU cost, live cleanup and end-to-end preview proof |
| Design | Coherent multipage interface, editorial hierarchy, garment metadata, mobile correction and clear next actions | Full device/accessibility coverage and usability observations |
| Potential impact | Specific audience and researched coordination barriers; a complete dated borrowing workflow | Consenting owners/borrowers completing tasks and measured practical benefit |
| Quality of idea | Research and competitor comparison; preview connected to dates, care and handover | Evidence that the selected audience prefers this workflow over existing alternatives |

No winning percentage, adoption claim, carbon-saving claim or 95+ score is established by these tests. The mandatory live provider gate must be resolved before this can be called judging-ready.
