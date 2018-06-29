function ShowModalDialog(hiddenField, button, callback) {
    if ($("#sys-dialog").length === 0)
        $("<div id='sys-dialog'></div>").appendTo("body");
    $("#sys-dialog").html('<textarea id="sys-dialog-text" rows="10" style="width:312px !important;"></textarea>');
    $("#sys-dialog-text").val($("#" + hiddenField).val());
    $("#sys-dialog").dialog({
        autoOpen: true,
        height: 300,
        width: 350,
        modal: true,
        dialogClass: "lya-modal",
        buttons: {
            "OK": function () {
                $("#" + hiddenField).val($("#sys-dialog-text").val());
                $("#" + button).attr("title", $("#sys-dialog-text").val());
                if ($("#sys-dialog-text").val() !== "")
                    $("#" + button).switchClass("icon-empty-note", "icon-note");
                else
                    $("#" + button).switchClass("icon-note", "icon-empty-note");
                $(this).dialog("close");
                if (typeof callback === 'function') callback();
            },
            Cancel: function () {
                $(this).dialog("close");
            },
            "Timestamp": function () {
                var dt = new Date();
                $("#sys-dialog-text").append(dt.toLocaleString());
            }
        },
        close: function () {
            $("#sys-dialog-text").val("").removeClass("ui-state-error");
        }
    });
}
function SearchBoxKeyDown(event, controlId, type, useTabKey, isfilteron) {

    if ($.inArray(event.keyCode, [38, 40, 13]) > -1) // Up,down,enter
        SearchBoxNavigateContextMenu(event, controlId);
    else if (event.keyCode === 27) // On excape remove context menus
        var contextMenu = $('#' + controlId).nextAll("div.context-menu").remove();
    else if (event.keyCode === 9 && useTabKey) // Tab
    {
        var contextMenu = $('#' + controlId).nextAll("div.context-menu").first();
        
        // Just one child; Trigger click on tab;
        if (contextMenu.children().size() == 1) {
            contextMenu.children().first().trigger("click");
            return;
        }
        var selectedValue = contextMenu.find(".selected");
        if (selectedValue.length != 0)
            selectedValue.trigger("click");
        else
            SearchBoxFind(event, controlId, true, type);
    }
    else if (event.keyCode === 113) // F2
        SearchBoxOpenPage(controlId, type, isfilteron);

}
function SearchBoxNavigateContextMenu(event, controlId){
    event.preventDefault();
    var contextMenu = $('#' + controlId).nextAll("div.context-menu").first();
    //console.log(contextMenu);
    //Handle up key
    if(event.keyCode == 38){
        //console.log("Up");
        //console.log(event);
        var selected = contextMenu.find(".selected");
        var previous = selected.prev("div");
        if (selected.length == 0 || previous.length == 0) {
            contextMenu.find("div").last().addClass("selected");
            if (selected.length != 0)
                selected.removeClass("selected");
        }
        else {
            previous.addClass("selected");
            selected.removeClass("selected");
        }

    }
    //Handle down key
    if (event.keyCode == 40) {
        //console.log("Down");
        //console.log(event);

        var selected = contextMenu.find(".selected");
        var next = selected.next("div");
        //console.log(selected);
        if (selected.length == 0 || next.length == 0) {
            contextMenu.find("div").first().addClass("selected");
            if (selected.length != 0)
                selected.removeClass("selected");
        }
        else {
            next.addClass("selected");
            selected.removeClass("selected");
        }
    }
    //Handle enter
    if (event.keyCode == 13) {
        //console.log("HURRR");
        //console.log(event);
        contextMenu.find(".selected").trigger("click");
    }
}
function SearchBoxFind(event, controlId, setFirst, type, useTabKey) {
    if ($.inArray(event.keyCode, [38, 40, 13, 27]) > -1) return;  // Up,down,enter,escape
    if (event.keyCode === 113) return; // Skip F2
    if (event.keyCode === 9 && !useTabKey) return;
    
    var searchBox = $("#" + controlId);
    var searchBoxLink = $("#" + controlId + "Link");
    var searchBoxLabel = $("#" + controlId + "Label");
    var searchBoxValue = $("#" + controlId + "Value");


    var text = searchBox.val();
    searchBoxLink.removeClass("error");

    $(".context-menu").remove();
    $.ajax({
        type: "POST",
        url: "/Views/Shared/SearchForm.aspx/Find",
        data: "{text: '" + text + "', type: '" + type + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (!setFirst)
                ShowSearchResults(controlId, msg.d);
            else {
                var obj = jQuery.parseJSON(msg.d);
                if (obj !== null && obj.length === 1) {
                    searchBoxValue.val(obj[0]["Id"] + "," + obj[0]["Code"] + "," + obj[0]["Description"]);
                    var descr = obj[0]["Description"];
                    if (descr.length > 40)
                        descr = descr.substring(0, 40) + '...';
                    searchBoxLink.html(descr);
                    searchBoxLabel.html(descr);
                    searchBox.val(obj[0]["Code"]);
                    searchBoxValue.trigger("change");
                }
                else
                    searchBoxLink.html("No data found").addClass("error");
            }
        }
    });
}
function ShowSearchResults(controlId, result) {
    var p = $("#" + controlId).position();
    var style = "left:" + (p.left) + "px; top: " + (p.top + 23) + "px;"
    var divblock = $("<div class=\"context-menu\" style=\"" + style + "\"></div>")
    if (result !== "") {
        var obj = jQuery.parseJSON(result);
        for (var i = 0; i < Math.min(10, obj.length); i++) {
            
            var descr = obj[i]["Description"];
            if (!descr)
                descr = '';
            if (descr != null && descr.length > 40)
                descr = descr.substring(0, 40) + '...';
            var menuItem = $("<div idvalue='" + obj[i]["Id"] + "' code='" + obj[i]["Code"] + "'><span class='key'>" + descr + "</span><span class='value'>(" + obj[i]["Code"] + ")</span></div>");
            divblock.append(menuItem);
        }
    }
    else
        divblock.append("<div>No data found. F2 = Search</div>");
    
    $("#" + controlId).after(divblock);
    if (result !== "")
        $(".context-menu div").click(function () {
            $("#" + controlId + "Value").val($(this).attr("idvalue") + "," + $(this).attr("code") + "," + $(this).children("span.key").html());
            $("#" + controlId + "Link").html($(this).children("span.key").html());
            $("#" + controlId + "Label").html($(this).children("span.key").html());
            $("#" + controlId).val($(this).attr("code"));
            $("#" + controlId + "Value").trigger("change");
            $(".context-menu").remove();
        });
        $(".context-menu div").mouseleave(function () {
            $(this).removeClass("selected");
        });
        $("#" + controlId).blur(function () {
            $(".context-menu").fadeOut(200, function () { $(".context-menu").remove });
        });
    $(".context-menu").mouseleave(function () {
        $(".context-menu").remove();
    });
    $(".context-menu").mouseenter(function () {
        $(".context-menu div").removeClass("selected");
    });
}
function SearchBoxOpenPage(controlId, type, isfilteron) {
    $(".context-menu").remove();
    var key = "";
    if ($("#" + controlId).length !== 0 && isfilteron == 'True')
        key = $("#" + controlId).val();
    ShowDialog('/Views/Shared/SearchForm.aspx?id=' + controlId + '&type=' + type + '&key=' + key, 800, 600, 'no');    
    return false;
}
function ShowDialog(url, width, height, scrolling) {
    var body = $('body');
    var isInFrame = false;
    if (window.parent !== undefined) {
        body = window.parent.$('body');
    }
    if (window.frameElement !== null) {
        isInFrame = true;
        //console.log(window.frameElement.id);
    }
    var i = body.find('.ui-dialog').length;
    body.append('<div id="popup_' + i + '"></div>');
    body.find("#popup_" + i).dialog({
        open: function () {
            $(this).html('<iframe id="dialogIframe_'+ i + '" width="' + width + '" height="' + height + '" src="' + url + '&dialogid=' + i + (isInFrame ? ('&parentFrame='+window.frameElement.id) : '') + ' " scrolling="' + scrolling + '"></iframe>');
        },
        beforeClose: function (e) {
            $(this).empty();
        },
        close: function (e) {
            $(this).remove();
        },
        width: width+25,
        height: height + 45,
        modal: true,
        dialogClass: "lya-modal" ,
        resizable : false       
    });
}
function OnRequiredValidation(s, e) {
        if (e.value === undefined || e.value === null) {
        $("#" + s.name).addClass("error-table");
        e.isValid = false;
    }
    else {
        $("#" + s.name).removeClass("error-table");
        e.isValid = true;
    }
}
var dropZone;
var uploadedFiles = 0;
var filesDropped;

function initDropzone(onfilesDroppedCallBack) {

    // Initializes the dropZone
    dropZone = $('#dropZone');
    dropZone.removeClass('error');

    // Check if window.FileReader exists to make 
    // sure the browser supports file uploads
    if (typeof (window.FileReader) == 'undefined') {
        dropZone.text('Browser Not Supported!');
        dropZone.addClass('error');
        return;
    }

    // Add a nice drag effect
    dropZone[0].ondragover = function () {
        dropZone.addClass('hover');
        return false;
    };

    // Remove the drag effect when stopping our drag
    dropZone[0].ondragend = function () {
        dropZone.removeClass('hover');
        return false;
    };

    // The drop event handles the file sending
    dropZone[0].ondrop = function (event) {
        // Stop the browser from opening the file in the window
        event.preventDefault();

        // Get the file and the file reader
        var files = event.dataTransfer.files;

        // Assign how many files were dropped to a variable
        filesDropped = files.length;

        // Empty the progressZone div
        $('#progressZone').empty();

        // Loop through dropped files
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // Add a div for each file being uploaded
            $('#progressZone').append('<div id="progress' + i + '"></div>');

            // Validate file size
            if (file.size > maxRequestLength) {
                $('#progress' + i).html(' \
                            <div class="fileName">' + trimString(file.name) + '</div> \
                            <div class="barError"></div> \
                            <div class="uploadError">Error: File Too Large!</div>');
                uploadedFiles++;
                continue;
            }
            // Validate pdf file
            type = 'application/pdf';
            if (file.type != type) {
                $('#progress' + i).html(' \
                            <div class="fileName">' + trimString(file.name) + '</div> \
                            <div class="barError"></div> \
                            <div class="uploadError">Error: Only PDF files allowed!</div>');
                uploadedFiles++;
                continue;
            }

            // Report upload in progress
            dropZone.text('Upload In Progress...');

            // Send the file
            uploadFile(file, i);

        }



        // A hack to work around dashboard not resizing properly when a lot of files are added;

        if (typeof onfilesDroppedCallBack == 'function') {
            setTimeout(onfilesDroppedCallBack, 1000);
        }
    };
}
// Upload the file
function uploadFile(file, i) {
    var xhr = new XMLHttpRequest();
    //xhr.upload.addEventListener('progress', uploadProgress, false);
    xhr.upload.addEventListener('progress', function (event) {
        $('#progress' + i).html(' \
                <div class="fileName"> ' + trimString(file.name) + '</div> \
                <div class="barHolder"> \
                    <div id="barFiller' + i + '" class="barFiller" style="width: ' + parseInt(event.loaded / event.total * 100) + '%"></div> \
                </div> \
                <div id="uploadProgress' + i + '" class="uploadProgress">Uploading: ' + parseInt(event.loaded / event.total * 100) + '%</div>');
    }, false);
    xhr.onreadystatechange = function (event) {
        return function () {
            if (event.target.readyState == 4) {
                if (event.target.status == 200 || event.target.status == 304) {
                    $('#uploadProgress' + i).html('Upload Complete.');
                    uploadedFiles++;

                }
                else {
                    $('#barFiller' + i).addClass('barError');
                    $('#uploadProgress' + i).html('Error: XMLHttpRequest Error!');
                    $('#uploadProgress' + i).addClass('uploadError');
                    uploadedFiles++;
                }
                // If all files have been uploaded show drop files here text
                if (uploadedFiles >= filesDropped) {
                    dropZone.removeClass('hover');
                    dropZone.text('Drop Files Here.');
                }
            }
        } (event);
    };
    xhr.open('POST', '/Views/MasterData/DocumentEdit.aspx', true);
    xhr.setRequestHeader('X-FILE-NAME', file.name);
    xhr.send(file);
}
function trimString(sentSting) {
    allowedLength = 27;
    var newString;
    if (sentSting.length > allowedLength) {
        newString = sentSting.substring(0, allowedLength) + '...';
    } else {
        newString = sentSting;
    }
    return newString;
}
function GetOurRefDataForCash(control) {
    var items = $("#" + control.name + "Value").val().split(',');
    // No value
    if (!items[0]) {
        $("#" + control.name).focus(); // focus the control itself
        return
    }
    var idvalue = items[0]; var refvalue = items[1];
    $(".context-menu").remove();
    $.ajax({
        type: "POST",
        url: "/Views/Cash/CashEntry.aspx/GetOurRefData",
        data: "{itemValue: '" + idvalue + "', itemRef: '" + refvalue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var obj = jQuery.parseJSON(msg.d);
            if (obj !== null && obj.length === 1) {
                var invoiceCurrencyId = -1;
                var journalType = -1;
                var exchangeRate = 1.00;
                $.each(obj[0], function (key, value) {
                    if (key == "uxAccount" || key == "uxGLAccount") {
                        $("#" + key + "Value").val(value + "," + obj[0][key + "Code"] + "," + obj[0][key + "Desc"]);
                        $("#" + key + "Link").html(obj[0][key + "Desc"]);
                        $("#" + key + "Label").html(obj[0][key + "Desc"]);
                        $("#" + key).val(obj[0][key + "Code"]);
                        $("#" + key + "Value").trigger("change");
                    }

                    if (key == "Description") {
                        var ctrl = uxLineList.GetEditor(key);
                        ctrl.SetValue(value);
                    }

                    if (key == "AmountBalance") {
                        var ctrl = uxLineList.GetEditor("Amount");
                        ctrl.SetValue(value);
                    }

                    //                    if (key == "InvoiceCurrencyId") {
                    //                        invoiceCurrencyId = value;
                    //                    }
                    if (key == "JournalType") {
                        journalType = value;
                    }
                    //                    if (key == "ExchangeRate") {
                    //                        exchangeRate = value;
                    //                    }
                });
                var ctrl_desc = uxLineList.GetEditor("Description");
                var ctrl_amt = uxLineList.GetEditor("Amount");
                //var ctrl_famt = uxLineList.GetEditor("ForeignAmount");
                //var ctrl_rate = uxLineList.GetEditor("ExchangeRate");

                if (journalType == 0) { //from sales
                    var desc = "";
                    if (ctrl_desc.GetValue() != null)
                        desc = ":" + ctrl_desc.GetValue();
                    ctrl_desc.SetValue("Sales" + desc);
                    //ctrl_famt.SetValue(ctrl_amt.GetValue() / exchangeRate);
                }
                else if (journalType == 1) { //from purchase
                    ctrl_amt.SetValue(ctrl_amt.GetValue() * -1);
                }
                //                if (invoiceCurrencyId > 0) {
                //                    if (invoiceCurrencyId != journalCurrencyId.GetValue()) {
                //                        ctrl_rate.SetValue(exchangeRate);
                //                        if (journalType == 0) { //from sales
                //                            ctrl_famt.SetValue(ctrl_amt.GetValue() / exchangeRate);
                //                        }
                //                        else if (journalType == 1) { //from purchase
                //                            ctrl_amt.SetValue(ctrl_amt.GetValue() * -1);
                //                            //ctrl_amt = ctrl_amt.GetValue() * -1;
                //                            ctrl_famt.SetValue((ctrl_amt.GetValue() / exchangeRate));
                //                        }
                //                    }
                //                    else {
                //                        ctrl_amt.SetValue(ctrl_netamt.GetValue())
                //                    }
                //                }
                //else ctrl_rate.SetValue(exchangeRate);
                //window.focus();
            }
            $("#uxAccount").focus();
        }
    });
}
function GetOurRefDataForBank(control) {
    var data = control.split(',');
    var idvalues = $("#" + data[0] + "Value").val().split(',');

    var items = $("#" + data[0] + "Value").val().split(',');
    // No value
    if (!items[0]) {
        $("#" + data[0]).focus(); // focus the control itself
        return;
    }
    var idvalue = idvalues[0];
    var refvalue = idvalues[1];
    var controltype = data[1];
    var ctrl_docdate = uxLineList.GetEditor("DocumentDate");
    var docdate = (ctrl_docdate.GetValue().getMonth() + 1).toString() + "/" + ctrl_docdate.GetValue().getDate().toString() + "/" + ctrl_docdate.GetValue().getFullYear().toString();
    $(".context-menu").remove();
    $.ajax({
        type: "POST",
        url: "/Views/Banks/BankEntry.aspx/GetOurRefData",
        data: "{itemValue: '" + idvalue + "', itemRef: '" + refvalue + "', date: '" + docdate + "'  }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var obj = jQuery.parseJSON(msg.d);
            if (obj !== null && obj.length === 1) {
                var invoiceCurrencyId = -1;
                var journalType = -1;
                var exchangeRate = 1.00;
                $.each(obj[0], function (key, value) {
                    if (key == "uxAccount" || key == "uxGLAccount") {
                        $("#" + key + "Value").val(value + "," + obj[0][key + "Code"] + "," + obj[0][key + "Desc"]);
                        $("#" + key + "Link").html(obj[0][key + "Desc"]);
                        $("#" + key + "Label").html(obj[0][key + "Desc"]);
                        $("#" + key).val(obj[0][key + "Code"]);
                        $("#" + key + "Value").trigger("change");
                    }

                    if (key == "Description") {
                        var ctrl = uxLineList.GetEditor(key);
                        ctrl.SetValue(value);
                    }

                    if (key == "AmountBalance") {
                        var ctrl = uxLineList.GetEditor("Amount");
                        ctrl.SetValue(value);
                    }

                    if (key == "InvoiceCurrencyId") {
                        invoiceCurrencyId = value;
                    }
                    if (key == "JournalType") {
                        journalType = value;
                    }
                    if (key == "ExchangeRate") {
                        var ctrl = uxLineList.GetEditor(key);
                        ctrl.SetValue(value);
                        exchangeRate = value;
                    }

                    if (key == "uxAccount" || key == "uxGLAccount") {
                        $("#" + key + "Value").val(value + "," + obj[0][key + "Code"] + "," + obj[0][key + "Desc"]);
                        $("#" + key + "Link").html(obj[0][key + "Desc"]);
                        $("#" + key + "Label").html(obj[0][key + "Desc"]);
                        $("#" + key).val(obj[0][key + "Code"]);
                        $("#" + key + "Value").trigger("change");
                    }
                });

               // var ctrl_rate = uxLineList.GetEditor("ExchangeRate");
                var ctrl_amt = uxLineList.GetEditor("Amount");
                var ctrl_desc = uxLineList.GetEditor("Description");
                if (journalType == 0) { //from sales
                    ctrl_desc.SetValue("Sales:" + ctrl_desc.GetValue());
                }
                else if (journalType == 1) { //from purchase
                    ctrl_amt.SetValue(ctrl_amt.GetValue() * -1);
                }
                //                if (invoiceCurrencyId > 0) {
                //                    var ctrl_amt = uxLineList.GetEditor("Amount");
                //                    if (invoiceCurrencyId != journalCurrencyId.GetValue()) {
                //                        ctrl_rate.SetValue(exchangeRate);
                //                        if (journalType == 0) { //from sales
                //                            ctrl_amt.SetValue(ctrl_amt.GetValue() * ctrl_rate.GetValue());
                //                        }
                //                        else if (journalType == 1) { //from purchase
                //                            ctrl_amt.SetValue((ctrl_amt.GetValue() / ctrl_rate.GetValue()) * -1);
                //                        }
                //                    }
                //                }
                //                else ctrl_rate.SetValue(exchangeRate);
                var exchamt = 0;
                var ctrl_exchmt = uxLineList.GetEditor("ExchangeAmount");
                if (ctrl_amt != null) {
                    var ctrl_vatamt = uxLineList.GetEditor("VATAmount");
                    var vatamt = 0;
                    if (ctrl_vatamt != null) {
                        vatamt = ctrl_vatamt.GetValue();
                    }
                    exchamt = (vatamt + ctrl_amt.GetValue()) / exchangeRate;
                }
                ctrl_exchmt.SetValue(exchamt);
            }
        }
    });
}

function OnChangeAmountBank() {
    var ctrl_docdate = uxLineList.GetEditor("DocumentDate");
    var docdate = (ctrl_docdate.GetValue().getMonth() + 1).toString() + "/" + ctrl_docdate.GetValue().getDate().toString() + "/" + ctrl_docdate.GetValue().getFullYear().toString();
    $(".context-menu").remove();
    $.ajax({
        type: "POST",
        url: "/Views/Banks/BankEntry.aspx/GetExchangeRate",
        data: "{date: '" + docdate + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var obj = msg.d;
            if (obj !== null) {
                var ctrl_amt = uxLineList.GetEditor("Amount");
                var exchangeRate = parseFloat(obj);
                var isexchange = chIsExchange.GetChecked();
                var exchamt = 0;
                var ctrl_exchmt = uxLineList.GetEditor("ExchangeAmount");
                var ctrl_exchrate = uxLineList.GetEditor("ExchangeRate");
                if (ctrl_amt != null) {
                    var ctrl_vatamt = uxLineList.GetEditor("VATAmount");
                    var vatamt = 0;
                    if (ctrl_vatamt != null) {
                        vatamt = ctrl_vatamt.GetValue();
                    }
                    if (isexchange == true) {
                        ctrl_exchrate.SetValue(exchangeRate);
                        exchamt = (vatamt + ctrl_amt.GetValue()) / exchangeRate;
                    } else
                        ctrl_exchrate.SetValue(0);
                }
                ctrl_exchmt.SetValue(exchamt);
            }
        }
    });
}
function OnChangeVATWF(items) {
    var control = items.split(',');
    var idvalues = $("#" + control[0] + "Value").val().split(',');
    // No value
    if (!idvalues[0]) {
        $("#" + control[0]).focus(); // focus the control itself
        return;
    }
    var idvalue = idvalues[0];
    $(".context-menu").remove();
    $.ajax({
        type: "POST",
        url: "/Views/MasterData/VATCodeList.aspx/GetVATPercWF",
        data: "{iId: '" + idvalue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var obj = msg.d;
            if (obj !== null) {
                var vatperc = parseFloat(obj);
                var ctrlAmt = uxLineList.GetEditor(control[1]);
                var amt = 0;
                if (ctrlAmt.GetValue() != null) {
                    amt = ctrlAmt.GetValue();
                }
                var net = uxLineList.GetEditor(control[2]);
                if (vatperc != null || vatperc != "") {
                    var totalvatamount = amt * vatperc;
                    net.SetValue(totalvatamount);
                }
            }
            uxLineList.FocusEditor('Percentage');
        }
    });
}
function OnChangeAmountWF() {
    var control = 'uxVatPercentage';
    var idvalues = $("#" + control + "Value").val().split(',');
    // No value
    if (!idvalues[0]) {
        $("#" + control).focus(); // focus the control itself
        return;
    }
    var idvalue = idvalues[0];
    $(".context-menu").remove();
    $.ajax({
        type: "POST",
        url: "/Views/MasterData/VATCodeList.aspx/GetVATPercWF",
        data: "{iId: '" + idvalue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var obj = msg.d;
            if (obj !== null) {
                var amt = uxLineList.GetEditValue("Amount");
                var prc = parseFloat(obj);
//                var isexchange = false;
//                var exchangerate = 0;
//                try {
//                    isexchange = chIsExchange.GetChecked();
//                    exchangerate = uxExchangeRate.GetValue();
//                } catch (e) {

//                }

                uxLineList.SetEditValue("VAT", amt * prc);
                var vat = uxLineList.GetEditValue("VAT");
//                //Compute for foreign amount
//                if (isexchange == true) {
//                    if (exchangerate > 0)
//                        uxLineList.SetEditValue("ForeignAmount", (vat + amt) / exchangerate);
//                }
            }
        }
    });
}
function OnChangeAccount(control) {
    var items = $("#" + control + "Value").val().split(',');
    // No value
    if (!items[0]) {
        $("#" + control).focus(); // focus the control itself
        return
    }
    var idvalue = items[0];
    var refvalue = items[1];
    $(".context-menu").remove();
    $.ajax({
        type: "POST",
        url: "/Views/Banks/BankEntry.aspx/GetAccountData",
        data: "{id: '" + idvalue + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var obj = msg.d;
            if (obj !== null) {
                var value = obj.split(',');
                var ctrl = uxLineList.GetEditor(control[0]);
                try {
//                    $("#uxOutstandingValue").val(value[1] + "," + value[2] + "," + value[3]);
//                    $("#uxOutstanding").val(value[2]);
//                    $("#uxOutstandingValue").trigger("change");
//                    var attrvalue = $("#uxOutstanding").attr("onkeydown");
//                    $("#uxOutstanding").attr("onkeydown", attrvalue.replace("OutStandingItemsbyAccount", "OutStandingItemsbyAccount," + idvalue));
//                    var attrvalue = $("#uxOutstanding").attr("onkeyup");
//                    $("#uxOutstanding").attr("onkeyup", attrvalue.replace("OutStandingItemsbyAccount", "OutStandingItemsbyAccount," + idvalue));
                } catch (e) {
                    //Skip                    
                }
            }
            $("#uxOutstanding").focus();
        }
    });
}
function IsSearchBoxEmpty(value, element) {
    return $('#' + element.id + 'Value').val().split(',')[0] != '';
}
function HideDivSubTitle() {
    $('.fieldgroup .panel-default').each(function (i, divTitle) {
        if ($(divTitle).find('.panel-body').children('div:visible').length === 0)
            $(divTitle).hide();
    });
}
var ListPage = {
    ShowEdit: function (pageName, id) {
        if (id === 0)
            window.location = pageName + ".aspx";
        else
            window.location = pageName + ".aspx?id=" + id;
    },
    ShowPopUpNotification: function (gridview, action) {
        if (gridview.GetSelectedRowCount() < 1)
            popupNotification.Show();
        else
            if (action === 'delete')
                popupDelete.Show();
            else
                gridview.PerformCallback(action);
    },
    HandleCallbackAction: function (gridview, action) {
        if (typeof gridview === 'undefined' && action === 'refresh')
            location.reload();
        else if ($('#form1').valid())
            gridview.PerformCallback(action);
    },
    HideParentWindow: function (gridview, page) {
        if (gridview.cpHideParentWindow) 
            window.location = page;        
        else
            SetButtonsEnabled(true);
    }
};
var EditPage = {
    HandleButtonAction: function (panel, page, action) {
        SetButtonsEnabled(false);
        if (typeof panel === 'undefined' || !panel.GetEnabled())
            window.location = page;
        else if (action === 'Cancel' || ($('#form1').valid() && ASPxClientEdit.AreEditorsValid()))
            panel.PerformCallback(action);
        else SetButtonsEnabled(true);
    },
    HideParentWindow: function (panel, page, dialogid) {
        if ((panel.cpHideParentPopup)) {
            if (dialogid != undefined)
                window.parent.$("#popup_" + dialogid).dialog("close");
            else {
                var dialog = WebUtil.GetParameterByName("dialogid");
                if (dialog)
                    window.parent.$("#popup_" + dialog).dialog("close");
            }
        }  
        else if (panel.cpHideParentWindow)
            window.location = page;
        else
            SetButtonsEnabled(true);            
    }
}
var WebUtil = {
    SetCookie: function (c_name, value, exdays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : ";expires=" + exdate.toUTCString() + "; path=/");
        document.cookie = c_name + "=" + c_value;
    },
    GetCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x === c_name) {
                return unescape(y);
            }
        }
    },
    GetParameterByName: function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    ClosePdfViewer: function () {
        var hasViewerOpen = WebUtil.GetCookie("exe_ViewerHasOpen");
        if (hasViewerOpen != null && hasViewerOpen !== "" && hasViewerOpen === "true")
            WebUtil.SetCookie("exe_ViewerClose", true, 1);
    },
    //Method that uses flefpaper
    //OpenPdfViewer: function (filename, height, width, screenx, screeny) {
    //    var hasViewerOpen = WebUtil.GetCookie("exe_ViewerHasOpen");
    //    if (hasViewerOpen == null || hasViewerOpen === "" || hasViewerOpen === "false") {
    //        var windowinfo = window.open("/Views/Util/FlexPaper/PdfViewer.aspx?Doc=" + filename, "", "width=" + width + ",height=" + height + ",titlebar=no,location=no,menubar=no,status=yes,toolbar=no,scrollbars=yes,resizable=yes");
    //        windowinfo.resizeTo(width, height);
    //        windowinfo.moveTo(screenx, screeny);
    //        WebUtil.SetCookie("exe_ViewerHasOpen", true, 1);
    //        WebUtil.SetCookie("exe_ViewerFileName", filename, 1);
    //    }
    //    else {
    //        WebUtil.SetCookie("exe_ViewerFileName", filename, 1);
    //    }
    //    WebUtil.ResizeWindow(height, width, screenx);
    //},
    //MEthod that use google doc service
    OpenPdfViewer: function (ids, height, width, screenx, screeny) {
        var hasViewerOpen = WebUtil.GetCookie("exe_ViewerHasOpen");
        var idArray = ids.split(';');
        if (hasViewerOpen == null || hasViewerOpen === "" || hasViewerOpen === "false") {
            var windowinfo = window.open("/Views/Util/PdfViewer.aspx?id=" + idArray[0] + "&companyId=" + idArray[1] + (idArray.length > 2 ? "&imgId=" + idArray[2] : ""), "", "width=" + width + ",height=" + height + ",titlebar=no,location=no,menubar=no,status=yes,toolbar=no,scrollbars=yes,resizable=yes");
            //windowinfo.resizeTo(width, height);
            //windowinfo.moveTo(screenx, screeny);
            WebUtil.SetCookie("exe_ViewerHasOpen", true, 1);
            WebUtil.SetCookie("exe_ViewerFileName", ids, 1);
        }
        else {
            WebUtil.SetCookie("exe_ViewerFileName", ids, 1);
        }
        // EXE screen resizes after opening PDF document (https://tracker.exerius.com/issues/11490)
        //WebUtil.ResizeWindow(height, width, screenx);
    },
    OpenPdfViewerDirect: function (filename, height, width, screenx, screeny) {
        var windowinfo = window.open(filename, "", "width=" + width + ",height=" + height + ",titlebar=no,location=no,menubar=no,status=yes,toolbar=no,scrollbars=yes,resizable=yes");
        //windowinfo.resizeTo(width, height);
        //windowinfo.moveTo(screenx, screeny);
    },
    CheckFilePageStatus: function () {
        var hasViewerOpen = WebUtil.GetCookie("exe_ViewerHasOpen");
        if (hasViewerOpen != null && hasViewerOpen !== "" && hasViewerOpen === "true") {
            var checkStatus = WebUtil.GetCookie("exe_CheckViewerStatus");
            if (checkStatus == null || checkStatus === "" || checkStatus === "2")
                WebUtil.SetCookie("exe_CheckViewerStatus", "1", 1);
            else
                WebUtil.SetCookie("exe_ViewerHasOpen", false, 1);
        }
    },
    ResizeWindow: function (height, width, screenx) {
        var mainWidth = window.innerWidth - width - screenx;
        if (screenx > window.innerWidth / 2)
            mainWidth = screenx;
        window.resizeTo(mainWidth, window.outerHeight);
        if (screenx < window.innerWidth / 2)
            screenx = screenx + width;
        else
            screenx = 0;
        window.moveTo(screenx, 0);
    },
}
var GlobalUtils = {
    Notify: function (alerts) {
        if (!alerts)
            return;

        alerts.forEach(function (alert) {
            $.notify(alert.Text, NotifyHelpers.GetOptionsForStyle(alert.Style));
        })
    },
    GetUrlParamsAsJson: function (hashBased) {
        var query;
        if (hashBased) {
            var pos = location.href.indexOf("?");
            if (pos == -1) return [];
            query = location.href.substr(pos + 1);
        } else {
            query = location.search.substr(1);
        }
        var result = {};
        query.split("&").forEach(function (part) {
            if (!part) return;
            var item = part.split("=");
            var key = item[0];
            var from = key.indexOf("[");
            if (from == -1) result[key] = decodeURIComponent(item[1]);
            else {
                var to = key.indexOf("]");
                var index = key.substring(from + 1, to);
                key = key.substring(0, from);
                if (!result[key]) result[key] = [];
                if (!index) result[key].push(item[1]);
                else result[key][index] = item[1];
            }
        });
        return result;
    },
    GetCountry: function () {
        if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
        else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.open("GET", " http://api.hostip.info/get_html.php ", false);
        xmlhttp.send();
        hostipInfo = xmlhttp.responseText.split("n");
        if (hostipInfo.length > 0)
        for (i = 0; hostipInfo.length >= i; i++) {
            if (hostipInfo[i] && hostipInfo[i].indexOf(':') > 0) {
                ipAddress = hostipInfo[i].split(":");
                if (ipAddress[0] == "country_code") return ipAddress[1];
            }
        }
        return false;
    },
    ParseDate: function (date) {
        if (!date) {
            return date;
        }

        var currentDate = new Date;
        var timezone = currentDate.getTimezoneOffset() / 60;
        var operator = (timezone < 0) ? '+' : '-';
        var time = 'T00:00:00';

        if (date instanceof Date) {
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var day = ('0' + date.getDate()).slice(-2);

            date = year + '-' + month + '-' + day;
        }

        return date.substring(0, 10) + time + operator +
            ('0' + Math.abs(timezone)).slice(-2) + ':00';
    }
}


Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}