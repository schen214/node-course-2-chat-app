// console.log(__dirname + '/../public');
// Returns: D:\Documents\nodejs-udemy-andrew\node-chat-app\server/../public
// Converts paths so express middleware can be used and will keep the path 'clean' and cross-OS-compatible
const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public', );
// console.log(publicPath);
// Returns: D:\Documents\nodejs-udemy-andrew\node-chat-app\public

app.use(express.static(publicPath));

app.listen(port, () => console.log(`Server is up on ${port}`));
