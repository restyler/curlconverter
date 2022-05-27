import * as curlconverter from 'curlconverter';

if (!process.argv[3]) {
    process.argv[3] = 'node-fetch';
}

if (!['node-fetch', 'python', 'php-scrapeninja'].includes(process.argv[3])) {
    throw new Error(`Invalid syntax: ${process.argv[3]}`);
}

//console.log(process.argv);
if (process.argv[3] == 'python') {
    console.log(curlconverter.toPython(process.argv[2]));
} else if (process.argv[3] == 'node-fetch') {
    console.log(curlconverter.toNodeFetch(process.argv[2]));
} else if (process.argv[3] == 'php-scrapeninja') {
    console.log(curlconverter.toPhpScrapeNinja(process.argv[2]));
} else {
    throw new Error(`Invalid syntax: ${process.argv[3]}`);
}
