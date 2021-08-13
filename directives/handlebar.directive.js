const moment = require('moment');

module.exports = {
	teaserText: (text, length) => {
		if (text.length > length) {
			return `${text.substring(0, length)}...`;
		}
		return text;
	},
	isPassed: (date) => {
		return moment(date).isBefore(Date.now());
	},
	isVisible: (course) => {
		let isPassed = moment(course.startDate).isBefore(Date.now());
		return !isPassed || course.forcedVisibility;
	},
	generateDate: (date, format) => {
		return moment(date).format(format);
	},
	ifEq: (a, b, opts) => {
		return a == b ? opts.fn(this) : opts.inverse(this);
	},
	checked: (currentValue) => {
		return currentValue == true ? 'checked' : '';
	},
	select: (selected, options) => {
		return options
			.fn(this)
			.replace(
				new RegExp(' value="' + selected + '"'),
				'$& selected="selected"'
			);
	},
	getStatus: (status) => {
		switch (status) {
			case 'in_progress':
				return 'Folyamatban';
				break;
			case 'approved':
				return 'Jóváhagyva';
				break;
			case 'denied':
				return 'Elutasítva';
				break;

			default:
				break;
		}
	},
	pagination: (options) => {
		let output = '';
		if (options.hash.current === 1) {
			output +=
				'<li class="page-item disabled"><a class="page-link" href="#">Első</a></li>';
		} else {
			output +=
				'<li class="page-item"><a class="page-link" href="?page=1">Első</a></li>';
		}

		for (let index = 1; index <= parseInt(options.hash.pages); index++) {
			if (options.hash.current === index) {
				output += `<li class="page-item disabled"><a class="page-link">${index}</a></li>`;
			} else {
				output += `<li class="page-item"><a class="page-link" href="?page=${index}">${index}</a></li>`;
			}
		}

		if (options.hash.current === options.hash.pages) {
			output +=
				'<li class="page-item disabled"><a class="page-link" href="#">Utolsó</a></li>';
		} else {
			output += `<li class="page-item"><a class="page-link" href="?page=${options.hash.pages}">Utolsó</a></li>`;
		}

		return output;
	},
};
