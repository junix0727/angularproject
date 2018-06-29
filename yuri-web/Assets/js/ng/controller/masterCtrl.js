exeApp.controller('MasterCtrl', ['$http', '$scope', 'SearchService', function ($http, $scope, SearchService) {
    $scope.company = company;
    $scope.homePage = homePage;
    $scope.user = user;
    $scope.updateStatus = updateStatus;

    var searchService = new SearchService;

    $scope.getCompanyList = function (text) {
        searchService.getAllCompanies(text).then(function (data) {
            $scope.companies = data;
        });
    };

    $scope.getLinkStatus = function () {
        if ($scope.updateStatus.status == 1) {
            return 'https://heartbeat.exerius.com';
        }
        else {
            return '';
        }
    };

    searchService.getCompanyById(parseInt(company.Id)).then(function (data) {
        if (Object.prototype.toString.call($scope.companies) === '[object Array]') {
            $scope.companies = $scope.companies.concat(data);
        } else {
            $scope.companies = data;
        }
    });

    $scope.getCompanyList('');

    $scope.change = function () {
        topmenu.onCompanyChanged(company.Id);
    };


    function blinker() {
        $('.update-inprogress').fadeOut(500);
        $('.update-inprogress').fadeIn(500);
    }

    setInterval(blinker, 1000);
}]);