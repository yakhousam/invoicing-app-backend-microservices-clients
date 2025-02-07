import { type APIGatewayProxyEvent } from "aws-lambda";

const isDev = process.env.NODE_ENV === "development";

export function getUserId(event: APIGatewayProxyEvent): string {
  return isDev
    ? process.env.userId
    : event.requestContext.authorizer?.jwt?.claims?.sub;
}

export function createUpdateExpression(
  updates: Record<string, string>,
): string {
  return (
    "SET " +
    Object.keys(updates)
      .map((key) => `${key} = :${key}`)
      .join(", ")
  );
}

export function createExpressionAttributeValues(
  updates: Record<string, string>,
) {
  return Object.entries(updates).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[`:${key}`] = value;
      return acc;
    },
    {},
  );
}
