const nameValid = /^[a-zA-Z0-9]{0,20}$/i;
const passwordValid = /^[a-z0-9_*-]{4,20}$/i;
const phoneValid = /^\+38[0-9]{10}$/i;
const titleValid = /^[a-zA-Z0-9_][a-zA-Z0-9_ ]{0,20}$/i;
const descriptionValid = /^[a-zA-Z0-9_][a-zA-Z0-9_ ]{0,100}$/i;

module.exports  = {
	nameValid,
	passwordValid,
	phoneValid,
	titleValid,
	descriptionValid,
};