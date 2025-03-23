import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import AdminMenu from "./AdminMenu";

const mockLinks = [
    { text: "Create Category", path: "/dashboard/admin/create-category" },
    { text: "Create Product", path: "/dashboard/admin/create-product" },
    { text: "Products", path: "/dashboard/admin/products" },
    { text: "Orders", path: "/dashboard/admin/orders" },
    { text: "Users", path: "/dashboard/admin/users" },
];

describe("AdminMenu Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render admin menu correctly", () => {
        const { getByText } = render(
            <MemoryRouter>
                <AdminMenu />
            </MemoryRouter>
        );

        expect(getByText("Admin Panel")).toBeInTheDocument();
    });

    it("should render all navigation links correctly", () => {
        const { getByText } = render(
            <MemoryRouter>
                <AdminMenu />
            </MemoryRouter>
        );

        mockLinks.forEach((link) => {
            expect(getByText(link.text)).toBeInTheDocument();
            expect(getByText(link.text)).toHaveAttribute("href", link.path);
            fireEvent.click(getByText(link.text));
        });
    });
});