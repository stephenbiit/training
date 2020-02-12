from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination
from rest_framework.response import Response
from collections import OrderedDict, namedtuple

class CustomPagination(LimitOffsetPagination):
    
#     offset_query_param = 'start'
#     limit_query_param = 'limit'
    
    def get_paginated_response(self, data):
        return Response(OrderedDict([
#             ('draw', 0),
#             ('recordsTotal', self.count),
#             ('recordsFiltered', self.count),
            ('count', self.count),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))