// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import { BrowserRouter } from "react-router-dom";
// import { vi, test, expect } from "vitest";
// import AuthPage from "../modules/auth/AuthPage";
// import { supabase } from "../config/supabaseClient";

// const mockNavigate = vi.fn();

// vi.mock("react-router-dom", async () => {
//   const actual = await vi.importActual("react-router-dom");
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// vi.mock("../config/supabaseClient", () => ({
//   supabase: {
//     auth: {
//       signInWithPassword: vi.fn(),
//     },
//     from: vi.fn(),
//   },
// }));

// test("logs in a buyer and redirects to buyer dashboard", async () => {
//   supabase.auth.signInWithPassword.mockResolvedValue({
//     data: { user: { id: "123" } },
//     error: null,
//   });

//   supabase.from.mockReturnValue({
//     select: () => ({
//       eq: () => ({
//         single: () =>
//           Promise.resolve({
//             data: {
//               id: "123",
//               full_name: "John Doe",
//               role: "buyer",
//             },
//             error: null,
//           }),
//       }),
//     }),
//   });

//   render(
//     <BrowserRouter>
//       <AuthPage />
//     </BrowserRouter>
//   );

//   await userEvent.click(screen.getByText(/Login/i));

//   await userEvent.type(
//     screen.getByPlaceholderText(/Email Address/i),
//     "john@test.com"
//   );

//   await userEvent.type(
//     screen.getByPlaceholderText(/Password/i),
//     "password123"
//   );

//   await userEvent.click(
//     screen.getByRole("button", { name: /LOGIN/i })
//   );

//   expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
//   expect(mockNavigate).toHaveBeenCalledWith("/buyer/123");
// });