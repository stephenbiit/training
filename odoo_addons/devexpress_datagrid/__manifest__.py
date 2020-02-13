{
    'name': 'DevExpres DataGrid',
    'version': '1.0',
    'category': 'DataGrid',
    'sequence': 2,
    'author': 'Stephen Raj D',
    'summary': 'DevExpres DataGrid',
    'description': "",
    'depends': [
        'contacts',
        'crm',
        'web',
    ],
    'data': [
        'views/webclient_templates.xml',
        'views/partner_views.xml',
    ],
    'demo': [
    ],
    'qweb': [
        'static/src/xml/base.xml'
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
}
