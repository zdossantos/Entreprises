import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Input from "@/Components/ui/input/Input.vue";

describe("Input", () => {
    it("renders an input element", () => {
        const wrapper = mount(Input);
        expect(wrapper.find("input").exists()).toBe(true);
    });

    it("defaults to type text", () => {
        const wrapper = mount(Input);
        expect(wrapper.find("input").attributes("type")).toBe("text");
    });

    it("accepts type prop", () => {
        const wrapper = mount(Input, {
            props: { type: "email" },
        });
        expect(wrapper.find("input").attributes("type")).toBe("email");
    });

    it("emits update:modelValue on input", async () => {
        const wrapper = mount(Input, {
            props: { modelValue: "" },
        });
        await wrapper.find("input").setValue("test value");
        expect(wrapper.emitted("update:modelValue")).toBeTruthy();
        expect(wrapper.emitted("update:modelValue")[0]).toEqual(["test value"]);
    });

    it("reflects modelValue as input value", () => {
        const wrapper = mount(Input, {
            props: { modelValue: "hello" },
        });
        expect(wrapper.find("input").element.value).toBe("hello");
    });

    it("applies base styling classes", () => {
        const wrapper = mount(Input);
        expect(wrapper.find("input").classes()).toContain("rounded-md");
        expect(wrapper.find("input").classes()).toContain("border");
    });

    it("merges custom class", () => {
        const wrapper = mount(Input, {
            props: { class: "extra-class" },
        });
        expect(wrapper.find("input").classes()).toContain("extra-class");
    });
});
