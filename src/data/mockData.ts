/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  Teacher,
  Staff,
  ClassElement,
  AttendanceRecord,
  FeeCategory,
  FeeReceipt,
  ExamRecord,
  BookRecord,
  TransportVehicle,
  HostelRoom,
  CommunicationItem,
  HomeworkAssignment,
  LMSLecture,
  InventoryItem,
  FinanceLedgerEntry,
  AuditLog,
  UserRole,
  LandingTopper,
  LandingFaculty,
  LandingCurriculum,
  LandingFAQ,
  LandingTexts
} from "../types";

export const initialStudents: Student[] = [
  {
    id: "STU-001",
    name: "Aarav Sharma",
    email: "aarav.sharma@school.edu",
    phone: "+91 98765-11001",
    admissionNo: "ADM-2024-001",
    className: "Class 10",
    section: "A",
    parentName: "Rajesh Sharma",
    parentPhone: "+91 98765-11000",
    parentEmail: "rajesh.sharma@gmail.com",
    address: "Flat 452, Block B, pocket 1, Dwarka Sector 12, New Delhi - 110075",
    dob: "2010-04-12",
    bloodGroup: "O+",
    medicalConditions: "Dust Allergy (Carries inhaler)",
    documents: [
      { title: "Aadhaar Card Copy", url: "#", status: "Verified" }
    ],
    status: "Active",
    gradePerformance: 94.2,
    attendanceRate: 98.5,
    pendingFees: 250
  },
  {
    id: "STU-002",
    name: "Aniket Patel",
    email: "aniket.patel@school.edu",
    phone: "+91 94250-22001",
    admissionNo: "ADM-2024-002",
    className: "Class 10",
    section: "A",
    parentName: "Mahesh Patel",
    parentPhone: "+91 94250-22000",
    parentEmail: "mahesh.patel@outlook.com",
    address: "B-104, Shanti Nagar Housing Society, SG Highway, Ahmedabad, Gujarat - 380015",
    dob: "2010-09-22",
    bloodGroup: "A-",
    medicalConditions: "Mild Asthma",
    documents: [
      { title: "Aadhaar Card Copy", url: "#", status: "Verified" },
      { title: "Residential Address Proof", url: "#", status: "Verified" }
    ],
    status: "Active",
    gradePerformance: 82.5,
    attendanceRate: 92.1,
    pendingFees: 1200
  },
  {
    id: "STU-003",
    name: "Priyanka Sen",
    email: "priyanka.sen@school.edu",
    phone: "+91 81234-33001",
    admissionNo: "ADM-2024-003",
    className: "Class 10",
    section: "B",
    parentName: "Subrata Sen",
    parentPhone: "+91 81234-33000",
    parentEmail: "subrata.sen@gmail.com",
    address: "Flat 3C, Sonali Apartments, Salt Lake Sector V, Kolkata, West Bengal - 700091",
    dob: "2010-11-03",
    bloodGroup: "B+",
    medicalConditions: "None",
    documents: [
      { title: "Aadhaar Card Copy", url: "#", status: "Verified" },
      { title: "Leaving Certificate", url: "#", status: "Verified" }
    ],
    status: "Active",
    gradePerformance: 45.8, // Low grades to trigger failing AI predicted actions!
    attendanceRate: 68.4, // Low attendance
    pendingFees: 2400
  },
  {
    id: "STU-004",
    name: "Diya Iyer",
    email: "diya.iyer@school.edu",
    phone: "+91 70123-44001",
    admissionNo: "ADM-2024-004",
    className: "Class 9",
    section: "A",
    parentName: "Meenakshi Iyer",
    parentPhone: "+91 70123-44000",
    parentEmail: "meenakshi.iyer@gmail.com",
    address: "No. 12, Kalpataru Heights, T. Nagar, Chennai, Tamil Nadu - 600017",
    dob: "2011-05-14",
    bloodGroup: "AB+",
    medicalConditions: "Seasonal Pollen Allergy",
    documents: [
      { title: "Aadhaar Card Copy", url: "#", status: "Verified" },
      { title: "Parent Agreement Form", url: "#", status: "Verified" }
    ],
    status: "Active",
    gradePerformance: 98.9,
    attendanceRate: 100.0,
    pendingFees: 0
  },
  {
    id: "STU-005",
    name: "Kabir Verma",
    email: "kabir.verma@school.edu",
    phone: "+91 99887-55001",
    admissionNo: "ADM-2024-005",
    className: "Class 9",
    section: "B",
    parentName: "Sunil Verma",
    parentPhone: "+91 99887-55000",
    parentEmail: "sunil.verma@gmail.com",
    address: "Plot No. 102, Hitech City Phase II, Hyderabad, Telangana - 500081",
    dob: "2011-08-01",
    bloodGroup: "O-",
    medicalConditions: "Lactose Intolerant",
    documents: [
      { title: "Aadhaar Card Copy", url: "#", status: "Verified" },
      { title: "Transfer Certificate", url: "#", status: "Verified" }
    ],
    status: "Active",
    gradePerformance: 74.3,
    attendanceRate: 85.2,
    pendingFees: 1500
  },
  {
    id: "STU-006",
    name: "Rohit Das",
    email: "rohit.das@school.edu",
    phone: "+91 90011-66001",
    admissionNo: "ADM-2024-006",
    className: "Class 10",
    section: "A",
    parentName: "Amal Das",
    parentPhone: "+91 90011-66000",
    parentEmail: "amal.das@gmail.com",
    address: "Zoo Road, Tiniali Overpass, Guwahati, Assam - 781024",
    dob: "2010-01-18",
    bloodGroup: "B-",
    medicalConditions: "None",
    documents: [
      { title: "Aadhaar Card Copy", url: "#", status: "Verified" }
    ],
    status: "Active",
    gradePerformance: 62.1,
    attendanceRate: 74.0, // High risk of dropping out
    pendingFees: 3200 // Huge pending fees
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: "TEA-001",
    name: "Dr. Aditi Mukherjee",
    email: "a.mukherjee@school.edu",
    phone: "+91 98300-12345",
    qualification: "Ph.D. in Physics, IIT Kharagpur",
    designation: "Head of Science Department",
    status: "Active",
    subjectAllocation: ["Physics", "Mathematics", "Quantum Science"],
    classAllocation: ["Class 10-A", "Class 10-B", "Class 9-A"],
    salary: 6200,
    rating: 4.9,
    attendanceRate: 97.4,
    leavesApplied: 4,
    leavesApproved: 3,
    timetable: [
      { day: "Monday", period: "Period 1 (08:30 - 09:15)", class: "Class 10-A", subject: "Physics" },
      { day: "Monday", period: "Period 3 (10:00 - 10:45)", class: "Class 9-A", subject: "Mathematics" },
      { day: "Tuesday", period: "Period 2 (09:15 - 10:00)", class: "Class 10-B", subject: "Physics" },
      { day: "Wednesday", period: "Period 1 (08:30 - 09:15)", class: "Class 10-A", subject: "Quantum Science" },
      { day: "Thursday", period: "Period 4 (10:45 - 11:30)", class: "Class 9-A", subject: "Mathematics" },
      { day: "Friday", period: "Period 2 (09:15 - 10:00)", class: "Class 10-B", subject: "Physics" }
    ]
  },
  {
    id: "TEA-002",
    name: "Prof. Rakesh Shastri",
    email: "rakesh.shastri@school.edu",
    phone: "+91 94440-54321",
    qualification: "M.A. in History, JNU Delhi",
    designation: "Senior History Lecturer",
    status: "Active",
    subjectAllocation: ["World History", "Civics", "Ethics"],
    classAllocation: ["Class 10-A", "Class 9-B"],
    salary: 5800,
    rating: 4.8,
    attendanceRate: 98.1,
    leavesApplied: 2,
    leavesApproved: 2,
    timetable: [
      { day: "Monday", period: "Period 2 (09:15 - 10:00)", class: "Class 10-A", subject: "World History" },
      { day: "Tuesday", period: "Period 1 (08:30 - 09:15)", class: "Class 9-B", subject: "Ethics" },
      { day: "Wednesday", period: "Period 3 (10:00 - 10:45)", class: "Class 10-A", subject: "World History" },
      { day: "Thursday", period: "Period 2 (09:15 - 10:00)", class: "Class 9-B", subject: "Civics" },
      { day: "Friday", period: "Period 3 (10:00 - 10:45)", class: "Class 10-A", subject: "Ethics" }
    ]
  },
  {
    id: "TEA-003",
    name: "Mrs. Sunita Deshpande",
    email: "sunita.d@school.edu",
    phone: "+91 91234-56789",
    qualification: "M.Tech in CS, IISc Bangalore",
    designation: "IT & Robotics Instructor",
    status: "Active",
    subjectAllocation: ["Computer Science", "Artificial Intelligence", "Robotics"],
    classAllocation: ["Class 10-A", "Class 10-B", "Class 9-A", "Class 9-B"],
    salary: 6000,
    rating: 4.95,
    attendanceRate: 99.2,
    leavesApplied: 1,
    leavesApproved: 1,
    timetable: [
      { day: "Monday", period: "Period 4 (10:45 - 11:30)", class: "Class 10-A", subject: "Computer Science" },
      { day: "Tuesday", period: "Period 3 (10:00 - 10:45)", class: "Class 10-B", subject: "Computer Science" },
      { day: "Wednesday", period: "Period 4 (10:45 - 11:30)", class: "Class 9-A", subject: "Robotics" },
      { day: "Thursday", period: "Period 1 (08:30 - 09:15)", class: "Class 10-A", subject: "Artificial Intelligence" },
      { day: "Friday", period: "Period 4 (10:45 - 11:30)", class: "Class 9-B", subject: "Robotics" }
    ]
  }
];

export const initialStaff: Staff[] = [
  { id: "STF-001", name: "Rajesh Yadav", role: "Chief Custodian & Estate Officer", department: "Maintenance", phone: "+91 98110-91130", email: "rajesh.yadav@school.edu", status: "Active", salary: 3800, attendanceRate: 99.5 },
  { id: "STF-002", name: "Tarun Saikia", role: "Head Receptionist", department: "Reception", phone: "+91 94350-91140", email: "tarun.saikia@school.edu", status: "Active", salary: 3200, attendanceRate: 95.8 },
  { id: "STF-003", name: "Lakhya Jit Baruah", role: "Support Director & IT Admin", department: "IT Support", phone: "+91 99540-91180", email: "lakhya.baruah@school.edu", status: "Active", salary: 4500, attendanceRate: 98.9 }
];

export const initialClasses: ClassElement[] = [
  { id: "CLS-010-A", name: "Class 10", section: "A", roomNo: "RM-302, Sci Block", classTeacherId: "TEA-001", studentsCount: 45, subjects: [{ name: "Physics", teacherId: "TEA-001" }, { name: "World History", teacherId: "TEA-002" }, { name: "Computer Science", teacherId: "TEA-003" }] },
  { id: "CLS-010-B", name: "Class 10", section: "B", roomNo: "RM-304, Sci Block", classTeacherId: "TEA-003", studentsCount: 42, subjects: [{ name: "Physics", teacherId: "TEA-001" }, { name: "Ethics", teacherId: "TEA-002" }, { name: "Computer Science", teacherId: "TEA-003" }] },
  { id: "CLS-009-A", name: "Class 9", section: "A", roomNo: "RM-201, Junior Wing", classTeacherId: "TEA-002", studentsCount: 38, subjects: [{ name: "Mathematics", teacherId: "TEA-001" }, { name: "Robotics", teacherId: "TEA-003" }] }
];

export const initialAttendance: AttendanceRecord[] = [
  { id: "ATT-001", targetId: "STU-001", type: "Student", name: "Aarav Sharma", date: "2026-06-11", status: "Present", checkInTime: "08:14", checkOutTime: "15:30", remarks: "Biometric QR verification success" },
  { id: "ATT-002", targetId: "STU-002", type: "Student", name: "Aniket Patel", date: "2026-06-11", status: "Present", checkInTime: "08:25", checkOutTime: "15:30", remarks: "Checked-in with school RFID ID card" },
  { id: "ATT-003", targetId: "STU-003", type: "Student", name: "Priyanka Sen", date: "2026-06-11", status: "Absent", remarks: "No parent notifications submitted" },
  { id: "ATT-004", targetId: "STU-004", type: "Student", name: "Diya Iyer", date: "2026-06-11", status: "Present", checkInTime: "07:58", checkOutTime: "15:31" },
  { id: "ATT-005", targetId: "STU-005", type: "Student", name: "Kabir Verma", date: "2026-06-11", status: "Late", checkInTime: "08:48", checkOutTime: "15:30", remarks: "Arrived due to bus route delay" },
  { id: "ATT-006", targetId: "TEA-001", type: "Teacher", name: "Dr. Aditi Mukherjee", date: "2026-06-11", status: "Present", checkInTime: "07:44" },
  { id: "ATT-007", targetId: "STF-001", type: "Staff", name: "Rajesh Yadav", date: "2026-06-11", status: "Present", checkInTime: "07:12" }
];

export const initialFeeCategories: FeeCategory[] = [
  { id: "FEE-CAT-01", name: "Core Tuition Fee", amount: 1500, frequency: "Monthly" },
  { id: "FEE-CAT-02", name: "Transport Facility Fee", amount: 300, frequency: "Monthly" },
  { id: "FEE-CAT-03", name: "Science & Computer Laboratory Fee", amount: 200, frequency: "Quarterly" },
  { id: "FEE-CAT-04", name: "Annual Development & Library Fee", amount: 800, frequency: "Annually" }
];

export const initialFeeReceipts: FeeReceipt[] = [
  { id: "RCP-2026-001", studentId: "STU-001", studentName: "Aarav Sharma", className: "Class 10", category: "Core Tuition Fee", amount: 1500, discount: 100, fine: 0, paidAmount: 1400, paymentMethod: "UPI", paymentDate: "2026-06-03", status: "Paid", remarks: "Processed online via Stripe proxy" },
  { id: "RCP-2026-002", studentId: "STU-004", studentName: "Diya Iyer", className: "Class 9", category: "Core Tuition Fee", amount: 1500, discount: 250, fine: 0, paidAmount: 1250, paymentMethod: "Credit Card", paymentDate: "2026-06-05", status: "Paid", remarks: "Academic merit scholarship applied" },
  { id: "RCP-2026-003", studentId: "STU-002", studentName: "Aniket Patel", className: "Class 10", category: "Core Tuition Fee", amount: 1500, discount: 0, fine: 50, paidAmount: 350, paymentMethod: "Cash", paymentDate: "2026-06-08", status: "Partially Paid", remarks: "Partial payment; balance of 1200 remaining" }
];

export const initialExamRecords: ExamRecord[] = [
  {
    id: "EXM-001",
    title: "Midterm Examinations Term 1",
    className: "Class 10",
    subject: "Physics",
    examDate: "2026-05-15",
    maxMarks: 100,
    published: true,
    marksEntered: [
      { studentId: "STU-001", marksObtained: 98, grade: "A+" },
      { studentId: "STU-002", marksObtained: 85, grade: "A" },
      { studentId: "STU-003", marksObtained: 42, grade: "D" },
      { studentId: "STU-006", marksObtained: 58, grade: "C" }
    ]
  },
  {
    id: "EXM-002",
    title: "Midterm Examinations Term 1",
    className: "Class 10",
    subject: "Computer Science",
    examDate: "2026-05-18",
    maxMarks: 100,
    published: true,
    marksEntered: [
      { studentId: "STU-001", marksObtained: 99, grade: "A+" },
      { studentId: "STU-002", marksObtained: 80, grade: "A" },
      { studentId: "STU-003", marksObtained: 49, grade: "F" },
      { studentId: "STU-006", marksObtained: 66, grade: "B" }
    ]
  },
  {
    id: "EXM-003",
    title: "Weekly Practice Quiz ST2",
    className: "Class 9",
    subject: "Mathematics",
    examDate: "2026-06-02",
    maxMarks: 50,
    published: true,
    marksEntered: [
      { studentId: "STU-004", marksObtained: 50, grade: "A+" },
      { studentId: "STU-005", marksObtained: 38, grade: "B+" }
    ]
  }
];

export const initialBooks: BookRecord[] = [
  {
    id: "BOK-001",
    isbn: "978-0131103627",
    title: "The C Programming Language",
    author: "Brian W. Kernighan, Dennis M. Ritchie",
    category: "Computer Science",
    copiesTotal: 8,
    copiesAvailable: 6,
    shelveLocation: "Shelf G-3, Comp Sci Section",
    issuedLogs: [
      { studentId: "STU-001", studentName: "Aarav Sharma", issueDate: "2026-06-01", dueDate: "2026-06-15", fineAmount: 0 },
      { studentId: "STU-002", studentName: "Aniket Patel", issueDate: "2026-05-10", dueDate: "2026-05-24", returnDate: "2026-05-23", fineAmount: 0 }
    ]
  },
  {
    id: "BOK-002",
    isbn: "978-0465036738",
    title: "Gödel, Escher, Bach: An Eternal Golden Braid",
    author: "Douglas R. Hofstadter",
    category: "Philosophy & Science",
    copiesTotal: 3,
    copiesAvailable: 2,
    shelveLocation: "Shelf A-1, Philosophy",
    issuedLogs: [
      { studentId: "STU-004", studentName: "Diya Iyer", issueDate: "2026-06-05", dueDate: "2026-06-19", fineAmount: 0 }
    ]
  },
  {
    id: "BOK-003",
    isbn: "978-0321263544",
    title: "Introduction to Quantum Mechanics",
    author: "David J. Griffiths",
    category: "Physics",
    copiesTotal: 5,
    copiesAvailable: 5,
    shelveLocation: "Shelf B-4, Science Wing",
    issuedLogs: []
  }
];

export const initialVehicles: TransportVehicle[] = [
  { id: "VEH-101", vehicleNo: "AS-01-BX-9900", capacity: 48, driverName: "Raman Boro", driverPhone: "+91 98540-12034", driverLicense: "AS-01-DL-2024-09238", route: "Route 1: Paltan Bazaar to Science Block Complex", status: "Active", gpsCoordinates: { lat: 10.7769, lng: 106.7009 } },
  { id: "VEH-102", vehicleNo: "AS-01-PC-5678", capacity: 32, driverName: "Amulya Kalita", driverPhone: "+91 99541-23390", driverLicense: "AS-01-DL-2024-55241", route: "Route 4: Zoo Road to Junior Wing Gate 2", status: "Active", gpsCoordinates: { lat: 10.7932, lng: 106.7214 } }
];

export const initialHostels: HostelRoom[] = [
  { id: "HST-101", block: "Poseidon Hall (Boys)", roomNo: "101", type: "Double", bedCapacity: 2, occupiedBeds: 2, monthlyFee: 400, residents: [{ studentId: "STU-002", bedNo: 1 }, { studentId: "STU-005", bedNo: 2 }] },
  { id: "HST-102", block: "Poseidon Hall (Boys)", roomNo: "102", type: "Single", bedCapacity: 1, occupiedBeds: 0, monthlyFee: 550, residents: [] },
  { id: "HST-201", block: "Athena Complex (Girls)", roomNo: "201", type: "Double", bedCapacity: 2, occupiedBeds: 1, monthlyFee: 400, residents: [{ studentId: "STU-003", bedNo: 1 }] }
];

export const initialCommunications: CommunicationItem[] = [
  { id: "COM-001", title: "Final Semester Examination Term 1 Routine Published", content: "The schedules and classroom distribution arrangements for Term 1 Final Examinations starting July 10 has been published on the board. Study templates have been loaded onto the LMS portals.", sender: "Office of the Principal", targetRoles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.ADMINISTRATOR, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT], date: "2026-06-10", type: "Circular" },
  { id: "COM-002", title: "Urgent: Parent Teacher Association Advisory", content: "Dear Parents, please check the monthly schedule interface for booking slots for the parent-teacher review taking place on June 15 regarding Term 1 target reports.", sender: "Administration Coordinator", targetRoles: [UserRole.PARENT], date: "2026-06-11", type: "SMS" },
  { id: "COM-003", title: "Scheduled Central Main Server Updates", content: "The AI predicting modules and homework grading repositories will experience partial downtime on June 12 between 02:00 AM and 04:00 AM UTC.", sender: "Tarun Saikia", targetRoles: [UserRole.SUPER_ADMIN, UserRole.TEACHER], date: "2026-06-11", type: "Announcement" }
];

export const initialHomework: HomeworkAssignment[] = [
  { id: "HW-001", className: "Class 10-A", subject: "Physics", title: "Frictionless Inclines & Newtonian Inertia", description: "Solve questions 1 through 15 on Chapter 3 study slides. Provide full step-by-step mathematical reasoning.", publishedDate: "2026-06-08", dueDate: "2026-06-14", submissions: [{ studentId: "STU-001", studentName: "Aarav Sharma", submittedDate: "2026-06-10", filePath: "inertia_problems_sol.pdf", grade: "A+", feedback: "Impeccable calculation breakdown and neat layout." }, { studentId: "STU-002", studentName: "Aniket Patel", submittedDate: "2026-06-11", filePath: "ben_physics_hw3.pdf" }] },
  { id: "HW-002", className: "Class 10-A", subject: "Computer Science", title: "Recursive Backtracking and Maze Solving", description: "Write a pseudocode implementation of a classic depth-first maze exploring algorithm. Submit as a structured text block.", publishedDate: "2026-06-09", dueDate: "2026-06-16", submissions: [] }
];

export const initialLMSLectures: LMSLecture[] = [
  {
    id: "LMS-001",
    subject: "Computer Science",
    title: "Understanding Binary Search Trees & Balanced Trees",
    description: "In this session, we investigate the operations, mathematical proofs of O(log N) height, and simple rotation steps in AVL trees.",
    videoUrl: "https://www.youtube.com/embed/95s3b8i1a00", // standard template
    hasVirtualClass: true,
    virtualClassTime: "2026-06-12T10:00:00Z",
    studyMaterials: [
      { name: "Binary Tree Handout.pdf", url: "#", size: "2.4 MB" },
      { name: "BST Code Templates.cpp", url: "#", size: "45 KB" }
    ],
    quizzes: [
      { question: "What is the worst-case time complexity of standard BST search?", options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"], answerIndex: 2 },
      { question: "How many children can a node in a binary tree have?", options: ["Exactly 2", "0, 1, or 2", "At least 1", "Unlimited"], answerIndex: 1 }
    ]
  },
  {
    id: "LMS-002",
    subject: "World History",
    title: "The Bronze Age Collapse and Sea Peoples",
    description: "Deep dive into the structural variables, environmental disasters, and invasions that decimated empires of the Near East.",
    hasVirtualClass: false,
    studyMaterials: [
      { name: "Bronze Collapse Notes.pdf", url: "#", size: "1.8 MB" }
    ],
    quizzes: [
      { question: "Which major ancient civilization survived the collapse but was highly weakened?", options: ["Hittite Empire", "Mycenaean Greece", "New Kingdom of Egypt", "Assyrian Empire"], answerIndex: 2 }
    ]
  }
];

export const initialInventory: InventoryItem[] = [
  { id: "INV-001", name: "High-Resolution Laser Spectrometers", category: "Lab Equipment", quantity: 6, unit: "units", cost: 1200, location: "Chemistry Lab 2", purchaseDate: "2025-11-04" },
  { id: "INV-002", name: "Executive Ergonomic Desks", category: "Furniture", quantity: 50, unit: "pcs", cost: 120, location: "Faculty Cabin A", purchaseDate: "2026-01-10" },
  { id: "INV-003", name: "Rasberry Pi 4 Model B (4GB)", category: "IT Appliance", quantity: 24, unit: "units", cost: 75, location: "Robotics Sandbox", purchaseDate: "2026-03-15" }
];

export const initialLedger: FinanceLedgerEntry[] = [
  { id: "TRX-001", date: "2026-06-03", type: "Income", category: "Fee Collection", amount: 1400, reference: "RCP-2026-001", paymentMethod: "UPI" },
  { id: "TRX-002", date: "2026-06-05", type: "Income", category: "Fee Collection", amount: 1250, reference: "RCP-2026-002", paymentMethod: "Credit Card" },
  { id: "TRX-003", date: "2026-06-08", type: "Income", category: "Fee Collection", amount: 350, reference: "RCP-2026-003", paymentMethod: "Cash" },
  { id: "TRX-004", date: "2026-06-10", type: "Expense", category: "Salary Payout", amount: 18000, reference: "EMP-SAL-2026-06", paymentMethod: "Bank Transfer" },
  { id: "TRX-005", date: "2026-06-11", type: "Expense", category: "Lab Equipment", amount: 3200, reference: "INV-SPECT-09", paymentMethod: "Wire Transfer" }
];

export const initialAuditLogs: AuditLog[] = [
  { id: "LOG-001", timestamp: "2026-06-11T08:15:22Z", userEmail: "principal.office@school.edu", role: "Principal", action: "Verify Documents", module: "Student Management", details: "Verified Birth Certificate and Marksheets for STU-001" },
  { id: "LOG-002", timestamp: "2026-06-11T08:30:11Z", userEmail: "accountant.billing@school.edu", role: "Accountant", action: "Record Payment", module: "Fees Management", details: "Recorded cash offset of ₹350 for STU-002" },
  { id: "LOG-003", timestamp: "2026-06-11T08:55:00Z", userEmail: "admin.it@school.edu", role: "Administrator", action: "Publish Syllabus", module: "Academic Management", details: "Uploaded computer science lesson plan templates to Class 10" }
];

export function getStoredData<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(`edu_suite_${key}`);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`edu_suite_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Local storage error in edu_suite save:", e);
  }
}

export const initialToppers: LandingTopper[] = [
  { id: "top-001", name: "Aarav Sharma", className: "Class XII-A", percentage: "98.8%", avatar: "👨‍🎓", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=180&h=180&fit=crop" },
  { id: "top-002", name: "Ananya Patel", className: "Class XII-C", percentage: "98.2%", avatar: "👩‍🎓", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=180&h=180&fit=crop" },
  { id: "top-003", name: "Karan Malhotra", className: "Class X-A", percentage: "97.6%", avatar: "👨‍🎓", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180&h=180&fit=crop" },
  { id: "top-004", name: "Diya Iyer", className: "Class XII-B", percentage: "97.4%", avatar: "👩‍🎓", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=180&h=180&fit=crop" },
  { id: "top-005", name: "Kabir Verma", className: "Class X-B", percentage: "96.8%", avatar: "👨‍🎓", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=180&h=180&fit=crop" }
];

export const initialFaculty: LandingFaculty[] = [
  { id: "fac-001", name: "Dr. Aditi Mukherjee", title: "Science Head", dept: "Ph.D. Physics", avatar: "👩‍🏫", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=180&h=180&fit=crop" },
  { id: "fac-002", name: "Prof. Rakesh Shastri", title: "History Lecturer", dept: "M.A. History", avatar: "👨‍🏫", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=180&h=180&fit=crop" },
  { id: "fac-003", name: "Prof. Amitabha Bose", title: "Computing Head", dept: "M.Tech CS", avatar: "👨‍🏫", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=180&h=180&fit=crop" },
  { id: "fac-004", name: "Dr. Sarah Joseph", title: "English Scholar", dept: "Ph.D. English", avatar: "👩‍🏫", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=180&h=180&fit=crop" },
  { id: "fac-005", name: "Smt. Lakshmi Iyer", title: "Math Specialist", dept: "M.Sc. Maths", avatar: "👩‍🏫", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=180&h=180&fit=crop" }
];

export const initialCurriculums: LandingCurriculum[] = [
  { id: "curr-001", category: "Science Core", title: "Physics, Chem & Advanced Calculus", description: "Includes live lab tutorials, scientific method formulas and digital laboratory sessions." },
  { id: "curr-002", category: "Technology", title: "Computing & AI Core Foundations", description: "Focuses on algorithms, JavaScript logic loops, data structures, and Gemini SDK guidelines." },
  { id: "curr-003", category: "humanities", title: "Classical Philosophy & History", description: "Explores historic civilizations, constitutional rules and international ethical doctrines." }
];

export const initialFAQs: LandingFAQ[] = [
  { id: "faq-001", question: "What is the master admin login key?", answer: "Key in secure PIN code 1234 or 2026 to enter." },
  { id: "faq-002", question: "How do I calculate Estimated Fee?", answer: "Go to Fee Matrix tab on Landing Page, select Grade level and optionally toggle transport check to view computed rates." }
];

export const initialLandingTexts: LandingTexts = {
  heroBadge: "Admin Terminal System Connected",
  heroTitle: "Typing Desk Assam",
  stat1Num: "1,500+",
  stat1Label: "Enrolled Pupils",
  stat2Num: "98.5%",
  stat2Label: "Passing Rate",
  stat3Num: "12+",
  stat3Label: "Smart Modules",

  overviewTitle: "Institution Profile Overview",
  overviewDesc: "EduCore ERP System coordinates dynamic pupil details, hostel accommodation listings, academic fleet tracking, exam promotions, and payroll ledger entries with cloud integrity constraints.",

  card1Title: "Active Teacher Allocation",
  card1Body: "Track daily schedules, subject domains, and periods.",
  card2Title: "Consolidated Fee Audit",
  card2Body: "Quick invoicing receipts, payment ledgers and balance alerts.",
  card3Title: "Smart Biometric Scanning",
  card3Body: "Integrated facial scanner modules for instant pupil entry verification.",
  card4Title: "Live Transport Tracking",
  card4Body: "Accurate bus coordinate monitors with map system overlays.",

  admissionBadge: "Registration for Academic Session 2026-27 is LIVE",
  admissionDesc: "Secure an expedited seat inside the primary digital computer labs. Application gates are monitored with direct ledger accountability.",
  step1Title: "Step 1: Document Filing",
  step1Body: "File online application, upload marksheet credentials, and pay the core registration token.",
  step2Title: "Step 2: Biometric Interview",
  step2Body: "Attend pupil-parent interview where biometric face points are initialized into our server archives.",

  feeSubtitle: "Calculate Estimated Academic Fee",

  contact1Title: "Admission Admissions Hotline",
  contact1Phone: "+91 98765-XXXXX",
  contact1Availability: "Available 09:00 AM - 04:00 PM IST",
  contact2Title: "Accounts & Tuition Billing",
  contact2Email: "support@educore.school",
  contact2Availability: "Response time: within 24 business hours",

  principalName: "Dr. Joydeep Baruah",
  principalTitle: "Principal, EduCore Academy",
  principalMessage: "Welcome to our advanced regional knowledge portal. EduCore balances classical state-board benchmarks with dynamic ICT tools, empowering minds for modern horizons. Explore our integrated ERP modules to monitor academic progress with absolute transparency.",
  principalImg: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=180&h=180&fit=crop",
  supportTitle: "Campus IT Support & Helpdesk",
  supportDesc: "Connect directly with our administration support block for immediate assistance regarding student registrations, fee ledgers, exam records, or transport tracking routes.",
  supportPhone: "+91 361-234-5678",
  supportEmail: "helpdesk@educoreacademy.edu.in"
};

