import { Employee } from '../../core/models/employee.model';
import { MOCK_USERS } from '../../users/user.mock';

const u = (id: string) => {
  const user = MOCK_USERS.find(u => u.id === id);
  if (!user) throw new Error(`Mock user '${id}' not found`);
  return user;
};

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1', firstName: 'James', lastName: 'Wilson',
    phone: '+1 555-0101',
    description: 'Board-certified cardiologist with 12 years of clinical experience. Specializes in interventional cardiology and heart failure management.',
    about: [
      '<p>Dr. James Wilson completed his cardiology fellowship at Johns Hopkins Hospital and has since worked in top-tier cardiac centers across the US.</p>',
      '<p>He has published over 20 peer-reviewed articles on heart failure management and is an active member of the American College of Cardiology.</p>',
    ],
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm1', organizationId: 'mock', positionId: 'p1',
    createdAt: '2023-02-15T09:00:00Z', updatedAt: '2024-11-10T14:23:00Z', deletedAt: null,
    user: u('m1'),
    position: { id: 'p1', name: 'Cardiology', organizationId: 'mock', permissions: [] },
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
  },
  {
    id: '3', firstName: 'Raj', lastName: 'Patel',
    phone: '+1 555-0103',
    description: 'Neurologist specializing in epilepsy and movement disorders. Over 8 years of experience diagnosing and treating complex neurological conditions.',
    about: [
      '<p>Dr. Raj Patel earned his MD from AIIMS New Delhi and completed his neurology residency at Mayo Clinic. He is a leading voice in epilepsy research.</p>',
      '<p>Outside of clinical practice, he leads a weekly support group for patients with Parkinson&#39;s disease and their families.</p>',
    ],
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm3', organizationId: 'mock', positionId: 'p3',
    createdAt: '2022-11-20T08:00:00Z', updatedAt: '2024-09-18T16:45:00Z', deletedAt: null,
    user: u('m3'),
    position: { id: 'p3', name: 'Neurology', organizationId: 'mock', permissions: [] },
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
  },
  {
    id: '6', firstName: 'Henrik', lastName: 'Larsson',
    phone: '+1 555-0106',
    description: 'General practitioner with a holistic approach to patient care. Experienced in managing chronic diseases, preventive care, and routine health check-ups.',
    about: [
      '<p>Dr. Henrik Larsson graduated from Karolinska Institutet in Stockholm and has practiced family medicine in both Europe and North America for over 15 years.</p>',
      '<p>He believes in a patient-centered approach and takes time to educate patients about lifestyle modifications and preventive health strategies.</p>',
    ],
    role: 'EMPLOYEE', isActive: true, isPublic: true,
    userId: 'm6', organizationId: 'mock', positionId: 'p6',
    createdAt: '2021-05-18T09:45:00Z', updatedAt: '2024-12-22T13:30:00Z', deletedAt: null,
    user: u('m6'),
    position: { id: 'p6', name: 'General Practice', organizationId: 'mock', permissions: [] },
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
  },
];
