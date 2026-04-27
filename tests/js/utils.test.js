import { describe, it, expect } from "vitest";
import { formatDate, employeeLabel } from "@/lib/entrepriseFormatters";

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
