exeApp.directive('ngConfirmOnExit', function () {
    return {
        link: function (scope, elem, attrs) {
            $(window).bind('beforeunload', function (event) {
                scope.checkChanges();
                if (scope.hasChanges && (((typeof scope.action == 'undefined') || !scope.action) || scope.action == 'cancel')) {
                    scope.$apply(function () {
                        scope.performingAction = false;
                    });

                    return 'You\'ve made changes.';
                }
            });

            scope.linesToCompare = angular.copy(scope[attrs.linesToWatch]);
            scope.toCompare = angular.copy(scope[attrs.ngConfirmOnExit]);
            scope.periodToCompare = angular.copy(scope.period);
            
            scope.checkChanges = function () {
                scope.hasChanges = false;
                angular.forEach(scope[attrs.ngConfirmOnExit], function (value, key) {
                    if (value != '' && value != scope.toCompare[key]) {
                        if (scope.needsParsing[key]) {
                            if (scope.needsParsing[key] == 1) {
                                var oldDate = scope.toCompare[key].toLocaleDateString();
                                var newDate = value.toLocaleDateString();
                                if (oldDate != newDate) {
                                    scope.hasChanges = true;

                                    return;
                                }
                            }
                        } else {
                            scope.hasChanges = true;

                            return;
                        }
                    }
                });

                if (scope[attrs.linesToWatch].length == scope.linesToCompare.length) {
                    var index = 0;
                    angular.forEach(scope[attrs.linesToWatch], function (row) {
                        angular.forEach(row, function (value, key) {
                            if (needToSkip.indexOf(key) == -1) {
                                if (value != '' && value != scope.linesToCompare[index][key]) {
                                    if (scope.needsParsing[key]) {
                                        if (scope.needsParsing[key] == 1) {
                                            var oldDate = scope.linesToCompare[index][key].toLocaleDateString();
                                            var newDate = value.toLocaleDateString();
                                            if (oldDate != newDate) {
                                                scope.hasChanges = true;

                                                return;
                                            }
                                        }
                                    } else {
                                        scope.hasChanges = true;

                                        return;
                                    }
                                }
                            }
                        });

                        index++;
                    });
                } else {
                    scope.hasChanges = true;
                }

                angular.forEach(scope.period, function (value, key) {
                    if (value != '' && value != scope.periodToCompare[key]) {
                        scope.hasChanges = true;

                        return;
                    }
                });

            };

            var needToSkip = [
                '$$hashKey',
                'WriteOffCode'
            ];

        }
    };
});