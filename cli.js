import * as curlconverter from 'curlconverter';


if (process.argv[3] || process.argv[3] == 'python') {
    console.log(curlconverter.toPython(process.argv[2]));
} else {
    console.log(curlconverter.toNodeFetch(process.argv[2]));
}
