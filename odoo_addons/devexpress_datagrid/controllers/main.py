# -*- coding: utf-8 -*-

import json
from odoo import http
from odoo.http import content_disposition, request, Response
from odoo.addons.web.controllers.main import _serialize_exception
from odoo.tools import html_escape
from ast import literal_eval

class ResponseEncoder(json.JSONEncoder):
    
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime(tools.DEFAULT_SERVER_DATETIME_FORMAT)
        if isinstance(obj, datetime.date):
            return obj.strftime(tools.DEFAULT_SERVER_DATE_FORMAT)
        if isinstance(obj, (bytes, bytearray)):
            return obj.decode()
        return json.JSONEncoder.default(self, obj)

class RecordEncoder(ResponseEncoder):
    
    def default(self, obj):
        if isinstance(obj, models.BaseModel):
            return obj.name_get()
        return ResponseEncoder.default(self, obj)


class PartnerController(http.Controller):
    
    @http.route('/api/partners', type="http", auth='public')
    def get_partners(self, **args):
        result = {}; domain = []
        offset = int(args.get('skip',0))
        limit = int(args.get('take',25))
        filter = json.loads(args.get('filter', '[]'))
        filter_flag = False
        for f in filter:
            if isinstance(f, list):
                f[1] = 'ilike'
                filter_flag = True
                domain.append(tuple(f))
            elif isinstance(f, str) and f == 'or':
                domain = ['|', *domain]
        if not filter_flag and isinstance(filter, list) and len(filter) == 3:
            filter[1] = 'ilike'
            domain.append(tuple(filter))
        print(domain)
        order_vals = ['{} {}'.format(x['selector'], 'desc' if x['desc'] else 'asc') for x in json.loads(args.get('sort', '[]'))]
        order = ','.join(order_vals) if order_vals else None
        result['totalCount'] = request.env['res.partner'].sudo().search_count(domain)
        result['data'] = request.env['res.partner'].sudo().search_read(domain=domain, fields=['id','name','mobile','email'], offset=offset, limit=limit, order=order)
        content = json.dumps(result, sort_keys=True, indent=4, cls=ResponseEncoder)
        return Response(content, content_type='application/json;charset=utf-8', status=200)
    
