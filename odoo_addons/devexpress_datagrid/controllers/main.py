# -*- coding: utf-8 -*-

import json
from odoo import http
from odoo.http import content_disposition, request
from odoo.addons.web.controllers.main import _serialize_exception
from odoo.tools import html_escape


class PartnerController(http.Controller):
    
    @http.route('/api/partners', type="json", auth='public')
    def get_partners(self, domain=[], offset=0, limit=25):
        result = {}
        result['count'] = request.env['res.partner'].search_read(domain)
        result['partners'] = request.env['res.partner'].search_read(domain, ['id','name','email'], offset=offset, limit=limit)
        return result
    
