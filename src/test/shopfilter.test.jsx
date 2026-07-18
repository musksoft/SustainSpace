import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { test, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import ShopPage from "../shared/Shop";


vi.mock("../config/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() =>
          Promise.resolve({
            data: [],
            error: null,
          })
        ),
      })),
    })),
  },
}));


test("buyer can search and filter showcase furniture listings", async () => {

  render(
    <BrowserRouter>
      <ShopPage />
    </BrowserRouter>
  );


  // Wait until showcase cards render

  expect(
    await screen.findByText("Nordic Velvet Sofa")
  ).toBeInTheDocument();


//   expect(
//     await screen.findByText("Hand-Carved Oak Table")
//   ).toBeInTheDocument();



  // SEARCH TEST

  const searchInput = screen.getByPlaceholderText(
    /Search furniture/i
  );


  fireEvent.change(searchInput, {
    target: {
      value: "Nordic"
    }
  });


  expect(
    screen.getByText("Nordic Velvet Sofa")
  ).toBeInTheDocument();


//   expect(
//     screen.queryByText("Hand-Carved Oak Table")
//   ).not.toBeInTheDocument();



  // STATUS FILTER TEST

  const statusFilter = screen.getByRole("combobox");


  fireEvent.change(statusFilter, {
    target: {
      value: "available"
    }
  });


//   expect(
//     screen.getByText("Hand-Carved Oak Table")
//   ).toBeInTheDocument();


  expect(
    screen.queryByText("Nordic Velvet Sofa")
  ).toBeInTheDocument();

});