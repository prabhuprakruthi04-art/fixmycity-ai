import { CivicReport } from '../types';

// Helper to generate realistic visual SVG data URIs for environmental crises
export function generateCivicSvgImage(
  title: string,
  category: string,
  colorScheme: 'trash' | 'water' | 'smoke' | 'sewage' | 'clean'
): string {
  const backgrounds = {
    trash: '#3D2817',
    water: '#0C2D48',
    smoke: '#1E293B',
    sewage: '#2E1A0F',
    clean: '#064E3B',
  };

  const accentColors = {
    trash: '#F59E0B',
    water: '#38BDF8',
    smoke: '#EF4444',
    sewage: '#D97706',
    clean: '#10B981',
  };

  const bg = backgrounds[colorScheme] || '#111827';
  const accent = accentColors[colorScheme] || '#10B981';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg}"/>
        <stop offset="100%" stop-color="#050B14"/>
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="600" height="400" fill="url(#bgGrad)"/>
    <rect width="600" height="400" fill="url(#grid)"/>
    <circle cx="520" cy="70" r="70" fill="${accent}" opacity="0.12"/>
    <circle cx="90" cy="330" r="100" fill="${accent}" opacity="0.08"/>
    
    <!-- Horizon / Shoreline / Terrain -->
    <path d="M0,270 Q140,250 300,275 T600,265 L600,400 L0,400 Z" fill="rgba(0,0,0,0.5)"/>
    
    <!-- Category Badge -->
    <g transform="translate(50, 50)">
      <rect x="0" y="0" width="160" height="28" rx="14" fill="${accent}" opacity="0.95"/>
      <text x="80" y="19" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="#000" text-anchor="middle" letter-spacing="0.5">${category}</text>
    </g>

    <text x="50" y="150" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF">${title}</text>
    <text x="50" y="185" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#94A3B8">ENVIRONMENTAL DEGRADATION FORENSICS</text>
    <text x="50" y="340" font-family="system-ui, sans-serif" font-size="12" fill="${accent}" font-weight="700">● AUDIT CO-ORDINATES & STATUTORY AIR/WATER JURISDICTION RECORDED</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 3 PRE-MADE ENVIRONMENTAL REPORTS FOR INSTANT DEMO MODE (WITH BEFORE/AFTER PHOTOS)
export const DEMO_MODE_REPORTS: CivicReport[] = [
  {
    id: 'ENV-DEMO-01',
    problemType: 'Toxic Chemical Foam & Lake Ecosystem Contamination',
    severity: 'Critical',
    description: 'Thick billows of toxic white chemical surfactant foam rising 2 meters from stormwater weir, spilling into the urban lake basin and choking aquatic fauna.',
    likelyCause: 'Unauthorized industrial laundry detergents and untreated chemical effluent discharging into upstream stormwater canals.',
    healthOrEnvironmentalRisk: 'Acute respiratory irritation from airborne foam aerosols; risk of spontaneous hydrocarbon fires on water surface.',
    environmentalImpact: 'Toxic surfactants strip dissolved oxygen from the water body, destroying benthic organisms and fish stocks. Airborne chemical foam disperses carcinogenic phosphates across riparian wetlands.',
    responsibleAuthority: 'State Pollution Control Board (KSPCB) & Lake Development Authority',
    formalComplaint: 'Date: 08 October 2026\n\nTo,\nThe Member Secretary,\nState Pollution Control Board (KSPCB), Bengaluru.\n\nSubject: Critical environmental alert: Toxic chemical surfactant foam at Bellandur Lake Spillway\n\nRespected Officer,\n\nI write to formally lodge an emergency complaint regarding catastrophic chemical foam discharging at Bellandur Lake South Spillway. The toxic froth exceeds 2 meters in height, spilling onto roads and suffocating the lake ecosystem in direct violation of Section 24 of the Water (Prevention and Control of Pollution) Act, 1974.\n\nImmediate water sampling, containment floating booms, and closure of unauthorized effluent pipelines must be executed within 48 hours to avert an ecological disaster.\n\nYours faithfully,\nEnvironment Action Watch',
    suggestedDeadlineDays: 2,
    keyHighlights: [
      '2m thick toxic surfactant foam on public lake weir',
      'Direct violation of Water Pollution Act 1974',
      'Immediate risk to riparian wetland bird sanctuary',
    ],
    location: 'Bellandur Lake South Spillway, Outer Ring Road, Bengaluru',
    coordinates: { lat: 12.9348, lng: 77.6748 },
    photoUrl: '/assets/foam_before.jpg',
    isDemo: true,
    dateFiled: new Date(Date.now() - 5 * 86400000).toISOString(),
    simulatedDaysPassed: 5,
    status: 'Resolved',
    timeline: [
      {
        id: 'ev-1',
        title: 'Environmental Crisis Logged',
        timestamp: new Date(Date.now() - 5 * 86400000).toLocaleString(),
        description: 'Captured chemical foam overflowing into water canal with GPS tags.',
        type: 'filed',
      },
      {
        id: 'ev-2',
        title: 'Emergency SLA Notice Dispatched',
        timestamp: new Date(Date.now() - 3 * 86400000).toLocaleString(),
        description: 'Statutory 48-hour compliance demand served on Pollution Board Chairman.',
        type: 'escalation',
      },
      {
        id: 'ev-3',
        title: 'AI Verification Audit Completed',
        timestamp: new Date(Date.now() - 1 * 86400000).toLocaleString(),
        description: 'Follow-up visual inspection confirms chemical foam eliminated and floating booms installed.',
        type: 'verification',
      },
    ],
    verification: {
      afterPhotoUrl: '/assets/lake_after.jpg',
      fixed: true,
      confidence: 98,
      explanation: 'Forensic photo comparison confirms complete elimination of chemical surfactant froth. Water surface is clear, mechanical aeration booms are operational, and shoreline embankments have been stabilized.',
      verdict: 'RESOLVED',
      dateVerified: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    language: 'en',
  },
  {
    id: 'ENV-DEMO-02',
    problemType: 'Open Waste Burning Emitting Toxic Black Smoke',
    severity: 'Critical',
    description: 'Blatant open burning of commercial plastic waste and chlorinated packaging on open ground, releasing thick toxic black plumes into residential air corridors.',
    likelyCause: 'Illegal waste burning by commercial sweepers to evade landfill transport tipping fees.',
    healthOrEnvironmentalRisk: 'Severe pediatric asthma attacks from PM2.5 spikes; inhalation of highly toxic dioxins and furans.',
    environmentalImpact: 'Open incineration emits heavy black carbon and persistent organic pollutants directly into the troposphere. Toxic heavy metal ash leaches into topsoil, destroying soil microorganisms.',
    responsibleAuthority: 'Air Quality Enforcement Cell & Municipal Public Health Taskforce',
    formalComplaint: 'Date: 06 October 2026\n\nTo,\nThe Senior Environmental Officer (Air Quality Division),\nCity Municipal Corporation, Bengaluru.\n\nSubject: Statutory complaint: Hazardous open waste burning at HSR Sector 2 Layout\n\nRespected Sir,\n\nI am reporting an acute environmental offense: active open incineration of chlorinated plastics along Sector 2, HSR Layout. The acrid black smoke has engulfed residential quarters, causing acute respiratory distress among vulnerable residents.\n\nUnder National Green Tribunal (NGT) orders and the Air (Prevention and Control of Pollution) Act 1981, open burning is strictly prohibited with mandatory spot penalties. We demand emergency dousing, ash neutralization, and prosecution within 48 hours.\n\nYours faithfully,\nClean Air Citizen Vigil',
    suggestedDeadlineDays: 2,
    keyHighlights: [
      'Dense toxic black smoke from burning packaging plastics',
      'Direct breach of NGT national open burning ban',
      'Acute air quality deterioration for 2,000 residents',
    ],
    location: '24th Main, Sector 2, HSR Layout, Bengaluru',
    coordinates: { lat: 12.9116, lng: 77.6433 },
    photoUrl: '/assets/garbage_before.jpg',
    isDemo: true,
    dateFiled: new Date(Date.now() - 4 * 86400000).toISOString(),
    simulatedDaysPassed: 4,
    status: 'Resolved',
    timeline: [
      {
        id: 'ev-1',
        title: 'Air Pollution Alert Filed',
        timestamp: new Date(Date.now() - 4 * 86400000).toLocaleString(),
        description: 'Reported with GPS coordinates and PM2.5 threat alert.',
        type: 'filed',
      },
      {
        id: 'ev-2',
        title: 'NGT Penalty Demand Dispatched',
        timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
        description: 'Auto-escalation notice served to Zonal Health Inspector.',
        type: 'escalation',
      },
      {
        id: 'ev-3',
        title: 'AI Verification Audit Completed',
        timestamp: new Date(Date.now() - 1 * 86400000).toLocaleString(),
        description: 'After-photo confirms fire completely doused, charred ground removed, and warning sign posted.',
        type: 'verification',
      },
    ],
    verification: {
      afterPhotoUrl: '/assets/street_after.jpg',
      fixed: true,
      confidence: 96,
      explanation: 'Analysis confirms all active burning and smoldering embers have been extinguished. Charred plastic residues have been excavated, clean topsoil restored, and an anti-burning legal warning sign installed.',
      verdict: 'RESOLVED',
      dateVerified: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    language: 'en',
  },
  {
    id: 'ENV-DEMO-03',
    problemType: 'Untreated Raw Sewage Inflow into Urban Wetland',
    severity: 'High',
    description: 'Continuous torrent of untreated domestic blackwater sewage spewing from broken municipal main directly into an urban wetland bird habitat.',
    likelyCause: 'Underground sanitary sewer collapse and unauthorized sewage diversion into stormwater culverts.',
    healthOrEnvironmentalRisk: 'Outbreak risk of waterborne pathogens (cholera, gastroenteritis); severe contamination of neighborhood groundwater tables.',
    environmentalImpact: 'Massive nitrate and phosphate loads trigger hyper-eutrophication, suffocating native aquatic flora. Microbes consume all oxygen, turning the wetland into a dead, anaerobic wasteland.',
    responsibleAuthority: 'Water Supply and Sewerage Board (BWSSB) - River & Wetland Wing',
    formalComplaint: 'Date: 03 October 2026\n\nTo,\nThe Chief Engineer (Wastewater Management),\nWater Supply and Sewerage Board, Bengaluru.\n\nSubject: Emergency grievance: Raw untreated sewage discharge into Kaikondrahalli Wetland\n\nRespected Sir,\n\nWe urgently petition your department regarding the catastrophic rupture of a 600mm sewage main discharging blackwater directly into the Kaikondrahalli wetland buffer zone.\n\nThis flagrantly violates the Water (Prevention and Control of Pollution) Act 1974 and National Green Tribunal directives on buffer zones. Immediate bypass pumping and pipe replacement must be completed within 72 hours.\n\nYours faithfully,\nWetland Protectors Coalition',
    suggestedDeadlineDays: 3,
    keyHighlights: [
      'Raw blackwater discharging into sensitive bird wetland',
      'Violates Water Act 1974 & NGT 75-meter buffer zone ruling',
      'Groundwater aquifer poisoning risk for downstream borewells',
    ],
    location: 'Kaikondrahalli Wetland Inflow Canal, Sarjapur Road, Bengaluru',
    coordinates: { lat: 12.9150, lng: 77.6830 },
    photoUrl: '/assets/escalated_before.jpg',
    isDemo: true,
    dateFiled: new Date(Date.now() - 6 * 86400000).toISOString(),
    simulatedDaysPassed: 6,
    status: 'Not Actually Fixed',
    timeline: [
      {
        id: 'ev-1',
        title: 'Wetland Hazard Filed',
        timestamp: new Date(Date.now() - 6 * 86400000).toLocaleString(),
        description: 'Citizen captured raw sewage gushing into wetland with geo-tag.',
        type: 'filed',
      },
      {
        id: 'ev-2',
        title: 'Contractor Claimed Closure',
        timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
        description: 'Maintenance team claimed trench was backfilled.',
        type: 'status_change',
      },
      {
        id: 'ev-3',
        title: 'AI Verification Failed (Fake Fix Caught)',
        timestamp: new Date(Date.now() - 1 * 86400000).toLocaleString(),
        description: 'AI vision detected dark contaminated blackwater still bubbling beneath loose gravel. Marked as Not Actually Fixed!',
        type: 'verification',
      },
    ],
    verification: {
      afterPhotoUrl: '/assets/escalated_after.jpg',
      fixed: false,
      confidence: 93,
      explanation: 'Forensic inspection reveals contractor merely dumped surface aggregate stones over the rupture. Active blackwater sewage continues to ooze and pool along the embankment edge into the wetland water.',
      verdict: 'NOT_ACTUALLY_FIXED',
      dateVerified: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    language: 'en',
  },
  {
    id: 'ENV-DEMO-04',
    problemType: 'Unresolved Roadside Waste Accumulation',
    severity: 'High',
    description: 'Roadside garbage complaint filed 12 days ago. Authority marked it resolved, but follow-up photos show the problem persists.',
    likelyCause: 'Incomplete clearance and poor follow-up verification.',
    healthOrEnvironmentalRisk: 'Continued vector breeding and unsanitary conditions.',
    environmentalImpact: 'Ongoing waste accumulation and potential leachate.',
    responsibleAuthority: 'City Municipal Corporation, Bengaluru',
    formalComplaint: 'Date: 29 September 2026\n\nTo,\nThe Zonal Commissioner,\nCity Municipal Corporation, Bengaluru.\n\nSubject: Escalation: Unresolved roadside waste at Indiranagar 12th Main.\n\nRespected Sir,\n\nThe complaint filed 12 days ago has not been addressed, despite a "Resolved" status update.\n\nYours faithfully,\nConcerned Citizen',
    suggestedDeadlineDays: 0,
    keyHighlights: [
      'Unresolved garbage after 12 days',
      'False "Resolved" claim by authority',
      'Escalated to Commissioner',
    ],
    location: '12th Main, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    photoUrl: '/assets/escalated_before.jpg',
    isDemo: true,
    demoSceneType: 'trash',
    dateFiled: new Date(Date.now() - 12 * 86400000).toISOString(),
    simulatedDaysPassed: 12,
    status: 'Escalated',
    timeline: [
      {
        id: 'ev-1',
        title: 'Garbage Complaint Filed',
        timestamp: new Date(Date.now() - 12 * 86400000).toLocaleString(),
        description: 'Roadside garbage reported.',
        type: 'filed',
      },
      {
        id: 'ev-2',
        title: 'Reminder Sent',
        timestamp: new Date(Date.now() - 5 * 86400000).toLocaleString(),
        description: 'Automatic reminder for overdue complaint.',
        type: 'reminder',
      },
      {
        id: 'ev-3',
        title: 'Marked Resolved',
        timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
        description: 'Authority marked the complaint as resolved.',
        type: 'status_change',
      },
      {
        id: 'ev-4',
        title: 'Verification Failed',
        timestamp: new Date(Date.now() - 0 * 86400000).toLocaleString(),
        description: 'Verification check failed: Waste is still present.',
        type: 'verification',
      },
      {
        id: 'ev-5',
        title: 'Escalated to Commissioner',
        timestamp: new Date(Date.now() - 0 * 86400000).toLocaleString(),
        description: 'Complaint escalated to the higher authority.',
        type: 'escalation',
      },
    ],
    verification: {
      afterPhotoUrl: '/assets/escalated_after.jpg',
      fixed: false,
      confidence: 94,
      explanation: 'Not actually fixed: The waste is still present at the same location despite the "Resolved" status.',
      verdict: 'NOT_ACTUALLY_FIXED',
      dateVerified: new Date(Date.now() - 0 * 86400000).toISOString(),
    },
    escalation: {
      escalatedTo: 'Commissioner, Bengaluru Municipal Corporation',
      escalationReferenceId: 'ESC-DEMO-2026-004',
      escalationLetter: 'URGENT ESCALATION: Unresolved waste accumulation at Indiranagar 12th Main.\n\nThe complaint, filed 12 days ago, was incorrectly marked resolved. Follow-up verification confirms the issue remains.',
      recommendedAction: 'Verify the site in person and ensure immediate clearance.',
      dateEscalated: new Date(Date.now() - 0 * 86400000).toISOString(),
    },
    language: 'en',
  },
];

// FULL 8 SAMPLE REPORTS REFOCUSED ON ENVIRONMENTAL PROBLEMS
export const SAMPLE_REPORTS: CivicReport[] = [
  ...DEMO_MODE_REPORTS,
  {
    id: 'ENV-2026-084',
    problemType: 'Illegal Garbage Dumping & Toxic Leachate Spill',
    severity: 'High',
    description: 'Over 400 kg of mixed municipal and commercial solid waste dumped illegally on roadside green belt, generating black toxic leachate.',
    likelyCause: 'Absence of secondary ward waste bins and lack of scheduled door-to-door sanitation sweeps.',
    healthOrEnvironmentalRisk: 'High vector breeding threat; black leachate seeping into stormwater conduits.',
    environmentalImpact: 'Toxic leachate containing heavy metals and organic acids poisons roadside soil biomes. Runoff during rainfall carries concentrated pollutants directly into natural groundwater basins.',
    responsibleAuthority: 'Municipal Solid Waste Management & Health Division',
    formalComplaint: 'Date: 04 October 2026\n\nTo,\nThe Executive Engineer (SWM),\nCity Municipal Corporation, Bengaluru.\n\nSubject: Severe environmental degradation from illegal garbage dumping at 12th Main Indiranagar\n\nRespected Sir,\n\nI write to draw your immediate attention to massive illegal dumping of unsegregated waste on the green verge at 12th Main, Indiranagar. Dark anaerobic leachate is pooling on the soil, in direct violation of the Solid Waste Management Rules 2016.\n\nWe request immediate compactor deployment and biomineral treatment of the contaminated soil within 3 days.\n\nYours faithfully,\nIndiranagar Environmental Collective',
    suggestedDeadlineDays: 3,
    keyHighlights: [
      '400kg decomposing waste emitting toxic leachate',
      'Breach of Solid Waste Management Rules 2016',
      'Direct contamination of roadside soil and stormwater inlets',
    ],
    location: '12th Main Road, Indiranagar, Bengaluru',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    photoUrl: generateCivicSvgImage('Illegal Solid Waste Dumping', 'GARBAGE DUMP', 'trash'),
    dateFiled: new Date(Date.now() - 5 * 86400000).toISOString(),
    simulatedDaysPassed: 5,
    status: 'Escalated',
    timeline: [
      {
        id: 'ev-1',
        title: 'Complaint Registered',
        timestamp: new Date(Date.now() - 5 * 86400000).toLocaleString(),
        description: 'Citizen submitted photo evidence and automated AI legal petition.',
        type: 'filed',
      },
      {
        id: 'ev-2',
        title: '3-Day SLA Warning Sent',
        timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
        description: 'Suggested deadline passed without contractor confirmation.',
        type: 'reminder',
      },
      {
        id: 'ev-3',
        title: 'Escalated to Zonal Commissioner',
        timestamp: new Date(Date.now() - 1 * 86400000).toLocaleString(),
        description: 'Auto-escalated under Public Services Guarantee Act with citation of MSW Rules 2016.',
        type: 'escalation',
      },
    ],
    escalation: {
      escalatedTo: 'Office of the Special Commissioner (Solid Waste Management), BBMP',
      escalationReferenceId: 'ESC-BBMP-2026-9042',
      escalationLetter: 'URGENT ESCALATION NOTICE - TIER II\nRef: ESC-BBMP-2026-9042\n\nTo,\nThe Special Commissioner (SWM),\nBBMP Central Office, Bengaluru.\n\nSubject: Official Escalation for chronic illegal garbage dump at 12th Main Indiranagar\n\nRespected Sir,\n\nA statutory civic grievance was registered on 04 October 2026 regarding chronic waste dumping at 12th Main, Indiranagar. Despite 5 days having elapsed, no sanitation crew has arrived.\n\nAs this constitutes an open violation of public health standards, we request your direct intervention to issue show-cause notices to the ward health inspector and ensure site clearance within 24 hours.\n\nYours faithfully,\nCivic Grievance Cell',
      recommendedAction: 'Summon Ward 80 Health Supervisor and enforce spot penalty on illegal commercial dumpers.',
      dateEscalated: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    language: 'en',
  },
  {
    id: 'ENV-2026-085',
    problemType: 'Single-Use Plastic Pollution & Stormwater Culvert Blockage',
    severity: 'Medium',
    description: 'Over 1,200 discarded PET bottles, multi-layer food wrappers, and styrofoam containers completely plugging an open drainage outlet.',
    likelyCause: 'Unregulated street food vendors discarding single-use plastics without secondary collection bins.',
    healthOrEnvironmentalRisk: 'Flash flood stagnation leading to acute mosquito proliferation and sewer backflow into homes.',
    environmentalImpact: 'Non-biodegradable plastics fragment into microplastics under ultraviolet sunlight, contaminating aquatic food chains. Trapped organic matter undergoes anaerobic decay, releasing potent methane emissions.',
    responsibleAuthority: 'Stormwater & Plastic Enforcement Cell, City Corporation',
    formalComplaint: 'Date: 05 October 2026\n\nTo,\nThe Executive Engineer (Stormwater Management),\nCity Municipal Corporation, Bengaluru.\n\nSubject: Immediate clearance of single-use plastic choke point at 27th Main HSR Layout\n\nRespected Sir,\n\nWe petition your office regarding a severe accumulation of banned single-use plastics choking the primary canal culvert at 27th Main, Sector 1, HSR Layout. This violates Plastic Waste Management Rules 2016 and poses immediate flood and microplastic risks.\n\nWe request manual trash raking and trash net installation within 4 days.\n\nYours faithfully,\nHSR Environmental Forum',
    suggestedDeadlineDays: 4,
    keyHighlights: [
      '1,200+ plastic containers plugging natural stormwater flow',
      'Microplastic fragmentation into municipal waterways',
      'Flash flood hazard for surrounding 40 households',
    ],
    location: '27th Main Road, Sector 1, HSR Layout, Bengaluru',
    coordinates: { lat: 12.9116, lng: 77.6433 },
    photoUrl: generateCivicSvgImage('Plastic Canal Choke Point', 'PLASTIC POLLUTION', 'trash'),
    dateFiled: new Date(Date.now() - 2 * 86400000).toISOString(),
    simulatedDaysPassed: 2,
    status: 'Filed',
    timeline: [
      {
        id: 'ev-1',
        title: 'Plastic Hazard Logged',
        timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
        description: 'Captured macro-plastic culvert choke point with GPS tag.',
        type: 'filed',
      },
    ],
    language: 'en',
  },
  {
    id: 'ENV-2026-086',
    problemType: 'Toxic Chemical Effluent in Stormwater Stream',
    severity: 'High',
    description: 'Vibrant blue chemical dye effluent discharging continuously from commercial laundering units into public stormwater drain feeding Varthur watershed.',
    likelyCause: 'Illegal midnight bypassing of required Effluent Treatment Plants (ETP) by local fabric dyeing workshops.',
    healthOrEnvironmentalRisk: 'Severe skin dermatitis risk for sanitation workers; toxic volatile organic compound (VOC) vapor inhalation.',
    environmentalImpact: 'Synthetic azo dyes and heavy metals degrade aquatic photosynthesis and poison aquatic microorganisms. Pollutants percolate down into the shallow water table, spoiling agricultural borewells.',
    responsibleAuthority: 'State Pollution Control Board (KSPCB) - Industrial Surveillance Unit',
    formalComplaint: 'Date: 07 October 2026\n\nTo,\nThe Regional Environmental Officer,\nState Pollution Control Board, Whitefield Zone, Bengaluru.\n\nSubject: Emergency complaint: Chemical dye effluent discharge into Varthur lake stream\n\nRespected Officer,\n\nWe report an alarming discharge of untreated toxic blue chemical effluent into the stormwater conduit near Hope Farm, Whitefield. The chemicals are discharging directly towards the Varthur lake watershed, violating Section 25 of the Water Act 1974.\n\nWe demand immediate power disconnection to the illegal industrial units and forensic chemical sampling within 72 hours.\n\nYours faithfully,\nWhitefield Watershed Action',
    suggestedDeadlineDays: 3,
    keyHighlights: [
      'Untreated synthetic chemical dyes entering public water body',
      'Direct violation of Water Pollution Control Act 1974',
      'Heavy metal poisoning threat to local aquifers',
    ],
    location: 'Hope Farm Junction, Whitefield Road, Bengaluru',
    coordinates: { lat: 12.9830, lng: 77.7516 },
    photoUrl: generateCivicSvgImage('Chemical Effluent Discharge', 'RIVER & LAKE', 'water'),
    dateFiled: new Date(Date.now() - 3 * 86400000).toISOString(),
    simulatedDaysPassed: 3,
    status: 'Filed',
    timeline: [
      {
        id: 'ev-1',
        title: 'Chemical Effluent Logged',
        timestamp: new Date(Date.now() - 3 * 86400000).toLocaleString(),
        description: 'Citizen logged dye discharge with pH sample note.',
        type: 'filed',
      },
    ],
    language: 'en',
  },
  {
    id: 'ENV-2026-087',
    problemType: 'Dense Industrial Smoke & Particulate Air Pollution',
    severity: 'High',
    description: 'Commercial boiler chimney emitting heavy unscrubbed soot and black particulate matter, coating neighborhood trees and buildings with dark residue.',
    likelyCause: 'Unmaintained wet scrubbers and burning of sub-grade petcoke fuel in commercial furnaces.',
    healthOrEnvironmentalRisk: 'Critical spikes in PM2.5 and sulfur dioxide (SO2) leading to chronic obstructive pulmonary disease (COPD) in nearby children.',
    environmentalImpact: 'Acidic sulfur and soot emissions settle onto regional plant foliage, hindering leaf transpiration and photosynthesis. Increases ground-level ozone formation, degrading urban air quality indexes.',
    responsibleAuthority: 'Air Quality Monitoring Cell, State Pollution Control Board',
    formalComplaint: 'Date: 02 October 2026\n\nTo,\nThe Environmental Officer (Air Surveillance),\nState Pollution Control Board, Peenya Industrial Zone, Bengaluru.\n\nSubject: Unscrubbed soot and toxic air emissions in Peenya Industrial Buffer Area\n\nRespected Officer,\n\nWe petition your department regarding heavy unscrubbed particulate emissions discharging from commercial chimneys on 10th Cross, Peenya. Soot levels violate National Ambient Air Quality Standards (NAAQS).\n\nUnder the Air (Prevention & Control of Pollution) Act 1981, we demand stack monitoring and issuance of closure notices within 3 days.\n\nYours faithfully,\nPeenya Clean Air Federation',
    suggestedDeadlineDays: 3,
    keyHighlights: [
      'Unscrubbed black soot exceeding NAAQS industrial limits',
      'Direct violation of Air Pollution Act 1981',
      'Severe respiratory danger for adjacent school and residents',
    ],
    location: '10th Cross, Peenya Industrial Area, Bengaluru',
    coordinates: { lat: 13.0310, lng: 77.5140 },
    photoUrl: generateCivicSvgImage('Industrial Air Soot', 'AIR POLLUTION', 'smoke'),
    dateFiled: new Date(Date.now() - 6 * 86400000).toISOString(),
    simulatedDaysPassed: 6,
    status: 'Escalated',
    timeline: [
      {
        id: 'ev-1',
        title: 'Air Emission Violation Filed',
        timestamp: new Date(Date.now() - 6 * 86400000).toLocaleString(),
        description: 'Reported with plume imagery and chimney height estimation.',
        type: 'filed',
      },
      {
        id: 'ev-2',
        title: 'Escalated to Chairman, Pollution Board',
        timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
        description: 'Served Section 31A closure direction demand under Air Act 1981.',
        type: 'escalation',
      },
    ],
    language: 'en',
  },
  {
    id: 'ENV-2026-088',
    problemType: 'Hazardous E-Waste & Battery Dumping on Wetland Soil',
    severity: 'High',
    description: 'Illegal midnight tipping of discarded cathode ray tubes, broken lithium batteries, and circuit boards directly onto public wetland embankment.',
    likelyCause: 'Informal scrap dismantlers dumping stripped circuit remnants to avoid licensed recycling fees.',
    healthOrEnvironmentalRisk: 'Lead, cadmium, and mercury vapor toxicity; acute groundwater poisoning risk.',
    environmentalImpact: 'Leaching heavy metals bind permanently to wetland soil, sterilizing beneficial soil bacteria. Bioaccumulates up the food chain through aquatic insects and migratory waterfowl.',
    responsibleAuthority: 'Hazardous & E-Waste Management Wing, State Pollution Control Board',
    formalComplaint: 'Date: 05 October 2026\n\nTo,\nThe Senior Environmental Engineer (Hazardous Waste),\nState Pollution Control Board, Bengaluru.\n\nSubject: Severe hazardous e-waste dumping on Agara Lake wetland buffer\n\nRespected Sir,\n\nWe report dangerous midnight tipping of leaded electronic scrap and lithium batteries along the Agara Lake green corridor. This violates the E-Waste (Management) Rules 2016 and threatens public health.\n\nWe request immediate hazardous material containment and CCTV forensic investigation within 72 hours.\n\nYours faithfully,\nAgara Lake Conservation Trust',
    suggestedDeadlineDays: 3,
    keyHighlights: [
      'Heavy metal lead and cadmium e-waste dumped on lake buffer',
      'Breach of E-Waste Management Rules 2016',
      'Irreversible soil and groundwater heavy-metal contamination',
    ],
    location: 'Agara Lake Wetland Perimeter, HSR Sector 1, Bengaluru',
    coordinates: { lat: 12.9238, lng: 77.6513 },
    photoUrl: generateCivicSvgImage('E-Waste Dumping on Wetland', 'SOIL & WATER', 'trash'),
    dateFiled: new Date(Date.now() - 2 * 86400000).toISOString(),
    simulatedDaysPassed: 2,
    status: 'Filed',
    timeline: [
      {
        id: 'ev-1',
        title: 'Hazardous Waste Dump Logged',
        timestamp: new Date(Date.now() - 2 * 86400000).toLocaleString(),
        description: 'Reported with heavy metal biohazard tag.',
        type: 'filed',
      },
    ],
    language: 'en',
  },
];
