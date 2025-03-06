import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Policy from "./Policy";

jest.mock("../components/Layout", () => 
    jest.fn(({ children }) =>
        <div data-testid="layout">{ children }</div>
));

describe("Policy Component", () => {
    it("should render Policy page correctly", () => {
        const { getByText, getByAltText, getAllByText } = render(
            <Policy />
        );

        expect(getByText("Privacy Policy")).toBeInTheDocument();
        expect(getByAltText("contactus")).toBeInTheDocument();
        expect(getAllByText("add privacy policy").length).toBe(7);
    });
});