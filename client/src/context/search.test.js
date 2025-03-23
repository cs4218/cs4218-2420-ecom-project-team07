import { renderHook, act, waitFor } from "@testing-library/react";
import { SearchProvider, useSearch } from "./search";
import "@testing-library/jest-dom/extend-expect";

const mockSearch = {
    keyword: "test",
    results: ["A", "B"]
};

describe("search Component", () => {
    it("should provide default search state", () => {
        const { result } = renderHook(() => useSearch(), { wrapper: SearchProvider });

        expect(result.current[0]).toEqual({ keyword: "", results: [] });
    });

    it("should update search state when setSearch is called", async () => {
        const { result } = renderHook(() => useSearch(), { wrapper: SearchProvider });

        act(() => result.current[1](mockSearch));

        await waitFor(() => expect(result.current[0]).toEqual(mockSearch));
    });
});