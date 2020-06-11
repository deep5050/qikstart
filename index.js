#!/usr/bin/env node
'use strict';

const license = require('./src/license');
const readme = require('./src/readme');
const coc = require('./src/coc');
const issue = require('./src/issue');
const pull = require('./src/pull');
const contribute = require('./src/contribute');
const changelog = require('./src/changelog');
const badges = require('./src/badges');
const fs = require('fs');
const qoa = require('qoa');
const Conf = require('conf');
const chalk = require('chalk');
const symbols = require('log-symbols');
const path = require('path');

const config = new Conf();

// Console.log(config.path);
/*

[
    '0BSD',
    'BSD-3-Clause-Clear',
    'BSD-4-Clause',
    'BSL-1.0',
    'BSD-3-Clause',
    'ISC',
    'MIT',
    'MS-RL',
    'MS-PL',
    'NCSA',
    'OFL-1.1',
    'PostgreSQL',
    'Unlicense',
    'Vim',
    'UPL-1.0',
    'WTFPL',
    'AFL-3.0',
    'Apache-2.0',
    'Artistic-2.0',
    'CC0-1.0',
    'EPL-1.0',
    'EUPL-1.2',
    'EPL-2.0',
    'EUPL-1.1',
    'ECL-2.0',
    'LGPL-3.0',
    'OSL-3.0',
    'Zlib',
    'CC-BY-4.0',
    'CC-BY-SA-4.0',
    'CECILL-2.1',
    'GPL-2.0',
    'LPPL-1.3c',
    'MPL-2.0',
    'LGPL-2.1',
    'ODbL-1.0',
    'BSD-2-Clause',
    'AGPL-3.0',
    'GPL-3.0'
]

*/

const ask = async () => {
	const program = await qoa.input({
		query: ' Enter project Name:',
		handle: 'program'
	});
	config.set(program);

	const license = await qoa.confirm({
		query: 'Add or Update License?',
		handle: 'license',
		accept: 'y',
		deny: 'n'
	});
	config.set(license);

	if (config.get('license') === true) {
		const license_id = await qoa.interactive({
			query: 'Which License Do You Want?',
			handle: 'spdx-id',
			symbol: '>',
			menu: [
				'MIT',
				'ISC',
				'GPL-3.0',
				'LGPL-3.0',
				'Unlicense',
				'BSD-3-Clause',
				'BSD-3-Clause-Clear',
				'AGPL-3.0',
				'MPL-2.0',
				'WTFPL',
				'GPL-2.0',
				'0BSD',
				'BSD-4-Clause',
				'AFL-3.0',
				'Apache-2.0',
				'CC0-1.0',
				'OSL-3.0',
				'CC-BY-4.0',
				'LGPL-2.1',
				'BSD-2-Clause'
			]
		});
		config.set(license_id);

		const name = await qoa.input({
			query: ' Enter Your Full Name:',
			handle: 'name'
		});
		config.set(name);

		const year = await qoa.input({
			query: ' Enter Year:',
			handle: 'year'
		});
		config.set(year);
	}

	const readme = await qoa.confirm({
		query: 'Want A README Template?',
		handle: 'readme',
		accept: 'y',
		deny: 'n'
	});

	config.set(readme);

	const if_coc = await qoa.confirm({
		query: 'Want A CODE_OF_CONDUCT?',
		handle: 'if_coc',
		accept: 'y',
		deny: 'n'
	});
	config.set(if_coc);

	if (config.get('if_coc') === true) {
		const coc = await qoa.interactive({
			handle: 'coc',
			query: 'Choose language:',
			symbol: '>',
			menu: [
				'English',
				'Dutch',
				'Spanish',
				'German',
				'Chinese (China)',
				'Chinese (Taiwan)',
				'French',
				'Polish',
				'Japanese',
				'Portuguese',
				'Hindi',
				'Bengali',
				'Russian',
				'Bosnian',
				'Greek',
				'Portuguese (Brazil)',
				'Farsi (Iran)',
				'Indonesian',
				'Icelandic',
				'Hebrew',
				'Kannada',
				'Korean',
				'FYRO Macedonian',
				'Romanian',
				'Slovenian',
				'Swedish',
				'Turkish',
				'Ukrainian'
			]
		});
		config.set(coc);

		const email = await qoa.input({
			query: ' Enter Email:',
			handle: 'email'
		});
		config.set(email);
	}

	const contributing = await qoa.confirm({
		query: 'Want CONTRIBUTING.md?',
		handle: 'contributing',
		accept: 'y',
		deny: 'n'
	});

	config.set(contributing);

	const issue_template = await qoa.confirm({
		query: 'Want A ISSUE_TEMPLATE.md?',
		handle: 'issue_template',
		accept: 'y',
		deny: 'n'
	});

	config.set(issue_template);

	const pull_request_template = await qoa.confirm({
		query: 'Want A PULL_REQUEST_TEMPLATE.md?',
		handle: 'pull_req_template',
		accept: 'y',
		deny: 'n'
	});

	config.set(pull_request_template);

	const changelog = await qoa.confirm({
		query: 'Want A CHANGELOG.md?',
		handle: 'changelog',
		accept: 'y',
		deny: 'n'
	});

	config.set(changelog);

	const badges = await qoa.confirm({
		query: 'Want Essential Badges?',
		handle: 'badges',
		accept: 'y',
		deny: 'n'
	});

	config.set(badges);
};

const write_files = async (_path, data, name, ext) => {
	return new Promise((resolve, reject) => {
		let file_name = '';
		if (ext) {
			file_name = name + '.' + ext;
		} else {
			file_name = name;
		}

		const file_path = path.join(_path, file_name);
		fs.writeFile(file_path, data, () => {
			console.log(`${chalk.green.bold(symbols.success)} ${file_name} Added :)`);
			resolve('done');
		});
	});
};

const analyze = async () => {
	console.log(); // Add a blank line

	// ------ LICENSE -----------//

	if (config.get('license') === true && config.has('spdx-id') && config.has('name') && config.has('year')) {
		if (config.get('name') === '' || config.get('year') === '') {
			console.log(`${chalk.red.bold(symbols.error)} Could Not Add/Update LICENSE, Name Or Year Is Missing :(`);
		} else {
			license.get_license(
				config.get('spdx-id'),
				config.get('name'),
				config.get('year'),
				config.get('year')
			);
		}
	}

	// ------------------------- README --------------------------------//
	if (config.get('readme') === true) {
		await write_files(
			'.',
			readme.en(config.get('program')),
			'README',
			'md'
		);
	}

	// --------------------- CODE Of CONDUCT ----------------------- //
	if (config.has('coc') && config.get('if_coc') === true) {
		const lang_id = coc.get_code(config.get('coc'));
		await write_files(
			'.', coc.get_coc(lang_id, config.get('email')),
			'CODE_OF_CONDUCT', 'md'
		);
	}

	// -------- ISSUE TEMPLATE ---------------//
	if (config.get('issue_template') === true) {
		if (!fs.existsSync(path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE'))) {
			fs.mkdirSync(path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE'), {recursive: true}, err => {
				console.log(err);
			});
		}

		await write_files(
			path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE'),
			issue.bug(),
			'bug_report',
			'md'
		);
		await write_files(
			path.join(process.cwd(), '.github', 'ISSUE_TEMPLATE'),
			issue.feature(),
			'feature_request',
			'md'
		);
	}

	// ------------------- PULL REQUEST TEMPLATE --------------//
	if (config.get('pull_req_template') === true) {
		await write_files(
			'.',
			pull.en(),
			'PULL_REQUEST_TEMPLATE',
			'md'
		);
	}

	// ------------- CONTRIBUTING -------------------//

	if (config.get('contributing') === true) {
		await write_files(
			'.',
			contribute.en(),
			'CONTRIBUTING',
			'md'
		);
	}

	// ------------------- CHANGELOG --------------------//

	if (config.get('changelog') === true) {
		await write_files(
			'.',
			changelog.en(config.get('program')),
			'CHANGELOG',
			'md'
		).then(() => {

		});
	}

	// ----------------- BADGES ---------------------/

	if (config.get('badges') === true) {
		await badges.make_badges();
	}
};

ask().then(analyze);
