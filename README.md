<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



## Description

Briefly, it's an API service where users can register and upload photos. While uploading photos, users can resize them and add tags. These tags enable search functionality within the service. If you make the photo public, anyone can access it. If you make it private, only you can edit or delete your own photos.

In this project, I tried to use exceptions correctly while using S3 for photo storage and many other things for the first time. It's my first time using Nest.js, and it's only been 2 days since I started. During this process, I learned Nest.js, set up Docker and AWS for the first time, and used them for installation.

# Don't bother because the API service is already running live in EC2. 
## Build server
```bash
# dowload and build server
git clone https://github.com/faruk4234/Photo-uploader.git
#clean node terminals
killall node
# docker easy build 
# create an image whose name is faruk-photo or whatever you want.
docker build -t faruk-photo . 
# build image port 3001 to 3001 or whenever you want
docker run -p 3001:3001 -d faruk-photo
# for stop
docker ps
docker kill <4LettersOfContainerName>
```

## Collections

You can run it locally if you want, but I have published it for you on Amazon AWS, here are the Postman collections for local and AWS.

published url = http://photo-env.eba-vpc2zdvj.eu-central-1.elasticbeanstalk.com/

###actualy same but ı make it easy for you :)

 published collection => 
```bash
 https://api.postman.com/collections/25694163-3495092b-4832-408a-8976-26c2b48c3142?access_key=PMAT-01HPDABGE45RP7SBGA3Y0RRGA2
```

 private collection =>
```bash
 https://api.postman.com/collections/25694163-703cb5d0-b259-4c3f-b151-ab8014382a8a?access_key=PMAT-01HPDADJ1HFTED3N8JKH74JF1R
 ```


#### GET /user
response example (auth)
 ```bash
 {
    "name": "dsa",
    "email": "deneme1@gmail.com"
}
```



#### POST /user/register
request example (no auth)
 ```bash
 {   
    "username":"dsa",
    "email":"deneme1@gmail.com",
    "password":"123456"
}
```
response examples
 ```bash
 {
    "statusCode": 422,
    "message": "Email is already taken"
}
{
    "name": "dsa",
    "email": "deneme123@gmail.com"
}
```

#### POST /user/login
request body example (no auth)
 ```bash
 {   
    "email":"deneme1@gmail.com",
    "password":"123456"
}
```
response examples
 ```bash
{
    "token": "eyJhbGciOiJ21UzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbmVtZTFAZ21haWwuY29tIiwiaWF0IjoxNzA3Njk3NjQ0fQ.H8RxtBr7jM9ljtkQ_oJw5DWoDGjIITIpsRalP8WOAd0"
}
{
    "statusCode": 422,
    "message": "User not found"
}
```

#### POST /photo/upload
request body example (auth)
 ```bash
 {   
    "is_public":bolean, //optional default true
    "height":number //optional default 700
    "width":number //optional default 400
    "tags":Array<string> //optional
    "photo":file //requried max 50mb
}
```
response examples
 ```bash
{
    "id": "65c9669d6e6327d266eaff72",
    "user_id": "65c942e670765d093fe12c03",
    "tags": ["fun","party"],
    "is_public": true,
    "photo_url": "https://faruk-photo-upload.s3.amazonaws.com/ce8ac33e-c059-4e1d-9028-d0e7faf6f825.jpeg",
    "upload_date": "2024-02-12T00:30:21.868Z"
}
{
    "statusCode": 500, //if photo doesnt exist
    "message": "Internal server error"
}
```

#### PUT /photo?:photo_id(required)
request body example (auth)
you can change tags or public or private state
 ```bash
 {   
    "is_public":bolean, //optional 
    "tags":Array<string> //optional
    
}
```
response examples
 ```bash
{
    "id": "65c9669d6e6327d266eaff72",
    "user_id": "65c942e670765d093fe12c03",
    "tags": ["fun","party"],
    "is_public": true,
    "photo_url": "https://faruk-photo-upload.s3.amazonaws.com/ce8ac33e-c059-4e1d-9028-d0e7faf6f825.jpeg",
    "upload_date": "2024-02-12T00:30:21.868Z"
}
{
    "statusCode": 401,
    "message": "Unauthorized"
},
{
    "statusCode": 403,
    "message": "Forbidden" //if you try update another user photo
},
{
    "statusCode": 403,
    "message": "Forbidden" //if you try update another user photo
},
{
    "statusCode": 404,
    "message": "photo not found" //if photo doesnt exist
}
```

#### DELETE /photo/:photo_id(required)
response examples
 ```bash
{
    true
}
{
    "statusCode": 401,
    "message": "Unauthorized"
},
{
    "statusCode": 403,
    "message": "Forbidden" //if you try delete another user photo
},
{
    "statusCode": 404,
    "message": "photo not found" //if photo doesnt exist
}
```

#### GET /photo/my-photos?:search
response examples
you can use search param for tag filter
 ```bash
[
    {
        "id": "65c95b966e6327d266eaff4e",
        "user_id": "65c942e670765d093fe12c03",
        "tags": [
            "disco",
            "party",
            "swim"
        ],
        "is_public": true,
        "photo_url": "https://faruk-photo-upload.s3.amazonaws.com/380973a4-2efe-4461-af97-d0c05567b858.jpeg",
        "upload_date": "2024-02-11T23:43:18.692Z"
    },
    {
        "id": "65c95b966e6327d266eaff4e",
        "user_id": "65c942e670765d093fe12c03",
        "tags": [
            "disco",
            "party",
            "swim"
        ],
        "is_public": false,
        "photo_url": "https://faruk-photo-upload.s3.amazonaws.com/380973a4-2efe-4461-af97-d0c05567b858.jpeg",
        "upload_date": "2024-02-11T23:43:18.692Z"
    }
]
{
    "statusCode": 401,
    "message": "Unauthorized"
},
```


#### GET /photo/photos?:search
response examples
you can use search param for tag filter
 ```bash
[
    {
        "id": "65c95b966e6327d266eaff4e",
        "user_id": "65c942e670765d093fe12c03",
        "tags": [
            "disco",
            "party",
            "swim"
        ],
        "is_public": true,
        "photo_url": "https://faruk-photo-upload.s3.amazonaws.com/380973a4-2efe-4461-af97-d0c05567b858.jpeg",
        "upload_date": "2024-02-11T23:43:18.692Z"
    },
    {
        "id": "65c95b966e6327d266eaff4e",
        "user_id": "65c942e670765d093fe12c03",
        "tags": [
            "disco",
            "party",
            "swim"
        ],
        "is_public": true,
        "photo_url": "https://faruk-photo-upload.s3.amazonaws.com/380973a4-2efe-4461-af97-d0c05567b858.jpeg",
        "upload_date": "2024-02-11T23:43:18.692Z"
    }
]
{
    "statusCode": 401,
    "message": "Unauthorized"
},
```