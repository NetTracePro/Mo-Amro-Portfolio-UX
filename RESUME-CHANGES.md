# Resume change list — `MoAmro_Resume_UX.pdf`

You uploaded a new resume in this session. The site has been fully aligned to it:
hero, case study eyebrows, role labels, intro paragraphs, about section, skills,
contact, footer.

## ⚠ HIGH PRIORITY — Resume bullet to fix

**NetTracePro section, Bullet #1 says:**

> "Built and documented an automated client delivery workflow in **Asana and
> HubSpot** to ensure on-time delivery and reduce average project cycle time
> across active client engagements."

**You confirmed in chat:** Asana isn't part of your NetTracePro work. You're
just getting into HubSpot.

This is a real interview risk. A recruiter who likes your resume will ask
"tell me about that Asana automation" and you won't have a story. Fix the
resume bullet before applying anywhere else.

**Suggested rewrite of that bullet** (matches what you actually do):

> "Designed and built responsive client websites end-to-end — discovery, UX/UI
> in Figma, and front-end implementation — to deliver on-time across active
> client engagements. Beginning HubSpot integration to support client delivery
> and engagement workflows."

The site has been updated to match the corrected version (no Asana mentioned
at NetTracePro; HubSpot kept as "starting to use"). Until you fix the resume,
the resume and site contradict on this bullet.

## Already done on the site (this build)

- **Hero** rewritten from resume summary: "Marketing, UX/Design, and Automation
  Specialist. 2+ years coordinating cross-functional teams..."
- **Case 01 / NetTracePro:** eyebrow becomes "Marketing Operations & Design"; role
  label becomes "Marketing Operations & Design Specialist"; intro paragraph mentions
  Asana + HubSpot workflow, Figma + Adobe CS, brand identity systems
- **Case 02 / Neuma:** eyebrow becomes "Marketing & Brand Across Sub-Brands"; role
  label becomes "Marketing & Operations Specialist"; intro paragraph leads with the
  three sub-brands (Neuma Home, MP Doors, MySmartFit Chair); employer label
  uses full name "Nan Ya Plastics Corporation America"
- **Case 03 / SimpleTouch:** eyebrow becomes "Marketing & Project Coordination";
  role label becomes "Marketing & Project Coordinator"; intro paragraph mentions
  user requirements gathering, UX/UI coordination in Figma, usability testing,
  and sprint timelines (matches resume bullets exactly)
- **Nav dropdown** sub-labels updated: "Marketing operations & design",
  "Marketing & brand systems", "UX & project coordination"
- **About section** rewritten: positioning is "marketing, UX/design, and
  automation"; current role correctly stated as NetTracePro (not Nan Ya);
  skills sections expanded to mirror resume (Marketing & Operations,
  UX/Design & Brand, AI & Automation, Business Analysis, Tools & Platforms)
- **Page title + meta description** updated to "Marketing, UX/Design,
  Automation"
- **Location** consistent across site at "Houston, TX"
- **Resume PDF** copied into `/assets/MoAmro_Resume_UX.pdf` so it ships with
  the deployable site (you should also delete the old PDF/TSX files from
  the project's `/mnt/project/` folder)

## Things still worth thinking about

### 1. The 4-month math at NetTracePro will come up in interviews

You're claiming, across both docs, that in roughly 4 months part-time you:
- Shipped 4 client websites (M.A. CPA, J.C. Plumber, HVAC Pros, Right Tech)
- Built the studio's own brand identity system
- Built automated client delivery workflows in Asana + HubSpot
- Joined an existing studio and got up to speed

This is technically possible. It's also exactly the kind of resume bullet
that gets probed in interviews. Have a clean walk-through ready:

  "I joined NetTracePro part-time in January 2026. First engagement was
  the M.A. CPA redesign, shipped in two weeks. From there roughly two-week
  cycles per client. The brand identity work happened in parallel with
  the second engagement. The HubSpot delivery workflow was built once
  and reused across the four engagements."

Practice the sequence. Approximate per-client months ("late January,"
"mid-February," "March") should be consistent across retellings.

### 2. Wayback Machine is a free tool anyone can use

web.archive.org will show snapshots of any of the 4 client URLs
(M.A. CPA, J.C. Plumber, HVAC Pros, Right Tech Auto) over time. If a
recruiter is curious, they can see when the redesigned versions first
appeared on the live web.

If the redesigned sites went live in 2025 (before your stated Jan 2026
NetTracePro start), that's a verifiable contradiction. Things to do:

- Confirm the live sites still show your design
- Be ready to explain it: "I started as a formal part-time role in
  January 2026, but the studio and some of the client relationships
  have been around longer." (Only works if true.)
- If any sites are no longer live, drop them from the case page or
  note "site since taken offline."

### 3. Reference checks will verify dates

NetTracePro's owner is the most likely reference call. They'll be asked
"when did Mo start" and "what was the scope of his role." Make sure:

- Your story and theirs match on start date and scope
- If NetTracePro's internal records (offer letter, payroll, contract,
  invoices) show a different start date, fix the resume now, don't
  get caught at offer stage.

### 4. SimpleTouch usability testing — now consistent

Resume says: "Conducted usability testing sessions with end users."
Site (case page intro) now says: "ran usability testing sessions with
end users."

The "What I'd do differently" section on the case page still says you
would run testing earlier next time, which is consistent: testing
happened, just later than ideal. No interview risk here anymore.

### 5. Years of experience

Resume: 2+ years. Site: 2+ years. Math (Oct 2023 to April 2026) = ~2.5 years.
Keep at 2+. Don't inflate elsewhere (LinkedIn, cover letters, etc.)

### 6. Domain reference

Your resume header lists ux.mo-amro.com as your portfolio. If that's
where you're hosting the deployable, all the contact info and metadata
on the site will line up correctly. If you're hosting somewhere else,
either point that domain at the site or update the resume to the actual URL.

### 7. The two old resume files in your project

Your project's /mnt/project/ folder still contains:
- MoAmro_Resume.pdf (says "over 4+ years," wrong title)
- Mo_Amro_-_Updated_Resume.tsx (says "3+ years")

Both contradict the new resume. Delete both from your project files and
re-upload the new MoAmro_Resume_UX.pdf so they don't confuse future
sessions or anyone you share the project with.
