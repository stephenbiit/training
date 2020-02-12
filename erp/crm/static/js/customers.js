//
// Updates "Select all" control in a data table
//
function updateDataTableSelectAllCtrl(table){
   var $table             = table.table().node();
   var $chkbox_all        = $('tbody input[type="checkbox"]', $table);
   var $chkbox_checked    = $('tbody input[type="checkbox"]:checked', $table);
   var chkbox_select_all  = $('thead input[name="select_all"]', $table).get(0);

   // If none of the checkboxes are checked
   if($chkbox_checked.length === 0){
      chkbox_select_all.checked = false;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = false;
      }

   // If all of the checkboxes are checked
   } else if ($chkbox_checked.length === $chkbox_all.length){
      chkbox_select_all.checked = true;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = false;
      }

   // If some of the checkboxes are checked
   } else {
      chkbox_select_all.checked = true;
      if('indeterminate' in chkbox_select_all){
         chkbox_select_all.indeterminate = true;
      }
   }
}



var table_name = '#customers';

$(document).ready(function() {
	// Array holding selected row IDs
	var rows_selected = [];
	var table = $(table_name).DataTable({
    	"dom": "<'row'<'col-sm-6'B><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'li><'col-sm-7'p>>",
    	processing:true,
        serverSide:true,
        paging: true,
        pageLength: 25,
        info: true,
        ordering:true,
        searching:true,
        lengthChange:true,
        stateSave: true,
        start: 0,
    	ajax: {
            "url": "/api/customers/",
            "contentType": "application/json",
            "dataType": "json",
            "type": 'GET',
            "data": function ( data ) {
                data.page = data.draw;
                delete data.draw;
                data.limit = data.length;
                data.page_size = data.limit;
                delete data.length;
                data.search = data.search.value;
                data.offset = data.start;
                var ordering = data.columns[data.order[0].column].data;
                if(ordering.includes('.')){
                    ordering = ordering.replace('.','__');
                }
                if(data.order[0].dir === 'asc') {
                    data.ordering = ordering;
                }else{
                    data.ordering = "-" + ordering;
                }
                delete data.start;
                return data;
            },
            "dataFilter": function(data){
                var json = jQuery.parseJSON(data);
                json.recordsTotal = json.count;
                json.recordsFiltered = json.count;
                json.data = json.results;
                delete json.results;
                return JSON.stringify(json); // return JSON string
            },
        },
        columnDefs: [
        	{
                'targets': 0,
                'searchable': false,
                'orderable': false,
                'width': '1%',
                'className': 'dt-body-center',
                'render': function (data, type, full, meta){
                    return '<input type="checkbox">';
                }
            },
	        {
	            targets: 1,
	            data: "name",
	            searchable: true,
	            orderable: true,
	        },
	        {
	            targets: 2,
	            data: "mobile",
	            searchable: true,
	            orderable: true,
	        },
	        {
	            targets: 3,
	            data: "email",
	            searchable: true,
	            orderable: true,
	        },
	        
        ],
        'order': [[1, 'asc']],
        'rowCallback': function(row, data, dataIndex){
            // Get row ID
            var rowId = data[0];

            // If row ID is in the list of selected row IDs
            if($.inArray(rowId, rows_selected) !== -1){
               $(row).find('input[type="checkbox"]').prop('checked', true);
               $(row).addClass('selected');
            }
         },
//        dom: 'Bfrtip',
        buttons: [
        	{
        		text: 'Create',
        	    action: function ( e, dt, node, config ) {
        	    	window.location.href = './create';
        	    }
        	},
        	
            'copy', 
            'csv', 
            'excel', 
            'pdf', 
            'print', 
            {
        		text: 'Reload',
        	    action: function ( e, dt, node, config ) {
        	        dt.ajax.reload();
        	    }
        	}
        ],
    });
    
 // Handle click on checkbox
    $('#country tbody').on('click', 'input[type="checkbox"]', function(e){
       var $row = $(this).closest('tr');

       // Get row data
       var data = table.row($row).data();

       // Get row ID
       var rowId = data[0];

       // Determine whether row ID is in the list of selected row IDs
       var index = $.inArray(rowId, rows_selected);

       // If checkbox is checked and row ID is not in list of selected row IDs
       if(this.checked && index === -1){
          rows_selected.push(rowId);

       // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
       } else if (!this.checked && index !== -1){
          rows_selected.splice(index, 1);
       }

       if(this.checked){
          $row.addClass('selected');
       } else {
          $row.removeClass('selected');
       }

       // Update state of "Select all" control
       updateDataTableSelectAllCtrl(table);

       // Prevent click event from propagating to parent
       e.stopPropagation();
    });

    // Handle click on table cells with checkboxes
    $('#country').on('click', 'tbody td, thead th:first-child', function(e){
       $(this).parent().find('input[type="checkbox"]').trigger('click');
    });

    // Handle click on "Select all" control
    $('thead input[name="select_all"]', table.table().container()).on('click', function(e){
       if(this.checked){
          $('#country tbody input[type="checkbox"]:not(:checked)').trigger('click');
       } else {
          $('#country tbody input[type="checkbox"]:checked').trigger('click');
       }

       // Prevent click event from propagating to parent
       e.stopPropagation();
    });

    // Handle table draw event
    table.on('draw', function(){
       // Update state of "Select all" control
       updateDataTableSelectAllCtrl(table);
    });

    // Handle form submission event
    $('#frm-country').on('submit', function(e){
       var form = this;

       // Iterate over all selected checkboxes
       $.each(rows_selected, function(index, rowId){
          // Create a hidden element
          $(form).append(
              $('<input>')
                 .attr('type', 'hidden')
                 .attr('name', 'id[]')
                 .val(rowId)
          );
       });
    });
    
});