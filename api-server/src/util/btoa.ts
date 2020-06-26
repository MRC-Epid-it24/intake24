export default (object: any): string => Buffer.from(JSON.stringify(object)).toString('base64');
