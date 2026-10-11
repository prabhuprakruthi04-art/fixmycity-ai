import { CivicReport } from '../types';

const BENGALURU_AREAS = [
  { name: 'Whitefield', lat: 12.9698, lng: 77.7500 },
  { name: 'Koramangala', lat: 12.9348, lng: 77.6100 },
  { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
  { name: 'Electronic City', lat: 12.8452, lng: 77.6602 },
  { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
  { name: 'Jayanagar', lat: 12.9308, lng: 77.5838 },
  { name: 'Hebbal', lat: 13.0355, lng: 77.5971 },
  { name: 'Bellandur', lat: 12.9238, lng: 77.6689 },
  { name: 'KR Puram', lat: 12.9972, lng: 77.6961 },
  { name: 'Malleshwaram', lat: 13.0033, lng: 77.5644 },
  { name: 'HSR Layout', lat: 12.9116, lng: 77.6433 },
  { name: 'Banashankari', lat: 12.9255, lng: 77.5468 },
];

const PROBLEM_TYPES = ['garbage dumping', 'burning waste', 'polluted lake', 'sewage overflow', 'plastic pollution'];
const AUTHORITIES = ['BBMP', 'BWSSB', 'KSPCB', 'Public Health Department'];

export const SAMPLE_MAP_INCIDENTS: CivicReport[] = Array.from({ length: 30 }).map((_, i) => {
  const area = BENGALURU_AREAS[i % BENGALURU_AREAS.length];
  const status = i < 12 ? 'Filed' : i < 20 ? 'Escalated' : 'Resolved';
  const type = PROBLEM_TYPES[i % PROBLEM_TYPES.length];
  
  return {
    id: `MAP-SAMPLE-${i}`,
    problemType: type.toUpperCase(),
    severity: i < 5 ? 'Critical' : 'Medium',
    description: `Sample incident at ${area.name}`,
    likelyCause: 'Sample cause',
    healthOrEnvironmentalRisk: 'Sample risk',
    responsibleAuthority: AUTHORITIES[i % AUTHORITIES.length],
    formalComplaint: 'Sample complaint',
    suggestedDeadlineDays: 3,
    keyHighlights: ['Sample highlight'],
    location: area.name,
    coordinates: { 
      lat: area.lat + (Math.random() - 0.5) * 0.02, 
      lng: area.lng + (Math.random() - 0.5) * 0.02 
    },
    photoUrl: 'assets/placeholder.jpg',
    dateFiled: new Date().toISOString(),
    simulatedDaysPassed: Math.floor(Math.random() * 10),
    status: status as any,
    timeline: [],
    language: 'en',
  };
});
