(function (angular) {
    'use strict';
    exeApp.controller('SearchBoxController', ['$scope', '$http', function ($scope, $http) {

        $scope.init = function (selectedItem, options) {
            $scope.SelectedItem = selectedItem;
            $scope.Options = options;
        };
        $scope.onSelect = function ($item, $model, $label) {
            $scope.SelectedItem = $item;
            var inputValue = $('#' + $scope.Options.ClientID + 'Value');
            inputValue.val($scope.SelectedItem.Id + ',' + $scope.SelectedItem.Code + ',' + $scope.SelectedItem.Description);
            inputValue.trigger("change");
        };
        $scope.getValues = function (val) {
            return $http.get('/Handlers/SearchHandler.ashx', {
                params: {
                    query: val,
                    type: $scope.Options.Type
                }
            }).then(function ($response) {
                var output = [];

                $response.data.forEach(function (item) {
                    output.push(item);
                });
                return output;
            });
        };


    }]);
    exeApp.filter('default', [function () {
        return function (value, def) {
            return value || def;
        };
    }]);


})(window.angular);