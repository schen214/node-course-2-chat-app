// Unix Epoch Time: Jan 1st 1970 00:00:00 AM UTC
const moment = require('moment');
// 'moment()' creates a new moment object that represents the current point in time [ similar to 'moment(new Date())' ]
// var date = moment();
// date.add(1, 'years').subtract(9, 'months');
// // 'format()' specifies patterns to match how you want months, dates, years, time to be displayed (Check out npm moment for patterns)
// console.log(date.format('MMM Do, YYYY'));

// '.valueOf()' returns a timestamp value in milliseconds from Unix Epoch Time similar to new Date().getTime()
var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm A'));
