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
    	return this._rpc({
            route: '/api/partners',
            params: {
    			domain: [],
    			offset: 0,
    			limit: 25
            }
        })
        .then(function(result) {
            self.result = result;
            $("#gridContainer").dxDataGrid({
                dataSource: result.partners,
                columns: ["id", "name", "email"],
                showBorders: true
            });
        });
    },
    
});

core.action_registry.add('devexpress.datagrid.partners', DevExpressDataGridPartners);

return DevExpressDataGridPartners;

});
