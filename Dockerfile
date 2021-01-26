FROM node:12

WORKDIR /home

COPY . .

# 如果各公司有自己的私有源，可以替换registry地址
RUN yarn

RUN yarn build

# 如果端口更换，这边可以更新一下
EXPOSE 7001

CMD ["npm", "run", "start"]