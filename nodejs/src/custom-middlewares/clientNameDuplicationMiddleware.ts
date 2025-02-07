import { ddbDocClient, tableName } from "@/db/client";
import { getUserId } from "@/utils";
import { Client } from "@/validation";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import middy from "@middy/core";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import createError from "http-errors";

const clientNameDuplicationMiddleware = (): middy.MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  return {
    before: async (request): Promise<void> => {
      const userId = getUserId(request.event);
      const body = request.event.body as unknown as Partial<Client>;
      const clientName = body.clientName as string;
      const clientId = request.event.pathParameters?.clientId as string;
      if (!clientName) {
        return;
      }
      console.log("table name", tableName);
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: "clientNameIndex",
        KeyConditionExpression: "clientName = :clientName AND userId = :userId",
        FilterExpression: clientId ? "clientId <> :clientId" : undefined,
        ExpressionAttributeValues: {
          ":clientName": clientName,
          ":userId": userId,
          ":clientId": clientId,
        },
      });
      const duplicateName = await ddbDocClient.send(command);
      if (duplicateName?.Count !== undefined && duplicateName.Count > 0) {
        throw new createError.Conflict("Client name already exists");
      }
    },
  };
};

export default clientNameDuplicationMiddleware;
