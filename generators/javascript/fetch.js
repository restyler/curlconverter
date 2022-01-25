import * as util from "../../util.js";
import jsesc from "jsesc";

const padStartMultiline = (str, num, paddingSymbol = ' ') => {
  return str.split("\n").map(s => s.padStart(num, paddingSymbol)).join("\n")
}

export const _toJsFetch = request => {
  let jsFetchCode = ''


  jsFetchCode += 'let req = fetch(\'https://scrapeninja.p.rapidapi.com/scrape\'';

  jsFetchCode += ', {\n'

  jsFetchCode += '    method: \'POST\',\n';

  jsFetchCode += '    headers: \n';

  let outerHeaders = {
    'Content-Type': 'application/json', 
    'x-rapidapi-host': 'scrapeninja.p.rapidapi.com', 
    'x-rapidapi-key': 'YOUR-RAPIDAPI-KEY'
  };

  jsFetchCode += padStartMultiline(JSON.stringify(outerHeaders, null, 4), 5, ' ');

  jsFetchCode += ',\n';

  let data = {
    url: request.url,

  };

  if (request.method != 'get') {
    data.method = "POST";
  }

  if (request.headers || request.cookies || request.auth) {
      data.headers = [];

      for (const headerName in request.headers) {
        data.headers.push(headerName + ': ' + request.headers[headerName]);

      }
      
      

      if (request.auth) {
        const splitAuth = request.auth.split(':')
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
        data.headers.push( '        \'Authorization\': \'Basic \' + btoa(\'' + user + ':' + password + '\')');
      }
      if (request.cookies) {
        const cookieString = util.serializeCookies(request.cookies)
        data.headers.push( '        \'Cookie\': \'' + cookieString + '\'' );
      }
  }

  if (request.data) {
    data.data = request.data;
  }

  jsFetchCode += '    body: JSON.stringify(' + padStartMultiline(JSON.stringify(data, null, 4), 8) + ')\n';

  jsFetchCode += '\n    }'


  jsFetchCode += ');'

  jsFetchCode += '\n'

  jsFetchCode += 'req.then((res) => res.json()).then(json => console.log(json))'

  jsFetchCode += '\n'

  return jsFetchCode;
}

export const toJsFetch = curlCommand => {
  const request = util.parseCurlCommand(curlCommand)
  return _toJsFetch(request)
}
