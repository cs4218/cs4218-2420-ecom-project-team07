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

jest.mock("antd", () => ({
    ...jest.requireActual("antd"),
    Select: ({ value, onChange }) => {
      const statusOptions = [
        "Not Process",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];
  
      const options = statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ));
  
      return (
        <select value={value} onChange={(o) => onChange(o.target.value)}>
          {options}
        </select>
      );
    },
}));

jest.spyOn(console, "log").mockImplementation(() => {});

const mockAuth = {
    name: "CS 4218 Test Account",
    email: "cs4218@test.com",
    phone: "81234567",
    token: "valid"
};

const mockOrders = [
    {
        _id: "1",
        status: "Not Process",
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
                expect(getByText("#")).toBeInTheDocument();
                expect(getByText("Status")).toBeInTheDocument();
                expect(getByText("Buyer")).toBeInTheDocument();
                expect(getByText("Date")).toBeInTheDocument();
                expect(getByText("Payment")).toBeInTheDocument();
                expect(getByText("Quantity")).toBeInTheDocument();
                expect(getByText(order._id)).toBeInTheDocument();
                expect(getByText(order.status)).toBeInTheDocument();
                expect(getByText(order.buyer.name)).toBeInTheDocument();
                expect(getByText("a few seconds ago")).toBeInTheDocument();
                expect(getByText("Success")).toBeInTheDocument();
                expect(getByText(order.products.length)).toBeInTheDocument();
                order.products.forEach((product) => {
                    expect(getByText(product.name)).toBeInTheDocument();
                    expect(getByText(product.description.substring(0, 30))).toBeInTheDocument();
                    expect(getByText(`Price : ${product.price}`)).toBeInTheDocument();
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

    it("should display an error message on failed API call in getOrders", async () => {
        axios.get.mockRejectedValueOnce({ message: "getOrders API error" });
    
        render(
          <MemoryRouter>
            <AdminOrders />
          </MemoryRouter>
        );
    
        await waitFor(() => expect(console.log).toHaveBeenCalledWith({ message: "getOrders API error" }));
    });

    it("should change the status of order correctly and display an error message on failed API call in handleChange", async () => {
        axios.get.mockResolvedValueOnce({ data: mockOrders });
        axios.put.mockRejectedValueOnce({ message: "handleChange API error" });
    
        const { getByText, getByDisplayValue } = render(
          <MemoryRouter>
            <AdminOrders />
          </MemoryRouter>
        );
    
        await waitFor(() => expect(getByText("Not Process")).toBeInTheDocument());
    
        const currentStatus = getByDisplayValue("Not Process");
        fireEvent.change(currentStatus, { target: { value: "Processing" } });
    
        const processingOption = await waitFor(() => getByText("Processing"));
        expect(processingOption).toBeInTheDocument();
    
        await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));

        await waitFor(() => {
          expect(axios.put).toHaveBeenCalledWith(
            `/api/v1/auth/order-status/${mockOrders[0]._id}`,
            { status: "Processing" }
          );
          expect(console.log).toHaveBeenCalledWith({ message: "handleChange API error" });
        });

        expect(axios.get).toHaveBeenCalledTimes(4);
    });
});