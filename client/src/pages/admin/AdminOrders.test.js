import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { useAuth } from "../../context/auth";
import AdminOrders from "./AdminOrders";

jest.mock("axios");

jest.mock("../../context/auth", () => ({
    useAuth: jest.fn(() => [null, jest.fn()]),
}));

describe("AdminOrders Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
});