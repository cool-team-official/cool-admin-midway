FROM node:lts-alpine

WORKDIR /app



# 如果各公司有自己的私有源，可以替换registry地址,如使用官方源注释下一行
RUN npm set registry https://registry.npm.taobao.org
# 安装开发期依赖
COPY package.json ./package.json
RUN npm install
# 构建项目
COPY . .
RUN npm run build
# 删除开发期依赖
RUN rm -rf node_modules && rm package-lock.json    
# 安装开发环境依赖   
RUN npm install --production                          

# 如果端口更换，这边可以更新一下
EXPOSE 7001

CMD ["npm", "run", "docker"]