import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { toast } from "react-hot-toast";
import Products from "./Products";
import UpdateProduct from "./UpdateProduct";

jest.mock("axios");
jest.mock("react-hot-toast");

jest.mock("../../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

jest.mock("../../components/AdminMenu", () =>
    jest.fn(() =>
        <div data-testid="admin-menu">Admin Menu</div>
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

describe("Products Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render all products correctly", async () => {
        axios.get.mockResolvedValue({ data: { products: mockProducts }});

        const { getByText } = render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getByText("All Products List")).toBeInTheDocument();
            mockProducts.forEach((product) => {
                expect(getByText(product.name)).toBeInTheDocument();
                expect(getByText(product.description)).toBeInTheDocument();
            });
        });
    });

    it("should render product update links correctly", async () => {
        axios.get.mockResolvedValue({ data: { products: mockProducts }});

        const { getAllByRole } = render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );
            
        await waitFor(() => {
            const links = getAllByRole("link").filter(link => link.classList.contains("product-link"));
                expect(links.length).toBe(mockProducts.length);
                mockProducts.forEach((product, index) => {
                    expect(links[index]).toHaveAttribute("href", `/dashboard/admin/product/${product.slug}`);
                    fireEvent.click(links[index]);
            });
        });
    });

    it("should display an error message on failed fetching products", async () => {
        axios.get.mockRejectedValue({ message: "Fetch Error"});

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalled());
        expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    })
});