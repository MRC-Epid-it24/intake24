export default (object: object): string => Buffer.from(JSON.stringify(object)).toString('base64');
