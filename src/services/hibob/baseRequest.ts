import has from "lodash/has";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { proxyFetch, adminGenericProxyFetch } from "@deskpro/app-sdk";
import { BASE_URL, placeholders } from "../../constants";
import { getQueryParams } from "../../utils";
import { HiBobError } from "./HiBobError";
import type { Request } from "../../types";

const baseRequest: Request = async (client, {
  url,
  rawUrl,
  data = {},
  method = "GET",
  queryParams = {},
  settings = {},
  headers: customHeaders,
}) => {
  const dpFetch = await (has(settings, ["access_tokens"]) ? adminGenericProxyFetch : proxyFetch)(client);

  const baseUrl = rawUrl ? rawUrl : `${BASE_URL}${url}`;
  const params = getQueryParams(queryParams);
  const accessTokens = get(settings, ["access_tokens"], placeholders.ACCESS_TOKEN);

  const requestUrl = `${baseUrl}${params}`;
  const options: RequestInit = {
    method,
    headers: {
      "Authorization": `Bearer ${accessTokens}`,
      ...customHeaders,
    },
  };

  if (data instanceof FormData) {
    options.body = data;
  } else if (!isEmpty(data)) {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  const res = await dpFetch(requestUrl, options);

  if (res.status < 200 || res.status > 399) {
    throw new HiBobError({
      status: res.status,
      data: await res.json(),
    });
  }

  try {
    return await res.json();
  } catch (e) {
    return {};
  }
};

export { baseRequest };
