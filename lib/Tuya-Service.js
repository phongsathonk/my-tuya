'use strict'
const requestUtil = require('../../utils/requestUtil')

const API_BASE = 'https://api.line.me/v2'
const API_BASE_DATA = 'https://api-data.line.me/v2'

module.exports = class TuyaCloud {

  constructor (options) {
    this._options = options || {}
  }
  
  getSession() {
    return this->session;
  }
  
  checkConnection() {
    $token = $this->session->getToken();
    return ( $token ) ? true : false;
  }
  
  discoverDevices() {
    $reqDiscovery = new DiscoveryRequest($this->session);
    $result = $reqDiscovery->request();
    $this->devices = $reqDiscovery->fetchDevices();
    return $result;
  }

  getAllDevices() {
    if ( empty($this->devices) ) $this->discoverDevices();
    return $this->devices;
  }

  getDeviceById(id) {
     if ( empty($this->devices) ) $this->discoverDevices();
        foreach ($this->devices as $device) {
            if ($device && $device->getId() == $id)
                return $device;
        }
        return null;
    }
  
  /**
   * replyMessage
   * @param {Object} replyMessage
   */

   replyMessage (replyMessage) {
    return requestUtil.post(Object.assign(this._options, {
      url: `${API_BASE}/bot/message/reply`,
      body: replyMessage
    }))
   }

  /**
   * pushMessage
   * @param {Object} pushMessage
   */

   pushMessage (pushMessage) {
    return requestUtil.post(Object.assign(this._options, {
      url: `${API_BASE}/bot/message/push`,
      body: pushMessage
    }))
   }
  
  /**
   * multicast
   * @param {Object} message
   */

    multicast (message) {
     return requestUtil.post(Object.assign(this._options, {
       url: `${API_BASE}/bot/message/multicast`,
       body: message
     }))
    }

  /**
   * getMessageContent
   * @param {String} messageId
   */

   getMessageContent (messageId) {
    return requestUtil.get(Object.assign(this._options, {
      url: `${API_BASE_DATA}/bot/message/${messageId}/content`
    }))
  }

  /**
   * getProfile
   * @param {String} userId
   */

   getProfile (userId) {
    return requestUtil.get(Object.assign(this._options, {
      url: `${API_BASE}/bot/profile/${userId}`
    }))
   }

  /**
   * leaveGroup
   * @param {String} groupId
   */

   leaveGroup (groupId) {
    return requestUtil.post(Object.assign(this._options, {
      url: `${API_BASE}/bot/group/${groupId}/leave`
    }))
   }

  /**
   * leaveRoom
   * @param {String} roomId
   */

   leaveRoom (roomId) {
    return requestUtil.post(Object.assign(this._options, {
      url: `${API_BASE}/bot/room/${roomId}/leave`
    }))
   }
}
