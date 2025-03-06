import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { useAuth } from "../../context/auth";
import Dashboard from "./Dashboard";

jest.mock("../../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

jest.mock("../../components/UserMenu", () =>
    jest.fn(() =>
        <div data-testid="user-menu">User Menu</div>
));

jest.mock("../../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]),
}));

const mockAuth = {
    user: {
        name: "Daniel",
        email: "daniel@test.com",
        phone: "12341234"
    }
};

describe("Dashboard Component", () => {
    beforeEach(() => {
        useAuth.mockReturnValue([mockAuth]);
     });

    it("should render user dashboard correctly", () => {
        const { getByText, getByTestId } = render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        expect(getByTestId("layout")).toBeInTheDocument();
        expect(getByTestId("user-menu")).toBeInTheDocument();

        expect(getByText((content) => content.includes("Daniel"))).toBeInTheDocument();
        expect(getByText((content) => content.includes("daniel@test.com"))).toBeInTheDocument();
        expect(getByText((content) => content.includes("12341234"))).toBeInTheDocument();
    });
});