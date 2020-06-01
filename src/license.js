const licenses = require('nonsense-license');
const fs = require('fs');
const chalk = require('chalk');
const log_symbols = require('log-symbols');



const write = async (data, name, year, program) => {
    return new Promise((resolve, reject) => {
        var texts = [];
        var to_write = "";
        try {
            texts = JSON.parse(data)['text'];
            texts.forEach(element => {
                to_write += "\n" + element;
            });

            if (to_write.includes('[year]') && to_write.includes('[fullname]')) {
                to_write = to_write.replace(/\[year\]/g, year);
                to_write = to_write.replace(/\[fullname\]/g, name);
            }
            if (to_write.includes('[yyyy]') && to_write.includes('[name of copyright owner]')) {
                to_write = to_write.replace(/\[yyyy\]/g, year);
                to_write = to_write.replace(/\[name of copyright owner\]/g, name);
            }
            if (to_write.includes('<year>') && to_write.includes('<name of author>')) {
                to_write = to_write.replace(/<year>/g, year);
                to_write = to_write.replace(/<name of author>/g, name);
            }
            if (to_write.includes('<program>')) {
                to_write = to_write.replace(/<program>/g, program);
            }

            fs.writeFile("LICENSE", to_write.trim(), () => {
                resolve("SUCCESS");
            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.get_license = (id, name, year,program) => {
    (async () => {
        const data = JSON.stringify(licenses[id]);
        try {
            const flag = await write(data, name, year,program);
            if (flag) {
                console.log(chalk.green.bold(log_symbols.success) + " LICENSE Updated :)");
            }
        } catch (error) {
            console.log(chalk.red.bold(log_symbols.error) + " Couldn't Update LICENSE :(");
        }
    })();
}