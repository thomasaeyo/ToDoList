$(document).ready(function() {
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	var clicked_event;
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
					}
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
		eventDrop: function(event,delta,revertFunc) {
	        alert(
	            event.start
	        );
			var title = event.title;
			var start = event.start;
			var end = event.end;
			$.ajax({
				url: '/task/edit',
				data: {
					title: title,
					start: start.toISOString(),
					end: end.toISOString(),
	            },
	            type: 'POST',
	            datatype: 'json',
			})
		},
		eventClick: function(event,jsEvent,view) {
			$('.fc-event').css('background-color', '#3a87ad');
			$('.fc-event').css('border-color', '#3a87ad');
			if(clicked_event !== event) {
				clicked_event = event;
				$(this).css('background-color', '#006699');
				$(this).css('border-color', '#006699');
			} else {
				clicked_event = null;
			};
			$(document).keydown(function(e) {
				if(e.keyCode == 8 && clicked_event != null) {
					e.preventDefault();
					$('#calendar').fullCalendar('removeEvents', clicked_event._id);
					$.ajax({
						url: '/task/remove',
						data: {
							title: clicked_event.title,
			            },
			            type: 'POST',
			            datatype: 'json',
					});
					clicked_event = null;
				}
			})
		},
		events: {
			url: '/task/getAllTasks',
		}
	});
});