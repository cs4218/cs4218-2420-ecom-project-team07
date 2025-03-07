import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import About from "./About";

jest.mock("../components/Layout", () => 
    jest.fn(({ children, title }) =>
        <div data-testid="layout"><h1>{ title }</h1>{ children }</div>
));

describe("About Component", () => {
    it("should render About page correctly", () => {
        const { getByText } = render(
            <MemoryRouter>
                <About />
            </MemoryRouter>
        );

        expect(getByText("Add text")).toBeInTheDocument();
    });
});