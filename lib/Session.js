// https://github.com/tejitak/node-line-bot-api/blob/develop/lib/clients/v2/Service.js
// https://github.com/sabinus52/TuyaCloudApi/blob/master/src/Session/Session.php

module.exports = class Session {
    constructor (username, password, country, biztype = null, timeout = 2.0) {
        this.username = username;
        this.password = password;
        this.countryCode = country;
        this.platform = new Platform(biztype);
        this.token = new Token();
        this.tokenPool = new CachePool(Token::CACHE_FILE);
        this.timeout = timeout;
        this.client = this._createClient();
    }

    getToken() {
        this.token = this.tokenPool.fetchFromCache(Token::CACHE_DELAY);

        if ( is_null(this.token) ) {
            // Pas de token sauvegardé sur le FS
            this.token = new Token();
            this._createToken();
        } else {
            // Token sauvegardé trouvé mais vérifie que celui-ci ne soit pas vide et bien un objet Token
            if ( ! this.token instanceof Token || ! this.token.has() ) {
                this.token = new Token();
                this._createToken();
            }
        }

        // Rafrachit le jeton s'il n'est plus valide
        if ( !this.token.isValid() ) {
            this._refreshToken();
        }
        return this.token.get();
    }


    getClient() {
        return this.client;
    }


   _createClient() {
        return new Client(array(
            'base_uri' => this.platform.getBaseUrl(),
            'connect_timeout' => this.timeout,
            'timeout' => this.timeout,
        ));
    }


    _createToken() {
        return requestUtil.post(Object.assign(this._options, {
          url: `${API_BASE}/homeassistant/auth.do`,
          body: pushMessage
        }))
        
        response = this.client.post(new Uri('homeassistant/auth.do'), array(
            'form_params' => array(
                'userName'    => this.username,
                'password'    => this.password,
                'countryCode' => this.countryCode,
                'bizType'     => this.platform.getBizType(),
                'from'        => 'tuya',
            ),
        ));
        //print 'CREATE : '.response.getBody()."\n";
        response = json_decode((string) response.getBody(), true);
        this.checkResponse(response, 'Failed to get a token');

        // Affecte le résultat dans le token et le sauvegarde
        this.token.set(response);
        this.tokenPool.storeInCache(this.token);

        // La valeur du token retoune la region pour indiquer sur quelle plateforme, on doit se connecter
        this.platform.setRegionFromToken(this.token.get());
        // Recréer l'objet du client HTTP pour la nouvelle base URL en fonction de la region
        this.client = this._createClient();
    }


   _refreshToken() {
        response = this.client.get(new Uri('homeassistant/access.do'), array(
            'query' => array(
                'grant_type'    => 'refresh_token',
                'refresh_token' => this.token.getTokenRefresh(),
            ),
        ));
        //print 'REFRESH : '.response.getBody()."\n";
        response = json_decode((string) response.getBody(), true);
        this.checkResponse(response, 'Failed to refresh token');

        // Affecte le résultat dans le token
        this.token.set(response);
        this.tokenPool.storeInCache(this.token);
    }


    checkResponse(response, message = null) {
        if ( empty(response) ) {
            throw new \Exception(message.' : Datas return null');
        }
        if ( isset(response['responseStatus']) && response['responseStatus'] === 'error' ) {
            message = isset(response['errorMsg']) ? response['errorMsg'] : message;
            throw new \Exception(message);
        }
    }


   setFolderStorePool(folder) {
        this.tokenPool.setFolder(folder);
    }

}
