const awsLambda = require('moromi-aws-lambda');
const lambdaResponse = require('lambda-edge-response');

const capitalise = string => string.split('-').map(
  part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
).join('-');

const buildHeaders = headers => Object.keys(headers).reduce((hdrs, key) => ({
  ...hdrs,
  [key.toLowerCase()]: [{ key: capitalise(key), value: headers[key].toString() }]
}), {});

const buildRequest = ({ method = 'GET', headers = {}, originHeaders, ...request }) => ({
  method,
  ...request,
  headers: buildHeaders(headers),
  ...(originHeaders ? {
    origin: { custom: { customHeaders: buildHeaders(originHeaders) } }
  } : {})
});

const buildEvent = ({ request = {}, response }) => ({ Records: [{ cf: {
  request: buildRequest(request),
  ...(response ? lambdaResponse(response) : {})
} }] });

module.exports = ({ module, handler, request, response, context }) => awsLambda({
  module, handler, event: buildEvent({ request, response, context })
})
  .then(response => ({
    ...response,
    headers: Object.keys(response.headers).reduce((headers, key) => ({
      ...headers,
      [response.headers[key][0].key]: response.headers[key][0].value
    }), {})
  }));
