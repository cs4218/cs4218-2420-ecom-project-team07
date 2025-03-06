import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Contact from "./Contact";

jest.mock("../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

describe("Contact Component", () => {
    it("should render Contact page correctly", () => {
        const { getByText, getByAltText } = render(
            <Contact />
        );

        expect(getByText("Contact us")).toBeInTheDocument();
        expect(getByAltText("contactus")).toBeInTheDocument();
        expect(getByText("For any query or info about product, feel free to call anytime. We are available 24X7.")).toBeInTheDocument();
        expect(getByText("www.help@ecommerceapp.com")).toBeInTheDocument();
        expect(getByText("012-3456789")).toBeInTheDocument();
        expect(getByText("1800-0000-0000 (toll free)")).toBeInTheDocument();
    });
});