import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import s from "./Upcoming.module.css";
import styles from "../Events/ViewEvents/ViewEvents.module.css";
import { getEvents_upcoming_API, deleteEventAPI } from '../Utility/Events/Events';
import { formatTime, formatDate } from '../Utility/DateConversion/DateConversion';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useNotification } from "../Notifications/Notifications";
import { Popconfirm } from 'antd';

const data_title = {
    'today': 'Today',
    'tomorrow': 'Tomorrow',
    'week': 'Next 7 days',
    'month': 'Next 30 days',
};

export default function Upcoming() {
    const user = Cookies.get('user') || "none";
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const popNotification = useNotification();

    useEffect(() => {
        if (user !== "none") {
            getEvents_upcoming_API().then((data) => {
                setEvents(data);
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
                getEvents_upcoming_API().then((data) => {
                    setEvents(data);
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
                <div className={styles['view_events_main_holder']}>
                    <div className={s["top_strip_upcoming_events"]}>
                        <h2>Upcoming Events</h2>
                    </div>
                    <br />
                    <div className={styles["view_events_content_holder"]}>
                        {Object.keys(data_title)?.map((title) => {
                            const eventSection = events?.[title];
                            const data_l = eventSection?.length;
                            if (data_l != 0) {
                                return (
                                    <>
                                        <h3>
                                            {data_title?.[title]}
                                        </h3>
                                        <hr />
                                        <div className={styles['view_events_content']}>
                                            {eventSection?.map((event) => {
                                                return (
                                                    <div key={event?.id} className={styles["view_event_card"]}>
                                                        <div>
                                                            <h4>{event?.title}</h4>
                                                            <p>{event?.description}</p>
                                                        </div>
                                                        <div className={styles["event_card_right_section"]}>
                                                            <div>
                                                                <p className={styles["view_events_card_date"]}>{formatDate(event.start_time)}</p>
                                                                <p>
                                                                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                                                </p>
                                                            </div>
                                                            <div className={styles["event_card_right_icon_div"]}>
                                                                <EditOutlined onClick={() => editEvent(event)} className={styles['event_card_edit_button']} />
                                                                <Popconfirm
                                                                    title="Delete the task"
                                                                    description="Are you sure to delete this task?"
                                                                    onConfirm={() => deleteEvent(event)}
                                                                    placement="topLeft"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <DeleteOutlined className={styles['event_card_delete_button']} />
                                                                </Popconfirm>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </>
                                )
                            }
                            else {
                                return null;
                            }
                        })}
                    </div>
                </div>
            }
        </div>
    )
}
