import { Employee, WorkScheduleEntry } from '../models/employee.model';
import { MOCK_USERS } from '../../users/user.mock';
import { MOCK_SERVICES } from './mock-services';

const schedule = (
  mon: [string, string] | [string, string][] | null,
  tue: [string, string] | [string, string][] | null,
  wed: [string, string] | [string, string][] | null,
  thu: [string, string] | [string, string][] | null,
  fri: [string, string] | [string, string][] | null,
  sat: [string, string] | [string, string][] | null,
  sun: [string, string] | [string, string][] | null,
): WorkScheduleEntry[] => {
  const toIv = (v: [string, string] | [string, string][] | null) => {
    if (!v) return [];
    if (Array.isArray(v[0])) return (v as [string, string][]).map(([s, e]) => ({ startTime: s, endTime: e }));
    return [{ startTime: (v as [string, string])[0], endTime: (v as [string, string])[1] }];
  };
  return [
    { day: 'monday',    isWorking: !!mon, intervals: toIv(mon) },
    { day: 'tuesday',   isWorking: !!tue, intervals: toIv(tue) },
    { day: 'wednesday', isWorking: !!wed, intervals: toIv(wed) },
    { day: 'thursday',  isWorking: !!thu, intervals: toIv(thu) },
    { day: 'friday',    isWorking: !!fri, intervals: toIv(fri) },
    { day: 'saturday',  isWorking: !!sat, intervals: toIv(sat) },
    { day: 'sunday',    isWorking: !!sun, intervals: toIv(sun) },
  ];
};

const u = (id: string) => {
  const user = MOCK_USERS.find(u => u.id === id);
  if (!user) throw new Error(`Mock user '${id}' not found`);
  return user;
};

// Defined before MOCK_EMPLOYEES to avoid circular import (mock-services ← mock-employees)
// Cross-referencing is done below after both arrays are initialized.
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1', firstName: 'James', lastName: 'Wilson',
    phone: '+1 555-0101',
    description: 'Board-certified cardiologist with 12 years of clinical experience. Specializes in interventional cardiology and heart failure management.',
    about: [
      '<p>Dr. James Wilson completed his cardiology fellowship at Johns Hopkins Hospital and has since worked in top-tier cardiac centers across the US.</p>',
      '<p>He has published over 20 peer-reviewed articles on heart failure management and is an active member of the American College of Cardiology.</p>',
    ],
    services: MOCK_SERVICES.filter(s => ['1', '3'].includes(s.id)),
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm1', organizationId: 'mock', positionId: 'p1',
    createdAt: '2023-02-15T09:00:00Z', updatedAt: '2024-11-10T14:23:00Z', deletedAt: null,
    user: u('m1'),
    position: { id: 'p1', name: 'Cardiology', organizationId: 'mock', permissions: [] },
    workSchedule: schedule(
      [['09:00','13:00'],['14:00','17:00']], [['09:00','13:00'],['14:00','17:00']], [['09:00','13:00'],['14:00','17:00']], [['09:00','13:00'],['14:00','17:00']], ['09:00','15:00'], null, null,
    ),
    experienceYears: 12,
    education: [
      'MD, Johns Hopkins University School of Medicine',
      'Cardiology Fellowship, Johns Hopkins Hospital',
      'Interventional Cardiology Training, Cleveland Clinic',
    ],
    certificates: [
      'Board Certification in Cardiovascular Disease, American Board of Internal Medicine',
      'Advanced Cardiac Life Support (ACLS)',
      'Certification in Interventional Cardiology, SCAI',
    ],
  },
  {
    id: '2', firstName: 'Amara', lastName: 'Okafor',
    phone: '+1 555-0102',
    description: 'Dermatologist with expertise in medical and cosmetic dermatology. Focused on skin cancer prevention and treatment of chronic skin conditions.',
    about: [
      '<p>Dr. Amara Okafor trained at the University of Lagos before pursuing a residency at NYU Langone Health, where she specialized in inflammatory skin diseases.</p>',
      '<p>She is passionate about dermatological care for diverse skin types and regularly volunteers at community health clinics.</p>',
    ],
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm2', organizationId: 'mock', positionId: 'p2',
    createdAt: '2023-04-01T10:30:00Z', updatedAt: '2025-01-05T11:00:00Z', deletedAt: null,
    user: u('m2'),
    position: { id: 'p2', name: 'Dermatology', organizationId: 'mock', permissions: [] },
    workSchedule: schedule(
      [['10:00','13:00'],['14:30','18:00']], null, [['10:00','13:00'],['14:30','18:00']], null, ['10:00','18:00'], ['09:00','13:00'], null,
    ),
    experienceYears: 9,
    education: [
      'MBBS, University of Lagos College of Medicine',
      'Dermatology Residency, NYU Langone Health',
      'Certificate in Cosmetic Dermatology, American Academy of Dermatology',
    ],
    certificates: [
      'Board Certification in Dermatology, American Board of Dermatology',
      'Certificate in Laser & Aesthetic Medicine, ASLMS',
    ],
  },
  {
    id: '3', firstName: 'Raj', lastName: 'Patel',
    phone: '+1 555-0103',
    description: 'Neurologist specializing in epilepsy and movement disorders. Over 8 years of experience diagnosing and treating complex neurological conditions.',
    about: [
      '<p>Dr. Raj Patel earned his MD from AIIMS New Delhi and completed his neurology residency at Mayo Clinic. He is a leading voice in epilepsy research.</p>',
      '<p>Outside of clinical practice, he leads a weekly support group for patients with Parkinson&#39;s disease and their families.</p>',
    ],
    services: MOCK_SERVICES.filter(s => ['1', '3', '6'].includes(s.id)),
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm3', organizationId: 'mock', positionId: 'p3',
    createdAt: '2022-11-20T08:00:00Z', updatedAt: '2024-09-18T16:45:00Z', deletedAt: null,
    user: u('m3'),
    position: { id: 'p3', name: 'Neurology', organizationId: 'mock', permissions: [] },
    workSchedule: schedule(
      [['08:00','12:00'],['13:00','17:00']], [['08:00','12:00'],['13:00','17:00']], [['08:00','12:00'],['13:00','17:00']], [['08:00','12:00'],['13:00','17:00']], null, null, null,
    ),
    experienceYears: 8,
    education: [
      'MD, All India Institute of Medical Sciences (AIIMS), New Delhi',
      'Neurology Residency, Mayo Clinic',
      'Epilepsy Fellowship, Mayo Clinic',
    ],
    certificates: [
      'Board Certification in Neurology, American Board of Psychiatry and Neurology',
      'Epilepsy Specialist Certification, American Clinical Neurophysiology Society',
    ],
  },
  {
    id: '4', firstName: 'Lisa', lastName: 'Park',
    phone: '+1 555-0104',
    description: 'Pediatrician dedicated to providing comprehensive care for children from newborns to adolescents. Strong focus on developmental health and vaccination.',
    about: [
      '<p>Dr. Lisa Park graduated from Seoul National University School of Medicine and completed her pediatric residency at Children\'s Hospital of Philadelphia.</p>',
      '<p>She is certified in pediatric advanced life support and has a special interest in childhood obesity prevention and nutrition counseling.</p>',
    ],
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm4', organizationId: 'mock', positionId: 'p4',
    createdAt: '2023-07-12T07:30:00Z', updatedAt: '2025-02-14T09:15:00Z', deletedAt: null,
    user: u('m4'),
    position: { id: 'p4', name: 'Pediatrics', organizationId: 'mock', permissions: [] },
    workSchedule: schedule(
      ['08:00','15:00'], ['08:00','15:00'], ['08:00','15:00'], ['08:00','15:00'], ['08:00','15:00'], ['09:00','12:00'], null,
    ),
    experienceYears: 6,
    education: [
      'MD, Seoul National University College of Medicine',
      'Pediatric Residency, Children\'s Hospital of Philadelphia',
      'PALS Certification, American Heart Association',
    ],
  },
  {
    id: '5', firstName: 'Maria', lastName: 'Santos',
    phone: '+1 555-0105',
    description: 'Orthopedic surgeon with a focus on sports medicine and joint replacement. Helps patients recover mobility and quality of life after injuries.',
    about: [
      '<p>Dr. Maria Santos trained at the University of São Paulo and completed a fellowship in sports medicine at Hospital for Special Surgery in New York.</p>',
      '<p>She has worked with professional athletes from multiple sports organizations and is a consultant for two national sports teams.</p>',
    ],
    role: 'EMPLOYEE', isActive: false, isPublic: false,
    userId: 'm5', organizationId: 'mock', positionId: 'p5',
    createdAt: '2022-08-30T12:00:00Z', updatedAt: '2024-06-01T10:00:00Z', deletedAt: null,
    user: u('m5'),
    position: { id: 'p5', name: 'Orthopedics', organizationId: 'mock', permissions: [] },
    workSchedule: schedule(
      null, ['10:00','16:00'], null, ['10:00','16:00'], null, null, null,
    ),
    experienceYears: 14,
    education: [
      'MD, University of São Paulo Faculty of Medicine',
      'Orthopedic Surgery Residency, Hospital das Clínicas, São Paulo',
      'Sports Medicine Fellowship, Hospital for Special Surgery, New York',
    ],
    certificates: [
      'Board Certification in Orthopaedic Surgery, American Board of Orthopaedic Surgery',
      'Certificate of Added Qualification in Sports Medicine',
      'FIFA Medical Centre of Excellence Certification',
    ],
  },
  {
    id: '6', firstName: 'Henrik', lastName: 'Larsson',
    phone: '+1 555-0106',
    description: 'General practitioner with a holistic approach to patient care. Experienced in managing chronic diseases, preventive care, and routine health check-ups.',
    about: [
      '<p>Dr. Henrik Larsson graduated from Karolinska Institutet in Stockholm and has practiced family medicine in both Europe and North America for over 15 years.</p>',
      '<p>He believes in a patient-centered approach and takes time to educate patients about lifestyle modifications and preventive health strategies.</p>',
    ],
    services: MOCK_SERVICES.filter(s => ['1', '5', '3'].includes(s.id)),
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm6', organizationId: 'mock', positionId: 'p6',
    createdAt: '2021-05-18T09:45:00Z', updatedAt: '2024-12-22T13:30:00Z', deletedAt: null,
    user: u('m6'),
    position: { id: 'p6', name: 'General Practice', organizationId: 'mock', permissions: [] },
    workSchedule: schedule(
      ['08:30','17:30'], ['08:30','17:30'], ['08:30','17:30'], ['08:30','17:30'], ['08:30','17:30'], ['08:30','13:00'], null,
    ),
    experienceYears: 15,
    education: [
      'MD, Karolinska Institutet, Stockholm',
      'Family Medicine Residency, Karolinska University Hospital',
      'Certificate in Preventive Medicine, Royal College of General Practitioners',
    ],
  },
  {
    id: '7', firstName: 'Yuki', lastName: 'Tanaka',
    phone: '+1 555-0107',
    description: 'Cardiologist with special interest in electrophysiology and arrhythmia management. Conducts research in non-invasive cardiac diagnostics.',
    about: [
      '<p>Dr. Yuki Tanaka studied at the University of Tokyo and completed her cardiology fellowship at Massachusetts General Hospital, where she focused on cardiac electrophysiology.</p>',
      '<p>She leads a research team developing AI-assisted ECG analysis tools and has been featured in Nature Medicine for her contributions to arrhythmia detection.</p>',
    ],
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm7', organizationId: 'mock', positionId: 'p1',
    createdAt: '2023-09-05T11:00:00Z', updatedAt: '2025-03-01T08:00:00Z', deletedAt: null,
    user: u('m7'),
    position: { id: 'p1', name: 'Cardiology', organizationId: 'mock', permissions: [] },
    workSchedule: schedule(
      [['09:00','12:00'],['13:30','18:00']], [['09:00','12:00'],['13:30','18:00']], null, ['09:00','18:00'], ['09:00','18:00'], [['10:00','12:00'],['13:00','15:00']], null,
    ),
    experienceYears: 7,
    education: [
      'MD, University of Tokyo Faculty of Medicine',
      'Cardiology Fellowship, Massachusetts General Hospital',
      'Electrophysiology Fellowship, Massachusetts General Hospital',
    ],
    certificates: [
      'Board Certification in Cardiovascular Disease, ABIM',
      'Certification in Clinical Cardiac Electrophysiology, ABIM',
      'Heart Rhythm Society Certified Cardiac Device Specialist',
    ],
  },
];

// Patch MOCK_SERVICES with their employees (avoids circular import)
MOCK_SERVICES.forEach(svc => {
  svc.employees = MOCK_EMPLOYEES.filter(e => e.services?.some(s => s.id === svc.id));
});
