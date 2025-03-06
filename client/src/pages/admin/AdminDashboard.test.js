import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { useAuth } from "../../context/auth";
import AdminDashboard from "./AdminDashboard";

jest.mock("../../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

jest.mock("../../components/AdminMenu", () =>
    jest.fn(() =>
        <div data-testid="admin-menu">Admin Menu</div>
));

const mockAuth = {
    user: {
        name: "CS 4218 Test Account",
        email: "cs4218@test.com",
        phone: "81234567"
    }
};

describe("AdminDashboard Component", () => {
    beforeEach(() => {
        useAuth.mockReturnValue([mockAuth]);
    });

    it("should render admin dashboard correctly", () => {
        const { getByTestId, getByRole, getByText } = render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );

        expect(getByTestId("layout")).toBeInTheDocument();
        expect(getByTestId("admin-menu")).toBeInTheDocument();

        expect(getByRole("heading", { name: /Admin Name :/i })).toBeInTheDocument();
        expect(getByText((content) => content.includes("CS 4218 Test Account"))).toBeInTheDocument();
        expect(getByRole("heading", { name: /Admin Email :/i })).toBeInTheDocument();
        expect(getByText((content) => content.includes("cs4218@test.com"))).toBeInTheDocument();
        expect(getByRole("heading", { name: /Admin Contact :/i })).toBeInTheDocument();
        expect(getByText((content) => content.includes("81234567"))).toBeInTheDocument();
    });
});