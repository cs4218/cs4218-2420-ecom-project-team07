import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Pagenotfound from "./Pagenotfound";

jest.mock("../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

describe("Pagenotfound Component", () => {
    it("should render Pagenotfound page correctly", () => {
        const { getByText, getByRole } = render(
            <MemoryRouter>
                <Pagenotfound />
            </MemoryRouter>
        );

        expect(getByText("go back- page not found")).toBeInTheDocument();
        expect(getByText("404")).toBeInTheDocument();
        expect(getByText("Oops ! Page Not Found")).toBeInTheDocument();
        
        const goBackLink = getByRole("link", { name: "Go Back" });
        expect(goBackLink).toHaveAttribute("href", "/");
    });
});