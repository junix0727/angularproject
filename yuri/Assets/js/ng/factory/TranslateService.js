angular.module('exeApp')
    .factory('TranslateService', function ($http) {
        translate = function (items, languageId) {
            return $http.get('/Handlers/TranslateHandler.ashx', {
                params: {
                    items: items,
                    languageId: languageId
                }
            })
            .then(function ($response) {
                return $response.data;
            });
        };

        return function () {
            this.translate = function (items, languageId) {
                return translate(angular.toJson(items), languageId);
            };
        };
    });
