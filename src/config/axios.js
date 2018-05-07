module.exports = {
    "baseURL"    : "https://some-domain.com/api/", //change this to Beeline API URL
    "timeout"    : 1000,
    "headers"    : {'x-access-token': 'foobar'}, //chane this to real headers later
    "auth"       : {
        username: 'janedoe',
        password: 's00pers3cret'
      },
    "smthGET"    : "/foo",
    "smthPOST"   : "/bar", //change them to real ones
    "smthPUT"    : "/foo",
    "smthDELETE" : "/bar",
}