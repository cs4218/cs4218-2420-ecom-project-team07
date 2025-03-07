import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { useSearch } from "../context/search";
import Search from "./Search";

jest.mock("../context/search");

jest.mock("../components/Layout", () => 
    jest.fn(({ children, title }) =>
        <div data-testid="layout"><h1>{ title }</h1>{ children }</div>
));

const mockProducts = [
    {
        _id: "66db427fdb0119d9234b27f1",
        name: "Textbook",
        slug: "textbook",
        description: "A comprehensive textbook",
        price: 79.99,
        category: {
            _id: "66db427fdb0119d9234b27ef",
            name: "Book",
            slug: "book",
            __v: 0
        },
        quantity: 50,
        shipping: false,
        createdAt: "2024-09-06T17:57:19.963+00:00",
        updatedAt: "2024-09-06T17:57:19.963+00:00",
        __v: 0
    },
    {
        _id: "66db427fdb0119d9234b27f3",
        name: "Laptop",
        slug: "laptop",
        description: "A powerful laptop",
        price: 1499.99,
        category: {
            _id: "66db427fdb0119d9234b27ed",
            name: "Electronics",
            slug: "electronics",
            __v: 0
        },
        quantity: 30,
        shipping: true,
        createdAt: "2024-09-06T17:57:19.971+00:00",
        updatedAt: "2024-09-06T17:57:19.971+00:00",
        __v: 0
    },
    {
        _id: "66db427fdb0119d9234b27f5",
        name: "Smartphone",
        slug: "smartphone",
        description: "A high-end smartphone",
        price: 999.99,
        category: {
            _id: "66db427fdb0119d9234b27ed",
            name: "Electronics",
            slug: "electronics",
            __v: 0
        },
        quantity: 50,
        shipping: false,
        createdAt: "2024-09-06T17:57:19.978+00:00",
        updatedAt: "2024-09-06T17:57:19.978+00:00",
        __v: 0
    },
    {
        _id: "67a21772a6d9e00ef2ac022a",
        name: "NUS T-shirt",
        slug: "nus-tshirt",
        description: "Plain NUS T-shirt for sale",
        price: 4.99,
        category: {
            _id: "66db427fdb0119d9234b27ee",
            name: "Clothing",
            slug: "clothing",
            __v: 0
        },
        quantity: 200,
        shipping: true,
        createdAt: "2024-09-06T17:57:19.992+00:00",
        updatedAt: "2024-09-06T17:57:19.992+00:00",
        __v: 0
    },
    {
        _id: "66db427fdb0119d9234b27f9",
        name: "Novel",
        slug: "novel",
        description: "A bestselling novel",
        price: 14.99,
        category: {
            _id: "66db427fdb0119d9234b27ef",
            name: "Book",
            slug: "book",
            __v: 0
        },
        quantity: 200,
        shipping: true,
        createdAt: "2024-09-06T17:57:19.992+00:00",
        updatedAt: "2024-09-06T17:57:19.992+00:00",
        __v: 0
    },
    {
        _id: "67a2171ea6d9e00ef2ac0229",
        name: "The Law of Contract in Singapore",
        slug: "the-law-of-contract-in-singapore",
        description: "A bestselling book in singapore",
        price: 54.99,
        category: {
            _id: "66db427fdb0119d9234b27ef",
            name: "Book",
            slug: "book",
            __v: 0
        },
        quantity: 200,
        shipping: true,
        createdAt: "2024-09-06T17:57:19.992+00:00",
        updatedAt: "2024-09-06T17:57:19.992+00:00",
        __v: 0
    }
];

describe("Search Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render search page correctly", () => {
        useSearch.mockReturnValue([{ results: [] }, jest.fn()]);

        const { getByTestId, getByText } = render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        expect(getByTestId("layout")).toBeInTheDocument();
        expect(getByText("Search Results")).toBeInTheDocument();
    });

    it("should display 'No Products Found' when no search results exist", () => {
        useSearch.mockReturnValue([{ results: [] }, jest.fn()]);

        const { getByText } = render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );

        expect(getByText("No Products Found")).toBeInTheDocument();
    });

    it("should display products when search results exist", () => {
        useSearch.mockReturnValue([{ results: mockProducts }, jest.fn()]);

        const { getByText, getAllByText } = render(
            <MemoryRouter>
                <Search />
            </MemoryRouter>
        );


        expect(getByText(`Found ${mockProducts.length}`)).toBeInTheDocument();
        
        mockProducts.forEach((product) => {
            expect(getByText(product.name)).toBeInTheDocument();
            expect(getByText(`${product.description.substring(0, 30)}...`)).toBeInTheDocument();
            expect(getByText(`$ ${product.price}`)).toBeInTheDocument();
        });

        expect(getAllByText("More Details")).toHaveLength(mockProducts.length);
        expect(getAllByText("ADD TO CART")).toHaveLength(mockProducts.length);
    });
});