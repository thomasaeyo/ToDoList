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
		select: function(start, end, allDay) {
		    var title = prompt('Event Title:');
		    if (title) {
		        $('#calendar').fullCalendar('renderEvent',
		            {
		                title: title,
		                start: start,
		                end: end,
		            },
		            true
		        );
		        /**
		         * ajax call to store event in DB
		         */
		        jQuery.post(
		            "event/new" // your url
		            , { // re-use event's data
		                title: title,
		                start: start,
		                end: end,
		                allDay: allDay
		            }
		        );
		    }
		    $('#calendar').fullCalendar('unselect');
		}, 
		defaultDate: '2014-11-12',
		editable: true,
		eventLimit: true, // allow "more" link when too many events
		events: [
			{
				title: 'All Day Event',
				start: '2015-1-01'
			},
			{
				title: 'Long Event',
				start: '2014-11-07',
				end: '2014-11-10'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2014-11-09T16:00:00'
			},
			{
				id: 999,
				title: 'Repeating Event',
				start: '2014-11-16T16:00:00'
			},
			{
				title: 'Conference',
				start: '2014-11-11',
				end: '2014-11-13'
			},
			{
				title: 'Meeting',
				start: '2014-11-12T10:30:00',
				end: '2014-11-12T12:30:00'
			},
			{
				title: 'Lunch',
				start: '2014-11-12T12:00:00'
			},
			{
				title: 'Meeting',
				start: '2014-11-12T14:30:00'
			},
			{
				title: 'Happy Hour',
				start: '2014-11-12T17:30:00'
			},
			{
				title: 'Dinner',
				start: '2014-11-12T20:00:00'
			},
			{
				title: 'Birthday Party',
				start: '2014-11-13T07:00:00'
			},
			{
				title: 'Click for Google',
				url: 'http://google.com/',
				start: '2014-11-28'
			}
		]
	});
});