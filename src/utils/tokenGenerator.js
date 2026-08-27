/**
 * AAGAM Token Generator Utility
 * 
 * Token Specification:
 * - First 3 characters = Month name (e.g. AUG)
 * - 2-digit year = (e.g. 26)
 * - 2-digit month = (e.g. 08)
 * - 5-digit slot number = (e.g. 48291)
 * 
 * Example: AUG260848291
 */

const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function generateRandomToken(dateInput = null) {
  let dateObj = new Date();
  
  if (dateInput) {
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      dateObj = dateInput;
    } else if (typeof dateInput === 'string' && dateInput.trim()) {
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      }
    }
  }

  // 1. First 3 characters: Month Name (e.g., AUG)
  const monthName = MONTH_NAMES[dateObj.getMonth()] || 'AUG';

  // 2. 2-digit Year (e.g., 26 for 2026)
  const year2 = String(dateObj.getFullYear()).slice(-2);

  // 3. 2-digit Month (e.g., 08 for August)
  const month2 = String(dateObj.getMonth() + 1).padStart(2, '0');

  // 4. 5-digit Slot Number (e.g., 10000 to 99999)
  const slot5 = String(Math.floor(10000 + Math.random() * 90000));

  return `${monthName}${year2}${month2}${slot5}`;
}

export default generateRandomToken;
