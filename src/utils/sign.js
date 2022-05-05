// 验签 开始 ---------------------

/**
 * 是否是表情符号
 */
function isEmojiCharacter(codePoint) {
  return (
    codePoint == 0x0 ||
    codePoint == 0x9 ||
    codePoint == 0xa ||
    codePoint == 0xd ||
    (codePoint >= 0x20 && codePoint <= 0xd7ff) ||
    (codePoint >= 0xe000 && codePoint <= 0xfffd) ||
    (codePoint >= 0x10000 && codePoint <= 0x10ffff)
  );
}

/**
 * 过滤emoji 或者 其他非文字类型的字符
 *
 * @param source
 * @return
 */
function filterEmoji(source) {
  if (source == null || source.length == 0) {
    return source;
  }
  let buf = null;
  const len = source.length;
  for (let i = 0; i < len; i++) {
    const codePoint = source.charCodeAt(i);
    if (isEmojiCharacter(codePoint)) {
      if (buf == null) {
        buf = "";
      }
      buf += String.fromCharCode(codePoint);
    }
  }
  if (buf == null) {
    return source;
  } else if (buf.length == len) {
    buf = null;
    return source;
  } else {
    return buf;
  }
}

/**
 * 数据按ascii码排序
 * @param obj
 */
function sort_ASCII(obj) {
  const arr = new Array();
  let num = 0;
  for (var i in obj) {
    arr[num] = i;
    num++;
  }
  const sortArr = arr.sort();
  const sortObj = {};
  for (var i in sortArr) {
    if (obj[sortArr[i]] == "{}") {
      sortObj[sortArr[i]] = "";
    } else {
      sortObj[sortArr[i]] = obj[sortArr[i]];
    }
  }
  return sortObj;
}

/**
 * 获取from字符串（已排序）
 * @param sortData
 * @returns {string}
 */
function getFormStr(sortData) {
  let sb = "";
  for (const k in sortData) {
    // 空值不传递，不参与签名组串
    const v = sortData[k];
    if (v != null && v !== "") {
      sb = `${sb + k}=${v}`;
      sb += "&";
    }
  }
  if (sb.length > 0) {
    sb = sb.substring(0, sb.length - 1);
  }
  return sb;
}

/**
 * 获取随机数
 * @returns {string}
 */
function createRandomId() {
  // 旧的
  // return (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
  // 新的 - 谭成要求更换的 - 2020/08/17
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); // use high-precision timer if available
  }
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return "";
      return `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`;
    })
  ).join("&");
}

function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * 创建签名
 * @param sortData
 * @param sysCode
 * @param secret
 * @returns {string}
 */
function createSign(sortData, sysCode, secret) {
  sortData = sort_ASCII(sortData);
  let sb = "";

  for (const k in sortData) {
    // 空值不传递，不参与签名组串
    const v = sortData[k];
    if (v != null && v !== "") {
      sb = `${sb + k}=${v}&`;
    }
  }
  sb = `${sb}sysCode=${sysCode}`;
  sb = `${sb}&secret=${secret}`;
  // 过滤表情
  // 老方法
  // sb = sb.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '');
  // 新的
  // 2019-11-14 添加去除emoji表情再验签,必须在请求header中加入("replaceEmoji": "true")
  sb = filterEmoji(sb);
  // MD5加密,结果转换为大写字符
  const sign = md5(sb).toUpperCase();
  return sign;
}

/**
 * 处理验签
 * param: {
 *   method: 请求类型, 大小写无所谓
 *   rawData: 需要验签的数据, json类型
 *   token: 用户token
 *   sysCode: 平台sysCode
 *   secret: sysCode对应的密钥
 *   reqClient: 请求头中的X-Req-Client
 *   deviceType: 请求头中的X-Device-Type
 *   deviceCode: 请求头中的X-Device-Code
 *   contentType: 请求头中的Content-Type, 此字段建议别传, 暴露出来只是为了满足一些特殊场景的需求
 * }
 */
function handleSign({
  method = "GET",
  rawData = {},
  token = "",
  sysCode = "",
  secret = "",
  reqClient = "",
  deviceType = "",
  deviceCode = "",
  contentType = "",
}) {
  // 获取当前时间
  const time = new Date().getTime();
  // 获取随机数
  const nonce = createRandomId();

  let data;

  if (method.toUpperCase() === "GET") {
    // 以前的
    // data = param(rawData)
    // 现在的
    data = getFormStr(sort_ASCII(rawData));
  } else {
    if (contentType === "application/x-www-form-urlencoded") {
      data = getFormStr(sort_ASCII(rawData));
    } else if (contentType === "" || contentType === "application/json") {
      data = JSON.stringify(rawData);
    } else {
      return {
        err: "post请求Content-Type只支持application/json或者application/x-www-form-urlencoded",
      };
    }
  }

  const sortData = {
    nonce,
    time,
    data,
  };

  // 验签
  const sign = createSign(sortData, sysCode, secret);

  contentType =
    contentType && contentType.trim().length > 0
      ? contentType
      : method.toUpperCase() === "POST"
      ? "application/json"
      : "";

  // 添加验签
  const headers = {
    nonce,
    sign,
    time,
    "X-Auth-Token": token,
    sysCode,
    "X-Req-Client": reqClient,
    "X-Device-Type": deviceType,
    "X-Device-Code": deviceCode,
    "Content-Type": contentType,
    // 去除emoji表情再验签
    replaceEmoji: true,
  };
  return headers;
}

// 验签 结束 ---------------------

// md5 开始 ---------------------

function md5(md5str) {
  const createMD5String = function (string) {
    let x = Array();
    let k;
    let AA;
    let BB;
    let CC;
    let DD;
    let a;
    let b;
    let c;
    let d;
    const S11 = 7;
    const S12 = 12;
    const S13 = 17;
    const S14 = 22;
    const S21 = 5;
    const S22 = 9;
    const S23 = 14;
    const S24 = 20;
    const S31 = 4;
    const S32 = 11;
    const S33 = 16;
    const S34 = 23;
    const S41 = 6;
    const S42 = 10;
    const S43 = 15;
    const S44 = 21;
    string = uTF8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301;
    b = 0xefcdab89;
    c = 0x98badcfe;
    d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
      AA = a;
      BB = b;
      CC = c;
      DD = d;
      a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
      d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
      c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
      b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
      a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
      d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
      c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
      b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
      a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
      d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
      c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
      b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
      a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
      d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
      c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
      b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
      a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
      d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
      c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
      b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
      a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
      d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
      c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
      b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
      a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
      d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
      c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
      b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
      a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
      d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
      c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
      b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
      a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
      d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
      c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
      b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
      a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
      d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
      c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
      b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
      a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
      d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
      c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
      b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
      a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
      d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
      c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
      b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
      a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
      d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
      c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
      b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
      a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
      d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
      c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
      b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
      a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
      d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
      c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
      b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
      a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
      d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
      c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
      b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
      a = addUnsigned(a, AA);
      b = addUnsigned(b, BB);
      c = addUnsigned(c, CC);
      d = addUnsigned(d, DD);
    }
    const tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return tempValue.toLowerCase();
  };
  const rotateLeft = function (lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };
  var addUnsigned = function (lX, lY) {
    let lX4;
    let lY4;
    let lX8;
    let lY8;
    let lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      else return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  };
  const F = function (x, y, z) {
    return (x & y) | (~x & z);
  };
  const G = function (x, y, z) {
    return (x & z) | (y & ~z);
  };
  const H = function (x, y, z) {
    return x ^ y ^ z;
  };
  const I = function (x, y, z) {
    return y ^ (x | ~z);
  };
  var FF = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var GG = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var HH = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var II = function (a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };
  var convertToWordArray = function (string) {
    let lWordCount;
    const lMessageLength = string.length;
    const lNumberOfWordsTempOne = lMessageLength + 8;
    const lNumberOfWordsTempTwo =
      (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] |
        (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };
  var wordToHex = function (lValue) {
    let WordToHexValue = "";
    let WordToHexValueTemp = "";
    let lByte;
    let lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValueTemp = `0${lByte.toString(16)}`;
      WordToHexValue += WordToHexValueTemp.substr(
        WordToHexValueTemp.length - 2,
        2
      );
    }
    return WordToHexValue;
  };
  var uTF8Encode = function (string) {
    string = string.toString().replace(/\x0d\x0a/g, "\x0a");
    let output = "";
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n);
      if (c < 128) {
        output += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        output += String.fromCharCode((c >> 6) | 192);
        output += String.fromCharCode((c & 63) | 128);
      } else {
        output += String.fromCharCode((c >> 12) | 224);
        output += String.fromCharCode(((c >> 6) & 63) | 128);
        output += String.fromCharCode((c & 63) | 128);
      }
    }
    return output;
  };
  return createMD5String(md5str);
}

export default handleSign;
