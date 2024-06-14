# Description

Techcam is a tech news and reviews website which allows user's to share news and read news articles.
This project was built for a competition.
You can clone the repo and setup as per the steps mentioned in he installation.

```
We have used 3 third party services:
    - Auth0 -> For authentication.
    - Cloudinary -> Storage
    - Botpress -> Personalized web embedded bots.
```

# Insallation

```
1. Clone the repository :

    git clone https://github.com/Rakesh-46-VR/Techcam.git
```

```    
2. Configure .env in Backend folder code and .env.local in the Frontend folder :
    
    Create Backend/.env
        CLOUDINARY_CLOUD_NAME = ""
        CLOUDINARY_API_KEY = ""
        CLOUDINARY_API_SECRET = ""
        MONGOURI = ""

    Create Frontend/.env.local
        AUTH0_SECRET=''
        AUTH0_BASE_URL=''
        AUTH0_ISSUER_BASE_URL=''
        AUTH0_CLIENT_ID=''
        AUTH0_CLIENT_SECRET=''
```

```
3. Run the backend code : 
        cd Backend
        npm install
        npm run dev (Default Port : 3000)
```

```
4. Run the frontend code :
        cd Frontend
        yarn install
        yarn dev 
``` 
