const fs = require('fs');
const exec = require('child_process').exec;

class Inkscape {
    constructor(){
        this.inkscape_folder = null;
        // find inkscape program folder
        const locations = [
            "C:\\Program Files\\Inkscape\\",
            "C:\\Program Files (x86)\\Inkscape\\",
        ];

        let found_path = false;
        locations.forEach(location => {
            if(fs.existsSync(location)){
                found_path = fs.readdirSync(location).includes('inkscape.exe');
                if(found_path) this.inkscape_folder = location;
            }
        });

        this.O = {
            help: () => '--help',
            usage: () => '--usage',

            version: () => '--version',

            file: (FILENAME) => `--file="${FILENAME}"`,

            export_png: (FILENAME) => `--export-png="${FILENAME}"`,
            export_area: (x0, y0, x1, y1) => `--export-area=${x0}:${y0}:${x1}:${y1}`,
            export_area_page: () => '--export-area-page',
            export_area_drawing: () => '--export-area-drawing',
            export_area_snap: () => '--export-area-snap',
            export_id: (ID) => `--export-id=${ID}`,
            export_id_only: () => '--export-id-only',
            export_use_hints: () => '--export-use-hints',
            export_background: (COLOR) => `--export-background=${COLOR}`,
            export_background_opactiy: (VALUE) => `--export-background-opacity=${VALUE}`,
            export_dpi: (DPI) => `--export-dpi=${DPI}`,
            export_width: (WIDTH) => `--export-width=${WIDTH}`,
            export_height: (HEIGHT) => `--export-height=${HEIGHT}`,

            export_ps: (FILENAME) => `--export-ps="${FILENAME}"`,
            export_eps: (FILENAME) => `--export-eps="${FILENAME}"`,
            export_pdf: (FILENAME) => `--export-pdf="${FILENAME}"`,
            export_pdf_version: (VERSION_STRING) => `--export-pdf-version=${VERSION_STRING}`,
            export_latex: () => '--export-latex',

            export_text_to_path: () => '--export-text-to-path',
            export_ignore_filters: () => '--export-ignore-filters',

            export_plain_svg: (FILENAME) => `--export-plain-svg="${FILENAME}"`,
 
            print: (PRINTER) => `--print=${PRINTER}`,

            query_id: (ID) => `--query-id=${ID}`,
            query_x: () => '--query-x',
            query_y: () => '--query-y',
            query_width: () => '--query-width',
            query_height: () => '--query-height',
            query_all: () => '--query-all',

            extension_directory: () => '--extension-directory',
            
            verb_list: () => '--verb-list',
            verb: (VERB_ID) => `--verb=${VERB_ID}`,
            select: (OBJECT_ID) => `--select=${OBJECT_ID}`,

            shell: () => 'shell',

            with_gui: () => '--with-gui',
            without_gui: () => '--without-gui',

            vacuum_defs: () => '--vacuum-defs',
            no_convert_text_baseline_spacing: () => '--no-convert-text-baseline-spacing',

            g_fatal_warnings: () => '--g-fatal-warnings',

            /* Shorthand */

            V: () => this.O.version,

            f: (FILENAME) => this.O.file(FILENAME),

            e: (FILENAME) => this.O.export_png(FILENAME),
            a: (x0, y0, x1, y1) => this.O.export_area(x0, y0, x1, y1),
            C: () => this.O.export_area_page,
            D: () => this.O.export_area_drawing,

            i: (ID) => this.O.export_id(ID),
            j: () => this.O.export_id_only,
            t: () => this.O.export_use_hints,
            b: (COLOR) => this.O.export_background(COLOR),
            y: (VALUE) => this.O.export_background_opactiy(VALUE),
            d: (DPI) => this.O.export_dpi(DPI),
            w: (WIDTH) => this.O.export_width(WIDTH),
            h: (HEIGHT) => this.O.export_height(HEIGHT),

            P: (FILENAME) => this.O.export_ps(FILENAME),
            E: (FILENAME) => this.O.export_eps(FILENAME),
            A: (FILENAME) => this.O.export_pdf(FILENAME),

            T: () => this.O.export_text_to_path,

            l: (FILENAME) => this.O.export_plain_svg(FILENAME),

            p: (PRINTER) => this.O.print(PRINTER),

            I: (ID) => this.O.query_id(ID),
            X: () => this.O.query_x,
            Y: () => this.O.query_y,
            W: () => this.O.query_width,
            H: () => this.O.query_height,
            S: () => this.O.query_all,

            x: () => this.O.extension_directory,

            g: () => this.O.with_gui,
            z: () => this.O.without_gui
        }
    }

    setFolder(path){
        if(fs.readdirSync(path).includes('inkscape.exe')) this.inkscape_folder = path;
        else throw new Error('Invalid Inkscape folder');
    }

    generateCommand(args){
        if(this.inkscape_folder == null) throw new Error('Could not find Inkscape folder or invalid Inkscape folder given');
        const parsed_args = args.map(arg => {
            if(typeof(arg) == 'string') return arg;
            else return arg();
        });

        return `"${this.inkscape_folder}\\inkscape.exe" ${parsed_args.join(' ')}`;
    }

    runCommand(command){
        if(this.inkscape_folder == null) throw new Error('Could not find Inkscape folder or invalid Inkscape folder given');

        exec(command, (err, stdout, stderr) => {
            if(stderr) console.log(stderr);
            console.log('Finished:' + command);
        });
    }

    chainCommands(commands){
        if(this.inkscape_folder == null) throw new Error('Could not find Inkscape folder or invalid Inkscape folder given');
    
        const iteration = (previous_commands) => {
            let current_commands = previous_commands;
            const current_command = current_commands.pop();
            exec(current_command, (err, stdout, stderr) => {
                if(stderr) console.log(stderr);
                console.log('Finished:' + current_command);

                if(commands.length != 0) iteration(current_commands);
                else console.log('Done');
            });
        };

        iteration(commands);
    }
}


module.exports = new Inkscape();