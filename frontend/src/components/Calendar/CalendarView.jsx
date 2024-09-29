import React, { useEffect, useState } from 'react'
import { Badge, Calendar, Tag } from 'antd';
import s from "./calendar.module.css";
import CalendarPopup from './CalendarPopup/CalendarPopup';
import Cookies from 'js-cookie';

import { getEventsYM_API, getEvents_M_COUNT_API } from '../Utility/Events/Events';

// get events for the year and month
const getCalendarData_YM = (setDateMap, year, month) => {
  let user = Cookies.get('user') || 'none';
  if(user === 'none') return;
  
  let body = {
    month: month,
    year: year,
  };
  
  let dateMap = new Map();
  getEventsYM_API(body).then((res) => {
    for (let i of res) {
      let [date, time] = i.start_time.split('T');
      if (dateMap.has(date)) {
        const events = dateMap.get(date);
        events.push(i);
      }
      else {
        dateMap.set(date, [i]);
      }
    }
    setDateMap(dateMap);
  });
}

// get events count for a month
const getCalendarData_M_COUNT = (year, setMonthMap) => {
  let user = Cookies.get('user') || 'none';
  if(user === 'none') return;

  let body = {
    year: year,
  };
  
  getEvents_M_COUNT_API(body).then((res) => {
    let monthMap = new Map();
    for (let i in res) {
      monthMap.set(i, res[i]);
    }
    setMonthMap(monthMap);
  });
};

export default function CalendarView() {
  // popup
  const [openPopup, setOpenPopup] = useState(false);
  const [activeDate, setActiveDate] = useState(null);
  const [dateMap, setDateMap] = useState(new Map());
  const [monthMap, setMonthMap] = useState(new Map());
  const [pannel, setPannel] = useState("month");

  useEffect(() => {
    let date = new Date();
    getCalendarData_YM(setDateMap, date.getFullYear(), date.getMonth() + 1);
  }, [1000]);


  const getListData = (value) => {
    let key = value.format('YYYY-MM-DD');
    let content = dateMap?.get(key) || [];
    if (content.length > 0) {
      content = content.map((i) => {
        let [date, time] = i.start_time.split('T');
        let type = (date < new Date().toISOString().split('T')[0]) ? 'error' : 'success';
        return {
          type: type,
          content: i.title,
        }
      });
    }
    return content;
  };


  // month cell render
  const monthCellRender = (value) => {
    let key = `${value.month() + 1}`;
    let num = monthMap?.get(key);

    return num ? (
      <div className="notes-month">
        <Tag color="purple">
          {num} {num === 1 ? "Event" : "Events"}
        </Tag>
      </div>
    ) : null;
  };

  // data cell render
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };
  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  const pannelSelect = (e, mode) => {
    setPannel(mode);
    if (mode === "year") {
      let year = e.year();
      getCalendarData_M_COUNT(year, setMonthMap);
    }
  }

  const dateSelect = (e, { source }) => {
    const date = e.date();
    const month = e.month() + 1;
    const year = e.year();
    if (source === "date") {
      setOpenPopup(true);
      setActiveDate({ date, month, year });
    }
    else if (source === "month" || pannel === "month") {
      getCalendarData_YM(setDateMap, year, month);
    }
  }

  return (
    <div className={s['calendar_holder']}>
      <div>
        <p>
          Calendar View
        </p>
        <div className={s["calendar_wrapper"]}>
          <Calendar
            cellRender={cellRender}
            onSelect={dateSelect}
            onPanelChange={pannelSelect}
          />;
        </div>
        {openPopup &&
          <CalendarPopup dateMap={dateMap} open={openPopup} setOpen={setOpenPopup} activeDate={activeDate} />
        }
      </div>
    </div>
  )
}
