import { Service } from '../models/service.model';

export const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Consultation',
    description: 'Initial doctor consultation, medical history review and diagnosis',
    photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=240&fit=crop',
    price: 2500,
    duration: 30,
    organizationId: 'mock',
    about: [
      '<p>Our consultations are conducted by board-certified physicians with extensive clinical experience. During the visit, the doctor reviews your medical history and performs a thorough assessment.</p>',
      '<p>You will receive a detailed diagnosis, a personalised treatment plan, and referrals to specialists if needed. Follow-up digital summary is sent to your email within 24 hours.</p>',
    ],
  },
  {
    id: '2',
    title: 'Teeth Cleaning',
    description: 'Professional ultrasonic teeth cleaning and polishing',
    photo: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=240&fit=crop',
    price: 4800,
    duration: 45,
    durationMax: 60,
    organizationId: 'mock',
    about: [
      '<p>Our hygienists use state-of-the-art ultrasonic scalers to remove tartar and plaque buildup that regular brushing cannot reach. The session ends with professional polishing to restore the natural shine of your teeth.</p>',
      '<p>Regular professional cleaning helps prevent cavities, gum disease, and bad breath. We recommend scheduling a cleaning every 6 months for optimal oral health.</p>',
    ],
  },
  {
    id: '3',
    title: 'ECG',
    description: 'Electrocardiogram with doctor interpretation',
    price: 1200,
    duration: 15,
    organizationId: 'mock',
    about: [
      '<p>A 12-lead ECG is performed by our certified cardiac technicians in a calm, private setting. The procedure is completely painless and takes only a few minutes to complete.</p>',
      '<p>Results are interpreted by a cardiologist and a written report is provided on the same day. ECG is recommended for patients experiencing chest pain, palpitations, or as part of a routine cardiac check-up.</p>',
    ],
  },
  {
    id: '4',
    title: 'Massage (back)',
    description: 'Therapeutic back massage — relaxing and restorative',
    photo: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=400&h=240&fit=crop',
    price: 3500,
    duration: 60,
    durationMax: 90,
    organizationId: 'mock',
    about: [
      '<p>Our licensed massage therapists use a combination of Swedish and deep-tissue techniques tailored to your individual needs. The session targets muscle tension, improves circulation, and promotes deep relaxation.</p>',
      '<p>Particularly effective for relieving chronic back pain, post-workout recovery, and stress-related muscle tightness. Aromatherapy oils are available on request at no extra charge.</p>',
    ],
  },
  {
    id: '5',
    title: 'Blood Test',
    description: 'Complete blood count with differential, basic metabolic panel',
    price: 890,
    duration: 10,
    organizationId: 'mock',
    about: [
      '<p>Our laboratory uses automated analyzers calibrated to international standards, ensuring accurate and reproducible results. Blood is drawn by experienced phlebotomists minimising discomfort.</p>',
      '<p>Results are available within 4–6 hours via our patient portal. The panel includes CBC with differential, glucose, electrolytes, kidney and liver function markers.</p>',
    ],
  },
  {
    id: '6',
    title: 'MRI (brain)',
    description: 'MRI brain scan with contrast, detailed radiologist report included',
    photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=240&fit=crop',
    price: 12000,
    duration: 40,
    durationMax: 60,
    organizationId: 'mock',
    about: [
      '<p>We operate a 3-Tesla MRI scanner providing high-resolution images of brain structures, blood vessels, and soft tissue. Contrast agent is administered intravenously to enhance visibility of abnormalities.</p>',
      '<p>A detailed written report is prepared by a senior neuroradiologist and delivered within 24 hours. The study is indicated for headaches, neurological symptoms, pre-surgical planning, and follow-up of known conditions.</p>',
    ],
  },
];
