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

###actualy same but ı make easy for you :)
```bash
 published collection => https://api.postman.com/collections/25694163-3495092b-4832-408a-8976-26c2b48c3142?access_key=PMAT-01HPDABGE45RP7SBGA3Y0RRGA2

 private collection =>https://api.postman.com/collections/25694163-703cb5d0-b259-4c3f-b151-ab8014382a8a?access_key=PMAT-01HPDADJ1HFTED3N8JKH74JF1R
```