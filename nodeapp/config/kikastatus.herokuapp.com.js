
exports.dbtag = "kikastatustest";
exports.baseUrl = 'http://kikastatus.herokuapp.com';
//exports.baseUrl: 'http://localhost:8080',

// Twitter consumer key and secret

// status updates should be made with this UID
// 2cmk UID
exports.twitterPostUID = '4f95c7f3185c8a01000000dd';
// local UID
//exports.twitterPostUID = '4f8cb46499663ffd15000001';

// Admin users. user.id: value. User ids can be seen in status request.
exports.admins = {
    '4f95c7f3185c8a01000000dd':true,
    '4f8cb46499663ffd15000001':true,
    '4f8c92908eb7200100000006':true
}