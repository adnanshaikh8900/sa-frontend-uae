const Mailgun = require('mailgun-js');
const humanizeDuration = require('humanize-duration');
const config = require('./config.json');

const mailgun = Mailgun({
	apiKey: config.MAILGUN_API_KEY,
	domain: config.MAILGUN_DOMAIN,
});

// subscribeMailgun is the main function called by Cloud Functions.
module.exports.subscribeMailgun = (pubSubEvent, context) => {
	const build = eventToBuild(pubSubEvent.data);

	// Skip if the current status is not in the status list.
	const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
	//if (status.indexOf(build.status) === -1) {
		//return;
	//}

	// Send email.
	const message = createEmail(build);
	mailgun.messages().send(message, (error, body) => console.log(body.message));
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
	return JSON.parse(Buffer.from(data, 'base64').toString());
}

// createEmail creates an email message from a build object.
const createEmail = (build) => {
	const duration = humanizeDuration(new Date(build.finishTime) - new Date(build.startTime));
	const msgText = `Build ${build.id} finished with status ${build.status}, in ${duration}.`;
	let msgHtml = `<p>${msgText}</p><p><a href="${build.logUrl}">Build logs</a></p>`;
	if (build.images) {
		const images = build.images.join(',');
		msgHtml += `<p>Images: ${images}</p>`;
	}
	const message = {
		from: config.MAILGUN_FROM,
		to: config.MAILGUN_TO,
		subject: `Build ${build.id} finished`,
		text: msgText,
		html: msgHtml
	};
	return message;
}
