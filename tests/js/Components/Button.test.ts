import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Button from "@/Components/ui/button/Button.vue";

describe("Button", () => {
    it("renders a button element by default", () => {
        const wrapper = mount(Button, {
            slots: { default: "Click me" },
        });
        expect(wrapper.find("button").exists()).toBe(true);
        expect(wrapper.text()).toBe("Click me");
    });

    it("applies the default variant classes", () => {
        const wrapper = mount(Button, {
            slots: { default: "Default" },
        });
        expect(wrapper.classes()).toContain("bg-primary");
        expect(wrapper.classes()).toContain("text-primary-foreground");
    });

    it("applies destructive variant classes", () => {
        const wrapper = mount(Button, {
            props: { variant: "destructive" },
            slots: { default: "Delete" },
        });
        expect(wrapper.classes()).toContain("bg-destructive");
    });

    it("applies outline variant classes", () => {
        const wrapper = mount(Button, {
            props: { variant: "outline" },
            slots: { default: "Outline" },
        });
        expect(wrapper.classes()).toContain("border");
        expect(wrapper.classes()).toContain("border-input");
    });

    it("applies small size classes", () => {
        const wrapper = mount(Button, {
            props: { size: "sm" },
            slots: { default: "Small" },
        });
        expect(wrapper.classes()).toContain("h-9");
    });

    it("applies large size classes", () => {
        const wrapper = mount(Button, {
            props: { size: "lg" },
            slots: { default: "Large" },
        });
        expect(wrapper.classes()).toContain("h-11");
    });

    it("renders as anchor when as prop is 'a'", () => {
        const wrapper = mount(Button, {
            props: { as: "a", href: "/test" },
            slots: { default: "Link" },
        });
        expect(wrapper.find("a").exists()).toBe(true);
    });

    it("merges custom class with variant classes", () => {
        const wrapper = mount(Button, {
            props: { class: "my-custom-class" },
            slots: { default: "Custom" },
        });
        expect(wrapper.classes()).toContain("my-custom-class");
    });

    it("emits click events", async () => {
        const wrapper = mount(Button, {
            slots: { default: "Click" },
        });
        await wrapper.trigger("click");
        expect(wrapper.emitted("click")).toBeTruthy();
    });
});
