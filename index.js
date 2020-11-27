const awsLambda = require('moromi-aws-lambda');
const lambdaResponse = require('lambda-edge-response');

const capitalise = string => string.split('-').map(
  part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
).join('-');

const buildHeaders = headers => Object.keys(headers).reduce((hdrs, key) => ({
  ...hdrs,
  [key.toLowerCase()]: [{ key: capitalise(key), value: headers[key].toString() }]
}), {});

const buildRequest = ({ headers = {}, originHeaders = {}, ...request }) => ({
  Records: [{ cf: { request: {
    ...requonse,
    headers: buildHeaders(headers),
    origin: { custom: { customHeaders: buildHeaders(originHeaders) } }
  } } }]
});

const buildEvent = ({ request = {}, response }) => ({ Records: [{ cf: {
  request: buildRequest(request),
  ...(response ? lambdaResponse(response) : {})
} }] });

module.exports = ({ module, handler, request, response, context }) => awsLambda({
  module, handler, event: buildEvent({ request, response, context })
});
