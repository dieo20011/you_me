export const environment = {
    DOMAIN: 'http://localhost:4200',
    API_DOMAIN: 'https://localhost:7220',
    OWNER_NAME: 'NOIS',
    // API_DOMAIN: 'https://api-hrm-dev.azurewebsites.net',
    MSAL: {
        config: {
            clientId: '9a4f52e2-98c4-4d01-b956-43b9b2d70440',
            authority: 'https://login.microsoftonline.com/5e2a3cbd-1a52-45ad-b514-ab42956b372c',
            redirectUri: '/',
        },
        scopes: ['api://a0ad59c6-5085-4ad4-b2d4-0d9d32e9033c/access_as_user'],
    },
};
