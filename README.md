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