/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  SUPER_ADMIN = "Super Admin",
  PRINCIPAL = "Principal",
  ADMINISTRATOR = "Administrator",
  ACCOUNTANT = "Accountant",
  TEACHER = "Teacher",
  STUDENT = "Student",
  PARENT = "Parent",
  LIBRARIAN = "Librarian",
  RECEPTIONIST = "Receptionist",
  STAFF = "Staff"
}

export interface Student {
  id: string; // e.g. STU-001
  name: string;
  email: string;
  phone: string;
  admissionNo: string;
  className: string;
  section: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  dob: string;
  bloodGroup: string;
  medicalConditions: string;
  documents: { title: string; url: string; status: "Verified" | "Pending" }[];
  status: "Active" | "Transferred" | "Graduated" | "Suspended";
  gradePerformance: number; // percentage, e.g. 88
  attendanceRate: number; // percentage, e.g. 94
  pendingFees: number;
}

export interface Teacher {
  id: string; // e.g. TEA-001
  name: string;
  email: string;
  phone: string;
  qualification: string;
  designation: string;
  status: "Active" | "On Leave" | "Suspended";
  subjectAllocation: string[]; // Subject names
  classAllocation: string[]; // Class names e.g. ["Class 10-A", "Class 9-B"]
  salary: number;
  rating: number; // e.g. 4.8
  attendanceRate: number;
  leavesApplied: number;
  leavesApproved: number;
  timetable: {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
    period: string; // e.g., "Period 1 (08:30 - 09:15)"
    class: string;
    subject: string;
  }[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: "Security" | "Administration" | "Maintenance" | "Kitchen" | "IT Support" | "Reception";
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  salary: number;
  attendanceRate: number;
}

export interface ClassElement {
  id: string;
  name: string; // e.g., Class 10
  section: string; // e.g., A
  roomNo: string;
  classTeacherId: string;
  studentsCount: number;
  subjects: { name: string; teacherId: string }[];
}

export interface AttendanceRecord {
  id: string;
  targetId: string; // ID of student, teacher, or staff
  type: "Student" | "Teacher" | "Staff";
  name: string;
  date: string; // YYYY-MM-DD
  status: "Present" | "Absent" | "Late" | "Half Day";
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
}

export interface FeeCategory {
  id: string;
  name: string; // e.g., Tuition Fee, Examination Fee, Bus Fee
  amount: number;
  frequency: "Monthly" | "Quarterly" | "Annually" | "One-time";
}

export interface FeeReceipt {
  id: string; // e.g., RCP-10293
  studentId: string;
  studentName: string;
  className: string;
  category: string;
  amount: number;
  discount: number;
  fine: number;
  paidAmount: number;
  paymentMethod: "Cash" | "Credit Card" | "Bank Transfer" | "UPI";
  paymentDate: string;
  status: "Paid" | "Partially Paid" | "Unpaid";
  remarks?: string;
}

export interface ExamRecord {
  id: string;
  title: string; // e.g. Final Examination Term 1
  className: string;
  subject: string;
  examDate: string;
  maxMarks: number;
  marksEntered: {
    studentId: string;
    marksObtained: number;
    grade: string;
    remarks?: string;
  }[];
  published: boolean;
}

export interface BookRecord {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  copiesTotal: number;
  copiesAvailable: number;
  shelveLocation: string;
  issuedLogs: {
    studentId: string;
    studentName: string;
    issueDate: string;
    dueDate: string;
    returnDate?: string;
    fineAmount: number;
  }[];
}

export interface TransportVehicle {
  id: string;
  vehicleNo: string;
  capacity: number;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  route: string; // e.g., Sector 12 to High School Campus
  status: "Active" | "Maintenance";
  gpsCoordinates: { lat: number; lng: number };
}

export interface HostelRoom {
  id: string;
  block: string; // e.g., Block A (Boys)
  roomNo: string;
  type: "Single" | "Double" | "Dormitory";
  bedCapacity: number;
  occupiedBeds: number;
  monthlyFee: number;
  residents: { studentId: string; bedNo: number }[];
}

export interface CommunicationItem {
  id: string;
  title: string;
  content: string;
  sender: string;
  targetRoles: UserRole[];
  date: string;
  type: "Circular" | "Announcement" | "Email" | "SMS";
}

export interface HomeworkAssignment {
  id: string;
  className: string;
  subject: string;
  title: string;
  description: string;
  publishedDate: string;
  dueDate: string;
  submissions: {
    studentId: string;
    studentName: string;
    submittedDate: string;
    filePath?: string;
    grade?: string;
    feedback?: string;
  }[];
}

export interface LMSLecture {
  id: string;
  subject: string;
  title: string;
  description: string;
  videoUrl?: string; // YouTube / Video link structure
  hasVirtualClass: boolean;
  virtualClassTime?: string;
  studyMaterials: { name: string; url: string; size: string }[];
  quizzes: {
    question: string;
    options: string[];
    answerIndex: number;
  }[];
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Classroom Supply" | "Lab Equipment" | "Sport Asset" | "IT Appliance" | "Furniture";
  quantity: number;
  unit: string;
  cost: number;
  location: string;
  purchaseDate: string;
}

export interface FinanceLedgerEntry {
  id: string;
  date: string;
  type: "Income" | "Expense";
  category: string; // e.g. Fee Collection, Salary Payout, Bills, Assets purchase
  amount: number;
  reference: string;
  paymentMethod: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  role: string;
  action: string;
  module: string;
  details: string;
}

export interface LandingTopper {
  id: string;
  name: string;
  className: string;
  percentage: string;
  avatar: string;
  img: string;
}

export interface LandingFaculty {
  id: string;
  name: string;
  title: string;
  dept: string;
  avatar: string;
  img: string;
}

export interface LandingCurriculum {
  id: string;
  category: string;
  title: string;
  description: string;
}

export interface LandingFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface LandingTexts {
  heroBadge: string;
  heroTitle: string;
  stat1Num: string;
  stat1Label: string;
  stat2Num: string;
  stat2Label: string;
  stat3Num: string;
  stat3Label: string;
  
  overviewTitle: string;
  overviewDesc: string;
  
  card1Title: string;
  card1Body: string;
  card2Title: string;
  card2Body: string;
  card3Title: string;
  card3Body: string;
  card4Title: string;
  card4Body: string;

  admissionBadge: string;
  admissionDesc: string;
  step1Title: string;
  step1Body: string;
  step2Title: string;
  step2Body: string;

  feeSubtitle: string;

  contact1Title: string;
  contact1Phone: string;
  contact1Availability: string;
  contact2Title: string;
  contact2Email: string;
  contact2Availability: string;

  principalName: string;
  principalTitle: string;
  principalMessage: string;
  principalImg: string;
  supportTitle: string;
  supportDesc: string;
  supportPhone: string;
  supportEmail: string;
}


