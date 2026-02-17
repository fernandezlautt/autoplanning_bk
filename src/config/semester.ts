import dotenv from 'dotenv';

dotenv.config();

export interface SemesterConfig {
  startDate: Date;
  endDate: Date;
  startWeek: number; // Calculated: always starts at 1
  endWeek: number; // Calculated: number of weeks between start and end
}

/**
 * Parse date string from environment variable
 * Format: "YYYY-MM-DD" or "MM-DD" (uses current year)
 */
const parseDate = (dateStr: string, defaultDate: Date): Date => {
  if (!dateStr) return defaultDate;
  
  // Try parsing as YYYY-MM-DD
  if (dateStr.includes('-') && dateStr.split('-').length === 3) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  // Try parsing as MM-DD (use current year)
  if (dateStr.includes('-') && dateStr.split('-').length === 2) {
    const [month, day] = dateStr.split('-').map(Number);
    const year = new Date().getFullYear();
    return new Date(year, month - 1, day);
  }
  
  return defaultDate;
};

/**
 * Calculate number of weeks between two dates
 */
const calculateWeeks = (startDate: Date, endDate: Date): number => {
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.ceil(diffDays / 7);
};

export const getSemesterConfig = (semester: '1st' | '2nd' | 'yearly'): SemesterConfig => {
  let startDate: Date;
  let endDate: Date;
  
  switch (semester) {
    case '1st':
      startDate = parseDate(
        process.env.SEMESTER_1_START_DATE || '',
        new Date(new Date().getFullYear(), 2, 1) // Default: March 1st
      );
      endDate = parseDate(
        process.env.SEMESTER_1_END_DATE || '',
        new Date(new Date().getFullYear(), 5, 30) // Default: June 30th
      );
      break;
    case '2nd':
      startDate = parseDate(
        process.env.SEMESTER_2_START_DATE || '',
        new Date(new Date().getFullYear(), 7, 1) // Default: August 1st
      );
      endDate = parseDate(
        process.env.SEMESTER_2_END_DATE || '',
        new Date(new Date().getFullYear(), 11, 31) // Default: December 31st
      );
      break;
    case 'yearly':
      startDate = parseDate(
        process.env.YEARLY_START_DATE || '',
        new Date(new Date().getFullYear(), 2, 1) // Default: March 1st
      );
      endDate = parseDate(
        process.env.YEARLY_END_DATE || '',
        new Date(new Date().getFullYear(), 11, 31) // Default: December 31st
      );
      break;
    default:
      throw new Error(`Invalid semester: ${semester}`);
  }
  
  const numberOfWeeks = calculateWeeks(startDate, endDate);
  
  return {
    startDate,
    endDate,
    startWeek: 1, // Always starts at week 1
    endWeek: numberOfWeeks,
  };
};

export const getWeeksForSemester = (semester: '1st' | '2nd' | 'yearly'): number[] => {
  const config = getSemesterConfig(semester);
  const weeks: number[] = [];
  for (let i = config.startWeek; i <= config.endWeek; i++) {
    weeks.push(i);
  }
  return weeks;
};

/**
 * Get the actual calendar date for a week number in a semester
 */
export const getWeekDate = (semester: '1st' | '2nd' | 'yearly', weekNumber: number): Date => {
  const config = getSemesterConfig(semester);
  const weekStartDate = new Date(config.startDate);
  weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7);
  return weekStartDate;
};
