import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import s from "./ViewEvents.module.css";
import { getEvents_All_API, deleteEventAPI } from '../../Utility/Events/Events';
import { formatTime, formatDate } from '../../Utility/DateConversion/DateConversion';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Popconfirm } from 'antd';
import { useNotification } from "../../Notifications/Notifications"

const options_key = {
  all: "All",
  this_month: "This Month",
  this_year: "This Year",
  next_year: "Next Year",
  prev_year: "Prev Year"
}

export default function ViewEvents() {
  const user = Cookies.get('user') || "none";
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState("all");
  const navigate = useNavigate();
  const popNotification = useNotification();

  useEffect(() => {
    if (user != 'none') {
      getEvents_All_API().then((res) => {
        setEvents(res);
      });
    }
  }, []);

  const editEvent = (event) => {
    let date = event.start_time.split("T")[0];
    let start_time = event.start_time.split("T")[1].split("Z")[0];
    let end_time = event.end_time.split("T")[1].split("Z")[0];

    let day = date.split("-")[2];
    let month = date.split("-")[1];
    let year = date.split("-")[0];
    const date_format = { date: day, month: month, year: year };
    Cookies.set('active_event', JSON.stringify({ date: date_format, title: event.title, description: event.description, start_time: start_time, end_time: end_time, type: "update", event_id: event.id }));
    navigate("/create_new_event");
  }

  const deleteEvent = (event) => {
    const event_id = event.id;

    deleteEventAPI(event_id).then((res) => {
      if (res.status === "success") {
        popNotification(res.status, res.message, '');
        getEvents_All_API().then((res) => {
          setEvents(res);
        });
      }
      else {
        popNotification(res.status, res.message, '');
      }
    });
  }

  return (
    <div>
      {user === "none" ?
        <div className={s["not_login_show"]}>
          <div>
            <h3>Nothing to Show</h3>
            <p>Login to add, view and manage your events</p>
          </div>
        </div>
        :
        <div className={s['view_events_main_holder']}>
          <div className={s["top_strip_view_events"]}>
            <h2>View Events</h2>
            <select name="select_type" id="" onChange={(e) => setTab(e.target.value)}>
              {
                Object.keys(options_key).map((key) => {
                  return <option key={key} value={key}>{options_key[key]}</option>
                })
              }
            </select>
          </div>
          <div className={s["view_events_content_holder"]}>
            <h3>{options_key[tab]}</h3>
            <hr />
            <div className={s['view_events_content']}>
              {events?.[tab]?.length === 0 && <div className={s['no_events_view']}>No Event Found</div>}
              {events?.[tab] && events?.[tab]?.map((event) => {
                return (
                  <div key={event.id} className={s["view_event_card"]}>
                    <div>
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                    <div className={s["event_card_right_section"]}>
                      <div>
                        <p className={s["view_events_card_date"]}>{formatDate(event.start_time)}</p>
                        <p>
                          {formatTime(event.start_time)} - {formatTime(event.end_time)}
                        </p>
                      </div>
                      <div className={s["event_card_right_icon_div"]}>
                        <EditOutlined onClick={() => editEvent(event)} className={s['event_card_edit_button']} />
                        <Popconfirm
                          title="Delete the task"
                          description="Are you sure to delete this task?"
                          onConfirm={() => deleteEvent(event)}
                          placement="topLeft"
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined className={s['event_card_delete_button']} />
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      }
    </div>
  )
}
