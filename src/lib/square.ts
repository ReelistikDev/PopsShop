import { SquareClient, SquareEnvironment } from "square";

export function getSquareClient() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return null;
  return new SquareClient({
    token,
    environment:
      process.env.SQUARE_ENV === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });
}

export const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID ?? "";
