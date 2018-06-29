angular.module('exeApp')
    .factory('RequestDataService', ['$http', function ($http) {
        getValue = function (page, type, isFromModel) {
            return $http.get('/Handlers/RequestDataHandler.ashx', {
                params: {
                    page: page,
                    type: type,
                    isFromModel: isFromModel
                }
            })
            .then(function ($response) {
                return $response.data;
            });
        };

        return function () {
            this.getNewAccount = function () {
                return getValue('Account', 'NewId', true);
            };

            this.getNewGLAccount = function () {
                return getValue('GLAccount', 'NewId', true);
            };

            this.getNewPaymentCondition = function () {
                return getValue('PaymentCondition', 'NewId', true);
            };

            this.getNewItem = function () {
                return getValue('Item', 'NewId', true);
            };

            this.getNewBank = function () {
                return getValue('Bank', 'NewId', true);
            };
        };
    }]);
