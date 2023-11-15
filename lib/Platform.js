'use strict'
const BASE_URL_FORMAT = 'https://px1.tuya{0}.com';
const TUYA = 'tuya';
const SMART_LIFE = 'smart_life';
  
module.exports = class Platform {
  
  constructor (biztype, region = 'eu') {
    this.biztype = biztype ? biztype : TUYA;
    this.region = region;
  }
  
  getBizType() {
    return this.biztype;
  }
  
  getBaseUrl() {
    return encodeURIComponent(BASE_URL_FORMAT.format(this.region));
  }
  
  setRegionFromToken(token) {
    var prefix = substr(token, 0, 2);
    this.region = '';
    switch (prefix) {
      case 'AY' : this.region = 'cn'; break;
      case 'EU' : this.region = 'eu'; break;
      case 'US' : this.region = 'us'; break;
      default   : this.region = 'us'; break;
    }
  }

}
