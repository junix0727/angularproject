function CreateClass(parentClass, properties) {
    var result = function() { 
        if(result.preparing)
            return delete(result.preparing);
        if(result.ctor)
            result.ctor.apply(this);
    };

    result.prototype = { };
    if(parentClass) {
        parentClass.preparing = true;
        result.prototype = new parentClass;
        result.base = parentClass;
    }
    if(properties) {
        var ctorName = "constructor";
        for(var name in properties)
            if(name != ctorName)
                result.prototype[name] = properties[name];
        var ctor = properties[ctorName];
        if(ctor)
            result.ctor = ctor;
    }
    return result;
}


PageModuleBase = CreateClass(null, {

    MinDesktopLandscapeSize: 1024,
    PendingCallbacks: {},
    ForceFolderUpdate: false,
    ForcedFolder: "",

    DoCallback: function(sender, callback) {
        if(sender.InCallback()) {
            MailRoom.PendingCallbacks[sender.name] = callback;
            sender.EndCallback.RemoveHandler(MailRoom.DoEndCallback);
            sender.EndCallback.AddHandler(MailRoom.DoEndCallback);
        } else {
            callback();
        }
    },

    DoEndCallback: function(s, e) {
        var pendingCallback = MailRoom.PendingCallbacks[s.name];
        if(pendingCallback) {
            pendingCallback();
            delete MailRoom.PendingCallbacks[s.name];
        }
    },

    ChangeMailState: function(view, command, key) {
        var prev = this.MailState;
        var current = { View: view, Command: command, Key: key };

        if(prev && current && prev.View == current.View && prev.Command == current.Command && prev.Key == current.Key)
            return;

        this.MailState = current;
        this.OnStateChanged();
        this.ShowMenuItems();
    },

    OnStateChanged: function() { },
    ShowMenuItems: function() { },

    Adjust: function() {
        var isLandscape = MailRoom.GetIsLandscapeOrientation();
        if(!window.ClientLayoutSplitter || MailRoom.PrevIsLandscape === isLandscape)
            return;

        if(isLandscape)
            $('body').removeClass("Portrait").addClass("Landscape");
        else
            $('body').removeClass("Landscape").addClass("Portrait");

        MailRoom.ChangeLeftPaneExpandedState(isLandscape);
        MailRoom.PrevIsLandscape = isLandscape;
    },

    ChangeLeftPaneExpandedState: function(expand) {
        var leftPane = ClientLayoutSplitter.GetPaneByName("LeftPane");
        var rightPane = ClientLayoutSplitter.GetPaneByName("RightPane");
        if(expand)
            leftPane.Expand(rightPane);
        else
            leftPane.Collapse(rightPane);

        ClientExpandPaneImage.SetVisible(!expand);
        ClientCollapsePaneImage.SetVisible(expand);
    },

    GetIsLandscapeOrientation: function () {
        if(ASPxClientUtils.touchUI)
            return ASPxClientTouchUI.getIsLandscapeOrientation();
        else
            return ASPxClientUtils.GetDocumentClientWidth() >= this.MinDesktopLandscapeSize;
    },

    // Site master

    ClientActionMenu_ItemClick: function(s, e) { },
    ClientLayoutSplitter_PaneResized: function(s, e) { },

    ClientCollapsePaneImage_Click: function(s, e) {
        MailRoom.ChangeLeftPaneExpandedState(false);
    },
    ClientExpandPaneImage_Click: function(s, e) {
        MailRoom.ChangeLeftPaneExpandedState(true);
    },

    ClientInfoMenu_ItemClick: function(s, e) {
        if(e.item.parent && e.item.parent.name == "theme") {
            ASPxClientUtils.SetCookie("MailRoomCurrentTheme", e.item.name || "");
            e.processOnServer = true;
        }
    },

    ClientSearchBox_KeyPress: function(s, e) {
        e = e.htmlEvent;
        if(e.keyCode === 13) {
            // prevent default browser form submission
            if(e.preventDefault)
                e.preventDefault();
            else
                e.returnValue = false;
        }
    },

    ClientSearchBox_KeyDown: function(s, e) {
        window.clearTimeout(MailRoom.searchBoxTimer);
        MailRoom.searchBoxTimer = window.setTimeout(function() { 
            MailRoom.OnSearchTextChanged(); 
        }, 1200);
    },

    ClientSearchBox_TextChanged: function(s, e) {
        MailRoom.OnSearchTextChanged();
    },

    OnSearchTextChanged: function() {
        window.clearTimeout(MailRoom.searchBoxTimer);
        var searchText = ClientSearchBox.GetText();
        if(ClientHiddenField.Get("SearchText") == searchText)
            return true;
        ClientHiddenField.Set("SearchText", searchText);
    },

    ClearSearchBox: function() {
        ClientHiddenField.Set("SearchText", "");
        ClientSearchBox.SetText("");
    },

    ShowLoadingPanel: function(element) {
        this.loadingPanelTimer = window.setTimeout(function() {
            ClientLoadingPanel.ShowInElement(element);
        }, 500);
    },

    HideLoadingPanel: function() {
        if(this.loadingPanelTimer > -1) {
            window.clearTimeout(this.loadingPanelTimer);
            this.loadingPanelTimer = -1;
        }
        ClientLoadingPanel.Hide();
    },

    PostponeAction: function(action, canExecute) {
        var f = function() {
            if(!canExecute())
                window.setTimeout(f, 50);
            else
                action();
        };
        f();
    }
});

MailPageModule = CreateClass(PageModuleBase, {
    constructor: function () {
        this.MailState = { View: "MailList" };
    },

    OnStateChanged: function () {
        var state = this.MailState;
        if (state.View == "MailList")
            this.ShowMailGrid();
        if (state.View == "MailPreview")
            this.ShowPreview(state.Key);
        if (state.View == "MailForm")
            this.ShowMailForm(state.Command, state.Key);
    },

    OnSearchTextChanged: function () {
        var processed = MailPageModule.base.prototype.OnSearchTextChanged.call(MailRoom);
        if (processed) return;
        MailRoom.ChangeMailState("MailList");
        MailRoom.DoCallback(ClientMailGrid, function () {
            ClientMailGrid.PerformCallback("Search");
        });
    },

    ClientLayoutSplitter_PaneResized: function (s, e) {
        ClientLayoutSplitter.SetHeight($(window).height() - 150 - $("#footer").height());
        var state = MailRoom.MailState;
        if (!state)
            return;
        if (state.View == "MailList")
            ClientMailGrid.SetHeight(e.pane.GetClientHeight());
        if (state.View == "MailForm" && window.ClientMailEditor)
            ClientMailEditor.SetHeight(e.pane.GetClientHeight() - $("#MailForm").get(0).offsetHeight);
    },

    ClientActionMenu_ItemClick: function (s, e) {
        var command = e.item.name;
        var state = MailRoom.MailState;
        switch (command) {
            case "new":
                MailRoom.ChangeMailState("MailForm", "New");
                ClientAttachmentGrid.PerformCallback("New");
                ClientToEditor.SetIsValid(true);
                ClientSubjectEditor.SetIsValid(true);
                break;
            case "reply":
                MailRoom.ChangeMailState("MailForm", "Reply", state.Key);
                ClientAttachmentGrid.PerformCallback("Reply");
                break;
            case "forward":
                MailRoom.ChangeMailState("MailForm", "Forward", state.Key);
                ClientAttachmentGrid.PerformCallback("Forward");
                break;
            case "back":
                MailRoom.ChangeMailState("MailList");
                break;
            case "delete":
                if (!window.confirm("Confirm Delete?"))
                    return;
                var keys = [];
                if (state.View == "MailList") {
                    keys = ClientMailGrid.GetSelectedKeysOnPage();
                } else if (state.View == "MailPreview") {
                    keys = [state.Key];
                    MailRoom.ChangeMailState("MailList");
                }
                if (keys.length > 0) {
                    MailRoom.DoCallback(ClientMailGrid, function () {
                        ClientMailGrid.PerformCallback("Delete|" + keys.join("|"));
                    });
                    MailRoom.MarkMessagesAsRead(true, keys);
                }
                break;
            case "send":
            case "save":
                if (window.ClientToEditor && !ASPxClientEdit.ValidateEditorsInContainerById("MailForm"))
                    return;
                var args = command == "send" ? "SendMail" : "SaveMail";
                if (state.Command === "EditDraft")
                    args += "|" + state.Key;
                MailRoom.ChangeMailState("MailList");
                MailRoom.DoCallback(ClientMailGrid, function () {
                    ClientMailGrid.PerformCallback(args);
                    ClientAttachmentGrid.PerformCallback(args);
                });
                break;
            case "read":
            case "unread":
                var selectedKeys = ClientMailGrid.GetSelectedKeysOnPage();
                if (selectedKeys.length == 0)
                    return;
                ClientMailGrid.UnselectAllRowsOnPage();
                MailRoom.MarkMessagesAsRead(command == "read", selectedKeys);
                break;
        }
    },

    ShowMenuItems: function () {
        var view = MailRoom.MailState.View;

        if (ClientHiddenId.Get("Id") < 1) {
            ClientActionMenu.GetItemByName("new").SetVisible(false);
            ClientActionMenu.GetItemByName("reply").SetVisible(false);
            ClientActionMenu.GetItemByName("forward").SetVisible(false);
            ClientActionMenu.GetItemByName("back").SetVisible(false);
        } else {
            ClientActionMenu.GetItemByName("new").SetVisible(view != "MailForm");
            ClientActionMenu.GetItemByName("reply").SetVisible(view == "MailPreview");
            ClientActionMenu.GetItemByName("forward").SetVisible(view == "MailPreview");
            ClientActionMenu.GetItemByName("back").SetVisible(view != "MailList");
        }
        ClientActionMenu.GetItemByName("send").SetVisible(view == "MailForm");
        ClientActionMenu.GetItemByName("save").SetVisible(view == "MailForm");
        var hasSelectedMails = ClientMailGrid.GetSelectedKeysOnPage().length > 0;
        ClientActionMenu.GetItemByName("delete").SetVisible(view == "MailList" && hasSelectedMails || view == "MailPreview");

        var selectedNode = ClientMailTree.GetSelectedNode();
        var showMarkAs = view == "MailList" && hasSelectedMails && selectedNode.name != "Sent Items" && selectedNode.name != "Drafts";
        ClientActionMenu.GetItemByName("markAs").SetVisible(showMarkAs);

        ClientInfoMenu.GetItemByName("print").SetVisible(view == "MailList");
    },

    ClientMailFormPanel_Init: function (s, e) {
        MailRoom.DoCallback(s, function () {
            s.PerformCallback();
        });
    },

    ClientMailTree_Init: function (s, e) {
        s.cpPrevSelectedNode = s.GetSelectedNode();
        
        MailRoom.UpdateMailTreeUnreadInfo();
        MailRoom.UpdateMailGridUnreadInfo();
    },

    ClientMailTree_NodeClick: function (s, e) {
        if (s.cpPrevSelectedNode == s.GetSelectedNode())
            return;
        s.cpPrevSelectedNode = s.GetSelectedNode();
        MailRoom.ClearSearchBox();
        MailRoom.ShowMenuItems();
        MailRoom.ChangeMailState("MailList");
        MailRoom.DoCallback(ClientMailGrid, function () {
            ClientMailGrid.PerformCallback("FolderChanged");
        });
    },

    ClientMailGrid_Init: function (s, e) {
        MailRoom.UpdateMailGridKeyFolderHash();
    },

    ClientMailGrid_EndCallback: function (s, e) {
        MailRoom.ShowMenuItems();
        MailRoom.UpdateMailGridKeyFolderHash();
        MailRoom.UpdateMailGridUnreadInfo();
    },

    ClientMailGrid_RowClick: function (s, e) {
        var src = ASPxClientUtils.GetEventSource(e.htmlEvent);
        if (src.tagName == "TD" && src.className.indexOf("dxgvCommandColumn") != -1) // selection cell
            return;
        if (!s.IsDataRow(e.visibleIndex))
            return;
        var key = s.GetRowKey(e.visibleIndex);
        if (ClientMailTree.GetSelectedNode().name === "Drafts") {
            MailRoom.ChangeMailState("MailForm", "EditDraft", key);
            ClientAttachmentGrid.PerformCallback("EditDraft");
        }
        else {
            var Approved = src.parentNode.cells[6].innerHTML;
            MailRoom.ChangeMailState("MailPreview", "", key);
            if (Approved == "False") {
                ClientActionMenu.GetItemByName("reply").SetVisible(false);
                ClientActionMenu.GetItemByName("forward").SetVisible(false);
            }
        }
    },

    ClientMailGrid_SelectionChanged: function (s, e) {
        MailRoom.ShowMenuItems();
        MailRoom.UpdateMailGridUnreadInfo();
    },

    ClientMailEditor_Init: function (s, e) {
        if ($(s.GetMainElement()).is(":visible")) {
            ClientLayoutSplitter.GetPaneByName("MainPane").RaiseResizedEvent();
            window.setTimeout(function () { s.Focus(); }, 0);
        }
    },

    ClientAddressBookPopup_PopUp: function (s, e) {
        var emails = ClientToEditor.GetText().split(",");
        for (var i = 0; i < emails.length; i++)
            emails[i] = ASPxClientUtils.Trim(emails[i]);
        ClientAddressesList.UnselectAll();
        ClientAddressesList.SelectValues(emails);
    },

    ClientAddressBookPopupOkButton_Click: function (s, e) {
        ClientAddressBookPopup.Hide();
        ClientToEditor.SetIsValid(true);
        ClientSubjectEditor.SetIsValid(true);

        var emails = ClientToEditor.GetText().split(",");
        for (var i = 0; i < emails.length; i++)
            emails[i] = ASPxClientUtils.Trim(emails[i]);
        for (var i = emails.length - 1; i >= 0; i--) {
            var email = emails[i];
            var item = ClientAddressesList.FindItemByValue(email);
            if (email === "" || ClientAddressesList.FindItemByValue(email))
                emails.splice(i, 1);
        }
        emails = emails.concat(ClientAddressesList.GetSelectedValues());
        ClientToEditor.SetText(emails.join(", "));
    },

    ClientAddressBookPopupCancelButton_Click: function (s, e) {
        ClientAddressBookPopup.Hide();
    },

    ShowMailGrid: function () {
        MailRoom.HideLoadingPanel();
        MailRoom.HideMailPreview();
        MailRoom.HideMailForm();

        ClientMailGrid.SetVisible(true);
        ClientLayoutSplitter.GetPaneByName("MainPane").RaiseResizedEvent();
    },

    HideMailGrid: function () {
        ClientMailGrid.SetVisible(false);
    },

    ShowPreview: function (key) {
        MailRoom.HideLoadingPanel();
        MailRoom.HideMailGrid();
        MailRoom.HideMailForm();

        ClientMailPreviewPanel.SetVisible(true);
        MailRoom.DoCallback(ClientMailPreviewPanel, function () {
            ClientMailPreviewPanel.PerformCallback(key);
        });
        MailRoom.MarkMessagesAsRead(true, [key]);
    },

    HideMailPreview: function () {
        ClientMailPreviewPanel.SetVisible(false);
    },

    ShowMailForm: function (command, key) {
        MailRoom.HideMailGrid();
        MailRoom.HideMailPreview();
        if (window.ClientToEditor && window.ClientSubjectEditor && window.ClientMailEditor) {
            ClientToEditor.SetValue("");
            ClientToEditor.SetIsValid(true);
            ClientSubjectEditor.SetValue("");
            ClientMailEditor.SetHtml("");
        }

        ClientMailFormPanel.SetVisible(true);
        if (window.ClientMailEditor)
            ClientMailEditor.AdjustControl();
        ClientLayoutSplitter.GetPaneByName("MainPane").RaiseResizedEvent();

        if (command == "Reply" || command == "Forward" || command == "EditDraft") {
            ClientToEditor.SetIsValid(true);
            ClientSubjectEditor.SetIsValid(true);
            ClientMailGrid.GetValuesOnCustomCallback("MailForm|" + command + "|" + key, function (values) {
                var setValuesFunc = function () {
                    MailRoom.HideLoadingPanel();
                    if (!values)
                        return;
                    ClientToEditor.SetValue(values["To"]);
                    ClientSubjectEditor.SetValue(values["Subject"]);
                    ClientMailEditor.SetHtml(values["Text"]);
                    ClientMailEditor.SetFocus();
                };
                MailRoom.PostponeAction(setValuesFunc, function () { return !!window.ClientMailEditor });
            });
            MailRoom.ShowLoadingPanel(ClientMailFormPanel.GetMainElement());
        }
    },

    HideMailForm: function () {
        if (window.ClientAddressBookPopup)
            ClientAddressBookPopup.Hide();
        ClientMailFormPanel.SetVisible(false);
    },

    // MarkAsRead

    UpdateMailTreeUnreadInfo: function () {
        MailRoom.IterateMailTreeNodes(function (node) {
            if (!node.cpUnreadMessagesCount)
                node.cpUnreadMessagesCount = 0;
            var unreadMessages = ClientMailTree.cpUnreadMessagesHash[node.name];
            if (!unreadMessages || unreadMessages.length == node.cpUnreadMessagesCount)
                return;
            var nodeText = node.GetText();
            var match = nodeText.match(/^([\w|\s]+) \(\d+\)$/);
            if (match && match.length == 2)
                nodeText = match[1];
            MailRoom.UpdateNodeUnreadState(node, nodeText, unreadMessages.length);
            node.cpUnreadMessagesCount = unreadMessages.length;
        });
        ClientMailTree.AdjustControl();
    },

    UpdateNodeUnreadState: function (node, nodeText, unreadMessageCount) {
        if (unreadMessageCount == 0) {
            node.SetText(nodeText);
            node.GetHtmlElement().className = node.GetHtmlElement().className.replace(" unread", "");
        } else {
            node.SetText(nodeText + " (" + unreadMessageCount + ")");
            if (!node.GetHtmlElement().className.match("unread"))
                node.GetHtmlElement().className += " unread";
        }
    },

    IterateMailTreeNodes: function (action) {
        var stack = [ClientMailTree.GetRootNode()];
        while (stack.length > 0) {
            var node = stack.pop();
            action(node);
            for (var i = 0; i < node.GetNodeCount(); i++)
                stack.push(node.GetNode(i));
        }
    },

    MarkMessagesAsRead: function (read, keys) {
        var sendCallback = false;
        var keyMap = MailRoom.GetMailKeyMap(keys);
        MailRoom.IterateMailTreeNodes(function (node) {
            var markedKeys = keyMap[node.name];
            if (!markedKeys || markedKeys.length == 0)
                return;
            var unreadMessages = ClientMailTree.cpUnreadMessagesHash[node.name];
            if (!unreadMessages)
                unreadMessages = [];
            for (var i = 0; i < markedKeys.length; i++) {
                var key = markedKeys[i];
                var index = ASPxClientUtils.ArrayIndexOf(unreadMessages, key);
                if (read && index !== -1) {
                    unreadMessages.splice(index, 1);
                    sendCallback = true;
                }
                if (!read && index === -1) {
                    unreadMessages.push(key);
                    sendCallback = true;
                }
            }
        });
        MailRoom.UpdateMailTreeUnreadInfo();
        MailRoom.UpdateMailGridUnreadInfo();
        if (sendCallback)
            ClientMailGrid.GetValuesOnCustomCallback("MarkAs" + "|" + (read ? "Read" : "Unread") + "|" + keys.join("|"));
    },


    GetMailKeyMap: function (keys) {
        var result = {};
        var selectedNode = ClientMailTree.GetSelectedNode();
        if (selectedNode.name === "Inbox") {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var folderName = ClientMailGrid.cpKeyFolderHash[key];
                if (folderName) {
                    result[folderName] = result[folderName] || [];
                    result[folderName].push(key);
                }
            }
        } else {
            result[selectedNode.name] = keys;
        }
        return result;
    },

    UpdateMailGridUnreadInfo: function () {
        var unreadKeys = [];
        for (var folderName in ClientMailTree.cpUnreadMessagesHash)
            unreadKeys = unreadKeys.concat(ClientMailTree.cpUnreadMessagesHash[folderName]);

        var startIndex = ClientMailGrid.GetTopVisibleIndex();
        var count = ClientMailGrid.GetVisibleRowsOnPage();
        for (var i = startIndex; i < startIndex + count; i++) {
            if (ClientMailGrid.IsGroupRow(i))
                continue;
            var key = ClientMailGrid.GetRowKey(i);
            if (!ASPxClientUtils.IsExists(key))
                continue;
            var read = ASPxClientUtils.ArrayIndexOf(unreadKeys, key.toString()) < 0;
            var row = ClientMailGrid.GetRow(i);
            var hasMarker = row.className.match("unread");
            if (read && hasMarker)
                row.className = row.className.replace(" unread", "");
            if (!read && !hasMarker)
                row.className += " unread";
        }
    },

    UpdateMailGridKeyFolderHash: function () {
        var hash = {};
        for (var folderName in ClientMailGrid.cpVisibleMailKeysHash) {
            var keys = ClientMailGrid.cpVisibleMailKeysHash[folderName];
            if (!keys || keys.length == 0)
                continue;
            hash[folderName] = [];
            for (var i = 0; i < keys.length; i++)
                hash[keys[i]] = folderName;
        }
        ClientMailGrid.cpKeyFolderHash = hash;
    },

    //attachment

    ClientAttachPopup_Show: function (s, e) {
        ClientAttachPopup.Show();
    },

    ClientAttachPopup_PopUp: function (s, e) {
        ClientUpFile.ClearText();
    },

    ClientAttachPopupCancelButton_Click: function (s, e) {
        ClientAttachPopup.Hide();
    },

    ClientAttachPopupAttachButton_Click: function (s, e) {
        ClientUpFile.Upload();
    },

    ClientUpFile_UploadComplete: function (s, e) {
        MailRoom.ShowLoadingPanel(ClientAttachmentGrid.GetMainElement());
        ClientAttachmentGrid.PerformCallback("Attach");
        ClientAttachPopup.Hide();
    },

    ClientAttachmentGrid_EndCallback: function (s, e) {
        MailRoom.HideLoadingPanel();
    },

    ClientMailList_SelectedIndexChanged: function (s, e) {
        MailRoom.ClearSearchBox();
        MailRoom.ChangeMailState("MailList");
        if (FilterMailList.GetValue() == "5")
            $("#period").show();
        else
            $("#period").hide();
        MailRoom.DoCallback(ClientMailGrid, function () {
            ClientMailGrid.PerformCallback("MailFilterChanged|" + FilterMailList.GetValue() + "|" + MailRoom.GetDateString(filterFrom.GetValue()) + "|" + MailRoom.GetDateString(filterTo.GetValue()));
        });
    },

    GetDateString: function (date) {
        if (date == null) return "";
        var curr_date = date.getDate();
        var curr_month = date.getMonth();
        curr_month = curr_month + 1;
        var curr_year = date.getFullYear();
        return curr_date + '/' + curr_month + '/' + curr_year;
    }

});

CalendarPageModule = CreateClass(PageModuleBase, {
    constructor: function() {
        this.MailState = { View: "Scheduler" };
    },

    ClientActionMenu_ItemClick: function(s, e) { 
        var command = e.item.name;
        if(command == "new")
            ClientScheduler.RaiseCallback("MNUVIEW|NewAppointment");
    },

    ShowMenuItems: function() { 
        ClientActionMenu.GetItemByName("new").SetVisible(true);
    },

    ClientResourceCheckBox_CheckedChanged: function(s, e) {
        MailRoom.DoCallback(ClientScheduler, function() { 
            ClientScheduler.Refresh();
        });
    },

    ClientScheduler_AppointmentDoubleClick: function(s, e) {
        s.ShowAppointmentFormByClientId(e.appointmentId);
        e.handled = true;
    }

});

ContactsPageModule = CreateClass(PageModuleBase, {
    constructor: function () {
        this.MailState = { View: "ContactList" };
    },

    OnStateChanged: function () {
        var state = this.MailState;
        if (state.View == "ContactList")
            this.ShowContactDataView();
        if (state.View == "ContactForm")
            this.ShowContactForm(state.Command, state.Key);
    },

    OnSearchTextChanged: function () {
        var processed = ContactsPageModule.base.prototype.OnSearchTextChanged.call(MailRoom);
        if (processed) return;
        MailRoom.ChangeMailState("ContactList");
        MailRoom.DoCallback(ClientContactDataView, function () {
            ClientContactDataView.PerformCallback("Search");
        });
    },

    ClientContactDataView_EndCallback: function (s, e) {
        if (ClientContactDataView.cpError == "")
            MailRoom.ChangeMailState("ContactList");
        Client_LabelError.SetText(ClientContactDataView.cpError);
    },

    ClientActionMenu_ItemClick: function (s, e) {
        var command = e.item.name;
        var state = MailRoom.MailState;

        if (command == "new") {
            MailRoom.ChangeMailState("ContactForm", "New");
            Client_LabelError.SetText("");
        } else if (command == "back") {
            MailRoom.ChangeMailState("ContactList");
        } else if (command == "save") {
            if (window.ClientContactPhoneEditor && !ASPxClientEdit.ValidateEditorsInContainerById("ContactForm"))
                return;
            var args = "SaveContact|" + state.Command;
            args += "|";
            if (state.Command === "Edit")
                args += "|" + state.Key;

            MailRoom.DoCallback(ClientContactDataView, function () {
                ClientContactDataView.PerformCallback(args);
            });

        }
    },

    ShowMenuItems: function () {
        var view = this.MailState.View;

        ClientActionMenu.GetItemByName("new").SetVisible(view == "ContactList");
        ClientActionMenu.GetItemByName("save").SetVisible(view == "ContactForm");
        ClientActionMenu.GetItemByName("back").SetVisible(view == "ContactForm");

        ClientInfoMenu.GetItemByName("print").SetVisible(view == "ContactList");
    },

    ClientContactFormPanel_Init: function (s, e) {
        ClientLayoutSplitter.SetHeight($(window).height() - 150 - $("#footer").height());
        MailRoom.DoCallback(s, function () {
            s.PerformCallback();
        });
    },

    ClientContactAddressBookList_SelectedIndexChanged: function (s, e) {
        MailRoom.ClearSearchBox();
        MailRoom.ChangeMailState("ContactList");
        MailRoom.DoCallback(ClientContactDataView, function () {
            ClientContactDataView.PerformCallback("AddressBookChanged|" + s.GetValue());
        });
    },

    ClientContactSortByCombo_SelectedIndexChanged: function (s, e) {
        MailRoom.ChangeMailState("ContactList");
        MailRoom.DoCallback(ClientContactDataView, function () {
            ClientContactDataView.PerformCallback("SortByChanged");
        });
    },

    ClientContactSortDirectionCombo_SelectedIndexChanged: function (s, e) {
        MailRoom.ChangeMailState("ContactList");
        MailRoom.DoCallback(ClientContactDataView, function () {
            ClientContactDataView.PerformCallback("SortDirectionChanged");
        });
    },

    ClientEditContactImage_Click: function (s, e) {
        MailRoom.ChangeMailState("ContactForm", "Edit", s.cpContactKey);
    },

    ClientDeleteContactImage_Click: function (s, e) {
        if (!window.confirm("Confirm Delete?"))
            return;
        MailRoom.DoCallback(ClientContactDataView, function () {
            ClientContactDataView.PerformCallback("Delete" + "|" + s.cpContactKey);
        });
    },

    ClientSendMailContactImage_Click: function (s, e) {
        MailRoom.DoCallback(ClientContactDataView, function () {
            ClientContactDataView.PerformCallback("SendMail" + "|" + s.cpContactKey);
        });
    },

    ShowContactDataView: function () {
        MailRoom.HideLoadingPanel();
        MailRoom.HideContactForm();

        ClientContactDataView.SetVisible(true);
    },

    HideContactDataView: function () {
        ClientContactDataView.SetVisible(false);
    },

    ShowContactForm: function (command, key) {
        if (window.ClientContactPhoneEditor) {
            ClientContactNameEditor.SetText("");
            ClientContactEmailEditor.SetText("");
            ClientContactAddressEditor.SetText("");
            ClientContactCountryEditor.SetText("");
            ClientContactZipcodeEditor.SetText("");
            ClientContactCityEditor.SetText("");
            ClientContactPhoneEditor.SetText("");
            ClientContactLanguageEditor.SetText("");
            ClientContactNameEditor.SetIsValid(true);
            ClientContactEmailEditor.SetIsValid(true);
            ClientContactLanguageEditor.SetIsValid(true);
            ClientContactEmailEditor.SetEnabled(true);
        }
        MailRoom.HideContactDataView();
        ClientContactFormPanel.SetVisible(true);
        if (command == "Edit") {
            MailRoom.ShowLoadingPanel(ClientContactFormPanel.GetMainElement());
            MailRoom.DoCallback(ClientCallbackControl, function () {
                ClientCallbackControl.PerformCallback(command + "|" + key);
            });
        }
    },

    HideContactForm: function () {
        ClientContactFormPanel.SetVisible(false);
    },

    ClientCallbackControl_CallbackComplete: function (s, e) {
        MailRoom.HideLoadingPanel();
        if (e.result == "NotFound")
            MailRoom.ChangeMailState("ContactForm", "New");
        if (e.result == "Edit") {
            setValuesFunc = function () {
                MailRoom.HideLoadingPanel();
                if (!s.cpContact) return;
                var values = s.cpContact;
                ClientContactNameEditor.SetText(values["Name"]);
                ClientContactNameEditor.SetIsValid(true);

                ClientContactEmailEditor.SetText(values["Email"]);
                ClientContactEmailEditor.SetIsValid(true);

                ClientContactAddressEditor.SetText(values["Address"]);
                ClientContactCountryEditor.SetText(values["Country"]);
                ClientContactZipcodeEditor.SetText(values["Zipcode"]);
                ClientContactCityEditor.SetText(values["City"]);

                ClientContactPhoneEditor.SetText(values["Phone"]);

                ClientContactLanguageEditor.SetValue(values["Language"]);
                ClientContactLanguageEditor.SetIsValid(true);

                if (values["fk_dossier_id"] > 1)
                    ClientContactEmailEditor.SetEnabled(false);
            };
            MailRoom.PostponeAction(setValuesFunc, function () { return !!window.ClientContactPhoneEditor });
        }
    },

    ClientLookupDossier_Click: function (s, e) {
        ClientContactNameEditor.SetIsValid(true);
        ClientContactEmailEditor.SetIsValid(true);
        ClientContactLanguageEditor.SetIsValid(true);
        ClientPopupDossier.Show();
    },

    ClientPopupDossier_Shown: function (s, e) {
        ClientDossierCallbackPanel.PerformCallback();
    },

    ClientcbOrg_ValueChanged: function (s, e) {
        ClientDossierGrid.PerformCallback("BindDossier|" + s.GetValue());
    },

    ClientPopupDossier_CloseButtonClick: function (s, e) {
        ClientDossierCallbackPanel.PerformCallback();
    },

    ClientPopupDossier_CloseUp: function (s, e) {
        ClientDossierCallbackPanel.PerformCallback();
    }
});

PrintPageModule = CreateClass(PageModuleBase, {
    
    ClientPrintLayoutSplitter_Init: function(s, e) {
        var toolbarMenu = aspxGetControlCollection().Get(ClientReportToolbar.menuID);
        s.GetPaneByName("ToolbarPane").SetSize(toolbarMenu.GetMainElement().offsetHeight);
    },

    PrintAddressFilterCombo_SelectedIndexChanged: function(s, e) {
        ClientHiddenField.Set("AddressBook", s.GetValue());
        ClientContactReportViewer.Refresh();
    },

    PrintStartDateEdit_DateChanged: function(s, e) {
        MailRoom.ValidatePrintDateInteval();
        ClientScheduleReportViewer.Refresh();
    },

    PrintEndDateEdit_DateChanged: function(s, e) {
        MailRoom.ValidatePrintDateInteval();
        ClientScheduleReportViewer.Refresh();
    },

    ValidatePrintDateInteval: function() {
        var start = ClientPrintStartDateEdit.GetDate();
        var end = ClientPrintEndDateEdit.GetDate();

        if(start > end) {
            end.setTime(start.getTime() + 3600000 * 24);
            ClientPrintEndDateEdit.SetDate(end);
        }
        ClientHiddenField.Set("StartDate", ClientPrintStartDateEdit.GetValueString());
        ClientHiddenField.Set("EndDate", ClientPrintEndDateEdit.GetValueString());
    }
});

(function() {
    var pageModule;
    var bodyElement = $("body");
    if(bodyElement.hasClass("mail"))
        pageModule = new MailPageModule();
    else if(bodyElement.hasClass("contacts"))
        pageModule = new ContactsPageModule();
    else if(bodyElement.hasClass("calendar"))
        pageModule = new CalendarPageModule();
    else if(bodyElement.hasClass("print"))
        pageModule = new PrintPageModule();
    else
        pageModule = new PageModuleBase();
    window.MailRoom = pageModule;
})();

$(document).ready(function() { 
    ASPxClientUtils.AttachEventToElement(window, "resize", MailRoom.Adjust);
    if(ASPxClientUtils.touchUI) {
        ASPxClientUtils.AttachEventToElement(window, "orientationchange", function () {
            ASPxClientTouchUI.ensureOrientationChanged(MailRoom.Adjust);
        }, false);
    }
    MailRoom.Adjust();
    MailRoom.ShowMenuItems();
});