odoo.define('devexpress_datagrid.partners', function (require) {
"use strict";

var AbstractAction = require('web.AbstractAction');
var config = require('web.config');
var ajax = require('web.ajax');
var core = require('web.core');
var Dialog = require('web.Dialog');
var dom = require('web.dom');
var web_client = require('web.web_client');

var _t = core._t;
var QWeb = core.qweb;

var DevExpressDataGridPartners = AbstractAction.extend({
	hasControlPanel: false,
    contentTemplate: 'devexpress_datagrid.main',
    jsLibs: [
        '/devexpress_datagrid/static/src/js/dx.all.js',
    ],
    custom_events: _.extend({}, AbstractAction.prototype.custom_events, {
    }),
    events: {
    },
    
    /**
     * @override
     * @param {Object} [options]
     * @param {integer} [options.channelQuickSearchThreshold=20] amount of
     *   channels (dm inluded) for which a quick search appears in the sidebar.
     */
    init: function (parent, action, options) {
        this._super.apply(this, arguments);

        this.action = action;
        this.context = action.context;
        this.action_manager = parent;
        this.domain = [];
        this.options = options || {};
        
        this.result = {};
    },
    
    start: function () {
        var self = this;
        this._isStarted = true;
        return this._super.apply(this, arguments).then(function () {
            self.render_partners();
        });
    },
    
    render_partners: function(){
    	var self = this;
    	function isNotEmpty(value) {
            return value !== undefined && value !== null && value !== "";
        }
        var store = new DevExpress.data.CustomStore({
            key: "OrderNumber",
            load: function (loadOptions) {
                var deferred = $.Deferred(),
                    args = {};

                [
                    "skip",
                    "take",
                    "requireTotalCount",
                    "requireGroupCount",
                    "sort",
                    "filter",
                    "totalSummary",
                    "group",
                    "groupSummary"
                ].forEach(function(i) {
                    if (i in loadOptions && isNotEmpty(loadOptions[i]))
                        args[i] = JSON.stringify(loadOptions[i]);
                });
                $.ajax({
                    url: "https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders",
                    dataType: "json",
                    data: args,
                    success: function(result) {
                        deferred.resolve(result.data, {
                            totalCount: result.totalCount,
                            summary: result.summary,
                            groupCount: result.groupCount
                        });
                    },
                    error: function() {
                        deferred.reject("Data Loading Error");
                    },
                    timeout: 5000
                });

                return deferred.promise();
            }
        });

        self.$("#gridContainer").dxDataGrid({
            dataSource: store,
            showBorders: true,
            remoteOperations: true,
            paging: {
                pageSize: 12
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [8, 12, 20]
            },
            columns: [{
                dataField: "OrderNumber",
                dataType: "number"
            }, {
                dataField: "OrderDate",
                dataType: "date"
            }, {
                dataField: "StoreCity",
                dataType: "string"
            }, {
                dataField: "StoreState",
                dataType: "string"
            }, {
                dataField: "Employee",
                dataType: "string"
            }, {
                dataField: "SaleAmount",
                dataType: "number",
                format: "currency"
            }]
        }).dxDataGrid("instance");
    	
    },
    
});

core.action_registry.add('devexpress.datagrid.partners', DevExpressDataGridPartners);

return DevExpressDataGridPartners;

});
