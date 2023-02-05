import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { addHours, set } from 'date-fns'

import { NavBar } from "../components/NavBar"
import { localizer } from '../../helpers/calendarLocalizer';
import { getMessageEs } from '../../helpers/getMessages';
import { CalendarEvent } from '../components/CalendarEvent';
import { useState } from 'react';
import { CalendarModal } from '../components/CalendarModal';
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks/useCalendarStore';
import { FabAddNew } from '../components/FabAddNew';
import { FabDelete } from '../components/FabDelete';


export const CalendarPage = () => {

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  const { openDateModal } = useUiStore();

  const { events, setActiveEvent, hasEventSelected } = useCalendarStore();

  function eventStyleGetter(event, start, end, isSelected) {
    const style = {
      backgroundColor: '#347CF7',
      borderRadius: '0px',
      opacity: '0.8',
      color: 'white'
    }

    return {
      style
    }
  }

  function onDoubleClick(event) {
    openDateModal();
  }


  function onSelect(event) {
    setActiveEvent(event);
  }


  function onViewChanged(event) {
    setLastView(event);
    localStorage.setItem('lastView', event);
  }


  return (
    <>
      <NavBar />

      <Calendar
        culture='es'
        localizer={localizer}
        events={events}
        defaultView={lastView}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessageEs()}
        eventPropGetter={eventStyleGetter}
        components={{
          event: CalendarEvent
        }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
      />

      <CalendarModal/>

      <FabAddNew/>
      
      <FabDelete/>
    </>
  )
}
