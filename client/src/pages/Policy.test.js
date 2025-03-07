import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Policy from "./Policy";

jest.mock("../components/Layout", () => 
    jest.fn(({ children, title }) =>
        <div data-testid="layout"><h1>{ title }</h1>{ children }</div>
));

describe("Policy Component", () => {
    it("should render Policy page correctly", () => {
        const { getAllByText } = render(
            <MemoryRouter>
                <Policy />
            </MemoryRouter>
        );

        expect(getAllByText("add privacy policy").length).toBe(7);
    });
});