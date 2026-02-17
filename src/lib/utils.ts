export const RESOURCE_TYPES = [
  "Notes",
  "Question Papers",
  "Solutions",
  "Project Reports",
  "Study Material",
] as const;

export const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
] as const;

export const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Electrical",
  "Mechanical",
  "Civil",
  "Chemical",
  "Biotechnology",
  "Other",
] as const;

export const YEARS = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
] as const;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
