// UPYUN Purge endpoint

var request = require('request');
var crypto  = require('crypto');
var moment  = require('moment');

var service  = 'your_service';
var operator = 'your_operator';
var password = 'your_password';

// 待刷新的 url
purge = 'http://beepony.b0.upaiyun.com/test.png' 


// ## 坑出没 ##，必须要加 utc() 不然获取的是电脑上的当前时间，mm 必须小写，不然只返回固定的时间
var gmdate = moment.utc().format("ddd, DD MMM YYYY HH:mm:ss [GMT]");

// var now = moment().format();
// console.log(now);
// console.log(gmdate);

// Array 待传的拉取参数
function getSignature(){
  var data = purge + '&' + service + '&' + gmdate + '&' + md5(password);
  return data;
};

console.log(getSignature());
// MD5 加密，加密 password 和 Content-md5(非必选)
function md5(str) {
  return crypto.createHash('MD5').update(str).digest('hex').toLowerCase();
};

// 发起请求
request({
    uri: "http://purge.upyun.com/purge/",
    method: "POST",
    headers:{
        'Date': gmdate, 
        'User-Agent':'beepony',
        'Authorization': "UpYun " + service + ':' + operator + ":" + md5(getSignature())
    },
    form: 'purge=' + purge
    }, function(error, response, body) {
    console.log(response.statusCode);
    console.log(body);
});
