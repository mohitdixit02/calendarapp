import React, { useState } from 'react';
import s from "./NewEvent.module.css";
import style from "../ViewEvents/ViewEvents.module.css";
import Cookies from 'js-cookie';
import moment from 'moment';
import { createEventAPI, updateEventAPI, deleteEventAPI } from '../../Utility/Events/Events';
import { useNotification } from "../../Notifications/Notifications";
import { useNavigate } from 'react-router-dom';
import { Popconfirm } from 'antd';
import {
    Button,
    TimePicker,
    DatePicker,
    Form,
    Input,
} from 'antd';

const { TextArea } = Input;
const { RangePicker } = TimePicker;

export default function NewEvent() {
    const popNotification = useNotification();
    const user = Cookies.get('user') || "none";
    const event_data = JSON.parse(Cookies.get('active_event'));
    const navigate = useNavigate();

    let defaultMoment = event_data.date.year ? moment(`${event_data?.date?.year || ""}-${event_data?.date?.month || ""}-${event_data?.date?.date || ""}`, 'YYYY-MM-DD') : undefined;
    const defaultStartMoment = event_data?.start_time ? moment(event_data?.start_time, 'HH:mm p') : "";
    const defaultEndMoment = event_data?.end_time ? moment(event_data?.end_time, 'HH:mm p') : "";
    const submission_type = event_data?.type || "new";

    const createEvent = (values) => {
        let date = values?.date.format('YYYY-MM-DD');
        let title = values?.title;
        let description = values?.description;
        let start_time = values?.time[0].format('hh:mm A');
        let end_time = values?.time[1].format('hh:mm A');
        if (user === 'none') {
            popNotification('error', 'Permission denied', 'You can add events after successful login');
            return;
        }

        if (submission_type === 'new') {
            const data = {
                date: date,
                title: title,
                description: description,
                start_time: start_time,
                end_time: end_time,
            };
            createEventAPI(data).then((res) => {
                popNotification(res.status, res.message, '');
            });
        } else if (submission_type === 'update') {
            const data = {
                date: date,
                title: title,
                description: description,
                start_time: start_time,
                end_time: end_time,
                event_id: event_data.event_id
            };
            updateEventAPI(data).then((res) => {
                popNotification(res.status, res.message, '');
            });
        }
    }

    const deleteEvent = () => {
        const event_id = event_data?.event_id;
        if (event_id) {
            deleteEventAPI(event_id).then((res) => {
                if (res.status === "success") {
                    popNotification(res.status, res.message, '');
                    setTimeout(()=> {
                        navigate("/view_events");
                    }, 2000);
                }
                else {
                    popNotification(res.status, res.message, '');
                }
            });
        }
    }

    return (
        <>
            {(user === "none" ?
                <div className={style["not_login_show"]}>
                    <div>
                        <h3 style={{ 'color': 'red' }}>Permission denied</h3>
                        <p>You can add events after successful login</p>
                    </div>
                </div>
                :
                <div className={s["new_form_main"]}>
                    <h3>{submission_type === 'new' ? 'Add New Event' : 'Update Event'}</h3>
                    <div className={s["new_event_form_holder"]}>
                        <Form
                            labelCol={{
                                span: 8,
                            }}
                            wrapperCol={{
                                span: 16,
                            }}
                            layout="vertical"
                            style={{ maxWidth: 800 }}
                            autoComplete="off"
                            onFinish={createEvent}
                            name="create_event_form"

                            initialValues={{
                                title: event_data?.title,
                                date: defaultMoment,
                                description: event_data?.description,
                                time: [defaultStartMoment, defaultEndMoment],
                            }}
                        >
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input event title!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Date"
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input event date!',
                                    },
                                ]}
                            >
                                <DatePicker />
                            </Form.Item>
                            <Form.Item
                                label="Event Time"
                                name="time"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input event time!',
                                    },
                                ]}
                            >
                                <RangePicker use12Hours={true} format={"hh:mm A"} />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 0,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit" style={{ 'marginRight': "12px" }}>{submission_type === 'new' ? "Save" : "Update"}</Button>
                                {submission_type === 'new' ? <></> :
                                    <Popconfirm
                                        title="Delete the task"
                                        description="Are you sure to delete this task?"
                                        onConfirm={deleteEvent}
                                        placement="topLeft"
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="primary" danger="true">Delete</Button>
                                    </Popconfirm>
                                }
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </>
    )
}
