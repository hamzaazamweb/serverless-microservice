#!/bin/bash

cd services/gateway
serverless deploy
sleep 5s

cd ../serviceA
serverless deploy
sleep 5s

cd ../serviceB
serverless deploy
sleep 5s

echo "Press any key to continue"
read