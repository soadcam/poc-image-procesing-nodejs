const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const multer = require('multer');
const imageProperties = require('./model/image-properties.js');
const imageProcessor = require('./processing/process-image.js');
const path = require('path');

const imagePath = path.join(__dirname, 'images');
const router = express.Router();
const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.status(200).send('Ok');
});

router.post('/uploadImage', upload.single('image'), async function (req, res) {
    if (!req.file)
        res.status(401).json({ error: 'Please provide an image' });
    const fullPathModified = await imageProcessor(req.file, imageProperties, imagePath);
    res.status(200).send(fullPathModified);
});

app.use("/api", router);
app.listen(port, function () {
    console.log('Server is running on PORT', port);
});