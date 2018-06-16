var APP_ID = 'yd0D1dz3RMdMF3Qp718M2ktF-gzGzoHsz';
var APP_KEY = 'yQtiqnwQ2gnsU8g7xhO97HG8';
var AV = require('leancloud-storage');

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
 
export default { SDK: AV }