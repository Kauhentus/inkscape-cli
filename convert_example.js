const fs = require('fs');
const I = require('./index');
I.setFolder("C:\\Program Files\\Inkscape\\");

const svgFolder = '.\\svgs\\';
const pdfFolder = '.\\pdfs\\';

const commands = fs.readdirSync(svgFolder).map(fileName => 
    I.generateCommand([
        I.O.file(svgFolder + fileName),
        I.O.export_area_page,
        I.O.export_pdf(pdfFolder + fileName.slice(0, -4) + '.pdf')
    ]
));

I.chainCommands([...commands]);