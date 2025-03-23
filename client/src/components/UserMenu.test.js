import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import UserMenu from "./UserMenu";

const mockLinks = [
    { text: "Profile", path: "/dashboard/user/profile" },
    { text: "Orders", path: "/dashboard/user/orders" },
];

describe("UserMenu Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render user menu correctly", () => {
        const { getByText } = render(
            <MemoryRouter>
                <UserMenu />
            </MemoryRouter>
        );

        expect(getByText("Dashboard")).toBeInTheDocument();
    });

    it("should render all navigation links correctly", () => {
        const { getByText } = render(
            <MemoryRouter>
                <UserMenu />
            </MemoryRouter>
        );

        mockLinks.forEach((link) => {
            expect(getByText(link.text)).toBeInTheDocument();
            expect(getByText(link.text)).toHaveAttribute("href", link.path);
            fireEvent.click(getByText(link.text));
        });
    });
});