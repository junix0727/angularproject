exeApp.controller('PopupSendToAccountCtrl', function ($scope, $uibModalInstance, $http, content, isInvoice, isSales) {
    $scope.recipient = content.recipient;
    $scope.carbonCopy = content.carbonCopy;
    $scope.body = '';
    $scope.subject = '';

    var parameters = {
        isInvoice: isInvoice,
        isSales: isSales,
        invoiceId: content.invoiceId
    };

    $http.post('/Views/Sales/SalesInvoiceEdit.aspx/GetEmailTemplate', angular.toJson(parameters))
        .success(function (data, status, headers, config) {
            var result = angular.fromJson(data.d);

            if (result) {
                $scope.body = result.Text;
                $scope.subject = result.Subject;
            }
        });

    $scope.cancel = function () {
        $uibModalInstance.close('cancel');
    };

    $scope.send = function () {
        $scope.action = 'send';
        $scope.performingAction = true;

        var parameters = {
            invoiceId: content.invoiceId,
            email: $scope.recipient,
            cc: $scope.carbonCopy,
            body: $scope.body,
            isInvoice: content.isInvoice,
            isPurchase: !content.isSales,
            subject: $scope.subject
        };

        if (!$scope.carbonCopy) {
            parameters.cc = '';
        }

        return $http.post('/Views/Sales/SalesInvoiceEdit.aspx/SendMailToAccount', angular.toJson(parameters))
            .success(function (data, status, headers, config) {
                var result = angular.fromJson(data.d);
                $scope.performingAction = false;
                if (result.IsError && result.Messages) {
                    GlobalUtils.Notify(result.Messages);
                }
                else {
                    GlobalUtils.Notify(result.Messages);
                    $uibModalInstance.close('sended');
                }                
            })
            .error(function (data, status, headers, config) {
                var result = angular.fromJson(data.d);

                if (result.IsError) {
                    GlobalUtils.Notify(result.Messages);
                }

                $scope.performingAction = false;
            });
    };
});
