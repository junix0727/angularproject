exeApp.directive('ngFinancialPeriod', function () {
    return {
        link: function (scope, element, attrs) {
            scope.periodSelected = null;
            scope.period = {};

            scope.$watch('periodId', function (newValue) {
                if (newValue) {
                    scope.periodId = newValue;

                    getPeriod();
                }
            }, true);

            updatePeriod = function (updateRoot) {
                var status = '(Period is close)';

                scope.nextEnabled = true;
                scope.previousEnabled = true;

                scope.period = scope.periods[scope.periodSelected];

                if (scope.periods[scope.periodSelected + 1] == null) {
                    scope.nextEnabled = false;
                }

                if (scope.periods[scope.periodSelected - 1] == null) {
                    scope.previousEnabled = false;
                }

                if (!scope.period) {
                    scope.nextEnabled = false;

                    return;
                }

                scope.period.PeriodStatus = null;
                scope.period.PeriodDate = null;

                if (scope.period.Status == '0') {
                    status = '(Period is open)';
                }

                scope.period.PeriodDate = '(' + scope.period.StartDate + ' - ' + scope.period.EndDate + ')';
                scope.period.PeriodStatus = status;
                scope.periodId = scope.period.Id;

                if (typeof scope.getPeriod === 'function') {
                    scope.getPeriod(scope.period);
                }
            };

            getPeriod = function () {
                var index = 0;

                angular.forEach(scope.periods, function (period) {
                    if (period.Id == scope.periodId) {
                        scope.periodSelected = index;

                        scope.period.periodIsOpen = scope.period.Status == '0';
                        updatePeriod(false);

                        return;
                    }

                    index++;
                });
            };

            scope.next = function (periodIndex) {
                scope.periodSelected = periodIndex + 1;
                
                updatePeriod(true);

                if (!scope.period.Year || !scope.period.Month)
                    return;

                if (typeof scope.onPeriodChanged === 'function') {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                } else {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                }
            };

            scope.previous = function (periodIndex) {
                scope.periodSelected = periodIndex - 1;

                updatePeriod(true);

                if (!scope.period.Year || !scope.period.Month)
                    return;

                if (typeof scope.onPeriodChanged === 'function') {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                } else {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                }
            };

            getPeriod();

            scope.nextYear = function (periodIndex) {
                if (!scope.period.Year || !scope.period.Month)
                    return;
                var nextYear = scope.period.Year + 1;
                var yearExist = false;
                var defaultPeriod = 0;
                var index = 0;
                angular.forEach(scope.periods, function (period) {
                    if (period.Year == nextYear && period.Month == scope.period.Month) {
                        scope.periodSelected = index;
                        yearExist = true;
                    }
                    if (period.Year == nextYear && defaultPeriod == 0)
                    {
                        defaultPeriod = index;
                    }
                    index++;
                });
                
                if (!yearExist) {
                    scope.periodSelected = defaultPeriod;
                }
                updatePeriod(true);

                if (typeof scope.onPeriodChanged === 'function') {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                } else {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                }
            };

            scope.previousYear = function (periodIndex) {
                if (!scope.period.Year || !scope.period.Month)
                    return;
                var nextYear = scope.period.Year - 1;
                var defaultPeriod = 0;
                var yearExist = false;
                var index = 0;
                angular.forEach(scope.periods, function (period) {
                    if (period.Year == nextYear && period.Month == scope.period.Month) {
                        scope.periodSelected = index;
                        yearExist = true;
                    }
                    if (period.Year == nextYear && defaultPeriod == 0) {
                        defaultPeriod = index;
                    }
                    index++;
                });
                if (!yearExist)
                {
                    scope.periodSelected = defaultPeriod;
                }
                updatePeriod(true);

                if (typeof scope.onPeriodChanged === 'function') {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                } else {
                    scope.onPeriodChanged(scope.period.Year, scope.period.Month, true);
                }
            };
        }
    }
});