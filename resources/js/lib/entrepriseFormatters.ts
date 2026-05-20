/**
 * Shared formatting utilities for Entreprise data.
 * Extracted to a dedicated module so both the Vue pages and tests
 * exercise the exact same production logic.
 */

/**
 * Format an ISO date string (YYYY-MM-DD) into a French locale date.
 * Returns an empty string for falsy input.
 */
export const formatDate = (date: string | null | undefined): string => {
    if (!date) return "";
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

/**
 * Map of INSEE employee-range codes to human-readable French labels.
 */
export const EMPLOYEE_LABELS: Record<string, string> = {
    "00": "0 ou non disponible",
    "01": "1-2",
    "02": "3-5",
    "03": "6-9",
    "11": "10-19",
    "12": "20-49",
    "21": "50-99",
    "22": "100-199",
    "31": "200-249",
    "32": "250-499",
    "41": "500-999",
    "42": "1 000-1 999",
    "51": "2 000-4 999",
    "52": "5 000-9 999",
    "53": "10 000+",
};

/**
 * Return the French label for a given INSEE employee-range code.
 * Falls back to the raw code, or "" for null/undefined.
 */
export const employeeLabel = (code: string | null | undefined): string => {
    return code && EMPLOYEE_LABELS[code] ? EMPLOYEE_LABELS[code] : code ?? "";
};
