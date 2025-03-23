import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import Contact from "./Contact";

jest.mock("../components/Layout", () => 
    jest.fn(({ children, title }) =>
        <div data-testid="layout"><h1>{ title }</h1>{ children }</div>
));

jest.mock("react-icons/bi", () => ({
    BiMailSend: () => <svg data-testid="MailSend-icon" />,
    BiPhoneCall: () => <svg data-testid="PhoneCall-icon" />,
    BiSupport: () => <svg data-testid="Support-icon" />
}));

describe("Contact Component", () => {
    it("should render Contact page correctly", () => {
        const { getByTestId, getByText } = render(
            <MemoryRouter>
                <Contact />
            </MemoryRouter>
        );

        expect(getByTestId("layout")).toBeInTheDocument();
        expect(getByText("CONTACT US")).toBeInTheDocument();
        expect(getByText("For any query or info about product, feel free to call anytime. We are available 24X7.")).toBeInTheDocument();
        
        expect(getByTestId("MailSend")).toHaveTextContent("www.help@ecommerceapp.com");
        expect(getByTestId("PhoneCall")).toHaveTextContent("012-3456789");
        expect(getByTestId("Support")).toHaveTextContent("1800-0000-0000 (toll free)");
        
        expect(getByTestId("MailSend-icon")).toBeInTheDocument();
        expect(getByTestId("PhoneCall-icon")).toBeInTheDocument();
        expect(getByTestId("Support-icon")).toBeInTheDocument();
    });
});