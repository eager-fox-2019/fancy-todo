function onlyDateEvent(events) {
  let inputEvents = []
  events.forEach((oneTask) => {
    if (oneTask.due_date) {
      inputEvents.push({
        id: oneTask._id,
        title: oneTask.title,
        description: oneTask.note,
        start: oneTask.due_date,
        allDay: true
      })
    }
  })
  return inputEvents
}

function renderCalendar(events) {
  console.log('event result', events);
  $('#calendar1').empty()
  $('#calendar1').fullCalendar({
    defaultView: 'month',
    eventRender: function (eventObj, $el) {
      $el.popover({
          title: eventObj.title,
          content: eventObj.description,
          trigger: 'hover',
          placement: 'top',
          container: 'body'
      });
    },
    events: events
  });
}

function updateCalendar(events) {
  if (events) {
    renderCalendar(onlyDateEvent(events))
  } else {
    $.ajax({
      url: `${url_server}/task`,
      method: 'GET',
      headers: {
        token: JSON.parse(localStorage.token).token
      }
    })
      .done((result) => {
        renderCalendar(onlyDateEvent(result))
      })
      .fail((err) => {
        showError(err)
      })
  }
}

function updateOneEvent(event) {
  $('#calendar1').fullCalendar('updateEvent', event);
}