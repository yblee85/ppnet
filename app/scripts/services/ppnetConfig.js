'use strict';

angular.module('ppnetApp')
  .factory('ppnetConfig', function($http, $q, ppSyncService, ppnetUser) {
    var config, configuration;
    //localStorage.removeItem('ppnetConfig');
    function loadConfigFromLocalStorage() {
      configuration = JSON.parse(localStorage.getItem('ppnetConfig'));
      return configuration;
    }

    function saveConfigtoLocalStorage(config) {
      localStorage.setItem('ppnetConfig', JSON.stringify(config));
    }

    function init(config) {
      /* SET CONFIG TO POUCHDB BEFORE INIT() */
      ppSyncService.setDB(config).then(function() {
        ppSyncService.init();
        if (!ppnetUser.isLogedIn()) {
          // and redirect to login view if not
          window.location = '#/login';
        } else {
          window.location = '#/';
        }
      });
    }

    return {
      init: function(config) {
        if (!config) {
          return init(loadConfigFromLocalStorage());
        } else {
          init(config);
          saveConfigtoLocalStorage(config);
        }

      },
      existingConfig: function() {
        config = loadConfigFromLocalStorage();
        return (config) ? true : false;
      },
      loadConfig: function() {
        return loadConfigFromLocalStorage();
      },
      loadConfigFromExternal: function() {
        var deferred = $q.defer();
        $http.get('config.json').then(function(res) {
          deferred.resolve(res);
          deferred.reject(res);
          deferred.notify(res);
        });
        return deferred.promise;
      },
      saveConfig: function(config) {
        saveConfigtoLocalStorage(config);
      },


      getMapviewMapID: function() {
        return config.mapview.mapid;
      },
      getMapviewAccessToken: function() {
        return config.mapview.accesstoken;
      },
      getMapviewDefaultLatitude: function() {
        return config.mapview.defaultLatitude;
      },
      getMapviewDefaultLongitude: function() {
        return config.mapview.defaultLongitude;
      },
      getMapviewDefaultZoom: function() {
        return config.mapview.defaultZoom;
      }
    };
  });