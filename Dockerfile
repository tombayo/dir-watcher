FROM node:alpine

COPY dir-watch.js /home/node/

CMD [ "node", "/home/node/dir-watch.js" ]