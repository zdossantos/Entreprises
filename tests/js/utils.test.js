import { describe, it, expect } from "vitest";

// Utility functions extracted from Entreprise/Index.vue for unit testing

const formatDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

const employeeLabel = (code) => {
    const map = {
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
    return code && map[code] ? map[code] : code ?? "";
};

describe("formatDate", () => {
    it("returns empty string for falsy values", () => {
        expect(formatDate(null)).toBe("");
        expect(formatDate(undefined)).toBe("");
        expect(formatDate("")).toBe("");
    });

    it("formats a valid date string", () => {
        const result = formatDate("2020-01-15");
        expect(result).toContain("2020");
        expect(result).toContain("15");
    });

    it("formats date in French locale style", () => {
        const result = formatDate("2023-06-01");
        // French locale uses day month year
        expect(result).toMatch(/\d/);
        expect(result).toContain("2023");
    });
});

describe("employeeLabel", () => {
    it("returns correct label for code 00", () => {
        expect(employeeLabel("00")).toBe("0 ou non disponible");
    });

    it("returns correct label for code 12 (20-49 employees)", () => {
        expect(employeeLabel("12")).toBe("20-49");
    });

    it("returns correct label for code 53 (10000+ employees)", () => {
        expect(employeeLabel("53")).toBe("10 000+");
    });

    it("returns the code itself for unknown codes", () => {
        expect(employeeLabel("99")).toBe("99");
    });

    it("returns empty string for null/undefined", () => {
        expect(employeeLabel(null)).toBe("");
        expect(employeeLabel(undefined)).toBe("");
    });
});
