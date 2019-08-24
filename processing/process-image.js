const sharp = require('sharp');
const Jimp = require('jimp');
const moment = require('moment');
const path = require('path');

module.exports = async function (file, imageProperties, imagePath) {
    const date = moment().format('YYYY_MM_DD_HH_mm_ss');
    const fullPath = path.resolve(`${imagePath}/${file.originalname}`);
    const fullPathModified = path.resolve(`${imagePath}/${date}_${path.parse(file.originalname).name}.png`);
    await sharp(file.buffer).toFile(fullPath);
    Jimp.read(fullPath)
        .then(tpl => tpl.resize(imageProperties.maxWidth, imageProperties.maxHeight))
        .then(tpl => (
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => ([tpl, font]))
        ))
        .then(data => {
            tpl = data[0];
            font = data[1];
            let includeText = tpl.print(font, imageProperties.placementXName, imageProperties.placementYName, {
                text: imageProperties.author,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, imageProperties.maxWidth, imageProperties.maxHeight);
            return includeText.print(font, imageProperties.placementXDate, imageProperties.placementYDate, {
                text: moment().format('YYYY[/]MM[/]DD HH:mm:ss'),
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, imageProperties.maxWidth, imageProperties.maxHeight);
        })
        .then(tpl => tpl.quality(100).write(fullPathModified))
        .then(() => {
            console.log('exported file: ' + fullPathModified);
        })
        .catch(err => {
            console.error(err);
        });
    return fullPathModified;
}