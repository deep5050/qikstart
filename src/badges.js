#!/usr/bin/env node
'use strict';

const qoa = require('qoa');
const Conf = require('conf');
const fs = require('fs');
const chalk = require('chalk');
const symbols = require('log-symbols');

const config = new Conf();

config.clear();
// Console.log(config.path);
const shields = 'https://img.shields.io';
const badgen = 'https://badgen.net';

const table_header = '\n| Syntax    |    Badge  |\n| :---      |  :----:  |';

const get_badge_text = (provider, path, url, alt) => {
	let type = '';
	let style = '';

	if (config.has('style')) {
		style = config.get('style');
	}

	if (config.has('type')) {
		type = config.get('type');
	}

	if (type === 'HTML') {
		return `<img alt="${alt}" src="${provider}${path}style=${style}"></img>`;
	}

	if (type === 'MarkDown') {
		return `[![${alt}](${provider}${path}style=${style})](${url})`;
	}
};

const make_a_row = value => {
	return '\n| `' + value + '` | ' + value + '|';
};

const rating_bages = () => { };

const other_badges = (user, repo) => {
	let text = '\n## Other Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;
	const hit_count = get_badge_text(
		'http://hits.dwyl.com',
		`/${user}/${repo}.svg?`,
		url,
		'Hit Count'
	);
	text += make_a_row(hit_count);

	return text;
};

const social_badges = (user, repo) => {
	let text = '\n## Social Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;

	const followers = get_badge_text(
		shields,
		`/github/followers/${user}?`,
		url,
		'Followers'
	);

	text += make_a_row(followers);

	const forks = get_badge_text(
		shields,
		`/github/forks/${user}/${repo}?`,
		url,
		'Forks'
	);

	// Console.log(forks);
	text += make_a_row(forks);

	const stars = get_badge_text(
		shields,
		`/github/stars/${user}/${repo}?`,
		url,
		'Stars'
	);
	// Console.log(stars);
	text += make_a_row(stars);

	const watchers = get_badge_text(
		shields,
		`/github/watchers/${user}/${repo}?`,
		url,
		'Watchers'
	);
	// Console.log(watchers);
	text += make_a_row(watchers);

	if (config.has('twitter')) {
		if (config.get('twitter') !== false && config.get('twitter.id') !== undefined) {
			const twitter_follow = get_badge_text(
				shields,
				`/twitter/follow/${config.get('twitter.id')}?logo=twitter&`,
				url,
				'Twitter Follow'
			);
			// Console.log(twitter_follow);
			text += make_a_row(twitter_follow);
		}
	}

	return text;
};

const dependency_badges = (user, repo) => {

};

const version_badges = (user, repo) => {
	let text = '\n## Version Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;

	const version = get_badge_text(
		shields,
		`/github/v/release/${user}/${repo}?`,
		url,
		'Release Version'
	);
	// Console.log(version);
	text += make_a_row(version);
	return text;
};

const ci_cd_badges = (user, repo) => {
	let text = '\n## CI/CD Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;

	if (config.get('github') === false || !config.has('github')) {
		return text = '\n## CI/CD Badges\n';
	}

	const github_workflow = get_badge_text(
		shields,
		`/github/workflow/status/${user}/${repo}/${config.get('github.workflow')}?label=${config.get('github.workflow')}&logo=github&`,
		url,
		'GitHub Workflow Status'
	);

	text += make_a_row(github_workflow);

	if (config.has('ci_cd_provider') && config.get('ci_cd_provider') === 'Travis') {
		const travis = get_badge_text(
			shields,
			`/travis/${user}/${repo}?label=Build&logo=travis&`,
			url,
			'Travis Build'
		);
		text += make_a_row(travis);
	}

	return text;
};

const activity_badges = (user, repo) => {
	let text = '\n## Activity Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;

	const commits_per_month = get_badge_text(
		shields,
		`/github/commit-activity/m/${user}/${repo}?`,
		url,
		'Commits/month'
	);
	// Console.log(commits_per_month);
	text += make_a_row(commits_per_month);

	const last_commit = get_badge_text(
		shields,
		`/github/last-commit/${user}/${repo}?`,
		url,
		'Last Commit'
	);
	// Console.log(last_commit);
	text += make_a_row(last_commit);

	const relese_date = get_badge_text(
		shields,
		`/github/release-date/${user}/${repo}?`,
		url,
		'Last release date'
	);
	// Console.log(relese_date);
	text += make_a_row(relese_date);

	const contributors = get_badge_text(
		shields,
		`/github/contributors/${user}/${repo}?`,
		url,
		'Contributors'
	);
	// Console.log(contributors);
	text += make_a_row(contributors);

	return text;
};

const license_badges = (user, repo) => {
	let text = '\n## License Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;
	const license = get_badge_text(
		shields,
		`/github/license/${user}/${repo}?`,
		url,
		'License'
	);
	// Console.log(license);
	text += make_a_row(license);
	return text;
};

const size_badges = (user, repo) => {
	let text = '\n## Size Badges\n';
	text += table_header;

	const url = `https://github.com/${user}/${repo}`;
	const repo_size = get_badge_text(shields, `/github/repo-size/${user}/${repo}?`
		, url, 'Repo Size');
	// Console.log(repo_size);
	text += make_a_row(repo_size);
	return text;
};

const analysis_badges = (user, repo) => {
	let text = '\n## Analysis Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;

	const languages_count = get_badge_text(
		shields,
		`/github/languages/count/${user}/${repo}?`,
		url,
		'Language Count'
	);
	// Console.log(languages_count);
	text += make_a_row(languages_count);

	const top_language = get_badge_text(
		shields,
		`/github/languages/top/${user}/${repo}?`,
		url,
		'Top Language'
	);
	// Console.log(top_language);
	text += make_a_row(top_language);

	if (config.has('analysis_provider') && config.get('analysis_provider') === 'CodeClimate') {
		const codeclimate_maintain_percent = get_badge_text(
			shields,
			`/codeclimate/maintainability-percentage/${user}/${repo}?`,
			url,
			'Code Climate maintainability'
		);
		// Console.log(codeclimate_maintain_percent);
		text += make_a_row(codeclimate_maintain_percent);

		const codeclimate_issues = get_badge_text(
			shields,
			`/codeclimate/issues/${user}/${repo}?`,
			url,
			'Code Climate Issues'
		);
		// Console.log(codeclimate_issues);
		text += make_a_row(codeclimate_issues);
	}

	if (config.has('analysis_provider') && config.get('analysis_provider') === 'Codacy') {
		if (config.has('codacy.project_id') && config.get('codacy.project_id') !== '') {
			const codacy_project_id = config.get('codacy.project_id');
			const codacy_grade = get_badge_text(
				shields,
				`/codacy/grade/${codacy_project_id}?`,
				url, 'Codacy Grade'
			);
			// Console.log(codacy_grade);
			text += make_a_row(codacy_grade);
		}
	}

	return text;
};

const issues_badges = (user, repo) => {
	let text = '\n## Issues Badges\n';
	text += table_header;
	const url = `https://github.com/${user}/${repo}`;

	const issue_raw = get_badge_text(
		shields,
		`/github/issues-raw/${user}/${repo}?`,
		url,
		'Github Isuues'
	);
	// Console.log(issues_raw);
	text += make_a_row(issue_raw);

	const issues_closed = get_badge_text(
		shields,
		`/github/issues-closed/${user}/${repo}?`,
		url,
		'Github closed Isuues'
	);
	// Console.log(issues_closed);
	text += make_a_row(issues_closed);

	const pr_raw = get_badge_text(
		shields,
		`/github/issues-pr-raw/${user}/${repo}?`,
		url,
		'Github open PRs'
	);
	// Console.log(pr_raw);
	text += make_a_row(pr_raw);

	const pr_closed = get_badge_text(
		shields,
		`/github/issues-pr-closed/${user}/${repo}?`,
		url,
		'Github closed PRs'
	);
	// Console.log(pr_closed);
	text += make_a_row(pr_closed);

	return text;
};

const analyze_inputs = () => {
	const write_stream = fs.createWriteStream(`${config.get('repo')}-${config.get('style')}.md`);
	write_stream.write('# Autobadge\nThis is an auto-generated file\n');

	const user = config.get('user');
	const repo = config.get('repo');

	write_stream.write(license_badges(user, repo));
	write_stream.write(social_badges(user, repo));
	write_stream.write(size_badges(user, repo));
	write_stream.write(issues_badges(user, repo));
	write_stream.write(analysis_badges(user, repo));
	write_stream.write(activity_badges(user, repo));
	write_stream.write(version_badges(user, repo));
	write_stream.write(ci_cd_badges(user, repo));
	write_stream.write(other_badges(user, repo));

	console.log(`${chalk.green.bold(symbols.success)} ${config.get('repo')}-${config.get('style')}.md Added :)`);
};

const interactive_mode = async () => {
	const user = await qoa.input({
		query: 'Type your Github Username:',
		handle: 'user'
	});
	config.set(user);
	if (!config.has('user') || config.get('user') === '') {
		throw new Error('Empty User Name');
	}

	const repo = await qoa.input({
		query: 'Type Your Repository Name:',
		handle: 'repo'
	});
	config.set(repo);
	if (!config.has('repo') || config.get('repo') === '') {
		throw new Error('Empty repo name');
	}

	const style = await qoa.interactive({
		query: 'Badges style:',
		handle: 'style',
		symbol: '>',
		menu: [
			'flat',
			'flat-square',
			'plastic',
			'social',
			'for-the-badge'
		]
	});
	config.set(style);

	const type = await qoa.interactive({
		query: 'Badges Type:',
		handle: 'type',
		symbol: '>',
		menu: [
			'MarkDown',
			'HTML'
		]
	});
	config.set(type);

	const twitter = await qoa.confirm({
		query: 'Have Twitter Account?',
		handle: 'twitter',
		accept: 'y',
		deny: 'n'
	});
	config.set(twitter);
	if (config.get('twitter') == true) {
		const twitter_id = await qoa.input({
			query: 'Twitter Id:',
			handle: 'id'
		});
		config.set('twitter', twitter_id);
	}

	const ci_cd = await qoa.confirm({
		query: 'Want CI/CD Status?',
		handle: 'ci_cd',
		accept: 'y',
		deny: 'n'
	});
	config.set(ci_cd);

	if (config.get('ci_cd') === true) {
		const ci_cd_provider = await qoa.interactive({
			query: 'Your CI/CD Provider:',
			handle: 'ci_cd_provider',
			symbol: '>',
			menu: [
				'Travis'
			]
		});
		config.set(ci_cd_provider);
	}

	const analysis = await qoa.confirm({
		query: 'Code Analysis Services Added?',
		handle: 'analysis',
		accept: 'y',
		deny: 'n'
	});
	config.set(analysis);

	if (config.has('analysis') && config.get('analysis') === true) {
		const analysis_provider = await qoa.interactive({
			query: 'Your Code Analysis Provider:',
			handle: 'analysis_provider',
			symbol: '>',
			menu: [
				'CodeClimate',
				'Codacy'
			]
		});
		config.set(analysis_provider);
	}

	if (config.has('analysis_provider') && config.get('analysis_provider') === 'Codacy') {
		const project_id = await qoa.secure({
			query: 'Your Codacy Project ID:',
			handle: 'project_id'
		});
		config.set('codacy', project_id);
	}

	const github_workflow = await qoa.confirm({
		query: 'GitHub Workflow Added?',
		handle: 'github',
		accept: 'y',
		deny: 'n'
	});
	config.set(github_workflow);

	if (config.has('github') && config.get('github') === true) {
		const workflow_name = await qoa.input({
			query: 'Type GitHub Workflow name:',
			handle: 'workflow'
		});
		config.set('github', workflow_name);
	}
};

module.exports.make_badges = async () => {
	interactive_mode().then(analyze_inputs);
};
