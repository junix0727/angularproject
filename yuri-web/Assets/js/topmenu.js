var topmenu = {
    onCompanyChanged: function (companyId, url) {
        if (!companyId) {
            return;
        }

        var parameters = {
            action: 'changeCompany',
            id: companyId
        };

        $.ajax({
            type: 'POST',
            global: false,
            url: '/Handlers/MenuHandler.ashx',
            data: parameters,
            dataType: 'html',
            cache: false,
            success: function (result) {
                window.location = url || homePage;
            },
            error: function (result) {
                alert('ERROR ' + result.status + ' ' + result.statusText);
            }
        });
    }
};
