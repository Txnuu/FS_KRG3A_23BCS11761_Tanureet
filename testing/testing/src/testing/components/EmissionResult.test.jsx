import { render, screen } from "@testing-library/react";
import EmissionResult from "../../components/EmissionResult";

test("renders emission value", () => {
  render(<EmissionResult emission={50} />);
  expect(screen.getByText(/50 kg CO₂/i)).toBeInTheDocument();
});