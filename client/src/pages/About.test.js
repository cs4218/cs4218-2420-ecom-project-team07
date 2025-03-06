import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import About from "./About";

jest.mock("../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

describe("About Component", () => {
    it("should render About page correctly", () => {
        const { getByText, getByAltText } = render(
            <About />
        );

        expect(getByText("About us - Ecommerce app")).toBeInTheDocument();
        expect(getByAltText("contactus")).toBeInTheDocument();
        expect(getByText("Add text")).toBeInTheDocument();
    });
});