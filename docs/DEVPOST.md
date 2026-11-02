# Wearrove

**Tagline:** Try the look. Compare the details. Borrow from your circle.

**Topic:** eCommerce VTO / Apparel VTO

**Website:** https://wearrove.vercel.app/

**Source:** https://github.com/adeelfalaksher900-creator/wearrove

**Draft:** Wearrove, submission 1278478. Overview saved. The following story is the source for the Project details field. Final screenshots, the public 1–3-minute video and final submission remain a separate approval phase.

## Inspiration

The outfit for your next occasion might already be in a friend's wardrobe. Finding it usually means scattered photographs in chats, uncertain dates and unspoken assumptions about collection, cleaning and return.

A virtual try-on can help someone imagine a look. It cannot tell them whether that piece is actually available or coordinate the loan. Wearrove connects visual consideration with the practical steps that make borrowing possible.

We focused on invitation-only circles of people who already know each other. Clothing-rental and clothing-library research identifies availability, trust and process effort as barriers. That supports a product hypothesis; it does not establish that this application has already changed behaviour or reduced purchases.

## What it does

**Save a possibility. Check the details. Make a clear plan.**

An owner creates a private wardrobe, adds real garment photographs, actual measurements, condition and care instructions, and invites their people. A borrower chooses collection and return dates, searches the wardrobe and checks availability before making a request.

Saved pieces form a private shortlist. Compare up to three choices side by side: size labels, measurements, condition, care time, current date availability and any matching private previews. Checked dates travel into the selected piece's request form.

The fitting room uses **YouCam clothing v4**. A user selects a garment, chooses a photograph and explicitly consents to processing. The generated result is private to that account. An original/result view and a keyboard-operable slider support a closer look while the original is still present in that visit.

A manual detail checklist records what the user observed. They can flag a concern, save private notes and download a JSON review. The application refuses to mark an image usable without every required check. This is human review, not automated identity verification, colour certification or a physical-fit prediction.

The owner receives a borrowing request, never the borrower's portrait, preview or review. They confirm or decline the dates, record collection and record the actual return. Storage-level rules prevent conflicting confirmations, include the agreed care buffer and keep overdue pieces unavailable. A pending request alone does not hold a garment.

The homepage includes a labelled, recorded real YouCam example for immediate understanding without starting an inference. A clearly identified fictional wardrobe lets a new account explore the workflow; those garments are not real offered inventory. People can create their own wardrobe, save an account recovery code and export their records.

## How we built it

Wearrove is a complete multipage web application with semantic HTML, native dialogs, small JavaScript modules, an original responsive stylesheet and Phosphor icons. Desktop and phone use the same product, with a labelled phone tab bar, accessible form controls, focus states and reduced-motion support.

Vercel serves the site and forwards same-origin API requests to a dedicated Cloudflare Worker. D1 stores wardrobes, membership, garment details, booking states, event history, private saved pieces and expiring preview data. Bound SQL, authorization checks, state guards and SQLite triggers protect the workflow even when screens are stale or approvals arrive together.

The YouCam adapter checks current feature cost and unit balance, atomically reserves a bounded allowance, registers both input files, uploads them to approved signed storage destinations and creates the clothing-v4 task with strict single-person filtering. It polls the same task at a bounded cadence. An ambiguous submission never automatically becomes another billable task.

The API key is encrypted on the server. It is never sent to signed image-storage URLs. Redirects fail closed. The original portrait is not stored in the application database. Completed results are stored privately, expire after 24 hours and can be removed earlier. Provider deletion is requested and retried; we do not claim independent proof of the provider's internal erasure.

## Challenges

The difficult work was correctness at the boundaries: early returns should release later dates without losing cleaning time; overdue loans must stay blocked; an invitation already in flight must not restore a removed member; and two identical preview submissions must not create two paid tasks.

A real production check also found that Cloudflare rejects the standard fetch `redirect: error` option before sending a request. We replaced it with supported manual redirect handling and explicit rejection, preserving credential isolation. A separate guard was configured above the actual available unit balance; it was replaced with a small, explicit allowance and reserve, without enabling a paid plan or top-up.

We reproduced those failures, fixed them and added regressions. We also preserved old invitation links across the rename using exact owned origins, with every join still submitted to the current site's authorized API.

## Accomplishments

- A deployed borrowing workflow with original uploads, private invitations, date checks, approval, collection, actual return and event history.
- A **successful live YouCam clothing-v4 task**: two API units, a downloaded **1024 × 1024 JPEG**, a saved manual review and a verified JSON receipt. Re-uploading the same input reused the existing result rather than creating another task.
- Actual browser checks confirmed that another member of the same wardrobe could not read the private image, review or receipt.
- **49 passing automated tests**, 33 syntax-checked JavaScript modules and a 12-page build. Tests cover real SQLite constraints, API permissions, recovery concurrency, date conflicts, provider lifecycle races, redirects and exports.
- A complete visual redesign checked at phone, tablet and desktop widths, public MIT-licensed source, architecture diagrams and reproducible setup instructions.

These are engineering results. They are not adoption figures, a user study, a garment-fidelity benchmark, carbon savings or a prediction of a judging score.

## What we learned

The useful output is a decision that can become a clear agreement. Visual previews matter, but actual measurements, genuinely available dates, privacy, care time and an understandable next step determine whether the service is usable.

## What's next

Run consenting owner/borrower sessions to measure time to find an available piece, request completion, understanding of the care buffer and interpretation of preview limits. Use those observations to prioritize improvements. Payments, deposits, shipping, insurance, identity verification and automatic fit guarantees are outside this release.

## Built with

YouCam API clothing v4, JavaScript, HTML, CSS, Web Crypto, Cloudflare Workers, Cloudflare D1, SQLite, Vercel, Node.js, GitHub Actions, Phosphor Icons.

## References

- [Official requirements](https://youcam-api-skin-ai-ecommerce.devpost.com/)
- [Occasional clothing-library research](https://research-portal.uu.nl/en/publications/on-the-attractiveness-of-clothing-libraries-for-women-investigati/)
- [Fashion-rental barriers research](https://www.tandfonline.com/doi/full/10.1080/15487733.2022.2065774)
- [YouCam clothing-v4 documentation](https://docs.perfectcorp.com/reference/ai_clothes/v4.0)

No individual teammate role, award eligibility or user result is invented. Source history records implementation; the final public story must stay consistent with the verified release.
