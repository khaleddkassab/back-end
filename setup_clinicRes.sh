#!/bin/bash

# Create Docker network
docker network create network

# Build and run MongoDB container
cd ./data-base/
docker build --build-arg DEFAULT_MONGODB_PORT=27017 --tag data-base .
docker run -d -p 27017:27017  --name mongodb -e MONGODB_PORT=27017 --network network  data-base
cd ..

# Build and run Back-end container

cd ./back-end/
#docker build --build-arg PORT=8082 --build-arg MONGODB_URI=mongodb://mongodb/usersdb --tag back-end .docker run -d -p 8083:8083 -e PORT=8083 -e MONGODB_URI=mongodb://mongodb/usersdb --name back-end --network network back-end
docker run -d -p 8083:8083 -e PORT=8083 -e MONGODB_URI=mongodb://mongodb/usersdb --name back-end --network network back-end
cd ..


# Build and run Front-end container
cd ./front-end/
docker build --build-arg BACKEND_API_PORT=8083 --build-arg BACKEND_API_URI=http://localhost --tag front-end .
docker run -d -p 4200:80 --name front-end --network network front-end
cd ..


icacls setup_clinicRes.sh /grant:r "%USERNAME%:RX"
