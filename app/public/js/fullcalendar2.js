$(document).ready(function() {
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	$('#calendar').fullCalendar({
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay'
		},
		selectable: true,
		selectHelper: true,
		select:function(start,end,allDay) {
			var title = prompt("Event Title?");
			if(title) {
				$('#calendar').fullCalendar('renderEvent', 
					{
						title: title,
						start: start,
						end: end,
					},
					true
				);
				$.ajax({
					url: '/task/new',
					data: {
						title: title,
						start: start.toISOString(),
						end: end.toISOString(),
		            },
		            type: 'POST',
		            datatype: 'json',
				})
			}
			$('#calendar').fullCalendar('unselect');
		},
		editable: true,
		eventLimit: true,
		events: {
			url: '/task/getAllTasks',
		}
	});
});