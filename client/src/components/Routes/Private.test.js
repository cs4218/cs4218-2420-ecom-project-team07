import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import { useAuth } from "../../context/auth";
import Private from "./Private";

jest.mock("axios");

jest.mock("../../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: jest.fn(() => <div data-testid="outlet">User Page</div>),
}));

jest.mock("../Spinner", () => () => <div data-testid="spinner">Loading...</div>);

const mockAuth = {
    name: "Test User",
    email: "user@test.com",
    phone: "12345678",
    token: "valid"
};

describe("Private Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render Outlet if authentication is successful", async () => {
        useAuth.mockReturnValue([mockAuth]);

        axios.get.mockResolvedValueOnce({ data: { ok: true } });

        const { getByTestId } = render(
            <MemoryRouter>
                <Private />
            </MemoryRouter>
        );

        await waitFor(() => expect(getByTestId("outlet")).toBeInTheDocument());
    });

    it("should call user-auth API if auth token exists", async () => {
        useAuth.mockReturnValue([mockAuth]);

        axios.get.mockResolvedValueOnce({ data: { ok: true } });

        render(
            <MemoryRouter>
                <Private />
            </MemoryRouter>
        );

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/v1/auth/user-auth"));
    });

    it("should render Spinner if authentication is failed", async () => {
        useAuth.mockReturnValue([mockAuth]);

        axios.get.mockResolvedValueOnce({ data: { ok: false } });

        const { getByTestId } = render(
            <MemoryRouter>
                <Private />
            </MemoryRouter>
        );

        await waitFor(() => expect(getByTestId("spinner")).toBeInTheDocument());
    });

    it("should render Spinner if auth token doesn't exist", async () => {
        useAuth.mockReturnValue([]);

        const { getByTestId } = render(
            <MemoryRouter>
                <Private />
            </MemoryRouter>
        );

        await waitFor(() => expect(getByTestId("spinner")).toBeInTheDocument());
        expect(axios.get).not.toHaveBeenCalled();
    });
});