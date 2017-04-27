
//UPYUN compress endpoint

var request = require('request');
var crypto  = require('crypto');
var moment  = require('moment');

var service  = 'your_service';
var operator = 'your_operator';
var password = 'your_password';

// 使用 moment.js 格式化 GMT date
var gmdate = moment().format("ddd, DD MMM YYYY HH:MM:ss [GMT]");

// MD5 加密，加密 password 和 Content-md5(非必选)
function md5(str) {
  return crypto.createHash('MD5').update(str).digest('hex').toLowerCase();
};

// Base64，先把 Array 转化成 Json 格式，再 Base64
function base64(str){
  return new Buffer(JSON.stringify(str)).toString('base64');
};

// SHA1 加密签名前的参数组
function sha1(key, data){
  return crypto.createHmac('sha1', md5(key))
                    .update(data)
                    .digest('base64');
};

// Array 待传的拉取参数
function getSignature(gmdate){
  var date = 'POST' + '&' + '/pretreatment/' + '&' + gmdate;
  return date;
};

// 异步拉去 POST 请求的参数，url 和 save_as 为必选
var params = [{
    'sources':['/test.jpg','jump.jpg'],
    'save_as': '/testnode.zip'
}];


// POST body 信息
var form_data = {
    service: service,
    notify_url: 'https://uptool.tingfun.net/echo.php',
    app_name: 'compress',
    tasks: base64(params)
};

// 发起请求
request({
    uri: "http://p0.api.upyun.com/pretreatment/",
    method: "POST",
    headers:{
        'Date':gmdate, 
        'User-Agent':'beepony',
        'Authorization': "UPYUN " + operator + ":" + sha1(password, getSignature(gmdate))
    },
    form: form_data
    }, function(error, response, body) {
    console.log(response.statusCode);
    console.log(body);
});


