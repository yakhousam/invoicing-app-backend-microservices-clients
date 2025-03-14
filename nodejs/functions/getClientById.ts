import {
  type APIGatewayProxyEvent,
  type APIGatewayProxyResult,
} from "aws-lambda";

import middy from "@middy/core";
import errorLogger from "@middy/error-logger";
import httpContentEncodingMiddleware from "@middy/http-content-encoding";
import httpErrorHandlerMiddleware from "@middy/http-error-handler";
import httpEventNormalizerMiddleware from "@middy/http-event-normalizer";
import httpHeaderNormalizerMiddleware from "@middy/http-header-normalizer";
import httpSecurityHeadersMiddleware from "@middy/http-security-headers";

import getClientByIdController from "@/controllers/getClientByIdController";

const getClientByIdHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return await getClientByIdController(event);
};

export const handler = middy({
  timeoutEarlyResponse: () => {
    return {
      statusCode: 408,
    };
  },
})
  .use(httpEventNormalizerMiddleware())
  .use(httpHeaderNormalizerMiddleware())
  .use(httpSecurityHeadersMiddleware())
  .use(httpContentEncodingMiddleware())
  .use(httpErrorHandlerMiddleware())
  .use(errorLogger())
  .handler(getClientByIdHandler);
