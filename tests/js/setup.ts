// Global test setup for Vitest + Vue Test Utils
import { config } from "@vue/test-utils";

type RouteValue = string | ((id: unknown) => string);

// Mock the window.route function (provided by Ziggy)
(global as unknown as Record<string, unknown>).route = (
    name: string,
    params?: unknown
): string => {
    const routes: Record<string, RouteValue> = {
        "entreprises.index": "/entreprises",
        "entreprises.create": "/entreprises/create",
        "entreprises.store": "/entreprises",
        "entreprises.edit": (id) => `/entreprises/${id}/edit`,
        "entreprises.update": (id) => `/entreprises/${id}`,
        "entreprises.destroy": (id) => `/entreprises/${id}`,
        dashboard: "/dashboard",
        "profile.edit": "/profile",
        logout: "/logout",
        login: "/login",
        register: "/register",
        "password.request": "/forgot-password",
    };
    const r = routes[name];
    if (typeof r === "function") return r(params);
    return r ?? `/${name}`;
};

// Stub for Inertia's usePage
vi.mock("@inertiajs/vue3", () => ({
    usePage: () => ({
        props: {
            auth: { user: { name: "Test User", email: "test@example.com" } },
            ziggy: { url: "http://localhost", routes: {} },
        },
    }),
    router: {
        delete: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        visit: vi.fn(),
    },
    Head: { template: "<div><slot /></div>" },
    Link: { template: "<a><slot /></a>", props: ["href"] },
    useForm: () => ({
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        processing: false,
        errors: {},
    }),
}));
