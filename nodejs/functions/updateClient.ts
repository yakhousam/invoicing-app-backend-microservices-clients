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
import httpJsonBodyParserMiddleware from "@middy/http-json-body-parser";
import httpSecurityHeadersMiddleware from "@middy/http-security-headers";

import updateClientController from "@/controllers/updateClientController";
import clientNameDuplicationMiddleware from "@/custom-middlewares/clientNameDuplicationMiddleware";
import emailDuplicationMiddleware from "@/custom-middlewares/emailDuplicationMiddleware";

const updateClientHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return await updateClientController(event);
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
  .use(httpJsonBodyParserMiddleware())
  .use(httpSecurityHeadersMiddleware())
  .use(httpContentEncodingMiddleware())
  .use(emailDuplicationMiddleware())
  .use(clientNameDuplicationMiddleware())
  .use(httpErrorHandlerMiddleware())
  .use(errorLogger())
  .handler(updateClientHandler);
