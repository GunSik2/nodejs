
npm install connect serve-static fs
npm install websocket
npm install express http path

mkdir -p cert; 
openssl req -x509 -newkey rsa:2048 -keyout cert/key.pem -out cert/cert.pem -days 100 -nodes
