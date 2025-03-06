import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./auth";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";

Object.defineProperty(window, "localStorage", {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
});

const mockUser = {
    name: "Daniel",
    email: "daniel@test.com",
    phone: "12341234",
    address: "daniel",
    role: 0
};

const mockToken = "test-token"

describe("auth Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should provide dafault auth state", () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        expect(result.current[0]).toEqual({ user: null, token: ""});
    });

    it("should update auth statae when setAuth is called", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        act(() => result.current[1]({ user: mockUser, token: mockToken }));

        expect(result.current[0]).toEqual({ user: mockUser, token: mockToken });
    });

    it("should update axios Authorization header", async () => {
        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        act(() => result.current[1]({ user: mockUser, token: mockToken }));

        expect(axios.defaults.headers.common["Authorization"]).toBe(mockToken);
    });

    it("should load auth data from localStorage and update state", async () => {
        localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify({ user: mockUser, token: mockToken }));

        const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

        expect(localStorage.getItem).toBeCalledWith("auth");
        await waitFor(() => expect(result.current[0]).toEqual({ user: mockUser, token: mockToken }));
    });
});