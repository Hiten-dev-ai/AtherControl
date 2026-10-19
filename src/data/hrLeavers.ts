import { Employee } from '../types/audit';

export const INITIAL_HR_LEAVERS: Employee[] = [
  {
    id: 'EMP-1042',
    fullName: 'Marcus Vance',
    workEmail: 'marcus.vance@acmecorp.io',
    personalEmail: 'mvance99@gmail.com',
    department: 'Engineering',
    role: 'Staff Infrastructure Engineer',
    exitDate: '2026-10-05', // 14 days ago
    status: 'RESIGNED',
    separationReason: 'Joined another startup'
  },
  {
    id: 'EMP-1088',
    fullName: 'Sarah Jenkins-Hayes',
    formerSurname: 'Jenkins', // TC2: Surname changed after marriage/legal update
    workEmail: 'sarah.jenkins@acmecorp.io',
    personalEmail: 'sarah.hayes.personal@outlook.com',
    department: 'Product & Design',
    role: 'Principal UX Designer',
    exitDate: '2026-10-09', // 10 days ago
    status: 'RESIGNED',
    separationReason: 'Relocation'
  },
  {
    id: 'EMP-1104',
    fullName: 'Alex Mercer',
    workEmail: 'alex.mercer@acmecorp.io',
    personalEmail: 'alex.m.dev@icloud.com',
    department: 'Security & DevOps',
    role: 'DevOps Engineer',
    exitDate: '2026-10-08', // 11 days ago
    status: 'TERMINATED',
    separationReason: 'Contract end'
  },
  {
    id: 'EMP-1120',
    fullName: 'Elena Rostova',
    workEmail: 'elena.rostova@acmecorp.io',
    personalEmail: 'erostova@protonmail.com',
    department: 'Cloud Platform',
    role: 'Senior Cloud Architect',
    exitDate: '2026-09-28', // 21 days ago
    status: 'RESIGNED',
    separationReason: 'Career sabbatical'
  },
  {
    id: 'EMP-1155',
    fullName: 'David Kim',
    workEmail: 'david.kim@acmecorp.io',
    personalEmail: 'dkim.finance@yahoo.com',
    department: 'Finance & Operations',
    role: 'Financial Analyst',
    exitDate: '2026-10-12', // 7 days ago
    status: 'RESIGNED',
    separationReason: 'Further education'
  },
  {
    id: 'EMP-1190',
    fullName: 'Priya Sharma',
    workEmail: 'priya.sharma@acmecorp.io',
    personalEmail: 'priya.sharma.tech@gmail.com',
    department: 'Human Resources',
    role: 'HR People Partner',
    exitDate: '2026-10-01', // 18 days ago
    status: 'RESIGNED',
    separationReason: 'Personal reasons'
  }
];
