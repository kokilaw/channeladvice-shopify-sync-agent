# channeladvice-shopify-sync-agent

### Dev Environment Setup

1. Install Node Version Manager (nvm) [OPTIONAL]
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
```
2. Install Node v16
```shell
nvm install 16
```
3. Set Node v16 as default version
```shell
nvm alias default 16
```
5. Set the following environment variables in `.env` file of project root
    * PORT - 8080 (Or any preferred port)
    * RUNNING_ENV - local
    * CHANNEL_ADVISOR_APPLICATION_ID
    * CHANNEL_ADVISOR_APPLICATION_SECRET
    * CHANNEL_ADVISOR_REFRESH_TOKEN
    * SHOPIFY_SHOP_ID
    * SHOPIFY_ADMIN_API_TOKEN
   

5. Install dependencies
```shell
npm install
```

6. Start Application
```shell
npm start start-local
```

7. Deploy Application
```shell
gcloud functions deploy ca-shopify-sync-function --entry-point syncApp --runtime nodejs16 --trigger-http --project ca-shopify-sync-agent
```