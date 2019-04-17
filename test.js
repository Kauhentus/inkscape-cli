const I = require('inkscape-cli');
I.setFolder("C:\\Program Files\\Inkscape\\");

const savePDF = I.generateCommand([
    I.O.file('.\\File.svg'),
    I.O.export_area_page,
    I.O.export_pdf('.\\File.pdf')
]);

const savePNG = I.generateCommand([
    I.O.file('.\\File.svg'),
    I.O.export_area_drawing,
    I.O.export_width(2024),
    I.O.export_height(1024),
    I.O.export_png('.\\File.png')
]);

I.runCommand(savePDF);
I.chainCommands([savePDF, savePNG]);