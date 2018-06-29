exeApp
    .controller('InvoiceHistoryPopupCtrl', function ($scope, $uibModalInstance, $filter, $http, history, labels, NgTableParams) {
        $scope.labels = labels;
        $scope.historyList = history;

        angular.forEach($scope.historyList, function (item) {
            item.sInvoiceDate = $filter('date')(item.InvoiceDate, 'shortDate');
        });

        $scope.dismiss = function () {
            $uibModalInstance.close('cancel');
        }

        $scope.list = new NgTableParams({
            page: 1,
            count: 10,
            sorting: { InvoiceDate: 'desc' }
        }, {
            total: $scope.historyList.length,
            getData: function (params) {
                var filteredData = params.filter() ? $filter('filter')($scope.historyList, params.filter()) : $scope.historyList;
                var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                var customFilter = angular.copy(params.filter());
                for (var propt in customFilter) {
                    if (customFilter[propt] === '' || customFilter[propt] === null) {
                        delete customFilter[propt];
                    }
                }
                orderedData = customFilter ? $filter('filter')(orderedData, customFilter) : orderedData;

                params.total(orderedData.length);
                return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            }
        });

        $scope.openEntry = function (item) {
            angular.forEach($scope.history, function (invoice) {
                invoice.$selected = false;
            });

            item.$selected = true;

            if (item.IsPurchase) {
                var baseUrl = '/Views/Purchase/PurchaseEntry.aspx#/edit/';
                var params = {};

                params.From = window.location.href;
                params.Close = true;

                window.open(baseUrl + item.Id + '?' + $.param(params));
            } else {
                var baseUrl = '/Views/Sales/SalesEntry.aspx';
                var url = baseUrl + '?id=' + item.Id + '&journalid=' + item.fk_journal_id + '&periodid=' + item.fk_periodentry_id + '&close=true';

                window.open(url);
            }
        };

        
        $scope.translate = function (row) {
            row.TranslatedGLAccountDescription = row.GLAccountCodes;

            var apiKey = 'trnsl.1.1.20151203T051244Z.3fc0892b53bf94b8.7f9ef68f31d6f150d2d80598fcdfe4781a64edae';
            var apiLink = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key={key}&text={text}&lang={lang}';

            var languages = [
                { id: 1, code: 'en' },
                { id: 2, code: 'nl' },
                { id: 3, code: 'fr' },
                { id: 4, code: 'de' },
                { id: 5, code: 'lv' },
                { id: 6, code: 'ru' },
                { id: 7, code: 'en' },
            ];

            var language = $filter('equalFilter')(languages, { id: preloadedData.User.LanguageId });

            var url = apiLink.replace('{key}', apiKey)
                .replace('{text}', encodeURI(row.GLAccountCodes))
                .replace('{lang}', 'nl-' + language[0].code);

            $http.post(url).then(function (response) {
                row.TranslatedGLAccountDescription = response.data.text[0];
            });
        };
    });