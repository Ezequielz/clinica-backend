export const checkIsValidDate = (fecha: string): boolean => {
    const fechaRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    
    const match = fecha.match(fechaRegex);
    if (!match) return false;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);

    if (month < 1 || month > 12) return false;

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (month === 2) {
        const isLeapYear = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
        if (isLeapYear) daysInMonth[1] = 29;
    }

    if (day < 1 || day > daysInMonth[month - 1]) return false;

    const providedDate = new Date(year, month - 1, day); // Crear fecha
    if (isNaN(providedDate.getTime())) return false;

    const today = new Date();
    const normalizeDate = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (normalizeDate(providedDate) < normalizeDate(today)) return false;

    return true;
};
