# moromi-aws-lambda-edge
aws lambda@edge plugin for moromi

## Installation
```
  yarn add moromi-aws-lambda-edge
```

## Usage

### params:
* module: _the local filename of the lambda module to test (relative to the folder where moromi is being called from)_
* handler (default `handler`): _the handler name exported by the lambda module_
* request: _a request that the handler should be called with, with normalised headers_
* response (optional): _a response event that the handler should be called with, with normalised headers_

## Example
Given the following lambda function:
```js
module.exports.handler = ({ Records: [{ cf: { request: {
  uri, method = 'GET', querystring = '', headers
} } }] }, context, callback) => callback(null, {
  uri,
  method,
  headers
});
```

the following moromi test will pass:
```js
{
  name: 'example aws lambda test',
  type: require('moromi-aws-lambda')
  params: {
    module: '../index.js',
    request: {
      uri: '/test',
      headers: { Host: 'example.is' }
    }
  },
  expected: {
    uri: '/test', method: 'GET',
   'headers.Host': 'example.is'
  }
}
```


