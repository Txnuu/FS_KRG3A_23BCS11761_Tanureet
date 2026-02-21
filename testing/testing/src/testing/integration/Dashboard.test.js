import { render, screen } from "@testing-library/react";
import Dashboard from "../../components/Dashboard";

test("loads eco data asynchronously", async () => {
  render(<Dashboard />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();

  const loadedText = await screen.findByText("Eco Data Loaded");
  expect(loadedText).toBeInTheDocument();
});