import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import { useAuth } from "../../context/auth";
import AdminOrders from "./AdminOrders";

jest.mock("axios");

jest.mock("../../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("../../components/Layout", () => 
    jest.fn(({ children, title }) =>
        <div data-testid="layout"><h1>{ title }</h1>{ children }</div>
));

jest.mock("../../components/AdminMenu", () =>
    jest.fn(() =>
        <div data-testid="admin-menu">Admin Menu</div>
));

const mockAuth = {
    name: "CS 4218 Test Account",
    email: "cs4218@test.com",
    phone: "81234567",
    token: "valid"
};

const mockOrders = [
    {
        _id: "1",
        status: "Processing",
        buyer: { name: "Daniel" },
        createAt: new Date().toISOString(),
        payment: { success: true },
        products: [
            { _id: "66db427fdb0119d9234b27f1", name: "Textbook", description: "A comprehensive textbook", price: 79.99 },
            { _id: "66db427fdb0119d9234b27f3", name: "Laptop", description: "A powerful laptop", price: 1499.99 },
        ]
    }
];

describe("AdminOrders Component", () => {
    beforeEach(() => {
        useAuth.mockReturnValue([mockAuth]);
    });

    it("should render AdminOrders component correctly", async () => {
        axios.get.mockResolvedValueOnce({ data: mockOrders });

        const { getByText, getByTestId } = render(
            <MemoryRouter>
                <AdminOrders />
            </MemoryRouter>
        );

        expect(getByTestId("layout")).toBeInTheDocument();
        expect(getByTestId("admin-menu")).toBeInTheDocument();
        expect(getByText("All Orders")).toBeInTheDocument();

        await waitFor(() => {
            mockOrders.forEach((order) => {
                expect(getByText(order.status)).toBeInTheDocument();
                expect(getByText(order.buyer.name)).toBeInTheDocument();
                expect(getByText("a few seconds ago")).toBeInTheDocument();
                expect(getByText("Success")).toBeInTheDocument();
                order.products.forEach((product) => {
                    expect(getByText(product.name)).toBeInTheDocument();
                });
            });
        });
    });

    it("should call API to get orders", async () => {
        axios.get.mockResolvedValueOnce({ data: mockOrders });

        render(
            <MemoryRouter>
                <AdminOrders />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith("/api/v1/auth/all-orders");
        });
    });

    it("should update order status when changed", async () => {
        axios.get.mockResolvedValueOnce({ data: mockOrders });
        axios.put.mockResolvedValueOnce({ data: { success: true } });

        const { getByText, getByRole } = render(
            <MemoryRouter>
                <AdminOrders />
            </MemoryRouter>
        );

        await waitFor(() => {
            const select = getByRole("combobox");
            expect(select).toHaveValue("Processing");
        });

        fireEvent.mouseDown(select);

        const shippedOption = await waitFor(() => getByText("Shipped"));
        fireEvent.click(shippedOption);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledWith("/api/v1/auth/order-status/order1", { status: "Shipped" });
        });
    });
});