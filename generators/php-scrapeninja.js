import * as util from "../util.js";

const padStartMultiline = (str, num, paddingSymbol = ' ') => {
  return str.split("\n").map(s => s.padStart(num, paddingSymbol)).join("\n")
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

function escape(str) {
    return str.replace(/"/g,'\\"').replace(/\$/g,'\\$').replace(/\\n/g,'\\\\n');//.replace(/\\/g,'\\\\/');
}

const _toPhpAssocString = (obj, indent = 0) => {
    let out = '[\n';

    for (const key in obj) {

        if (Array.isArray(obj[key])) {
            out += `    "${key}" => ` + _toPhpAssocString(obj[key], indent+1);
        } else if (isNumeric(key)) {
            out += `"${escape(obj[key])}",\n`.padStart(indent, '  ');
        } else {
            out += `    "${key}" => "${escape(obj[key])}",\n`.padStart(indent, '  ');;
        }
        

    }
    //console.log("out[-1]", out[-1]);
    //out = out.slice(0, -2);

    out += "\n],\n";

    if (indent == 0) {
        out = out.slice(0, -2);
        out += ';';
    }
    return out;
}

export const _toPhpScrapeNinja = request => {
  let jsFetchCode = '<?php\n\nrequire "./vendor/autoload.php";\nuse ScrapeNinja\\Client;\n\n'


  jsFetchCode += '// get your subscription key at https://rapidapi.com/restyler/api/scrapeninja from "Code generator",\n// copy&paste it to \'rapidapi_key\' param below\n\n';

  jsFetchCode += "$client = new Client([\"rapidapi_key\" => \""+ (process.env.RAPIDAPI_KEY ?? 'YOUR-RAPIDAPI-KEY') +"\"]);";

  jsFetchCode += "\n\n";



  jsFetchCode += '$payload = '


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

  jsFetchCode += _toPhpAssocString(data);
  //jsFetchCode += padStartMultiline(JSON.stringify(data, null, 4), 8) + '\n';


  jsFetchCode += '\n'

  jsFetchCode += '$response = $client->scrape($payload);\n'

  jsFetchCode += '\n// check $response[\'info\'][\'statusCode\'] and $response[\'info\'][\'headers\'] for target website response code and headers\n\n'

  jsFetchCode += `var_dump($response);\n`;

  return jsFetchCode;
}

export const toPhpScrapeNinja = curlCommand => {
  const request = util.parseCurlCommand(curlCommand)
  return _toPhpScrapeNinja(request)
}
