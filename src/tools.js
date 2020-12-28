// 时间戳格式化
export function formatTime(val) {
  if (val) {
    let date = new Date(val * 1000);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s
  } else {
    return ""
  }
}
export function formatTimeInstant(val) {
    return val;
}

// 时间格式化
export function formatDate(val, size) {
  if (val) {
    let date = new Date(val);
    let Y, M, D, h, m, s;
    if (size == 'day') {
      Y = date.getFullYear();
      M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
      m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    } else {
      Y = date.getFullYear() + '-';
      M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    }
    if (size) {
      if (size == 'day') {
        return Y + M + D
      } else {
        return Y + M + D + ' ' + h + m + s
      }
    } else {
      return Y + M + D
    }
  } else {
    return ""
  }
}
// 时间转时间戳
export function unixTimes(val) {
  if (val != " 00:00:00" && val != " 23:59:59") {
    let date = new Date(val);
    let time1 = date.getTime() / 1000;
    return time1;
  } else {
    return ""
  }
}
// 时间戳格式化
export function formatTimeCN(val) {
  if (val) {
      let date = new Date(val * 1000);
      let Y = date.getFullYear();
      let M = date.getMonth() + 1;
      let D = date.getDate();
      let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

      let nowDate = new Date();
      let ny = nowDate.getFullYear();
      let nm = nowDate.getMonth() + 1;
      let nd = nowDate.getDate();

      let str = '';

      if (Y == ny && M == nm && (D + 1) == nd) {
          str = '昨天 ' + h + m;
      } else if (Y == ny && M == nm && D == nd) {
          str = '今天 ' + h + m;
      } else {
          Y = Y + '-';
          M = (M < 10 ? '0' + M : M) + '-'
          D = (D < 10 ? '0' + D : D + ' ');
          str = Y + M + D + h + m
      }
      return str
  } else {
      return ''
  }
}
// 空显示
export function unllText(val, type) {
  if (val) {
    return val;
  } else {
    if (val == "0") {
      return val
    } else {
      if (type == 1) {
        return "无"
      } else if (type == 2) {
        return "0"
      } else {
        return "--"
      }
    }
  }
}
// 格式化号码
export function formatNumber(num, startN, space, sign) {
  if (num) {
    let a = num.replace(/\s/g, "");
    let z = a.toString().split("");
    for (let i = startN; i < z.length - 2; i += space) {
      z[i] = z[i] + sign;
    }
    return z.join("");
  }
}

// 去空格
export function lanking(val) {
  if (val) {
    return val.replace(/\s/g, "");
  }
}