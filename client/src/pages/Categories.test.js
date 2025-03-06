import React from "react"
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import useCategory from "../hooks/useCategory";
import Categories from "./Categories";

jest.mock("../hooks/useCategory");

jest.mock("../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

const mockCategories = [
    {
        _id: "66db427fdb0119d9234b27ed",
        name: "Electronics",
        slug: "electronics",
        __v: 0
    },
    {
        _id: "66db427fdb0119d9234b27ee",
        name: "Clothing",
        slug: "clothing",
        __v: 0
    },
    {
        _id: "66db427fdb0119d9234b27ef",
        name: "Book",
        slug: "book",
        __v: 0
    }
];

describe("Categories Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render category buttons with correct links", async () => {
        useCategory.mockReturnValue(mockCategories);

        const { findAllByRole } = render(
            <MemoryRouter>
                <Categories />
            </MemoryRouter>
        );

        const categoryButtons = await findAllByRole("link", { name: /Electronics|Clothing|Book/i });

        expect(categoryButtons.length).toBe(mockCategories.length);
        mockCategories.forEach((category, index) => {
            expect(categoryButtons[index]).toHaveAttribute("href", `/category/${category.slug}`);
            expect(categoryButtons[index]).toHaveTextContent(category.name);
        });
    });
});