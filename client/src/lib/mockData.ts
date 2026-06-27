// ============================================================
// SWIMXP CONNECT — MOCK DATA
// 15 coaches, 15 pools, 20 parents, 25 children, 50 lessons
// ============================================================

export type SwimLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Competitive';
export type CoachSpeciality = 'Toddlers' | 'Children' | 'Adult Beginners' | 'Competitive' | 'Water Confidence' | 'Special Needs' | 'Stroke Technique';
export type LessonStatus = 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Makeup Requested';
export type UserRole = 'Parent' | 'Coach' | 'SwimSchool' | 'PoolHost' | 'Admin';

export type CertStatus = 'approved' | 'pending_review' | 'expired' | 'rejected';

export interface Coach {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewCount: number;
  specialities: CoachSpeciality[];
  experience: number;
  certifications: string[];
  languages: string[];
  hourlyRate: number;
  location: string;
  distance: string;
  bio: string;
  matchScore?: number;
  availability: string[];
  studentCount: number;
  verified: boolean;
  introVideo?: string;
  // Credentialing fields
  coachingCertType?: string;
  coachingCertExpiry?: string;   // ISO date string YYYY-MM-DD
  lifesavingCertType?: string;
  lifesavingCertExpiry?: string; // ISO date string YYYY-MM-DD
  certStatus?: CertStatus;       // admin approval state
  proofUploaded?: boolean;       // whether docs were attached
}

export interface Pool {
  id: string;
  name: string;
  image: string;
  address: string;
  rentalRate: number;
  features: string[];
  length: number;
  lanes: number;
  availability: string[];
  rating: number;
  hostName: string;
  distance: string;
  capacity: number;
}

export interface Parent {
  id: string;
  name: string;
  photo: string;
  children: Child[];
  preferredLocation: string;
  preferredLanguage: string;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  swimLevel: SwimLevel;
  goals: string[];
}

export interface Lesson {
  id: string;
  studentName: string;
  coachName: string;
  poolName: string;
  date: string;
  time: string;
  duration: number;
  status: LessonStatus;
  swimLevel: SwimLevel;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  swimLevel: SwimLevel;
  parentContact: string;
  assignedCoach: string;
  preferredPool: string;
  totalLessons: number;
  photo: string;
}

// ---- COACH PHOTOS (Unsplash) ----
const coachPhotos = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face',
];

const poolImages = [
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663787850072/HM5C7RcyProJEpB8Er5afd/pool-aerial-56eLRA968PGBUR89CgTByi.webp',
  'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
];

export const coaches: Coach[] = [
  {
    id: 'c1', name: 'Sarah Chen', photo: coachPhotos[1], rating: 4.9, reviewCount: 127,
    specialities: ['Children', 'Water Confidence', 'Toddlers'], experience: 8,
    certifications: ['AUSTSWIM', 'CPR Certified', 'Bronze Medallion'],
    languages: ['English', 'Mandarin'], hourlyRate: 85,
    location: 'Buona Vista', distance: '0.8 km',
    bio: 'Passionate about helping children overcome water fear. I use a gentle, play-based approach that builds confidence naturally.',
    matchScore: 96, availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    studentCount: 24, verified: true,
    coachingCertType: 'AUSTSWIM Teacher of Swimming & Water Safety', coachingCertExpiry: '2026-11-15',
    lifesavingCertType: 'Bronze Medallion', lifesavingCertExpiry: '2026-09-20',
    certStatus: 'approved', proofUploaded: true,
  },
  {
    id: 'c2', name: 'Marcus Tan', photo: coachPhotos[0], rating: 4.8, reviewCount: 89,
    specialities: ['Competitive', 'Stroke Technique', 'Children'], experience: 12,
    certifications: ['AUSTSWIM', 'FINA Level 2', 'CPR Certified'],
    languages: ['English', 'Malay'], hourlyRate: 95,
    location: 'Clementi', distance: '1.2 km',
    bio: 'Former national swimmer with 12 years of coaching experience. Specialise in stroke technique and competitive training.',
    matchScore: 92, availability: ['Tue', 'Thu', 'Sat', 'Sun'],
    studentCount: 18, verified: true,
    coachingCertType: 'NROC (National Registry of Coaches)', coachingCertExpiry: '2026-07-10',
    lifesavingCertType: 'CPR & AED', lifesavingCertExpiry: '2026-07-22',
    certStatus: 'approved', proofUploaded: true,
  },
  {
    id: 'c3', name: 'Priya Nair', photo: coachPhotos[3], rating: 4.9, reviewCount: 203,
    specialities: ['Adult Beginners', 'Water Confidence', 'Special Needs'], experience: 6,
    certifications: ['AUSTSWIM', 'CPR Certified', 'Special Needs Cert'],
    languages: ['English', 'Tamil', 'Hindi'], hourlyRate: 75,
    location: 'Jurong East', distance: '2.1 km',
    bio: 'Specialising in adult beginners and special needs swimmers. Every swimmer deserves a patient, supportive coach.',
    matchScore: 88, availability: ['Mon', 'Tue', 'Wed', 'Thu'],
    studentCount: 31, verified: true,
    coachingCertType: 'AUSTSWIM Teacher of Swimming & Water Safety', coachingCertExpiry: '2026-08-05',
    lifesavingCertType: 'First Aid', lifesavingCertExpiry: '2026-08-05',
    certStatus: 'approved', proofUploaded: true,
  },
  {
    id: 'c4', name: 'James Lim', photo: coachPhotos[2], rating: 4.7, reviewCount: 64,
    specialities: ['Children', 'Toddlers'], experience: 4,
    certifications: ['AUSTSWIM', 'CPR Certified'],
    languages: ['English', 'Mandarin'], hourlyRate: 70,
    location: 'Holland Village', distance: '1.5 km',
    bio: 'Young, energetic coach who makes every lesson fun. Kids love my games-based approach to learning strokes.',
    matchScore: 85, availability: ['Wed', 'Fri', 'Sat', 'Sun'],
    studentCount: 15, verified: true,
    coachingCertType: 'AUSTSWIM Teacher of Swimming & Water Safety', coachingCertExpiry: '2026-07-18',
    lifesavingCertType: 'CPR & AED', lifesavingCertExpiry: '2026-07-18',
    certStatus: 'approved', proofUploaded: true,
  },
  {
    id: 'c5', name: 'Aisha Rahman', photo: coachPhotos[5], rating: 4.8, reviewCount: 156,
    specialities: ['Children', 'Adult Beginners', 'Water Confidence'], experience: 9,
    certifications: ['AUSTSWIM', 'CPR Certified', 'Bronze Cross'],
    languages: ['English', 'Malay'], hourlyRate: 80,
    location: 'Queenstown', distance: '0.5 km',
    bio: 'Building water confidence one stroke at a time. I believe every swimmer has untapped potential waiting to be discovered.',
    matchScore: 91, availability: ['Mon', 'Wed', 'Sat', 'Sun'],
    studentCount: 28, verified: true,
    coachingCertType: 'STA (Swimming Teachers Association)', coachingCertExpiry: '2027-01-30',
    lifesavingCertType: 'Bronze Medallion', lifesavingCertExpiry: '2027-01-30',
    certStatus: 'approved', proofUploaded: true,
  },
  {
    id: 'c6', name: 'David Wong', photo: coachPhotos[6], rating: 4.6, reviewCount: 42,
    specialities: ['Competitive', 'Stroke Technique'], experience: 15,
    certifications: ['FINA Level 3', 'AUSTSWIM', 'CPR Certified'],
    languages: ['English', 'Cantonese'], hourlyRate: 110,
    location: 'Bishan', distance: '3.2 km',
    bio: 'Elite competitive swimming coach with 15 years experience. Trained multiple national-level swimmers.',
    matchScore: 79, availability: ['Tue', 'Thu', 'Sat'],
    studentCount: 12, verified: true,
  },
  {
    id: 'c7', name: 'Emma Toh', photo: coachPhotos[7], rating: 4.9, reviewCount: 178,
    specialities: ['Toddlers', 'Children', 'Water Confidence'], experience: 7,
    certifications: ['AUSTSWIM', 'CPR Certified', 'Early Childhood Cert'],
    languages: ['English', 'Mandarin'], hourlyRate: 80,
    location: 'Bukit Timah', distance: '2.8 km',
    bio: 'Early childhood specialist who makes water a happy place for toddlers. Parent-and-child classes available.',
    matchScore: 87, availability: ['Mon', 'Tue', 'Wed', 'Sat'],
    studentCount: 22, verified: true,
  },
  {
    id: 'c8', name: 'Ryan Koh', photo: coachPhotos[8], rating: 4.7, reviewCount: 93,
    specialities: ['Children', 'Competitive'], experience: 5,
    certifications: ['AUSTSWIM', 'CPR Certified'],
    languages: ['English'], hourlyRate: 75,
    location: 'Toa Payoh', distance: '4.1 km',
    bio: 'Former school swim team captain. I love helping kids discover their competitive edge in a supportive environment.',
    matchScore: 82, availability: ['Mon', 'Wed', 'Fri'],
    studentCount: 19, verified: false,
    coachingCertType: 'AUSTSWIM Teacher of Swimming & Water Safety', coachingCertExpiry: '2026-07-05',
    lifesavingCertType: 'CPR & AED', lifesavingCertExpiry: '2026-07-05',
    certStatus: 'pending_review', proofUploaded: true,
  },
  {
    id: 'c9', name: 'Mei Lin', photo: coachPhotos[9], rating: 4.8, reviewCount: 115,
    specialities: ['Adult Beginners', 'Stroke Technique'], experience: 10,
    certifications: ['AUSTSWIM', 'CPR Certified', 'Lifesaving SG'],
    languages: ['English', 'Mandarin', 'Hokkien'], hourlyRate: 90,
    location: 'Ang Mo Kio', distance: '5.3 km',
    bio: 'Helping adults conquer their fear of water since 2014. No judgment, just progress at your own pace.',
    matchScore: 76, availability: ['Tue', 'Thu', 'Sat', 'Sun'],
    studentCount: 20, verified: true,
  },
  {
    id: 'c10', name: 'Alex Fernandez', photo: coachPhotos[10], rating: 4.5, reviewCount: 38,
    specialities: ['Children', 'Water Confidence'], experience: 3,
    certifications: ['AUSTSWIM', 'CPR Certified'],
    languages: ['English', 'Filipino'], hourlyRate: 65,
    location: 'Pasir Ris', distance: '8.2 km',
    bio: 'New to coaching but full of passion. I bring fresh energy and modern teaching methods to every lesson.',
    matchScore: 73, availability: ['Sat', 'Sun'],
    studentCount: 8, verified: false,
    coachingCertType: 'AUSTSWIM Teacher of Swimming & Water Safety', coachingCertExpiry: '2025-12-01',
    lifesavingCertType: 'CPR & AED', lifesavingCertExpiry: '2025-11-15',
    certStatus: 'expired', proofUploaded: true,
  },
  {
    id: 'c11', name: 'Natasha Gupta', photo: coachPhotos[11], rating: 4.9, reviewCount: 241,
    specialities: ['Special Needs', 'Water Confidence', 'Adult Beginners'], experience: 11,
    certifications: ['AUSTSWIM', 'CPR Certified', 'Hydrotherapy Cert', 'Special Needs Cert'],
    languages: ['English', 'Hindi'], hourlyRate: 95,
    location: 'Novena', distance: '3.7 km',
    bio: 'Hydrotherapy and inclusive swimming specialist. I work with swimmers of all abilities and backgrounds.',
    matchScore: 84, availability: ['Mon', 'Wed', 'Fri', 'Sat'],
    studentCount: 16, verified: true,
  },
  {
    id: 'c12', name: 'Kevin Ong', photo: coachPhotos[12], rating: 4.6, reviewCount: 71,
    specialities: ['Competitive', 'Children'], experience: 8,
    certifications: ['FINA Level 2', 'AUSTSWIM', 'CPR Certified'],
    languages: ['English', 'Mandarin'], hourlyRate: 88,
    location: 'Tampines', distance: '6.9 km',
    bio: 'Squad training specialist. I run group and individual sessions focused on race preparation and technique.',
    matchScore: 78, availability: ['Tue', 'Thu', 'Sat'],
    studentCount: 25, verified: true,
  },
  {
    id: 'c13', name: 'Zoe Hartley', photo: coachPhotos[13], rating: 4.8, reviewCount: 88,
    specialities: ['Adult Beginners', 'Children', 'Stroke Technique'], experience: 6,
    certifications: ['AUSTSWIM', 'CPR Certified', 'Bronze Medallion'],
    languages: ['English'], hourlyRate: 78,
    location: 'Orchard', distance: '2.4 km',
    bio: 'Australian-trained coach bringing international techniques to Singapore. Friendly, patient, and results-driven.',
    matchScore: 89, availability: ['Mon', 'Tue', 'Thu', 'Sat'],
    studentCount: 21, verified: true,
  },
  {
    id: 'c14', name: 'Farid Hassan', photo: coachPhotos[4], rating: 4.7, reviewCount: 52,
    specialities: ['Children', 'Toddlers'], experience: 5,
    certifications: ['AUSTSWIM', 'CPR Certified'],
    languages: ['English', 'Malay'], hourlyRate: 72,
    location: 'Woodlands', distance: '9.1 km',
    bio: 'North Singapore specialist. Affordable, reliable, and genuinely passionate about teaching kids to swim.',
    matchScore: 71, availability: ['Wed', 'Fri', 'Sat', 'Sun'],
    studentCount: 14, verified: true,
  },
  {
    id: 'c15', name: 'Linda Park', photo: coachPhotos[14], rating: 4.9, reviewCount: 167,
    specialities: ['Children', 'Competitive', 'Stroke Technique'], experience: 13,
    certifications: ['FINA Level 2', 'AUSTSWIM', 'CPR Certified', 'Lifesaving SG'],
    languages: ['English', 'Korean'], hourlyRate: 100,
    location: 'Marine Parade', distance: '4.6 km',
    bio: 'Korean national team alumna. I bring Olympic-level training philosophy to recreational and competitive swimmers alike.',
    matchScore: 93, availability: ['Mon', 'Tue', 'Thu', 'Sat', 'Sun'],
    studentCount: 30, verified: true,
  },
];

export const pools: Pool[] = [
  {
    id: 'p1', name: 'The Parc Condo Pool',
    image: poolImages[0],
    address: '10 West Coast Walk, Singapore 127157',
    rentalRate: 45, features: ['25m Lane', 'Heated', 'Changing Rooms', 'Parking', 'Lifeguard'],
    length: 25, lanes: 4, availability: ['Mon–Fri 7am–8pm', 'Sat–Sun 8am–6pm'],
    rating: 4.8, hostName: 'The Parc Management', distance: '0.6 km', capacity: 12,
  },
  {
    id: 'p2', name: 'Clementi Crest Pool',
    image: poolImages[1],
    address: '6 West Coast Road, Singapore 127366',
    rentalRate: 35, features: ['20m Pool', 'Shaded', 'Changing Rooms', 'Shallow End'],
    length: 20, lanes: 3, availability: ['Mon–Sun 6am–9pm'],
    rating: 4.6, hostName: 'Clementi Crest MCST', distance: '1.1 km', capacity: 8,
  },
  {
    id: 'p3', name: 'Reflections at Keppel Bay',
    image: poolImages[2],
    address: '1 Keppel Bay View, Singapore 098402',
    rentalRate: 80, features: ['50m Olympic', 'Infinity Edge', 'Heated', 'Jacuzzi', 'Concierge'],
    length: 50, lanes: 6, availability: ['Mon–Fri 8am–7pm', 'Sat 8am–5pm'],
    rating: 4.9, hostName: 'Keppel Bay Management', distance: '2.3 km', capacity: 20,
  },
  {
    id: 'p4', name: 'One-North Eden Pool',
    image: poolImages[3],
    address: '1 Slim Barracks Rise, Singapore 138664',
    rentalRate: 55, features: ['30m Pool', 'Heated', 'Changing Rooms', 'Parking', 'Café Nearby'],
    length: 30, lanes: 4, availability: ['Mon–Fri 7am–9pm', 'Sat–Sun 7am–7pm'],
    rating: 4.7, hostName: 'One-North Eden MCST', distance: '1.8 km', capacity: 10,
  },
  {
    id: 'p5', name: 'Queenstown Community Pool',
    image: poolImages[4],
    address: '473 Stirling Road, Singapore 148948',
    rentalRate: 25, features: ['25m Lane', 'Changing Rooms', 'Accessible', 'Affordable'],
    length: 25, lanes: 4, availability: ['Mon–Sun 6:30am–9:30pm'],
    rating: 4.4, hostName: 'ActiveSG', distance: '0.3 km', capacity: 16,
  },
  {
    id: 'p6', name: 'The Interlace Pool',
    image: poolImages[5],
    address: '180 Depot Road, Singapore 109684',
    rentalRate: 65, features: ['25m Pool', 'Heated', 'Lap Lanes', 'Kids Splash Zone', 'Parking'],
    length: 25, lanes: 5, availability: ['Mon–Fri 7am–8pm', 'Sat–Sun 8am–6pm'],
    rating: 4.8, hostName: 'The Interlace MCST', distance: '2.7 km', capacity: 14,
  },
  {
    id: 'p7', name: 'Bishan Sports Complex',
    image: poolImages[6],
    address: '5 Bishan Street 14, Singapore 579783',
    rentalRate: 30, features: ['50m Olympic', 'Competition Pool', 'Changing Rooms', 'Spectator Seating'],
    length: 50, lanes: 8, availability: ['Mon–Sun 6:30am–9:30pm'],
    rating: 4.5, hostName: 'ActiveSG', distance: '4.2 km', capacity: 24,
  },
  {
    id: 'p8', name: 'Sentosa Cove Pool',
    image: poolImages[7],
    address: '1 Ocean Way, Singapore 098066',
    rentalRate: 90, features: ['30m Pool', 'Sea View', 'Heated', 'Jacuzzi', 'Private Cabanas'],
    length: 30, lanes: 3, availability: ['Mon–Sun 7am–8pm'],
    rating: 4.9, hostName: 'Sentosa Cove Club', distance: '5.1 km', capacity: 10,
  },
  {
    id: 'p9', name: 'Jurong West Pool',
    image: poolImages[1],
    address: '20 Jurong West Street 93, Singapore 648965',
    rentalRate: 28, features: ['25m Pool', 'Changing Rooms', 'Accessible', 'Toddler Pool'],
    length: 25, lanes: 4, availability: ['Mon–Sun 6:30am–9:30pm'],
    rating: 4.3, hostName: 'ActiveSG', distance: '6.4 km', capacity: 12,
  },
  {
    id: 'p10', name: 'Marina Bay Residences Pool',
    image: poolImages[2],
    address: '18 Marina Boulevard, Singapore 018980',
    rentalRate: 100, features: ['Infinity Pool', 'City View', 'Heated', 'Concierge', 'Towel Service'],
    length: 25, lanes: 3, availability: ['Mon–Fri 7am–9pm', 'Sat–Sun 7am–7pm'],
    rating: 5.0, hostName: 'Marina Bay Residences', distance: '7.2 km', capacity: 8,
  },
];

export const students: Student[] = [
  { id: 's1', name: 'Ethan Lim', age: 7, swimLevel: 'Beginner', parentContact: 'Mrs Lim (+65 9123 4567)', assignedCoach: 'Sarah Chen', preferredPool: 'The Parc Condo Pool', totalLessons: 12, photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop&crop=face' },
  { id: 's2', name: 'Sophia Tan', age: 9, swimLevel: 'Intermediate', parentContact: 'Mr Tan (+65 9234 5678)', assignedCoach: 'Marcus Tan', preferredPool: 'Clementi Crest Pool', totalLessons: 28, photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=100&h=100&fit=crop&crop=face' },
  { id: 's3', name: 'Aiden Wong', age: 5, swimLevel: 'Beginner', parentContact: 'Ms Wong (+65 9345 6789)', assignedCoach: 'Emma Toh', preferredPool: 'Queenstown Community Pool', totalLessons: 6, photo: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=100&h=100&fit=crop&crop=face' },
  { id: 's4', name: 'Chloe Ng', age: 12, swimLevel: 'Advanced', parentContact: 'Dr Ng (+65 9456 7890)', assignedCoach: 'Linda Park', preferredPool: 'Bishan Sports Complex', totalLessons: 54, photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face' },
  { id: 's5', name: 'Lucas Rahman', age: 8, swimLevel: 'Intermediate', parentContact: 'Mrs Rahman (+65 9567 8901)', assignedCoach: 'Aisha Rahman', preferredPool: 'One-North Eden Pool', totalLessons: 20, photo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face' },
  { id: 's6', name: 'Isabella Chen', age: 6, swimLevel: 'Beginner', parentContact: 'Mr Chen (+65 9678 9012)', assignedCoach: 'Sarah Chen', preferredPool: 'The Parc Condo Pool', totalLessons: 8, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  { id: 's7', name: 'Noah Koh', age: 10, swimLevel: 'Intermediate', parentContact: 'Ms Koh (+65 9789 0123)', assignedCoach: 'Ryan Koh', preferredPool: 'The Interlace Pool', totalLessons: 35, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: 's8', name: 'Mia Gupta', age: 4, swimLevel: 'Beginner', parentContact: 'Mr Gupta (+65 9890 1234)', assignedCoach: 'Natasha Gupta', preferredPool: 'Queenstown Community Pool', totalLessons: 4, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face' },
  { id: 's9', name: 'Oliver Park', age: 14, swimLevel: 'Competitive', parentContact: 'Mrs Park (+65 9901 2345)', assignedCoach: 'Linda Park', preferredPool: 'Bishan Sports Complex', totalLessons: 87, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  { id: 's10', name: 'Ava Hassan', age: 7, swimLevel: 'Beginner', parentContact: 'Mr Hassan (+65 9012 3456)', assignedCoach: 'Farid Hassan', preferredPool: 'Jurong West Pool', totalLessons: 10, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
];

export const lessons: Lesson[] = [
  { id: 'l1', studentName: 'Ethan Lim', coachName: 'Sarah Chen', poolName: 'The Parc Condo Pool', date: '2026-06-23', time: '09:00', duration: 45, status: 'Confirmed', swimLevel: 'Beginner' },
  { id: 'l2', studentName: 'Sophia Tan', coachName: 'Marcus Tan', poolName: 'Clementi Crest Pool', date: '2026-06-23', time: '10:00', duration: 45, status: 'Scheduled', swimLevel: 'Intermediate' },
  { id: 'l3', studentName: 'Aiden Wong', coachName: 'Emma Toh', poolName: 'Queenstown Community Pool', date: '2026-06-23', time: '11:00', duration: 30, status: 'Confirmed', swimLevel: 'Beginner' },
  { id: 'l4', studentName: 'Chloe Ng', coachName: 'Linda Park', poolName: 'Bishan Sports Complex', date: '2026-06-23', time: '14:00', duration: 60, status: 'Confirmed', swimLevel: 'Advanced' },
  { id: 'l5', studentName: 'Lucas Rahman', coachName: 'Aisha Rahman', poolName: 'One-North Eden Pool', date: '2026-06-23', time: '15:00', duration: 45, status: 'Scheduled', swimLevel: 'Intermediate' },
  { id: 'l6', studentName: 'Isabella Chen', coachName: 'Sarah Chen', poolName: 'The Parc Condo Pool', date: '2026-06-23', time: '16:00', duration: 30, status: 'Confirmed', swimLevel: 'Beginner' },
  { id: 'l7', studentName: 'Noah Koh', coachName: 'Ryan Koh', poolName: 'The Interlace Pool', date: '2026-06-23', time: '17:00', duration: 45, status: 'Makeup Requested', swimLevel: 'Intermediate' },
  { id: 'l8', studentName: 'Oliver Park', coachName: 'Linda Park', poolName: 'Bishan Sports Complex', date: '2026-06-23', time: '07:00', duration: 90, status: 'Completed', swimLevel: 'Competitive' },
  { id: 'l9', studentName: 'Mia Gupta', coachName: 'Natasha Gupta', poolName: 'Queenstown Community Pool', date: '2026-06-24', time: '10:00', duration: 30, status: 'Scheduled', swimLevel: 'Beginner' },
  { id: 'l10', studentName: 'Ava Hassan', coachName: 'Farid Hassan', poolName: 'Jurong West Pool', date: '2026-06-24', time: '11:00', duration: 45, status: 'Scheduled', swimLevel: 'Beginner' },
  { id: 'l11', studentName: 'Sophia Tan', coachName: 'Marcus Tan', poolName: 'Clementi Crest Pool', date: '2026-06-24', time: '14:00', duration: 45, status: 'Confirmed', swimLevel: 'Intermediate' },
  { id: 'l12', studentName: 'Ethan Lim', coachName: 'Sarah Chen', poolName: 'The Parc Condo Pool', date: '2026-06-25', time: '09:00', duration: 45, status: 'Scheduled', swimLevel: 'Beginner', notes: 'Focus on freestyle kick' },
  { id: 'l13', studentName: 'Chloe Ng', coachName: 'Linda Park', poolName: 'Bishan Sports Complex', date: '2026-06-25', time: '16:00', duration: 60, status: 'Scheduled', swimLevel: 'Advanced' },
  { id: 'l14', studentName: 'Lucas Rahman', coachName: 'Aisha Rahman', poolName: 'One-North Eden Pool', date: '2026-06-26', time: '10:00', duration: 45, status: 'Cancelled', swimLevel: 'Intermediate' },
  { id: 'l15', studentName: 'Noah Koh', coachName: 'Ryan Koh', poolName: 'The Interlace Pool', date: '2026-06-26', time: '15:00', duration: 45, status: 'Scheduled', swimLevel: 'Intermediate' },
];

export const testimonials = [
  {
    id: 't1', name: 'Jennifer Lim', role: 'Parent of 2',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    text: 'SwimXP matched us with Sarah within minutes. My son went from terrified of water to swimming freestyle in just 8 lessons. The match percentage was spot-on!',
    rating: 5, coach: 'Sarah Chen',
  },
  {
    id: 't2', name: 'David Tan', role: 'Parent',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    text: 'The booking flow is seamless. I found a coach, picked a pool near our condo, and booked a trial lesson in under 3 minutes. Absolutely brilliant.',
    rating: 5, coach: 'Marcus Tan',
  },
  {
    id: 't3', name: 'Preethi Sharma', role: 'Adult Learner',
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face',
    text: 'As an adult who was afraid of water, I was nervous. Priya was incredibly patient and understanding. I can now swim 20 laps without stopping!',
    rating: 5, coach: 'Priya Nair',
  },
  {
    id: 't4', name: 'Michael Wong', role: 'Swim School Owner',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    text: 'The scheduler dashboard has transformed how we run our swim school. Makeup lesson management alone saves us hours every week.',
    rating: 5, coach: null,
  },
];

export const adminStats = {
  totalParents: 1247,
  totalCoaches: 89,
  totalPools: 156,
  totalBookings: 8432,
  pendingVerifications: 12,
  activeSchools: 23,
  monthlyRevenue: 124500,
  growthRate: 18.4,
};

export const walletTransactions = [
  { id: 'tx1', date: '2026-06-23', description: 'Lesson: Ethan Lim × Sarah Chen', amount: 85, type: 'credit', from: 'Jennifer Lim', status: 'completed' },
  { id: 'tx2', date: '2026-06-23', description: 'Platform fee (15%)', amount: -12.75, type: 'debit', from: 'Platform', status: 'completed' },
  { id: 'tx3', date: '2026-06-23', description: 'Pool rental: The Parc Condo Pool', amount: -22.50, type: 'debit', from: 'Pool Host', status: 'completed' },
  { id: 'tx4', date: '2026-06-23', description: 'Coach payout: Sarah Chen', amount: 49.75, type: 'payout', from: 'Platform', status: 'pending' },
  { id: 'tx5', date: '2026-06-22', description: 'Lesson: Sophia Tan × Marcus Tan', amount: 95, type: 'credit', from: 'David Tan', status: 'completed' },
  { id: 'tx6', date: '2026-06-22', description: 'Platform fee (15%)', amount: -14.25, type: 'debit', from: 'Platform', status: 'completed' },
  { id: 'tx7', date: '2026-06-22', description: 'Pool rental: Clementi Crest Pool', amount: -17.50, type: 'debit', from: 'Pool Host', status: 'completed' },
  { id: 'tx8', date: '2026-06-22', description: 'Coach payout: Marcus Tan', amount: 63.25, type: 'payout', from: 'Platform', status: 'completed' },
];
