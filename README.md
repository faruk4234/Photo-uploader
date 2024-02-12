<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest



## Description

Briefly, it's an API service where users can register and upload photos. While uploading photos, users can resize them and add tags. These tags enable search functionality within the service. If you make the photo public, anyone can access it. If you make it private, only you can edit or delete your own photos.

In this project, I tried to use exceptions correctly while using S3 for photo storage and many other things for the first time. It's my first time using Nest.js, and it's only been 2 days since I started. During this process, I learned Nest.js, set up Docker and AWS for the first time, and used them for installation.

# Don't bother because the API service is already running live.
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