import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import AdminMenu from "./AdminMenu";

describe("AdminMenu Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders admin menu", () => {
        const { getByText } = render(
            <MemoryRouter>
                <AdminMenu />
            </MemoryRouter>
        );

        expect(getByText("Admin Panel")).toBeInTheDocument();
    });

    it("renders all navigation links", () => {
        const { getByText } = render(
            <MemoryRouter>
                <AdminMenu />
            </MemoryRouter>
        );

        const links = [
            { text: "Create Category", path: "/dashboard/admin/create-category" },
            { text: "Create Product", path: "/dashboard/admin/create-product" },
            { text: "Products", path: "/dashboard/admin/products" },
            { text: "Orders", path: "/dashboard/admin/orders" }
        ];

        links.forEach((link) => {
            expect(getByText(link.text)).toBeInTheDocument();
            expect(getByText(link.text)).toHaveAttribute("href", link.path);
            fireEvent.click(getByText(link.text));
        });
    });

    it("does not render User links", () => {
        const { queryByText } = render(
            <MemoryRouter>
                <AdminMenu />
            </MemoryRouter>
        );

        expect(queryByText("Users")).not.toBeInTheDocument();
    });
});