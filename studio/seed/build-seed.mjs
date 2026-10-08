// Builds seed.ndjson from the club's current content (requirements v1, 28 Sep 2026)
// and the photos in ./images/club. Import it with:
//
//   npm run seed         (from the studio folder)
//
// Document IDs are fixed, so re-running the import with --replace updates the same documents.

import {writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const SOURCE = 'Club requirements document v1, 28 September 2026'
const CREDIT = 'Lions Club of Dummalasuriya'

let keyCounter = 0
const key = () => `k${(++keyCounter).toString(36).padStart(4, '0')}`

const photo = (file, alt, caption, withKey = true) => ({
  ...(withKey ? {_key: key()} : {}),
  _type: 'photo',
  _sanityAsset: `image@${pathToFileURL(join(here, 'images', 'club', `${file}.webp`)).href}`,
  alt,
  ...(caption ? {caption} : {}),
  credit: CREDIT,
  permissionConfirmed: false,
})

const photos = (list) => list.map(([file, alt]) => photo(file, alt))

const docs = []

docs.push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  clubName: 'Lions Club of Dummalasuriya',
  district: 'Lions District 306 D11',
  multipleDistrict: 'Multiple District 306',
  locality: 'Dummalasuriya, Sri Lanka',
  serviceYear: '2026/27',
  localWording: 'Serve with passion, be a proud lion.',
  secretaryName: 'Lion Kushan Jayakody',
  secretaryRole: 'Secretary',
  email: 'lionsclubofdummalasuriya@gmail.com',
  phoneDisplay: '+94 76 564 6292',
  phoneInternational: '+94765646292',
  whatsappNumber: '+94765646292',
  facebook: 'https://www.facebook.com/LionsClubDummalasuriya',
  heroPhoto: photo(
    'installation-01',
    'Dummalasuriya Lions officers and guests gathered at the 2026/27 club installation ceremony',
    'Our club. Our community. Stronger together. Ready to serve.',
    false,
  ),
  aboutPhotos: [
    photo('meetings-01', 'Club members meeting around a table with documents and notebooks.', 'Planning our service'),
    photo('social-03', 'Members taking a photo together at the social event.', 'Friendship through Lions'),
  ],
  seoTitle: 'Lions Club of Dummalasuriya | Serve with Passion',
  seoDescription:
    'Lions Club of Dummalasuriya brings local people together for practical service, environmental projects and fellowship in Dummalasuriya, Sri Lanka. Find out how to join, volunteer or support our work.',
  impactPeriod: 'July–September 2026',
  impactItems: [
    {_key: key(), _type: 'highlight', value: 50, label: 'coconut saplings donated at Bingiriya'},
    {_key: key(), _type: 'highlight', value: 30, label: 'elders served at Sarana Elders Home'},
    {_key: key(), _type: 'highlight', value: 8, label: 'Lions clubs in the joint Dambadeniya programme'},
  ],
})

// Homepage wording, as on the site at handover. Wrap words in *asterisks* for the italic accent.
const tb = (type, title, body) => ({_key: key(), _type: type, title, body})
const heading = (eyebrow, title, intro) => ({_type: 'sectionHeading', eyebrow, title, intro})

docs.push({
  _id: 'homepage',
  _type: 'homepage',
  heroHeadline: 'A little of your time.',
  heroHeadlineAccent: 'A world of difference.',
  heroIntro:
    'We bring people together to serve Dummalasuriya and the communities around us. Join us in caring for people, protecting our environment, and making kindness count.',
  heroPrimaryCta: 'Become a member',
  heroSecondaryCta: 'Explore our projects',

  aboutHeading: 'Neighbours who *serve* together.',
  aboutIntro:
    'We are the Lions Club of Dummalasuriya, part of Lions District 306 D11 in Sri Lanka, and one local club in a worldwide community of Lions.',
  aboutStatement:
    'We bring people together to serve Dummalasuriya and neighbouring communities through practical service, environmental projects and fellowship. You can become a member, volunteer on a suitable project, or support the club through donations and partnerships.',
  pillars: [
    tb('pillar', 'Local identity', 'Neighbours serving neighbours in Dummalasuriya and the communities around us.'),
    tb('pillar', 'Community care', 'Practical help where it is needed, from shared meals to cleaner public spaces.'),
    tb('pillar', 'Environmental service', 'Planting and caring for a greener, healthier place to live.'),
    tb('pillar', 'Fellowship', 'Friendships built while serving together, locally and across our district.'),
  ],

  causesHeading: heading(
    'One movement. Many ways to care.',
    'Eight global causes. *Service close to home.*',
    'Lions around the world unite around these causes. Each club chooses activities that respond to its own community.',
  ),
  projectsHeading: heading(
    'Our work in the community',
    'Service that *means something.*',
    'A closer look at our recent projects, and the people who make them possible.',
  ),
  galleryHeading: heading(
    'Our club in pictures',
    'The people behind *the service.*',
    'Service, friendship and shared purpose. Explore moments from club life.',
  ),
  officersHeading: heading(
    'Meet the team',
    'Our club *officers.*',
    'Working together to guide our service, welcome members and support the community.',
  ),
  contactHeading: heading(
    'Let’s connect',
    'Good things start *with a hello.*',
    'Membership, volunteering, partnerships or a community need: send us a message, call the secretary or email the club.',
  ),

  joinHeading: heading(
    'Get involved',
    'Your first step is *a simple one.*',
    'You do not need to have all the answers. Let’s start with a conversation.',
  ),
  joinSteps: [
    tb('step', 'Introduce yourself', 'Send a WhatsApp message using the form below, or call our secretary. There is no commitment at this stage.'),
    tb(
      'step',
      'Visit a meeting or activity',
      'Ask about a club meeting or a suitable service activity to visit. The secretary will confirm the arrangements first.',
    ),
    tb(
      'step',
      'Talk it through',
      'Discuss membership requirements, commitments and fees with the club, then agree the next steps together.',
    ),
  ],
  enquiryEyebrow: 'Membership, meetings & more',
  enquiryHeading: 'Tell us you’re interested.',
  enquiryIntro:
    'Thinking of joining, want to visit a meeting, or keen to help with a project? Send a short WhatsApp message and the secretary will get back to you with the confirmed date, time, venue and anything else you need.',
  enquiryPoints: ['A reply on WhatsApp from the secretary', 'No commitment at this stage', 'Nothing is stored on this website'],
  volunteerTitle: 'Not ready to join? Volunteer.',
  volunteerBody:
    'You can ask about helping with an individual activity. We will confirm whether it is suitable and available before you take part. Volunteering is separate from applying for membership.',
  faqHeading: 'A few things you may be wondering.',
  faqs: [
    [
      'What does being a Lion mean?',
      'It means joining people who volunteer together to meet community needs. Members plan and take part in service, build friendships and contribute their time and skills through a local club.',
    ],
    [
      'Can I speak to someone before joining?',
      'Yes. Contact our secretary with your questions and ask about visiting a club meeting or a suitable service activity. The secretary will confirm the arrangements before you attend.',
    ],
    [
      'Are there membership fees or a time commitment?',
      'Ask the secretary about current club dues, any joining fees, meetings and service commitments. We will explain the requirements before you decide. No payment is collected on this website.',
    ],
    [
      'Does sending a message make me a member?',
      'No. It lets the secretary know you are interested. They will reply on WhatsApp, explain the club’s membership process and discuss the next steps with you.',
    ],
    [
      'Can I volunteer without becoming a member?',
      'You can ask the secretary about helping with an individual activity. Opportunities depend on the project and its needs, so please confirm arrangements with the club first.',
    ],
  ].map(([question, answer]) => ({_key: key(), _type: 'faq', question, answer})),

  supportHeading: heading(
    'Support our work',
    'Help us serve *more people.*',
    'Interested in donating, giving useful supplies, sponsoring a project or partnering with us? Speak to the secretary about current opportunities.',
  ),
  supportCta: 'Discuss how to help',
  supportWays: [
    ['money', 'Donations', 'Ask about the club’s official donation arrangements.'],
    ['supplies', 'Useful supplies', 'Saplings, food, cleaning kit or materials for a project.'],
    ['sponsor', 'Sponsorship', 'Back a specific service project in our community.'],
    ['partner', 'Partnerships', 'Work with us as an organisation, school or business.'],
  ].map(([icon, title, body]) => ({_key: key(), _type: 'way', icon, title, body})),

  marqueeWords: ['We Serve', 'Serve with passion', 'Be a proud lion', 'Dummalasuriya'],
  footerTagline: 'We Serve. Be part of the difference.',
})

docs.push({
  _id: 'project-kapruka-sangramaya',
  _type: 'project',
  title: 'Kapruka Sangramaya',
  slug: {_type: 'slug', current: 'kapruka-sangramaya'},
  category: 'Environment',
  summary: 'Supporting the coconut sapling initiative in Kurunegala and Bingiriya.',
  activities: [
    {
      _key: key(),
      _type: 'activity',
      date: '2026-06-30',
      place: 'Kurunegala Lions Office',
      summary: 'Coconut saplings handed over at the district office for the Kapruka Sangramaya initiative.',
      statistic: {value: 250, unit: 'saplings handed over', source: `${SOURCE}, record PR01`},
      // No caption: filenames do not establish which distribution a photo shows (FR09).
      image: photo('kapruka-01', 'Club members beside coconut saplings and the Dummalasuriya club banner.', undefined, false),
      reviewDate: '2026-09-28',
    },
    {
      _key: key(),
      _type: 'activity',
      date: '2026-07-07',
      place: 'Devagiri Rajamaha Viharaya, Bingiriya',
      summary: 'Coconut saplings donated to the temple community at Bingiriya.',
      statistic: {value: 50, unit: 'saplings donated', source: `${SOURCE}, record PR02`},
      image: photo('kapruka-07', 'A club member planting a coconut sapling.', undefined, false),
      reviewDate: '2026-09-28',
    },
  ],
  photos: photos([
    ['kapruka-01', 'Club members beside coconut saplings and the Dummalasuriya club banner.'],
    ['kapruka-02', 'Two participants beside a newly planted coconut sapling.'],
    ['kapruka-03', 'A coconut sapling handover beside the club banner.'],
    ['kapruka-04', 'Participants presenting a coconut sapling at the distribution.'],
    ['kapruka-05', 'Members taking part in a coconut sapling handover.'],
    ['kapruka-06', 'A participant receiving a coconut sapling from a club member.'],
    ['kapruka-07', 'A club member planting a coconut sapling.'],
    ['kapruka-08', 'Club members standing beside coconut saplings ready for distribution.'],
  ]),
  showInGallery: true,
  galleryDescription: 'Coconut sapling distribution and planting with our club.',
  galleryOrder: 1,
})

docs.push({
  _id: 'project-elders-home-meal',
  _type: 'project',
  title: 'Elders home meal',
  slug: {_type: 'slug', current: 'elders-home-meal'},
  category: 'Community care',
  summary: 'A meal donation at Sarana Elders Home in Weerapokuna.',
  activities: [
    {
      _key: key(),
      _type: 'activity',
      date: '2026-08-19',
      place: 'Sarana Elders Home, Weerapokuna',
      summary: 'A meal donation bringing members and volunteers together in service.',
      facts: ['LKR 25,000 contributed to the project.'],
      statistic: {value: 30, unit: 'elders served', source: `${SOURCE}, record PR03`},
      reviewDate: '2026-09-28',
    },
  ],
  photos: [],
  // No approved photograph yet, so no album (FR09).
  showInGallery: false,
  galleryOrder: 10,
})

docs.push({
  _id: 'project-cleaning-dengue-prevention',
  _type: 'project',
  title: 'Cleaning and dengue prevention',
  slug: {_type: 'slug', current: 'cleaning-and-dengue-prevention'},
  category: 'Community wellbeing',
  summary: 'A joint cleaning and dengue-prevention programme at Dambadeniya with eight Lions Clubs.',
  partner: 'Joint programme with eight Lions Clubs',
  activities: [
    {
      _key: key(),
      _type: 'activity',
      date: '2026-09-06',
      place: 'Dambadeniya',
      summary: 'A joint community cleaning and dengue-prevention programme.',
      statistic: {value: 8, unit: 'Lions clubs took part', source: `${SOURCE}, record PR04`},
      image: photo(
        'cleaning-01',
        'Members and volunteers gathered with club banners and collected waste.',
        'Members and volunteers during the Dambadeniya cleaning programme.',
        false,
      ),
      reviewDate: '2026-09-28',
    },
  ],
  photos: photos([
    ['cleaning-01', 'Members and volunteers gathered with club banners and collected waste.'],
    ['cleaning-02', 'Volunteers with bags of collected waste during the community cleanup.'],
    ['cleaning-03', 'Participants carrying out cleaning work beside a tractor.'],
    ['cleaning-04', 'Volunteers collecting waste along the roadside.'],
    ['cleaning-05', 'Lions and volunteers gathered during the cleaning programme.'],
    ['cleaning-06', 'Participants taking a group photo during the cleanup.'],
    ['cleaning-07', 'Volunteers with collected waste beside Lions club banners.'],
  ]),
  showInGallery: true,
  galleryTitle: 'Cleaner communities',
  galleryDescription: 'Members and volunteers working together on cleaning and dengue prevention.',
  galleryOrder: 2,
})

const album = (id, order, title, category, description, list) => ({
  _id: `album-${id}`,
  _type: 'album',
  title,
  slug: {_type: 'slug', current: id},
  category,
  description,
  photos: photos(list),
  order,
})

docs.push(
  album('officers-installation', 3, 'Officers’ installation', 'Club life', 'Moments from the 2026/27 Club Officers Installation Ceremony.', [
    ['installation-01', 'Club officers and guests at the 2026/27 installation ceremony.'],
    ['installation-02', 'A presentation during the Club Officers Installation Ceremony.'],
    ['installation-03', 'A speaker addressing members at the installation ceremony.'],
    ['installation-04', 'Club members and guests gathered for an installation group photo.'],
    ['installation-05', 'Members and guests seated together at the installation ceremony.'],
    ['installation-06', 'A floral presentation at the installation ceremony.'],
    ['installation-07', 'A guest speaking during the officers’ installation.'],
    ['installation-08', 'A presentation in front of the installation ceremony banner.'],
    ['installation-09', 'Members and guests standing together at the installation ceremony.'],
  ]),
  album('planning-our-service', 4, 'Planning our service', 'Club meetings', 'Club members coming together to discuss service and club activities.', [
    ['meetings-01', 'Club members meeting around a table with documents and notebooks.'],
    ['meetings-02', 'Members in discussion around the meeting table.'],
    ['meetings-03', 'A wider view of members attending a club meeting.'],
    ['meetings-04', 'Participants exchanging ideas at a club meeting.'],
    ['meetings-05', 'Members seated together during a club discussion.'],
  ]),
  album('friendship-through-lions', 5, 'Friendship through Lions', 'Fellowship', 'Shared moments with fellow Lions at District Social 2026.', [
    ['social-01', 'Lions members together at District Social 2026.'],
    ['social-02', 'A group of Lions members enjoying the district social.'],
    ['social-03', 'Members taking a photo together at the social event.'],
    ['social-04', 'Lions members gathered outdoors at the district social.'],
    ['social-05', 'Members sharing a group photo during the district gathering.'],
    ['social-06', 'A larger group of Lions members at the social event.'],
    ['social-07', 'The entrance to the District Social 2026 event.'],
  ]),
  album('learning-to-serve', 6, 'Learning to serve', 'Leadership development', 'Club members at the District 306 D11 Club School for 2026/27.', [
    ['club-school-01', 'Four club members in front of the District 306 D11 Club School 2026/27 stage.'],
  ]),
)

const officers = [
  ['president', 'President', 'Lion Pabasara Herath'],
  ['vice-president', 'Vice President', 'Lion Gayani Pradeepika Fernando'],
  ['secretary', 'Secretary', 'Lion Kushan Shakya Jayakody'],
  ['treasurer', 'Treasurer', 'Lion Linthotage John Canicious Perera'],
  ['service-chairperson', 'Service Chairperson', 'Lion Chaminda Rathnayake'],
  ['membership-chairperson', 'Membership Chairperson', 'Lion Herath Mudiyanselage Lalith Kumara'],
  ['lcif-chairperson', 'LCIF Chairperson', 'Lion Udari Vihanga Hathwise'],
  ['marketing-chairperson', 'Marketing & Communications Chairperson', 'Lion H. M. Ruvini Anurudika Herath'],
]
officers.forEach(([slug, role, name], i) =>
  docs.push({
    _id: `officer-2026-27-${slug}`,
    _type: 'officer',
    name,
    role,
    serviceYear: '2026/27',
    portrait: photo(`officer-${slug}`, `${name}, ${role}`, undefined, false),
    order: i + 1,
    status: 'current',
  }),
)

const out = join(here, 'seed.ndjson')
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents to ${out}`)
