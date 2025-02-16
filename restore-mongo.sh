#!/bin/bash

# MongoDB connection info
MONGO_URI=mongodb://mongo:27017  # Use 'mongo' because that's the service name in docker-compose
DB_NAME=luntian
DUMP_PATH=/mongodump/luntian

# Wait for MongoDB to start up (a brief delay to ensure MongoDB is ready)
echo "Waiting for MongoDB to start..."
sleep 10

# Drop the existing database
echo "Dropping the existing database: $DB_NAME"
docker exec -it mongodb mongo $DB_NAME --eval "db.dropDatabase()"

# Restore the new dump
echo "Restoring MongoDB dump from: $DUMP_PATH"
docker exec -it mongodb mongorestore --uri=$MONGO_URI --drop --dir=$DUMP_PATH

echo "Database restore complete."
