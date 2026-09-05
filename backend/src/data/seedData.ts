import { User, Cooperative, Worker, ServiceCategory, Booking, Payout, Rating, Proposal, Vote } from '../types';

export const seedUsers: User[] = [
  // 1 Gov Admin
  {
    id: 'user-gov-1',
    role: 'GOV_ADMIN',
    name: 'Dr. Rajeshwar Sharma (IAS, Ministry of Cooperation)',
    phone: '9999900001',
    lang_pref: 'EN',
    created_at: new Date('2025-01-01').toISOString()
  },
  // 3 Coop Admins
  {
    id: 'user-coop-admin-1',
    role: 'COOP_ADMIN',
    name: 'Sunita Deshmukh (Pune Sahakari Admin)',
    phone: '9822011111',
    lang_pref: 'HI',
    created_at: new Date('2025-01-10').toISOString()
  },
  {
    id: 'user-coop-admin-2',
    role: 'COOP_ADMIN',
    name: 'Rakesh Verma (Delhi NCR Sahakari Admin)',
    phone: '9811022222',
    lang_pref: 'EN',
    created_at: new Date('2025-01-15').toISOString()
  },
  {
    id: 'user-coop-admin-3',
    role: 'COOP_ADMIN',
    name: 'Ananth Kumar (Bengaluru Karmi Admin)',
    phone: '9845033333',
    lang_pref: 'EN',
    created_at: new Date('2025-01-20').toISOString()
  },
  // 15 Workers
  {
    id: 'user-worker-1',
    role: 'WORKER',
    name: 'Ramesh Patil',
    phone: '9822099001',
    lang_pref: 'HI',
    created_at: new Date('2025-02-01').toISOString()
  },
  {
    id: 'user-worker-2',
    role: 'WORKER',
    name: 'Amit Shinde',
    phone: '9822099002',
    lang_pref: 'HI',
    created_at: new Date('2025-02-02').toISOString()
  },
  {
    id: 'user-worker-3',
    role: 'WORKER',
    name: 'Kavita Jadhav',
    phone: '9822099003',
    lang_pref: 'HI',
    created_at: new Date('2025-02-03').toISOString()
  },
  {
    id: 'user-worker-4',
    role: 'WORKER',
    name: 'Sachin Kulkarni',
    phone: '9822099004',
    lang_pref: 'EN',
    created_at: new Date('2025-02-04').toISOString()
  },
  {
    id: 'user-worker-5',
    role: 'WORKER',
    name: 'Meera Gaikwad',
    phone: '9822099005',
    lang_pref: 'HI',
    created_at: new Date('2025-02-05').toISOString()
  },
  {
    id: 'user-worker-6',
    role: 'WORKER',
    name: 'Harpreet Singh',
    phone: '9811088001',
    lang_pref: 'HI',
    created_at: new Date('2025-02-06').toISOString()
  },
  {
    id: 'user-worker-7',
    role: 'WORKER',
    name: 'Pooja Sharma',
    phone: '9811088002',
    lang_pref: 'HI',
    created_at: new Date('2025-02-07').toISOString()
  },
  {
    id: 'user-worker-8',
    role: 'WORKER',
    name: 'Mohammad Imran',
    phone: '9811088003',
    lang_pref: 'HI',
    created_at: new Date('2025-02-08').toISOString()
  },
  {
    id: 'user-worker-9',
    role: 'WORKER',
    name: 'Vikram Rajput',
    phone: '9811088004',
    lang_pref: 'EN',
    created_at: new Date('2025-02-09').toISOString()
  },
  {
    id: 'user-worker-10',
    role: 'WORKER',
    name: 'Anita Devi',
    phone: '9811088005',
    lang_pref: 'HI',
    created_at: new Date('2025-02-10').toISOString()
  },
  {
    id: 'user-worker-11',
    role: 'WORKER',
    name: 'Suresh Gowda',
    phone: '9845077001',
    lang_pref: 'EN',
    created_at: new Date('2025-02-11').toISOString()
  },
  {
    id: 'user-worker-12',
    role: 'WORKER',
    name: 'Deepa Hegde',
    phone: '9845077002',
    lang_pref: 'EN',
    created_at: new Date('2025-02-12').toISOString()
  },
  {
    id: 'user-worker-13',
    role: 'WORKER',
    name: 'Karthik Rao',
    phone: '9845077003',
    lang_pref: 'EN',
    created_at: new Date('2025-02-13').toISOString()
  },
  {
    id: 'user-worker-14',
    role: 'WORKER',
    name: 'Lakshmi Narayanan',
    phone: '9845077004',
    lang_pref: 'EN',
    created_at: new Date('2025-02-14').toISOString()
  },
  {
    id: 'user-worker-15',
    role: 'WORKER',
    name: 'Basavaraj Patil',
    phone: '9845077005',
    lang_pref: 'EN',
    created_at: new Date('2025-02-15').toISOString()
  },
  // 10 Customers
  {
    id: 'user-cust-1',
    role: 'CUSTOMER',
    name: 'Aarav Mehta',
    phone: '9876500001',
    lang_pref: 'EN',
    created_at: new Date('2025-02-16').toISOString()
  },
  {
    id: 'user-cust-2',
    role: 'CUSTOMER',
    name: 'Sneha Joshi',
    phone: '9876500002',
    lang_pref: 'HI',
    created_at: new Date('2025-02-17').toISOString()
  },
  {
    id: 'user-cust-3',
    role: 'CUSTOMER',
    name: 'Rohan Gupta',
    phone: '9876500003',
    lang_pref: 'EN',
    created_at: new Date('2025-02-18').toISOString()
  },
  {
    id: 'user-cust-4',
    role: 'CUSTOMER',
    name: 'Priya Nair',
    phone: '9876500004',
    lang_pref: 'EN',
    created_at: new Date('2025-02-19').toISOString()
  },
  {
    id: 'user-cust-5',
    role: 'CUSTOMER',
    name: 'Vikram Malhotra',
    phone: '9876500005',
    lang_pref: 'EN',
    created_at: new Date('2025-02-20').toISOString()
  },
  {
    id: 'user-cust-6',
    role: 'CUSTOMER',
    name: 'Ananya Roy',
    phone: '9876500006',
    lang_pref: 'EN',
    created_at: new Date('2025-02-21').toISOString()
  },
  {
    id: 'user-cust-7',
    role: 'CUSTOMER',
    name: 'Kunal Kapoor',
    phone: '9876500007',
    lang_pref: 'HI',
    created_at: new Date('2025-02-22').toISOString()
  },
  {
    id: 'user-cust-8',
    role: 'CUSTOMER',
    name: 'Neha Agarwal',
    phone: '9876500008',
    lang_pref: 'HI',
    created_at: new Date('2025-02-23').toISOString()
  },
  {
    id: 'user-cust-9',
    role: 'CUSTOMER',
    name: 'Aditya Swaminathan',
    phone: '9876500009',
    lang_pref: 'EN',
    created_at: new Date('2025-02-24').toISOString()
  },
  {
    id: 'user-cust-10',
    role: 'CUSTOMER',
    name: 'Pooja Bhatia',
    phone: '9876500010',
    lang_pref: 'HI',
    created_at: new Date('2025-02-25').toISOString()
  }
];

export const seedCooperatives: Cooperative[] = [
  {
    id: 'coop-1',
    name: 'Pune Shramik Seva Sahakari Sanstha Ltd.',
    registration_no: 'MH/PUN/COOP/2023/1042',
    district: 'Pune',
    state: 'Maharashtra',
    admin_user_id: 'user-coop-admin-1',
    fund_balance: 142500,
    status: 'APPROVED',
    created_at: new Date('2025-01-10').toISOString()
  },
  {
    id: 'coop-2',
    name: 'Delhi NCR Griha Kalyan Sahakari Samiti',
    registration_no: 'DL/SD/COOP/2022/8871',
    district: 'South Delhi',
    state: 'Delhi',
    admin_user_id: 'user-coop-admin-2',
    fund_balance: 186000,
    status: 'APPROVED',
    created_at: new Date('2025-01-15').toISOString()
  },
  {
    id: 'coop-3',
    name: 'Bengaluru Urban Karmi Sahakara Sangha',
    registration_no: 'KA/BLR/COOP/2024/0319',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    admin_user_id: 'user-coop-admin-3',
    fund_balance: 98400,
    status: 'APPROVED',
    created_at: new Date('2025-01-20').toISOString()
  }
];

export const seedCategories: ServiceCategory[] = [
  {
    id: 'cat-cleaning',
    name: 'Cleaning',
    description: 'Deep home cleaning, kitchen scrubbing, bathroom sanitization, and floor polishing.',
    base_rate: 499,
    cooperative_id: null
  },
  {
    id: 'cat-plumbing',
    name: 'Plumbing',
    description: 'Pipe leak repairs, tap fixtures, drainage clearing, and water tank setup.',
    base_rate: 399,
    cooperative_id: null
  },
  {
    id: 'cat-electrical',
    name: 'Electrical',
    description: 'Short circuit diagnosis, switchboard fitting, fan and chandelier installation.',
    base_rate: 349,
    cooperative_id: null
  },
  {
    id: 'cat-tutoring',
    name: 'Tutoring',
    description: 'K-12 academics, science and math tutoring, languages, and coding basics.',
    base_rate: 599,
    cooperative_id: null
  },
  {
    id: 'cat-caregiving',
    name: 'Caregiving',
    description: 'Elderly care, patient recovery assistance, companionship, and mobility aid.',
    base_rate: 799,
    cooperative_id: null
  },
  {
    id: 'cat-appliance',
    name: 'Appliance Repair',
    description: 'AC servicing, refrigerator gas refilling, washing machine and microwave repairs.',
    base_rate: 649,
    cooperative_id: null
  }
];

export const seedWorkers: Worker[] = [
  // Pune Workers (Pune center: 18.5204, 73.8567)
  {
    id: 'worker-1',
    user_id: 'user-worker-1',
    cooperative_id: 'coop-1',
    skills: ['Plumbing', 'Appliance Repair'],
    verification_status: 'VERIFIED',
    rating_avg: 4.85,
    availability_status: true,
    lat: 18.5215,
    lng: 73.8540
  },
  {
    id: 'worker-2',
    user_id: 'user-worker-2',
    cooperative_id: 'coop-1',
    skills: ['Electrical', 'Appliance Repair'],
    verification_status: 'VERIFIED',
    rating_avg: 4.70,
    availability_status: true,
    lat: 18.5300,
    lng: 73.8470
  },
  {
    id: 'worker-3',
    user_id: 'user-worker-3',
    cooperative_id: 'coop-1',
    skills: ['Cleaning', 'Caregiving'],
    verification_status: 'VERIFIED',
    rating_avg: 4.90,
    availability_status: true,
    lat: 18.5150,
    lng: 73.8600
  },
  {
    id: 'worker-4',
    user_id: 'user-worker-4',
    cooperative_id: 'coop-1',
    skills: ['Tutoring'],
    verification_status: 'VERIFIED',
    rating_avg: 4.95,
    availability_status: false,
    lat: 18.5080,
    lng: 73.8250
  },
  {
    id: 'worker-5',
    user_id: 'user-worker-5',
    cooperative_id: 'coop-1',
    skills: ['Caregiving', 'Cleaning'],
    verification_status: 'VERIFIED',
    rating_avg: 4.60,
    availability_status: true,
    lat: 18.5400,
    lng: 73.8300
  },
  // Delhi Workers (Delhi center: 28.6139, 77.2090)
  {
    id: 'worker-6',
    user_id: 'user-worker-6',
    cooperative_id: 'coop-2',
    skills: ['Plumbing'],
    verification_status: 'VERIFIED',
    rating_avg: 4.80,
    availability_status: true,
    lat: 28.6145,
    lng: 77.2100
  },
  {
    id: 'worker-7',
    user_id: 'user-worker-7',
    cooperative_id: 'coop-2',
    skills: ['Cleaning', 'Caregiving'],
    verification_status: 'VERIFIED',
    rating_avg: 4.92,
    availability_status: true,
    lat: 28.5355,
    lng: 77.2410
  },
  {
    id: 'worker-8',
    user_id: 'user-worker-8',
    cooperative_id: 'coop-2',
    skills: ['Electrical', 'Appliance Repair'],
    verification_status: 'VERIFIED',
    rating_avg: 4.75,
    availability_status: true,
    lat: 28.5700,
    lng: 77.2200
  },
  {
    id: 'worker-9',
    user_id: 'user-worker-9',
    cooperative_id: 'coop-2',
    skills: ['Appliance Repair'],
    verification_status: 'VERIFIED',
    rating_avg: 4.65,
    availability_status: false,
    lat: 28.6300,
    lng: 77.2150
  },
  {
    id: 'worker-10',
    user_id: 'user-worker-10',
    cooperative_id: 'coop-2',
    skills: ['Tutoring'],
    verification_status: 'VERIFIED',
    rating_avg: 4.88,
    availability_status: true,
    lat: 28.5400,
    lng: 77.2600
  },
  // Bengaluru Workers (Bengaluru center: 12.9716, 77.5946)
  {
    id: 'worker-11',
    user_id: 'user-worker-11',
    cooperative_id: 'coop-3',
    skills: ['Electrical', 'Plumbing'],
    verification_status: 'VERIFIED',
    rating_avg: 4.82,
    availability_status: true,
    lat: 12.9750,
    lng: 77.5900
  },
  {
    id: 'worker-12',
    user_id: 'user-worker-12',
    cooperative_id: 'coop-3',
    skills: ['Cleaning'],
    verification_status: 'VERIFIED',
    rating_avg: 4.91,
    availability_status: true,
    lat: 12.9352,
    lng: 77.6245
  },
  {
    id: 'worker-13',
    user_id: 'user-worker-13',
    cooperative_id: 'coop-3',
    skills: ['Tutoring'],
    verification_status: 'VERIFIED',
    rating_avg: 4.98,
    availability_status: true,
    lat: 12.9700,
    lng: 77.6400
  },
  {
    id: 'worker-14',
    user_id: 'user-worker-14',
    cooperative_id: 'coop-3',
    skills: ['Caregiving'],
    verification_status: 'VERIFIED',
    rating_avg: 4.70,
    availability_status: false,
    lat: 12.9200,
    lng: 77.5800
  },
  {
    id: 'worker-15',
    user_id: 'user-worker-15',
    cooperative_id: 'coop-3',
    skills: ['Appliance Repair', 'Electrical'],
    verification_status: 'VERIFIED',
    rating_avg: 4.78,
    availability_status: true,
    lat: 13.0100,
    lng: 77.5500
  }
];

export const seedBookings: Booking[] = [
  // 15 Completed bookings with payouts and ratings
  {
    id: 'booking-1',
    customer_id: 'user-cust-1',
    worker_id: 'worker-1',
    category_id: 'cat-plumbing',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-10T10:00:00Z').toISOString(),
    address: 'Flat 402, Shivneri Heights, FC Road, Pune',
    instructions: 'Kitchen sink pipe is leaking heavily under the counter',
    amount: 500,
    created_at: new Date('2025-02-09T18:30:00Z').toISOString()
  },
  {
    id: 'booking-2',
    customer_id: 'user-cust-2',
    worker_id: 'worker-2',
    category_id: 'cat-electrical',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-12T14:00:00Z').toISOString(),
    address: 'Bungalow 12, Baner Pashan Link Rd, Pune',
    instructions: 'Main MCB keeps tripping whenever geyser is turned on',
    amount: 600,
    created_at: new Date('2025-02-11T09:15:00Z').toISOString()
  },
  {
    id: 'booking-3',
    customer_id: 'user-cust-3',
    worker_id: 'worker-3',
    category_id: 'cat-cleaning',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-14T09:00:00Z').toISOString(),
    address: 'Rowhouse 4, Magarpatta City, Pune',
    instructions: 'Post-renovation deep cleaning for 3BHK flat',
    amount: 1500,
    created_at: new Date('2025-02-13T12:00:00Z').toISOString()
  },
  {
    id: 'booking-4',
    customer_id: 'user-cust-4',
    worker_id: 'worker-6',
    category_id: 'cat-plumbing',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-15T11:00:00Z').toISOString(),
    address: 'A-24, Greater Kailash 1, New Delhi',
    instructions: 'Replace bathroom mixer tap and repair valve',
    amount: 800,
    created_at: new Date('2025-02-14T16:20:00Z').toISOString()
  },
  {
    id: 'booking-5',
    customer_id: 'user-cust-5',
    worker_id: 'worker-7',
    category_id: 'cat-cleaning',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-16T10:30:00Z').toISOString(),
    address: 'C-301, Vasant Kunj, New Delhi',
    instructions: 'Sofa cleaning and carpet sanitization',
    amount: 1200,
    created_at: new Date('2025-02-15T11:00:00Z').toISOString()
  },
  {
    id: 'booking-6',
    customer_id: 'user-cust-6',
    worker_id: 'worker-8',
    category_id: 'cat-appliance',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-17T15:00:00Z').toISOString(),
    address: 'Tower 3, Saket Residential Complex, New Delhi',
    instructions: 'Split AC not cooling, fan motor noise',
    amount: 1400,
    created_at: new Date('2025-02-16T18:00:00Z').toISOString()
  },
  {
    id: 'booking-7',
    customer_id: 'user-cust-7',
    worker_id: 'worker-11',
    category_id: 'cat-electrical',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-18T13:00:00Z').toISOString(),
    address: '14th Cross, Indiranagar, Bengaluru',
    instructions: 'Ceiling fan replacement and lighting track setup',
    amount: 750,
    created_at: new Date('2025-02-17T14:30:00Z').toISOString()
  },
  {
    id: 'booking-8',
    customer_id: 'user-cust-8',
    worker_id: 'worker-12',
    category_id: 'cat-cleaning',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-19T09:30:00Z').toISOString(),
    address: 'Villa 88, Koramangala 4th Block, Bengaluru',
    instructions: 'Kitchen deep scrubbing and chimney grease removal',
    amount: 1000,
    created_at: new Date('2025-02-18T10:00:00Z').toISOString()
  },
  {
    id: 'booking-9',
    customer_id: 'user-cust-9',
    worker_id: 'worker-13',
    category_id: 'cat-tutoring',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-20T17:00:00Z').toISOString(),
    address: 'Green Glen Layout, Bellandur, Bengaluru',
    instructions: 'Grade 10 ICSE Physics exam preparation session',
    amount: 900,
    created_at: new Date('2025-02-19T11:45:00Z').toISOString()
  },
  {
    id: 'booking-10',
    customer_id: 'user-cust-10',
    worker_id: 'worker-15',
    category_id: 'cat-appliance',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-21T11:30:00Z').toISOString(),
    address: 'Sobha Forest View, Kanakapura Rd, Bengaluru',
    instructions: 'Front load washing machine draining error E20',
    amount: 1100,
    created_at: new Date('2025-02-20T15:10:00Z').toISOString()
  },
  {
    id: 'booking-11',
    customer_id: 'user-cust-1',
    worker_id: 'worker-2',
    category_id: 'cat-electrical',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-22T16:00:00Z').toISOString(),
    address: 'Kothrud Depot Road, Pune',
    instructions: 'Inverter battery terminal cleanup and water top-up',
    amount: 550,
    created_at: new Date('2025-02-21T09:00:00Z').toISOString()
  },
  {
    id: 'booking-12',
    customer_id: 'user-cust-2',
    worker_id: 'worker-3',
    category_id: 'cat-caregiving',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-23T08:00:00Z').toISOString(),
    address: 'Prabhat Road, Lane 4, Pune',
    instructions: 'Assisting senior citizen with physiotherapy and walking',
    amount: 1600,
    created_at: new Date('2025-02-22T13:00:00Z').toISOString()
  },
  {
    id: 'booking-13',
    customer_id: 'user-cust-3',
    worker_id: 'worker-7',
    category_id: 'cat-cleaning',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-24T10:00:00Z').toISOString(),
    address: 'Hauz Khas Enclave, New Delhi',
    instructions: 'Window glass cleaning and balcony wash',
    amount: 700,
    created_at: new Date('2025-02-23T14:15:00Z').toISOString()
  },
  {
    id: 'booking-14',
    customer_id: 'user-cust-4',
    worker_id: 'worker-10',
    category_id: 'cat-tutoring',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-25T16:30:00Z').toISOString(),
    address: 'Defence Colony, C-Block, New Delhi',
    instructions: 'Class 8 Mathematics algebra practice',
    amount: 800,
    created_at: new Date('2025-02-24T19:00:00Z').toISOString()
  },
  {
    id: 'booking-15',
    customer_id: 'user-cust-5',
    worker_id: 'worker-11',
    category_id: 'cat-plumbing',
    status: 'COMPLETED',
    scheduled_time: new Date('2025-02-26T11:00:00Z').toISOString(),
    address: 'HSR Layout, Sector 2, Bengaluru',
    instructions: 'Geyser inlet valve leaking water constantly',
    amount: 650,
    created_at: new Date('2025-02-25T17:30:00Z').toISOString()
  },

  // 5 In-Progress Bookings
  {
    id: 'booking-16',
    customer_id: 'user-cust-1',
    worker_id: 'worker-1',
    category_id: 'cat-plumbing',
    status: 'IN_PROGRESS',
    scheduled_time: new Date(Date.now() + 3600000).toISOString(),
    address: 'Aundh Gaon, Near D-Mart, Pune',
    instructions: 'Water motor switch and pipe joint replacement',
    amount: 850,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'booking-17',
    customer_id: 'user-cust-2',
    worker_id: 'worker-3',
    category_id: 'cat-caregiving',
    status: 'IN_PROGRESS',
    scheduled_time: new Date(Date.now() + 7200000).toISOString(),
    address: 'Model Colony, Pune',
    instructions: 'Post-surgery mobility care for mother',
    amount: 1500,
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 'booking-18',
    customer_id: 'user-cust-6',
    worker_id: 'worker-6',
    category_id: 'cat-plumbing',
    status: 'IN_PROGRESS',
    scheduled_time: new Date(Date.now() + 5400000).toISOString(),
    address: 'Lajpat Nagar IV, New Delhi',
    instructions: 'Kitchen drainage pipe overflow',
    amount: 700,
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'booking-19',
    customer_id: 'user-cust-7',
    worker_id: 'worker-8',
    category_id: 'cat-electrical',
    status: 'IN_PROGRESS',
    scheduled_time: new Date(Date.now() + 1800000).toISOString(),
    address: 'Alaknanda, Mandakini Enclave, New Delhi',
    instructions: 'Living room light points rewiring',
    amount: 900,
    created_at: new Date(Date.now() - 18000000).toISOString()
  },
  {
    id: 'booking-20',
    customer_id: 'user-cust-8',
    worker_id: 'worker-12',
    category_id: 'cat-cleaning',
    status: 'IN_PROGRESS',
    scheduled_time: new Date(Date.now() + 9000000).toISOString(),
    address: 'Whitefield Main Road, Bengaluru',
    instructions: 'Full house floor polishing and balcony pressure wash',
    amount: 1800,
    created_at: new Date(Date.now() - 21600000).toISOString()
  },

  // 5 Accepted Bookings
  {
    id: 'booking-21',
    customer_id: 'user-cust-9',
    worker_id: 'worker-1',
    category_id: 'cat-plumbing',
    status: 'ACCEPTED',
    scheduled_time: new Date(Date.now() + 86400000).toISOString(),
    address: 'Kalyani Nagar, Pune',
    instructions: 'Overhead water tank ball cock replacement',
    amount: 500,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'booking-22',
    customer_id: 'user-cust-10',
    worker_id: 'worker-2',
    category_id: 'cat-electrical',
    status: 'ACCEPTED',
    scheduled_time: new Date(Date.now() + 90000000).toISOString(),
    address: 'Viman Nagar, Pune',
    instructions: 'Power backup wiring check',
    amount: 650,
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'booking-23',
    customer_id: 'user-cust-3',
    worker_id: 'worker-7',
    category_id: 'cat-cleaning',
    status: 'ACCEPTED',
    scheduled_time: new Date(Date.now() + 93600000).toISOString(),
    address: 'Panchsheel Park, New Delhi',
    instructions: 'Bathroom tiles stain removal',
    amount: 600,
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: 'booking-24',
    customer_id: 'user-cust-4',
    worker_id: 'worker-11',
    category_id: 'cat-electrical',
    status: 'ACCEPTED',
    scheduled_time: new Date(Date.now() + 97200000).toISOString(),
    address: 'JP Nagar 7th Phase, Bengaluru',
    instructions: 'Exhaust fan installation in 2 bathrooms',
    amount: 700,
    created_at: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'booking-25',
    customer_id: 'user-cust-5',
    worker_id: 'worker-13',
    category_id: 'cat-tutoring',
    status: 'ACCEPTED',
    scheduled_time: new Date(Date.now() + 100800000).toISOString(),
    address: 'Sarjapur Road, Bengaluru',
    instructions: 'CBSE Class 12 Chemistry revision',
    amount: 950,
    created_at: new Date(Date.now() - 18000000).toISOString()
  },

  // 5 Requested Bookings (Pending Worker acceptance)
  {
    id: 'booking-26',
    customer_id: 'user-cust-1',
    worker_id: 'worker-1',
    category_id: 'cat-plumbing',
    status: 'REQUESTED',
    scheduled_time: new Date(Date.now() + 172800000).toISOString(),
    address: 'Shivaji Nagar, Pune',
    instructions: 'Tap replacement in master bedroom',
    amount: 450,
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'booking-27',
    customer_id: 'user-cust-2',
    worker_id: 'worker-2',
    category_id: 'cat-electrical',
    status: 'REQUESTED',
    scheduled_time: new Date(Date.now() + 176400000).toISOString(),
    address: 'Bavdhan, Pune',
    instructions: 'Inverter point fitting',
    amount: 550,
    created_at: new Date(Date.now() - 2400000).toISOString()
  },
  {
    id: 'booking-28',
    customer_id: 'user-cust-6',
    worker_id: 'worker-6',
    category_id: 'cat-plumbing',
    status: 'REQUESTED',
    scheduled_time: new Date(Date.now() + 180000000).toISOString(),
    address: 'Saket, New Delhi',
    instructions: 'Water pipe leakage repair',
    amount: 500,
    created_at: new Date(Date.now() - 3000000).toISOString()
  },
  {
    id: 'booking-29',
    customer_id: 'user-cust-7',
    worker_id: 'worker-11',
    category_id: 'cat-electrical',
    status: 'REQUESTED',
    scheduled_time: new Date(Date.now() + 183600000).toISOString(),
    address: 'HSR Layout, Bengaluru',
    instructions: 'Light fixture installation',
    amount: 600,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'booking-30',
    customer_id: 'user-cust-8',
    worker_id: 'worker-15',
    category_id: 'cat-appliance',
    status: 'REQUESTED',
    scheduled_time: new Date(Date.now() + 187200000).toISOString(),
    address: 'Electronic City Phase 1, Bengaluru',
    instructions: 'Microwave oven not heating up',
    amount: 800,
    created_at: new Date(Date.now() - 4200000).toISOString()
  }
];

// Generate 80/15/5 Payouts for the 15 completed bookings
export const seedPayouts: Payout[] = seedBookings.slice(0, 15).map((b, idx) => {
  const amt = b.amount;
  return {
    id: `payout-${idx + 1}`,
    booking_id: b.id,
    worker_share: Math.round(amt * 0.80 * 100) / 100,
    cooperative_share: Math.round(amt * 0.15 * 100) / 100,
    platform_fee: Math.round(amt * 0.05 * 100) / 100,
    status: 'RELEASED',
    created_at: b.scheduled_time
  };
});

// Generate Ratings for completed bookings
export const seedRatings: Rating[] = [
  {
    id: 'rating-1',
    booking_id: 'booking-1',
    score: 5,
    comment: 'Ramesh arrived right on time, explained the cooperative model to me, and fixed the pipe flawlessly. Transparent pricing!',
    created_at: new Date('2025-02-10T12:30:00Z').toISOString()
  },
  {
    id: 'rating-2',
    booking_id: 'booking-2',
    score: 5,
    comment: 'Excellent electrician! Fixed the geyser MCB tripping in under 30 minutes. Glad to know 80% goes straight to him.',
    created_at: new Date('2025-02-12T15:30:00Z').toISOString()
  },
  {
    id: 'rating-3',
    booking_id: 'booking-3',
    score: 5,
    comment: 'Kavita and her cooperative team cleaned our 3BHK sparkling clean. Great work ethic and very polite.',
    created_at: new Date('2025-02-14T14:00:00Z').toISOString()
  },
  {
    id: 'rating-4',
    booking_id: 'booking-4',
    score: 5,
    comment: 'Harpreet was extremely skilled and honest. No hidden charges unlike other commercial apps.',
    created_at: new Date('2025-02-15T13:00:00Z').toISOString()
  },
  {
    id: 'rating-5',
    booking_id: 'booking-5',
    score: 5,
    comment: 'Pooja did a fantastic job with our upholstery. Highly recommended.',
    created_at: new Date('2025-02-16T12:45:00Z').toISOString()
  },
  {
    id: 'rating-6',
    booking_id: 'booking-6',
    score: 4,
    comment: 'Good repair work, resolved the AC noise completely. Slightly delayed by 15 mins due to traffic.',
    created_at: new Date('2025-02-17T17:00:00Z').toISOString()
  },
  {
    id: 'rating-7',
    booking_id: 'booking-7',
    score: 5,
    comment: 'Suresh is top notch! Fixed track lights with professional finish.',
    created_at: new Date('2025-02-18T15:00:00Z').toISOString()
  },
  {
    id: 'rating-8',
    booking_id: 'booking-8',
    score: 5,
    comment: 'Deepa left our kitchen looking brand new. Amazing cooperative initiative.',
    created_at: new Date('2025-02-19T12:00:00Z').toISOString()
  },
  {
    id: 'rating-9',
    booking_id: 'booking-9',
    score: 5,
    comment: 'Karthik is an incredible teacher. Helped my son grasp physics concepts in one session.',
    created_at: new Date('2025-02-20T19:00:00Z').toISOString()
  },
  {
    id: 'rating-10',
    booking_id: 'booking-10',
    score: 4,
    comment: 'Basavaraj diagnosed the washing machine pump issue accurately. Reasonable price.',
    created_at: new Date('2025-02-21T13:30:00Z').toISOString()
  },
  {
    id: 'rating-11',
    booking_id: 'booking-11',
    score: 5,
    comment: 'Inverter is working great. Very knowledgeable technician.',
    created_at: new Date('2025-02-22T17:30:00Z').toISOString()
  },
  {
    id: 'rating-12',
    booking_id: 'booking-12',
    score: 5,
    comment: 'Kavita treated my elderly mother with so much warmth and patience. Thank you SahakarConnect!',
    created_at: new Date('2025-02-23T11:00:00Z').toISOString()
  },
  {
    id: 'rating-13',
    booking_id: 'booking-13',
    score: 4,
    comment: 'Cleaned windows nicely and properly disposed of dust and waste.',
    created_at: new Date('2025-02-24T12:00:00Z').toISOString()
  },
  {
    id: 'rating-14',
    booking_id: 'booking-14',
    score: 5,
    comment: 'Pooja is a very encouraging tutor. Great experience.',
    created_at: new Date('2025-02-25T18:30:00Z').toISOString()
  },
  {
    id: 'rating-15',
    booking_id: 'booking-15',
    score: 5,
    comment: 'Fast response and fixed the bathroom leak quickly. Love supporting worker cooperatives!',
    created_at: new Date('2025-02-26T12:30:00Z').toISOString()
  }
];

export const seedProposals: Proposal[] = [
  // 1 Open Proposal for Pune Coop
  {
    id: 'prop-1',
    cooperative_id: 'coop-1',
    title: 'Should we raise Plumbing Base Rate from ₹399 to ₹450 to cover higher tool costs?',
    description: 'Due to inflation in copper fittings and branded sealant material costs, the managing committee proposes adjusting our base service charge by +₹51. This will increase worker earnings by ₹40.80 per booking.',
    options: ['Approve Rate Increase (₹450)', 'Keep Current Rate (₹399)', 'Raise Further to ₹480'],
    deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: 'OPEN',
    created_at: new Date('2025-02-20T10:00:00Z').toISOString()
  },
  // 1 Open Proposal for Delhi Coop
  {
    id: 'prop-2',
    cooperative_id: 'coop-2',
    title: 'Utilize ₹50,000 from Cooperative Welfare Fund for Group Health & Accident Insurance',
    description: 'We have received quotes from Star Health & New India Assurance to provide ₹3 Lakh accident cover and ₹1 Lakh hospitalization cover for all 15 active cooperative members. Premium will be paid from our 15% welfare reserve.',
    options: ['Yes, Procure Insurance Immediately', 'No, Reserve Funds for Festive Bonus', 'Seek Additional Quotes'],
    deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: 'OPEN',
    created_at: new Date('2025-02-22T14:00:00Z').toISOString()
  },
  // 1 Closed Proposal with existing votes for Bengaluru Coop
  {
    id: 'prop-3',
    cooperative_id: 'coop-3',
    title: 'Adopt Cooperative EV Scooter Subsidy Scheme for Karmi Members',
    description: 'Partnering with Ather/Ola to offer ₹15,000 down payment contribution from cooperative fund balance to help workers transition to electric two-wheelers, reducing petrol expenses by 70%.',
    options: ['Adopt EV Scheme', 'Reject Scheme', 'Offer Loan Instead of Subsidy'],
    deadline: new Date('2025-02-15T23:59:59Z').toISOString(),
    status: 'CLOSED',
    created_at: new Date('2025-02-01T09:00:00Z').toISOString()
  }
];

export const seedVotes: Vote[] = [
  // Votes on Closed Proposal (prop-3)
  {
    id: 'vote-1',
    proposal_id: 'prop-3',
    worker_id: 'worker-11',
    choice: 'Adopt EV Scheme',
    created_at: new Date('2025-02-03T11:00:00Z').toISOString()
  },
  {
    id: 'vote-2',
    proposal_id: 'prop-3',
    worker_id: 'worker-12',
    choice: 'Adopt EV Scheme',
    created_at: new Date('2025-02-04T15:30:00Z').toISOString()
  },
  {
    id: 'vote-3',
    proposal_id: 'prop-3',
    worker_id: 'worker-13',
    choice: 'Offer Loan Instead of Subsidy',
    created_at: new Date('2025-02-05T10:20:00Z').toISOString()
  },
  {
    id: 'vote-4',
    proposal_id: 'prop-3',
    worker_id: 'worker-14',
    choice: 'Adopt EV Scheme',
    created_at: new Date('2025-02-06T14:45:00Z').toISOString()
  },
  {
    id: 'vote-5',
    proposal_id: 'prop-3',
    worker_id: 'worker-15',
    choice: 'Adopt EV Scheme',
    created_at: new Date('2025-02-07T09:10:00Z').toISOString()
  },

  // Votes on Open Proposal (prop-1)
  {
    id: 'vote-6',
    proposal_id: 'prop-1',
    worker_id: 'worker-1',
    choice: 'Approve Rate Increase (₹450)',
    created_at: new Date('2025-02-21T09:30:00Z').toISOString()
  },
  {
    id: 'vote-7',
    proposal_id: 'prop-1',
    worker_id: 'worker-2',
    choice: 'Approve Rate Increase (₹450)',
    created_at: new Date('2025-02-21T12:00:00Z').toISOString()
  },
  {
    id: 'vote-8',
    proposal_id: 'prop-1',
    worker_id: 'worker-3',
    choice: 'Raise Further to ₹480',
    created_at: new Date('2025-02-22T10:15:00Z').toISOString()
  }
];
