# Install
``` 
npm i --save-deps
npm run dev
``` 
# Run DB

Because prisma db requires using mongodb in cluster

## primary instance run in one terminal (for windows)
``` 
mongod --dbpath "C:\Program Files\MongoDB\Server\8.0\data" --logpath "C:\Program Files\MongoDB\Server\8.0\log\mongod.log" --port 27017 --storageEngine=wiredTiger --replSet rs0
``` 
## secondary instance run in another terminal (for windows)
``` 
mongosh --port 27017
``` 

## configure db (for linux)
``` 
nano /etc/mongod.conf
``` 

``` 
#operationProfiling:

replication:
  replSetName: rs0
#sharding:
``` 


# Install Docker 
``` 
docker run --rm --name redis -p 6379:6379 --network=host redis
``` 


# .env

```
# main
GOOGLE_CLIENT_ID=CHANGE
GOOGLE_CLIENT_SECRET=CHANGE
AUTH_SECRET=CHANGE
RESEND_API_KEY=CHANGE

API_SECRET=CHANGE
ENCRYPTION_KEY=CHANGE
AUTH_TRUST_HOST=true
LLM = "deepseek-r1:1.5b"


# For dev
MONGO_DATABASE_URL="mongodb://127.0.0.1:27017/appsec?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.3"
AUTH_URL=http://localhost:3000
API_URL=http://localhost:3000
TEMP_DIR="E:/temp"
NEXT_PUBLIC_DEV_MODE = true
REDIS_HOST=host.docker.internal
REDIS_PORT=6379




# For linux
#TEMP_DIR="/tmp"
#REDIS_HOST=localhost
#REDIS_PORT=6379
#MONGO_DATABASE_URL="mongodb://127.0.0.1:27017/appsec?replicaSet=rs0"
#API_URL=http://localhost:3000
#AUTH_URL=http://localhost:3000
#AUTH_URL_INTERNAL=http://localhost:3000
#NODE_ENV = production
```