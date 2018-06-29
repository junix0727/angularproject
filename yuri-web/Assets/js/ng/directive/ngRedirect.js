exeApp.directive('ngRedirect', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs) {
            var unregister = scope.$watch(attrs.ngRedirect, function (value) {
                var ngModel = $parse(attrs.ngModel);
                var data = attrs.ngModel.split('.');

                if (value === undefined) {
                    return;
                }

                if (value != null) {
                    window.open(value);
                }
            });
        }
    };
}]);