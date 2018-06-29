exeApp.controller('PopupAddBatchTrackingCtrl', ['$scope', '$uibModalInstance', '$http', '$filter', 'SearchService', function ($scope, $uibModalInstance, $http, $filter, SearchService) {
    $scope.mydata = {};
    $scope.cbjointventures = cbjointventures;
    $scope.cbDossiers = cbDossiers;
    $scope.cbDocTypes = cbDocTypes;
    $scope.iscanreg = 1;
    $scope.chkIsOneDoc = false;
    $scope.cbFirms = cbFirms;
    $scope.batchinfo = '';
    $scope.journals = [];

    var searchService = new SearchService();

    searchService.getPurchaseJournals('').then(function (data) {
        data = $filter('filter')(data, { UseInInvoicing: false });

        $scope.purchaseJournals = data;
    });

    searchService.getSalesJournals('').then(function (data) {
        data = $filter('filter')(data, { UseInInvoicing: false });

        $scope.salesJournals = data;
    });

    searchService.getBankJournals('').then(function (data) {
        $scope.bankJournals = data;
    });

    $scope.docTypeChanged = function (docType) {
        $scope.mydata.fk_journal_id = undefined;
        
        if (docType == 'Purchase') {
            $scope.journalHide = false;
            $scope.journals = $scope.purchaseJournals;
        } else if (docType == 'Sales') {
            $scope.journalHide = false;
            $scope.journals = $scope.salesJournals;
        } else if (docType == 'Banking') {
            $scope.journalHide = false;
            $scope.journals = $scope.bankJournals;
        } else {
            $scope.journalHide = true;
        }

        console.log($scope.journals);
    };

    $scope.Dismiss = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.Add = function () {        
        var parameters = {
            cbjv: "jvname",
            cbdossier: $scope.mydata.cbDossiers,
            cbdoctype: $scope.mydata.cbDocTypes,
            fk_journal_id: $scope.mydata.fk_journal_id == undefined ? '' : $scope.mydata.fk_journal_id,
            iscanreg: $scope.iscanreg,
            bIsOneDoc: $scope.chkIsOneDoc,
            cbFirms: $scope.mydata.cbFirms == undefined ? "" : $scope.mydata.cbFirms,
            description: $scope.batchinfo,
        };
        $uibModalInstance.close(parameters);
    };


} ]);