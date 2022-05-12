#!/bin/bash

rm -rf node_modules

npm i

npm run build

cd dist

NODE_ENV=production

pm2 start bootstrap.js -n wechat_flower -i 1
