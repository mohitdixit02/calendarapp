import React, { useEffect, useState } from 'react';
import s from "./CalendarPopup.module.css";
import styles from "../../Events/ViewEvents/ViewEvents.module.css";
import { Button, Modal } from 'antd';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../Utility/DateConversion/DateConversion';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useNotification } from '../../Notifications/Notifications';
import { deleteEventAPI, deleteAllEventsAPI } from '../../Utility/Events/Events';

const App = ({ dateMap, open, setOpen, activeDate }) => {
  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const popNotification = useNotification();

  useEffect(() => {
    let year = activeDate?.year;
    let month = String(activeDate?.month).padStart(2, '0');
    let date = String(activeDate?.date).padStart(2, '0');
    let key = `${year}-${month}-${date}`;
    setEvents(dateMap.get(key) || []);
  }, []);

  const handleCreateNewEvent = () => {
    setLoadingOne(true);
    Cookies.set('active_event', JSON.stringify({ date: activeDate, title: "", description: "", start_time: "", end_time: "", type: 'new' }));
    navigate("/create_new_event");
    setLoadingOne(false);
    setOpen(false);
  };

  const handleDeleteAllEvents = () => {
    setLoadingTwo(true);
    let body = {
      id_set: (events.map((i) => i.id)),
    }

    deleteAllEventsAPI(body).then((res) => {
      if (res.status === "success") {
        popNotification(res.status, res.message, '');
        setEvents([]);
        setLoadingTwo(false);
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, [2000]);
      }
      else {
        popNotification(res.status, res.message, '');
        setLoadingTwo(false);
      }
    })
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
        setEvents(events.filter((i) => i.id !== event_id));

        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, [2000]);
      }
      else {
        popNotification(res.status, res.message, '');
      }
    });
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="submit_calendar_popup" type="primary" loading={loadingOne} onClick={handleCreateNewEvent}>
          Create a event
        </Button>,
        <>
          {(events.length === 0 ? <></> :
            <Button
              key="submitDelete_calendar_popup"
              type="primary"
              danger="true"
              loading={loadingTwo}
              onClick={handleDeleteAllEvents}
            >
              Delete all events
            </Button>
          )}
        </>,
      ]}
    >
      <div className={s["popup_top_view"]}>
        <div>Events</div>
        <div>{activeDate?.date + "/" + activeDate?.month + "/" + activeDate?.year}</div>
      </div>
      {events.length === 0 && <div>No events to show</div>}

      <div className={s["event_show_strip_holder"]}>
        {events.map((i, index) => (
          <div key={`${index}_event_calendar_popup`} className={s["event_show_strip"]}>
            <div>
              <p>
                {i.title}
              </p>
              {i.description}
            </div>
            <div className={styles["event_card_right_section"]}>
              <div>
                {formatTime(i.start_time)} - {formatTime(i.end_time)}
              </div>
              <div className={styles["event_card_right_icon_div"]}>
                <EditOutlined onClick={() => editEvent(i)} className={styles['event_card_edit_button']} />
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => deleteEvent(i)}
                  placement="topLeft"
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined className={styles['event_card_delete_button']} />
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
export default App;