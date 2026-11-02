# Borrowloom design direction

## Product character

A clear clothing service with large garment photography, near-white and light-grey surfaces, readable ink text and a restrained red accent. Native system sans-serif typography, rounded controls and labelled phone navigation follow the requested iOS character. No gradients, glowing AI ornaments, endorsement logos or invented metrics. The first screen explains borrowing from known friends and gives real create/join actions.

## References inspected through Mobbin

- [ZARA product view](https://mobbin.com/screens/b5ef602f-13cb-4dfb-8813-d7e4258a06ef): the garment dominates the page; metadata is secondary and the composition has room to breathe.
- [Selfridges item-detail form](https://mobbin.com/screens/deb3c52c-d189-454f-9dba-e06a130c2391): concrete condition and included-parts inputs, selected chips and a clear next step.
- [Tripadvisor reservation selection](https://mobbin.com/screens/21632a98-8496-4d51-842f-103cd064d9c4): the date, available option and total commitment are adjacent. Reuse this clarity for borrowing dates, without presenting a payment flow.
- [Zomato reservation screen](https://mobbin.com/screens/4e8c570a-810c-4633-a74d-9a90de18bf60): constrained choices and a bottom continuation control keep a mobile reservation understandable.

These are design references, not licensed assets or screenshots to embed in Borrowloom. Copy no brand logo, protected photograph or entire product design.

Additional references from the redesign are [Depop item details](https://mobbin.com/screens/fa88a213-b3fb-478b-9681-8531578dd704), [Depop listing management](https://mobbin.com/screens/ff0c5318-3ec2-43cd-ae77-a23e9d04fccf), [Vinted mobile browsing](https://mobbin.com/screens/f5b782b0-b5de-4293-bd39-5db1d7cc39aa), and the free MINNA listing found through Templens. [WINNER-REVIEW.md](WINNER-REVIEW.md) records the search, asset limits and skill-direction decisions. No template code or protected photography was imported.

## Screens

- Home: literal product explanation, interactive garment selector, create/join actions, date entry, privacy summary, FAQ and full footer.
- My wardrobes: memberships, owned collections, join/create flows and a useful empty state.
- Wardrobe: dates and availability first, search/filter controls, garment gallery, details and owner controls.
- Fitting room: selected garment, explicit image/processing permission, capture guidance, real asynchronous state, completed comparison and request CTA.
- Borrowing: separate incoming and personal requests, a clear status trail and authorized next actions.
- Guide: owner/borrower instructions, photo requirements, care-day explanation and preview limitations.
- Settings: display name, recovery, export, photo deletion and membership controls.
- Privacy: specific data, recipients, expiry, deletion and operating limits.

## Interaction requirements

44px touch targets; explicit labels; visible focus; no placeholder-only forms; form errors associated with the field; a live status region; real disabled/busy states. Dialogs trap focus and close with Escape. Preserve entered values after recoverable errors. The return date is inclusive and a care day is visibly blocked. A pending request never looks confirmed. Avoid animation that delays core tasks; reduced-motion users receive the same content immediately.

## Skills applied

Minimalist UI and high-end visual-design guidance inform hierarchy, spacing, typography and restrained motion. Their conflicting styling prescriptions are resolved in favour of this product's accessible editorial system. Anatomy is relevant only for an explanatory mechanism, rather than the main commerce UI. REA explicitly directs ordinary source projects to normal repository analysis; no binary reverse engineering is needed. The macOS menubar skill does not apply to a browser application and is not used to introduce a separate native product.
