import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import { useAuth } from "../../context/auth";
import AdminRoute from "./AdminRoute";

jest.mock("axios");

jest.mock("../../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: jest.fn(() => <div data-testid="outlet">Admin Page</div>),
}));

jest.mock("../Spinner", () => () => <div data-testid="spinner">Loading...</div>);

const mockAuth = {
    name: "CS 4218 Test Account",
    email: "cs4218@test.com",
    phone: "81234567",
    token: "valid"
};

describe("AdminRoute Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render Outlet if authentication is successful", async () => {
        useAuth.mockReturnValue([mockAuth]);

        axios.get.mockResolvedValueOnce({ data: { ok: true } });

        const { getByTestId } = render(
            <MemoryRouter>
                <AdminRoute />
            </MemoryRouter>
        );

        await waitFor(() => expect(getByTestId("outlet")).toBeInTheDocument());
    });

    it("should call admin-auth API if auth token exists", async () => {
        useAuth.mockReturnValue([mockAuth]);

        axios.get.mockResolvedValueOnce({ data: { ok: true } });

        render(
            <MemoryRouter>
                <AdminRoute />
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/v1/auth/admin-auth"));
    });

    it("should render Spinner if authentication is failed", async () => {
        useAuth.mockReturnValue([mockAuth]);

        axios.get.mockResolvedValueOnce({ data: { ok: false } });

        const { getByTestId } = render(
            <MemoryRouter>
                <AdminRoute />
            </MemoryRouter>
        );

        await waitFor(() => expect(getByTestId("spinner")).toBeInTheDocument());
    });

    it("should render Spinner if auth token doesn't exist", async () => {
        useAuth.mockReturnValue([]);

        const { getByTestId } = render(
            <MemoryRouter>
                <AdminRoute />
            </MemoryRouter>
        );

        await waitFor(() => expect(getByTestId("spinner")).toBeInTheDocument());
        expect(axios.get).not.toHaveBeenCalled();
    });
});