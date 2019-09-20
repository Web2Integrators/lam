// import * as moment from 'moment';

// import { xr } from './regex-utils';

// const monthList = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];
// const monthName: RegExp = RegExp(monthList.join('|'));
// const monthNumber: RegExp = xr`
//   0?[1-9]       # 1-9 or 01-09
//   |             # or
//   1[0-2]        # 10-12
// `;
// const dayNumber: RegExp = xr`
//   0?[1-9]       # 1-9 or 01-09
//   |             # or
//   [1-2][0-9]    # 10-29
//   |             # or
//   3[0-1]        # 30-31
// `;
// const year: RegExp = /\d{4}/;
// const hours12: RegExp = xr`
//   0?[1-9]       # 1-9 or 01-09
//   |             # or
//   1[0-2]        # 10-12
// `;
// const verboseMinutes: RegExp = /[0-5][0-9]/; // 00-59
// const verboseSeconds: RegExp = /[0-5][0-9]/; // 00-59
// // note that slim format hours, minutes, seconds can all be single digits
// const hours24: RegExp = xr`
//   0?[1-9]       # 1-9 or 01-09
//   |             # or
//   1[0-9]        # 10-19
//   |             # or
//   2[0-4]        # 20-24
// `;
// const slimMinutes: RegExp = xr`
//   0?[0-9]       # 1-9 or 01-09
//   |             # or
//   [1-5][0-9]    # 10-59
// `;
// const slimSeconds: RegExp = xr`
//   0?[0-9]       # 1-9 or 01-09
//   |             # or
//   [1-5][0-9]    # 10-59
// `;

// const verboseDate: RegExp = xr`${monthName} \s+ ${dayNumber} , \s+ ${year}`;
// const verboseTime: RegExp = xr`
//   ${hours12} : ${verboseMinutes} : ${verboseSeconds} \s+ (?:am|pm)
//   \s+
//   \d{1,3} \s+ Milliseconds
// `;

// const slimDate: RegExp = xr`${monthNumber} / ${dayNumber} / ${year}`;
// const slimTime: RegExp = xr`${hours24} : ${slimMinutes} : ${slimSeconds}`;

// // "March 15, 2018   11:12:36 am   431 Milliseconds "
// const verboseFormat = xr`^ ${verboseDate} \s+ ${verboseTime} \s* $`;
// // "7/20/2017  20:38:7"
// const slimFormat = xr`^ ${slimDate} \s+ ${slimTime} $`;

// /**
//  * Parse dates out of strings from the server. We know of two date formats so far.
//  *
//  * @param input a string that is supposed to represent a date
//  */
// export function parsePdeDate(input: string): Date | undefined {
//   if (input.match(verboseFormat)) {
//     return moment(input, 'MMMM D, YYYY hh:mm:ss a').toDate();
//   } else if (input.match(slimFormat)) {
//     return moment(input, 'M/D/YYYY H:m:s').toDate();
//   }
//   return undefined;
// }
