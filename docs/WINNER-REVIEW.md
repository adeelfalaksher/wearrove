# Winner review and product redesign

Research and implementation update: 2 November 2026.

The previous event's [official gallery](https://youcam-api.devpost.com/project-gallery) marks Aloud, ShadeSpan, CASTING, KeepMe and ConfidFit as winners. The project descriptions below are the creators' accounts, not independently reproduced performance evaluations. No published judge score or private feedback was available. The design conclusions are our interpretation of the visible work.

## Five projects, five useful outcomes

| Project | User and practical result | What goes beyond an API wrapper | Lesson for this build |
| --- | --- | --- | --- |
| [Aloud](https://devpost.com/software/aloud-lxqr70), first place | Blind and low-vision beauty shoppers receive spoken product and skin information | Nonvisual capture guidance, barcode/ingredient tools, structured skin scores and voice interaction | Start with a specific user's task. Accessibility has to work through the journey, not appear as a claim on a landing page |
| [ShadeSpan](https://devpost.com/software/shadespan), second place | A merchandiser checks the visibility of garment colours across a reference panel | Try-on renders combined with deterministic colour scoring and a worst-case report | The output should answer a decision, with a visible method and limitations. A gallery alone is not enough |
| [CASTING](https://devpost.com/software/casting), third–fifth place | A brand reviews catalogue coverage across measured reference profiles | Four YouCam APIs, per-person progress, partial-failure handling, exported images and a report | Integration depth comes from a coherent workflow and useful artifacts, rather than a count of APIs |
| [KeepMe](https://devpost.com/software/keepme), third–fifth place | A shopper checks whether a generated try-on changed protected parts of their appearance | Specific consent, image comparison, supported repair and an integrity receipt | Show what the user controls and what the system checked. Do not hide uncertainty behind a confident-looking image |
| [ConfidFit](https://devpost.com/software/confidfit), third–fifth place | Shoppers preview a garment inside a Shopify product page; merchants operate its usage | Storefront integration, async jobs, entitlement, quotas and merchant controls | The preview should sit next to the user's next action, with service limits and errors handled |

The sponsor's [round-two announcement](https://www.perfectcorp.com/business/news/YouCam-API-Hackthon-eCommerce) also discusses the first-round winners. The common lesson is a specific audience, a useful output and evidence of an end-to-end implementation. These observations do not establish why each judge selected each winner, or promise a similar result here.

## What was weak in Borrowloom

The earlier first screen was an editorial slogan and an outfit photograph. It did not quickly explain who shares clothes, how someone joins, or what happens after a preview. Its repeated small captions, muted berry accent, serif type and large quiet sections made the service harder to distinguish from a concept site. A user also had to open individual garments to check a date window.

There is a real product hypothesis worth testing: friends arranging an occasional garment loan need more than a generated picture. They need access to a known collection, the owner's measurements, genuinely available dates, cleaning time and an agreed handover. Existing rental and wardrobe products remain competition. A new name or a larger hero is not evidence of originality or adoption.

## Changes implemented

- A literal first-screen explanation: try on clothes, borrow from friends. Separate real actions create a wardrobe or open the invitation form.
- Interactive garment selection on the homepage. Illustrative assets are identified; they are not YouCam results or offered inventory.
- A date entry on the homepage that carries the selected window into the wardrobe and garment detail.
- A wardrobe-wide availability filter using authenticated, real per-garment checks. Four requests at most run concurrently. Each answer includes the existing backend's approved loans, actual returns, care buffer and overdue hold. No failure is interpreted as availability.
- The browser and server use the same date-validation module, copied unchanged into the static build.
- A phone layout with labelled bottom navigation, safe-area spacing, touch-sized controls, larger form text and preserved desktop functionality. This is one responsive web application, not a claim that native iOS or Android binaries exist.
- A new neutral surface system, native sans-serif type, restrained red accent and clearer form, card, dialog and borrowing states.
- Reduced-motion support and small interactions; no fake user totals, testimonials or conversion claims.

## Visual references

The [Templens](https://templens.com/) live search was restricted to free templates and returned 15 partial matches. Its MINNA preview describes a garment-led catalogue, product details and clear navigation. [MINNA's template listing](https://www.framer.com/marketplace/templates/minna/) was examined as a visual reference. We did not import Framer code, reuse template photographs, or represent a free listing as unrestricted rights to its assets.

Mobbin references inspected:

- [Depop item detail](https://mobbin.com/screens/fa88a213-b3fb-478b-9681-8531578dd704): dominant garment photography with concrete information and a nearby action.
- [Depop listing management](https://mobbin.com/screens/ff0c5318-3ec2-43cd-ae77-a23e9d04fccf): owner controls stay associated with the item.
- [Vinted browsing](https://mobbin.com/screens/f5b782b0-b5de-4293-bd39-5db1d7cc39aa): a photo-first phone grid, compact filters and labelled bottom destinations.

The design-taste skill dealt `hero-object`, seed `2071387760`, and the app direction `editorial-greeting`. The initial card-pastel palette was redrawn because the user rejected muted colours. The dealt brass palette was not adopted: the explicit user brief takes priority, so the implementation uses neutral white/grey, ink and a red accent. Native system typography follows the requested iOS character. The proof-logo block was omitted because there are no customer or endorsement logos. The ordinary website workflow was kept short rather than turned into full-height scroll posters. Automated skill-browser inspection was not run; actual browser and independent viewport checks must establish the resulting layout, without claiming a zero-failure inspector result.

## API credentials and backend isolation

The user reports receiving both an API key and a secret. The [official quick start](https://docs.perfectcorp.com/develop/quick_start_guide) and [FAQ](https://docs.perfectcorp.com/develop/faq) specify the API key as the Bearer credential for these API requests. Clothing v4 does not require us to collect an additional secret for that authentication flow. A credential should be entered directly into encrypted server settings, never into chat, source, a screenshot or a public client variable.

Borrowloom already has a dedicated database and working server. No Supabase project is required to address this design change. The user's two existing Supabase projects remain untouched. Reusing one would require a separate schema, scoped permissions and tests protecting both products; avoiding that migration keeps the existing data isolated without an unnecessary release risk. Product screens do not discuss hosting implementation, while technical documentation remains accurate.

## Evidence still required

Production browser verification of the new controls, viewport review, live YouCam output with the user's configured key, and user testing remain distinct checks. No winning score, preview quality, avoided purchases or adoption rate is inferred from the winner review. The final image gallery and video remain a later approval phase.
