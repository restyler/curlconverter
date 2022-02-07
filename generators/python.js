import * as util from "../util.js";

const padStartMultiline = (str, num, paddingSymbol = ' ') => {
  return str.split("\n").map(s => s.padStart(num, paddingSymbol)).join("\n")
}

export const _toPython = request => {
  let jsFetchCode = 'import requests\nimport json\n\n'

  jsFetchCode += 'url = \'https://scrapeninja.p.rapidapi.com/scrape\'\n\n';

  jsFetchCode += '# get your subscription key at https://rapidapi.com/restyler/api/scrapeninja from "Code generator",\n# copy&paste it to \'x-rapidapi-key\' header below\n\n';
  let outerHeaders = {
    'Content-Type': 'application/json', 
    'x-rapidapi-host': 'scrapeninja.p.rapidapi.com', 
    'x-rapidapi-key': 'YOUR-RAPIDAPI-KEY'
  };

  jsFetchCode += 'headers = ';
  jsFetchCode += padStartMultiline(JSON.stringify(outerHeaders, null, 4), 5, ' ');

  jsFetchCode += "\n\n";



  jsFetchCode += 'payload = '


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
      
      

      /*if (request.auth) {
        const splitAuth = request.auth.split(':')
        const user = splitAuth[0] || ''
        const password = splitAuth[1] || ''
        data.headers.push( 'Authorization: Basic' + 'btoa(\'' + user + ':' + password + '\')');
      }*/
      if (request.cookies) {
        const cookieString = util.serializeCookies(request.cookies)
        data.headers.push( 'Cookie: ' + cookieString + '' );
      }
  }

  if (request.data) {
    data.data = request.data;
  }

  jsFetchCode += padStartMultiline(JSON.stringify(data, null, 4), 8) + '\n';


  jsFetchCode += '\n'

  jsFetchCode += 'response = requests.request("POST", url, json=payload, headers=headers)\n'

  jsFetchCode += '\n'

  jsFetchCode += `response_json = json.loads(response.text)
print(response.__dict__)
print(response_json)`;

  return jsFetchCode;
}

export const toPython = curlCommand => {
  const request = util.parseCurlCommand(curlCommand)
  return _toPython(request)
}
