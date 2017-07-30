import fs from 'fs';
import path from 'path';

const file_location = path.join('./','config.json');
const config = JSON.parse(fs.readFileSync(file_location, 'utf8'));
const config_key = [
    'DB_HOSTNAME',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'PORT',
    'NODE_ENV',
];

let this_module = {
    'DB_HOSTNAME':'',
    'DB_USER'    :'',
    'DB_PASSWORD':'',
    'DB_NAME'    :'',
    'PORT'       :'',
    'NODE_ENV'   :'',
};
(function() {
    for(let i=0;i<config_key.length;i++) {
        if(config[config_key[i]])
            this_module[config_key[i]] = config[config_key[i]];
    }

    if(process.env.DB) {
        this_module.DB_HOSTNAME = process.env.DB;
    }

    this_module.PORT = process.env.PORT || 4000;
    this_module.NODE_ENV = (process.env.NODE_ENV||'development');
}());

export default this_module;