import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Card from "@/Components/ui/card/Card.vue";
import CardHeader from "@/Components/ui/card/CardHeader.vue";
import CardTitle from "@/Components/ui/card/CardTitle.vue";
import CardDescription from "@/Components/ui/card/CardDescription.vue";
import CardContent from "@/Components/ui/card/CardContent.vue";
import CardFooter from "@/Components/ui/card/CardFooter.vue";

describe("Card", () => {
    it("renders with default classes", () => {
        const wrapper = mount(Card, {
            slots: { default: "Content" },
        });
        expect(wrapper.classes()).toContain("rounded-lg");
        expect(wrapper.classes()).toContain("border");
        expect(wrapper.classes()).toContain("bg-card");
    });

    it("accepts custom class", () => {
        const wrapper = mount(Card, {
            props: { class: "my-custom" },
            slots: { default: "Content" },
        });
        expect(wrapper.classes()).toContain("my-custom");
    });

    it("renders slot content", () => {
        const wrapper = mount(Card, {
            slots: { default: "Hello card" },
        });
        expect(wrapper.text()).toBe("Hello card");
    });
});

describe("CardHeader", () => {
    it("renders with correct classes", () => {
        const wrapper = mount(CardHeader, {
            slots: { default: "Header" },
        });
        expect(wrapper.classes()).toContain("flex");
        expect(wrapper.classes()).toContain("flex-col");
    });
});

describe("CardTitle", () => {
    it("renders as h3", () => {
        const wrapper = mount(CardTitle, {
            slots: { default: "My Title" },
        });
        expect(wrapper.find("h3").exists()).toBe(true);
        expect(wrapper.text()).toBe("My Title");
        expect(wrapper.classes()).toContain("font-semibold");
    });
});

describe("CardDescription", () => {
    it("renders as paragraph with muted text", () => {
        const wrapper = mount(CardDescription, {
            slots: { default: "Description text" },
        });
        expect(wrapper.find("p").exists()).toBe(true);
        expect(wrapper.classes()).toContain("text-muted-foreground");
    });
});

describe("CardContent", () => {
    it("renders with padding classes", () => {
        const wrapper = mount(CardContent, {
            slots: { default: "Content" },
        });
        expect(wrapper.classes()).toContain("p-6");
    });
});

describe("CardFooter", () => {
    it("renders with flex classes", () => {
        const wrapper = mount(CardFooter, {
            slots: { default: "Footer" },
        });
        expect(wrapper.classes()).toContain("flex");
        expect(wrapper.classes()).toContain("items-center");
    });
});
