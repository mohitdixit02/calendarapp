import React, { useEffect, useState } from 'react';
import s from "./LeftPannel.module.css";
import Cookies from 'js-cookie';
import AuthenticationForm from '../AuthenticationForm/AuthenticationForm';
import { LogoutAPI } from '../Utility/Authentication/Authentication';
import {useNavigate} from 'react-router-dom';
import {
  CalendarOutlined,
  AlertOutlined,
  FileDoneOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNotification } from '../Notifications/Notifications';

const items = [
  {
    key: '/',
    icon: <CalendarOutlined />,
    label: 'Calendar View',
  },
  {
    key: '/upcoming',
    icon: <AlertOutlined />,
    label: "Upcoming",
  },
  {
    key: 'sub1',
    label: 'Events',
    icon: <FileDoneOutlined />,
    children: [
      {
        key: '/view_events',
        icon: <FileDoneOutlined />,
        label: 'View Events',
      },
      {
        key: '/create_new_event',
        icon: <FileAddOutlined />,
        label: 'Add New Event',
      },
    ],
  },
];


export default function App() {
  const user = Cookies.get('user') || "none";
  const [visible, setVisible] = useState(false);
  const popNotification = useNotification();
  const navigate = useNavigate();
  
  function navigateFunction(e) {
    if(e.key === '/create_new_event'){
      Cookies.set('active_event', JSON.stringify({ date: {}, title: "", description: "", start_time: "", end_time: "", type: "new" }));
    }
     navigate(e.key);
  }

  function Logout_function() {
    const data = LogoutAPI();
    data.then((res) => {
      let status = res.status;
      let message = res.message;
      if (status === "success") {
        Cookies.remove('user');
        popNotification(status, message, '');
        setTimeout(() => {
          window.location.reload();
        },2000);
      }
    })
  }

  return (
    <div className={s['left_pannel_holder']}
    >
      <div className={s["profile_holder"]}>
        <div className={s["profile_image"]}>
          <img src={user === "none" ? "https://poly-ag.com/wp-content/uploads/2020/12/guest-user.jpg" : "https://www.w3schools.com/howto/img_avatar.png"} alt="profile_image" />
        </div>
        <div className={s["profile_name"]}>
          <p>{user === "none" ? "Guest User" : <>{user}</>}</p>
        </div>
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="light"
        items={items}
        onClick={(e) => navigateFunction(e)}
      />
      <div className={s["login_button_holder"]}>
        {user === "none" ?
          <button className={s["login_button"]}
            onClick={() => setVisible(true)}
          >
            Login
          </button>
          :
          <button className={s["logout_button"]}
            onClick={Logout_function}
          >
            Logout
          </button>
        }

      </div>
      <div className={s['app_name_holder']}>
        <hr />
        Calendar App
      </div>
      <AuthenticationForm visible={visible} setVisible={setVisible} />
    </div>
  );
};