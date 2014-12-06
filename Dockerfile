FROM nodesource/node

WORKDIR /root

ONBUILD ADD package.json /root/
ONBUILD ADD . /root/
ONBUILD RUN npm install 2>&1

ENTRYPOINT ["echo hello"]
