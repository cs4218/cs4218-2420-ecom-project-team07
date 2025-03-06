import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import "@testing-library/jest-dom/extend-expect";
import useCategory from "./useCategory";

jest.mock("axios");

jest.spyOn(console, "log").mockImplementation(() => {});

const mockCategories = [
    {
        _id: "66db427fdb0119d9234b27ed",
        name: "Electronics",
        slug: "electronics",
        __v: 0
    },
    {
        id: "66db427fdb0119d9234b27ee",
        name: "Clothing",
        slug: "clothing",
        __v: 0
    },
    {
        id: "66db427fdb0119d9234b27ef",
        name: "Book",
        slug: "book",
        __v: 0
    }
];

describe("useCategory Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial state as an empty array", async () => {
    const { result } = renderHook(() => useCategory());
    
    expect(result.current).toEqual([]);
  });

  it("should fetch and update categories", async () => {
    axios.get.mockResolvedValue({ data: { category: mockCategories } });

    const { result } = renderHook(() => useCategory());

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/v1/category/get-category"));
    await waitFor(() => expect(result.current).toBe(mockCategories));
  });

  it("should display an error message on failed API call", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    renderHook(() => useCategory());

    await waitFor(() => expect(console.log).toHaveBeenCalledWith(new Error("API Error")));
  });
});