import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
const fileUpload = require('express-fileupload');
import EmptyFolder from './uploads/empty';

import setMongo from './mongo';
import setRoutes from './routes';

var process = require("process");

const app = express();
dotenv.config();
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  debug: true,
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: path.join(__dirname, './uploads/tmp/'),
  uploadTimeout: process.env.UPLOAD_TIMEOUT
}));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

async function main() {
  try {
    await setMongo();
    setRoutes(app);
    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
    if (!module.parent) {
      app.listen(app.get('port'), () => console.log(`Angular Full Stack listening on port ${app.get('port')}`));
    }
  } catch (err) {
    console.error(err);
  }
}

main();

export { app };
