import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Users from "./Users";

jest.mock("../../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

jest.mock("../../components/AdminMenu", () =>
    jest.fn(() =>
        <div data-testid="admin-menu">Admin Menu</div>
));

describe("Users Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });

    it("should render users correctly", () => {
        const { getByText } = render(
            <MemoryRouter>
                <Users />
            </MemoryRouter>
        );

        expect(getByText("All Users")).toBeInTheDocument();
    });
});