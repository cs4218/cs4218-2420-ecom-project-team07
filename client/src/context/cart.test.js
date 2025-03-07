import { renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "./cart";
import "@testing-library/jest-dom/extend-expect";

Object.defineProperty(window, "localStorage", {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
    },
    writable: true,
});

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

describe("cart Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should provide empry cart", () => {
        const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

        expect(result.current[0]).toEqual([]);
    });

    it("should update cart state when setCart is called", async () => {
        const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

        act(() => result.current[1](mockProducts));

        await waitFor(() => expect(result.current[0]).toEqual(mockProducts));
    });

    it("should load cart data from localStorage and update state", async () => {
        localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(mockProducts));

        const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

        expect(localStorage.getItem).toBeCalledWith("cart");
        await waitFor(() => expect(result.current[0]).toEqual(mockProducts));
    });
});