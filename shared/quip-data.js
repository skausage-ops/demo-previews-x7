/* QUIP demo data — mock incidents for the static preview. Shared by /quip (crew tablet) and /quip-admin (QA portal).
   All people, emails and phone numbers are fictional. Times are relative to "now" so the demo never ages.
   State written by either app lives in localStorage under QUIP.KEY, so an incident filed on the tablet
   shows up in the admin queue on the same device. */
(function () {
  const H = 3600e3, D = 24 * H;
  const P = (ref, n = 3) => Array.from({ length: n }, (_, i) => ({ src: `../shared/photos/${ref}/0${i + 1}.jpg`, label: ['Product', 'Case label', 'Context'][i] }));

  const STATUS = {
    PendingIntake:    { label: 'Pending intake',      tone: 'gold',  waitingOn: 'QA' },
    IntakeComplete:   { label: 'Intake complete',     tone: 'gold',  waitingOn: 'QA' },
    SupplierNotified: { label: 'Supplier notified',   tone: 'blue',  waitingOn: 'Supplier' },
    AwaitingDcAction: { label: 'Awaiting DC',         tone: 'blue',  waitingOn: 'Distribution center' },
    Escalated:        { label: 'Escalated',           tone: 'red',   waitingOn: 'QA' },
    Resolved:         { label: 'Resolved',            tone: 'green', waitingOn: null },
    ClosedNoAction:   { label: 'Closed · no action',  tone: 'grey',  waitingOn: null },
  };

  const INCIDENT_TYPES = [
    { name: 'Foreign Object', group: 'Product', q: 'What is the foreign object (metal, plastic, bug, wood, mold, etc.)? Keep the object until QA or the supplier says you can throw it away.', high: true },
    { name: 'Spoilage', group: 'Product', q: 'Spoiled product', high: true },
    { name: 'Temperature', group: 'Product', q: 'How does the product show signs of temperature abuse (thawed and refrozen, product sticking together, etc.)?' },
    { name: 'Underfilled / Underweight', group: 'Product', q: 'Not enough product in bag / case' },
    { name: 'External Damage', group: 'Product', q: 'What was the damage to outer packaging (discovered during receiving)?' },
    { name: 'Appearance and Size', group: 'Product', q: 'Describe issue (size / shape / color / weight)?' },
    { name: 'Mis-labeled / Missing label', group: 'Product', q: "Is the product label missing, or doesn't it match the product in the case?" },
    { name: 'Off Flavor / Odor', group: 'Product', q: 'Describe the flavor or odor and when you noticed it.' },
    { name: 'Driver Late', group: 'Service', q: 'How late was / is the driver?' },
    { name: 'Short / Missing Product', group: 'Service', q: 'What was ordered and not delivered?' },
  ];

  const STORES = [
    { num: '10189', name: 'Houston, TX', addr: '8710 Bellaire Blvd, Houston TX', dc: 'PFG Houston' },
    { num: '3011', name: 'Socorro, TX', addr: '10600 Alameda Ave, Socorro TX', dc: 'PFG RFS Arizona' },
    { num: '11598', name: 'Tulsa, OK', addr: '5110 S Peoria Ave, Tulsa OK', dc: 'PFG Little Rock' },
    { num: '959', name: 'Los Angeles, CA', addr: '4301 S Western Ave, Los Angeles CA', dc: 'PFG Bakersfield' },
    { num: '1147', name: 'McAllen, TX', addr: '2101 N 10th St, McAllen TX', dc: 'PFG Victoria' },
    { num: '1162', name: 'Harlingen, TX', addr: '1505 W Tyler Ave, Harlingen TX', dc: 'PFG Victoria' },
    { num: '1188', name: 'Brownsville, TX', addr: '3055 Boca Chica Blvd, Brownsville TX', dc: 'PFG Victoria' },
    { num: '2240', name: 'Atlanta, GA', addr: '1960 Metropolitan Pkwy, Atlanta GA', dc: 'PFG Atlanta' },
  ];

  const ITEMS = [
    { cin: '1105', name: 'Chicken Dark Meat - Fresh / Bone-In 128 pc', vendor: 'KOCH FOODS OF AL', vnum: '10038' },
    { cin: '7298', name: 'Chicken 8 PC Fresh "Mario"', vendor: 'CASE FARMS, LLC', vnum: '10019' },
    { cin: '6247', name: 'French Fry Battered 3/8" Crinkle-cut', vendor: 'LAMB WESTON', vnum: '90126' },
    { cin: '6833', name: 'Bomber Jalapeno Cheese 8/4#', vendor: 'MCCAIN FOODS USA', vnum: '10047' },
    { cin: '2181', name: 'Coleslaw Mix 4/5#', vendor: 'GreenGate Fresh', vnum: '90096' },
    { cin: '2101', name: 'Flour Breading - Bleached wheat', vendor: 'ARDENT MILLS', vnum: '10000' },
    { cin: '7365', name: 'BOX FAMILY "BOLD TX"', vendor: 'HUHTAMAKI CO. MFG.', vnum: '2029' },
    { cin: '3320', name: 'Honey Butter Biscuit Mix 6/5#', vendor: 'ARDENT MILLS', vnum: '10000' },
    { cin: '4410', name: 'Fryer Shortening Clear 35#', vendor: 'BUNGE LODERS', vnum: '10112' },
    { cin: '5502', name: 'Honey Sauce Packet 500ct', vendor: 'SAUER BRANDS', vnum: '10071' },
  ];

  // ago = hours before now for each timeline step
  const BASE = [
    { ref: 'QA-2026-000001', headline: 'Three bags from one case weighed 3.6 lb against 4.0 lb spec', status: 'Resolved', type: 'Underfilled / Underweight', severity: 'Medium',
      store: '10189', item: '6833', lot: 'MC6833-2207A', useByDays: 70, deliveredDaysAgo: 27, qty: '3 bags', by: 'Marcus Whitfield', phone: '(713) 555-0142',
      desc: 'Opened a case for lunch prep and three of the four bags felt light. Put them on the prep scale one at a time: 3.6, 3.6 and 3.7 lb. The fourth bag was 4.0. Case is marked 8/4# so every bag should be 4 lb. Weighed them twice on a scale we zeroed first.',
      photos: P('QA-2026-000001'), credit: 41.85,
      timeline: [
        { ago: 624, kind: 'submit', text: 'Filed from the store tablet' },
        { ago: 621, kind: 'intake', who: 'Tasha (QA)', text: 'Intake complete. Weights are credible: store zeroed the scale and repeated the measurement, and the fourth bag in the same case read on spec, which points at the filler rather than at the scale. Routed to McCain as an out-of-spec fill. Asked the store to hold the three bags and the case label.' },
        { ago: 620, kind: 'notify', text: 'McCain QA Desk notified by email' },
        { ago: 566, kind: 'response', who: 'McCain QA Desk', text: "Confirmed against our fill records for this lot. Line 2's checkweigher drifted low over that shift and the automatic reject did not trigger at the margin we saw. No other Church's cases from it are affected. Calibration corrected and the checkweigher is now verified at shift start rather than daily. Credit for three bags on the next invoice." },
        { ago: 558, kind: 'resolve', who: 'Tasha (QA)', text: 'Resolved. Checkweigher drift on line 2, calibration corrected. Credit for three bags issued. Store told it can discard the held product.' },
      ] },
    { ref: 'QA-2026-000002', headline: 'Two of six cases crushed on the pallet', status: 'Resolved', type: 'External Damage', severity: 'Medium',
      store: '3011', item: '7365', lot: 'HUH7365-0731', useByDays: null, deliveredDaysAgo: 22, qty: '2 cases', by: 'Hector Villanueva', phone: '(915) 555-0133',
      desc: 'Caught it at the back door during receiving. Two cases on the bottom of the stack were crushed down one side, corners split open and the boxes inside bent. Looks like something heavy rode on top of them on the pallet. Driver saw it and initialled the invoice. The other four cases on the same pallet are fine.',
      photos: P('QA-2026-000002'), credit: 96.40, dc: 'PFG RFS Arizona',
      timeline: [
        { ago: 504, kind: 'submit', text: 'Filed from the store tablet' },
        { ago: 501, kind: 'intake', who: 'Jennifer (QA)', text: 'Intake complete. Damage found at receiving with the driver present and the invoice initialled, so this sits with the distributor rather than Huhtamaki. Routed to PFG RFS Arizona for credit.' },
        { ago: 500, kind: 'notify', text: 'PFG RFS Arizona service desk notified by email' },
        { ago: 468, kind: 'response', who: 'PFG RFS Arizona', text: 'We accept the damage as occurring in our network. Credit for two cases raised against invoice 4471902. Inbound team is reviewing bottom-tier stacking on this lane.' },
        { ago: 460, kind: 'resolve', who: 'Jennifer (QA)', text: 'Resolved. DC credited two cases. Huhtamaki not notified: same lot arrived undamaged in four other cases on the same pallet.' },
      ] },
    { ref: 'QA-2026-000003', headline: 'Truck 3 h 40 min past window, store short on fresh chicken for lunch', status: 'ClosedNoAction', type: 'Driver Late', severity: null, service: true,
      store: '10189', item: null, lot: null, useByDays: null, deliveredDaysAgo: 17, qty: null, by: 'Denise Okoro', phone: '(713) 555-0178',
      desc: 'Delivery window was 05:00 to 07:00 and the truck came in at 10:40, so 3 hours 40 minutes late. Nobody called us. We opened short on fresh chicken and were rationing 8-piece through the lunch rush until it was put away. Driver said he had been rerouted that morning.',
      photos: [], dc: 'PFG Houston',
      timeline: [
        { ago: 408, kind: 'submit', text: 'Filed from the store tablet' },
        { ago: 405, kind: 'note', who: 'Tasha (QA)', text: 'Service issue, no product involved. No delay notification was made, which is what turned a late truck into a short lunch. Raising it with PFG Houston directly.' },
        { ago: 398, kind: 'note', who: 'Tasha (QA)', text: 'PFG Houston: truck rerouted at 04:30 after a breakdown on the prior stop; store was not called, which they accept was the failure. Dispatch reminded that a reroute over an hour means a call to every affected store.' },
        { ago: 396, kind: 'close', who: 'Tasha (QA)', text: 'Closed, no action. Logged against PFG Houston\'s service record so the pattern is visible if it repeats.' },
      ] },
    { ref: 'QA-2026-000004', headline: 'Browning and wilted edges on two bags, three days inside use-by', status: 'SupplierNotified', type: 'Appearance and Size', severity: 'Medium',
      store: '11598', item: '2181', lot: 'GG2181-B2338', useByDays: 3 - 9, deliveredDaysAgo: 11, qty: '2 bags', by: 'Sheila Mabry', phone: '(918) 555-0187',
      desc: 'Two bags out of the four in the case are brown along the cut edges and the shreds have gone limp, more like week-old slaw than fresh. Use-by on the bag still had three days on it. Cooler held 36 to 38 F all week per the log. The other two bags in the same case look normal.',
      photos: P('QA-2026-000004'),
      timeline: [
        { ago: 216, kind: 'submit', text: 'Filed from the store tablet' },
        { ago: 213, kind: 'intake', who: 'Grace (QA)', text: 'Intake complete. Cooler log 36–38 F and two bags from the same case are sound, so not a store temperature failure and not a whole-lot failure. Routed to GreenGate as a quality-at-pack question. Store holding both bags.' },
        { ago: 212, kind: 'notify', text: 'GreenGate Food Safety notified by email' },
        { ago: 170, kind: 'response', who: 'GreenGate Food Safety', text: 'Lot passed our 48-hour hold-and-look. Two bags browning while two from the same case hold is consistent with a seal weakness rather than raw material. Checking seal integrity on that pack line and would like the two bags returned. Return label to follow.' },
      ] },
    { ref: 'QA-2026-000005', headline: 'Blue plastic fragment about 20 mm found during breading; object retained', status: 'SupplierNotified', type: 'Foreign Object', severity: 'High', chaseOverdue: true,
      store: '10189', item: '1105', lot: 'KF1105-24807', useByDays: 2, deliveredDaysAgo: 5, qty: '1 case', by: 'Ray Delacruz', phone: '(713) 555-0119',
      desc: 'Found a hard blue plastic piece about 20 mm long in the breading pan while breading thighs from this case. It is stiff, not film, and one edge looks broken rather than cut. Nothing blue is used at this station. We stopped breading, threw out the pan of breading and pulled the rest of the case. The piece is bagged and labelled in the office and we will not throw it out until QA or the supplier says so.',
      photos: P('QA-2026-000005'),
      timeline: [
        { ago: 96, kind: 'submit', text: 'Filed from the store tablet' },
        { ago: 93, kind: 'intake', who: 'Tasha (QA)', text: 'Intake complete, severity High. Hard blue plastic in a raw protein is a food-safety report. Store stopped the station, discarded the breading, quarantined the case and retained the object. Routed to Koch Foods with a request for their blue-plastic component inventory on that line and whether metal / X-ray detection would catch a piece this size.' },
        { ago: 92, kind: 'notify', text: 'Koch Foods QA notified by email · reply due in 48 h' },
      ] },
    { ref: 'QA-2026-000006', headline: 'Fries soft and clumped on arrival, probe read 34 F in the case', status: 'AwaitingDcAction', type: 'Temperature', severity: 'Medium', tempConcern: true,
      store: '10189', item: '6247', lot: 'LW6247-23901', useByDays: 120, deliveredDaysAgo: 2, qty: '2 cases', by: 'Marcus Whitfield', phone: '(713) 555-0142',
      desc: 'Fries came off the truck soft and stuck together in solid clumps you have to break apart, which is what you get when they thaw and refreeze. Probed between the bags in the case at the back door and got 34 F on a frozen item. Two cases on the same pallet are the same. Did not accept them into the freezer, they are on the dock marked hold.',
      photos: P('QA-2026-000006'), dc: 'PFG Houston',
      timeline: [
        { ago: 48, kind: 'submit', text: 'Filed from the store tablet' },
        { ago: 45, kind: 'intake', who: 'Tasha (QA)', text: 'Intake complete. A frozen item probing 34 F at the back door is a cold-chain failure in transit — PFG Houston\'s to answer, not Lamb Weston\'s. Asked for the trailer temperature record and pickup or disposal instruction.' },
        { ago: 44, kind: 'notify', text: 'PFG Houston service desk notified by email' },
      ] },
    { ref: 'QA-2026-000007', headline: 'Off odor and slime on opening, product 48 F at receipt, delivery held', status: 'AwaitingDcAction', type: 'Spoilage', severity: 'High', tempConcern: true,
      store: '959', item: '7298', lot: 'CF7298-24112', useByDays: 2, deliveredDaysAgo: 1, qty: '6 cases', by: 'Andre Kimball', phone: '(213) 555-0154',
      desc: 'Opened the first case at receiving and it hit you straight away, a sour ammonia smell, and the pieces are slimy to the touch. Probed three pieces and got 48, 48 and 49 F on a fresh item that should be 28 to 32. The whole delivery of six cases smells the same. Refused all six and held the driver at the dock. Nothing went into the cooler.',
      photos: P('QA-2026-000007'), dc: 'PFG Bakersfield',
      timeline: [
        { ago: 24, kind: 'submit', text: 'Filed from the store tablet' },
        { ago: 22, kind: 'intake', who: 'Grace (QA)', text: 'Intake complete, severity High. Spoiled on arrival; store was right to refuse the whole delivery. Nothing entered the cooler. Notifying Case Farms for the pack and ship record.' },
        { ago: 21, kind: 'notify', text: 'Case Farms QA notified by email' },
        { ago: 19, kind: 'note', who: 'Grace (QA)', text: 'A full delivery at 48 F is unlikely to have hit only this store. Handing to the DC so the trailer record is pulled and other stores on that lane are checked before their next service.' },
        { ago: 18, kind: 'notify', text: 'PFG Bakersfield service desk notified by email' },
      ] },
    { ref: 'QA-2026-000008', headline: 'Two bags in a case with no lot or date code printed', status: 'PendingIntake', type: 'Mis-labeled / Missing label', severity: null,
      store: '10189', item: '2101', lot: 'AM2101-24215', useByDays: 140, deliveredDaysAgo: 1, qty: '2 bags', by: 'Tanya Brooks', phone: '(713) 555-0165',
      desc: 'Two bags in this case have a blank strip where the lot and date code should be printed. The product name is on them, just no code at all, like the printer skipped. The other bags in the same case are printed normally. We have not opened the two blank ones and set them aside.',
      photos: P('QA-2026-000008'),
      timeline: [ { ago: 0.67, kind: 'submit', text: 'Filed from the store tablet' } ] },
  ];

  const KEY = 'quip-demo-v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const write = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } };

  function hydrate(raw, now) {
    const t0 = raw.createdAt ? raw.createdAt : now - raw.timeline[0].ago * H;
    const timeline = raw.timeline.map(s => ({ ...s, at: s.at || (now - s.ago * H) }));
    const store = STORES.find(s => s.num === raw.store) || { num: raw.store, name: raw.storeName || raw.store };
    const item = ITEMS.find(i => i.cin === raw.item) || null;
    return {
      ...raw, timeline, store, itemObj: item,
      submittedAt: timeline[0].at,
      deliveryDate: raw.deliveryDate || (raw.deliveredDaysAgo != null ? now - raw.deliveredDaysAgo * D : null),
      useByDate: raw.useByDate || (raw.useByDays != null ? now + raw.useByDays * D : null),
      vendor: item ? item.vendor : null,
      statusInfo: STATUS[raw.status],
    };
  }

  window.QUIP = {
    KEY, STATUS, INCIDENT_TYPES, STORES, ITEMS, HOUR: H, DAY: D,
    TABLET_STORE: '10189',
    /** All incidents (seed + filed in this browser), newest first, with QA edits applied. */
    all() {
      const now = Date.now(), s = read();
      const edits = s.edits || {};
      const list = BASE.concat(s.filed || []).map(r => {
        const e = edits[r.ref];
        const merged = e ? { ...r, status: e.status || r.status, severity: e.severity !== undefined ? e.severity : r.severity, timeline: r.timeline.concat(e.steps || []) } : r;
        return hydrate(merged, now);
      });
      return list.sort((a, b) => b.submittedAt - a.submittedAt);
    },
    get(ref) { return this.all().find(i => i.ref === ref); },
    nextRef() { const n = 8 + ((read().filed || []).length) + 1; return 'QA-2026-' + String(n).padStart(6, '0'); },
    /** File a new incident from the tablet. photos: [{src: dataURL, label}] */
    file(inc) {
      const s = read(); s.filed = s.filed || [];
      const ref = this.nextRef();
      const rec = { ...inc, ref, status: 'PendingIntake', createdAt: Date.now(), timeline: [{ at: Date.now(), kind: 'submit', text: 'Filed from the store tablet' }] };
      s.filed.push(rec);
      if (!write(s)) { rec.photos = (rec.photos || []).map(p => ({ ...p, src: p.sample || '' })); s.filed[s.filed.length - 1] = rec; write(s); }
      return ref;
    },
    /** QA action on any incident: patch = {status?, severity?}, step = {kind, who, text} */
    act(ref, patch, step) {
      const s = read(); s.edits = s.edits || {};
      const e = s.edits[ref] = s.edits[ref] || { steps: [] };
      if (patch) Object.assign(e, patch);
      if (step) e.steps.push({ ...step, at: Date.now() });
      write(s);
    },
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} },
    fmtAgo(t) { const m = Math.round((Date.now() - t) / 60000); if (m < 1) return 'just now'; if (m < 60) return m + ' min ago'; const h = Math.round(m / 60); if (h < 48) return h + ' h ago'; return Math.round(h / 24) + ' days ago'; },
    fmtDate(t) { return t ? new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'; },
  };
})();
