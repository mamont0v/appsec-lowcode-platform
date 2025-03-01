export function getAppUrl(path: string) {
    const appUrl = process.env.AUTH_URL;
    return `${appUrl}/${path}`;
}