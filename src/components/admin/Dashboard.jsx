import './Dashboard.css'

import { Avatar, Button, Divider, Drawer, Dropdown, Layout, Menu, Space, Typography } from "antd";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { DataWebContext } from '../../context/Context';
import { useState } from 'react';
import { createContext } from 'react';
import { useEffect } from 'react';
import { useJwt, decodeToken } from 'react-jwt'
import axios from 'axios'
import env from '../../env'
import { EllipsisOutlined, FileAddOutlined, FileDoneOutlined, IdcardOutlined, LoginOutlined, SettingOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout

export const DashboardContext = createContext()

function Dashboard(props) {
    const context = useContext(DataWebContext)
    const location = useLocation()
    const navigate = useNavigate()
    const [collap, setCollap] = useState(false);
    const [drawer, setDrawer] = useState(false);


    if (context.isLogin()) {
        return (
            <DashboardContext.Provider value={{ drawer, setDrawer }}>
                <Layout className='dash-menu-bg' style={{ width: '100%', height: '100vh' }}>
                    {!context.loading && <Sider
                        breakpoint="xl"
                        collapsedWidth="1"
                        trigger={null}
                        onCollapse={(e) => {
                            setCollap(e)
                        }}
                    >
                        <div className='dash-logo'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1585.906 1832.531" fill="currentColor">
                                <path d="M967.18,366.454C1083.57,368.772,1131.12,582.264,1175,681c-71.66,36.235-99.45,43.989-122.43,61.395-16.19,4.694-44.58-64-81.57-135.395-47.411,115.431-80.736,208.51-93.144,227.826C859.668,850.949,791.529,895.565,702,943l-1-1C776.845,739.3,838.829,394.624,967.18,366.454ZM1695,460c15.01,1.038,16.48,6.463,7,16-195.87,164.054-470.09,297.531-684,456-124.975,78.41-224.464,178.05-435,249-26.686,3.46-63.986,1.05-77-19-20.292-31.27,11-72.05,26-88,89.165-76.253,220.26-139.847,320-199C1126.33,731.353,1388.43,572.51,1695,460Zm368,81,11,3c-6.45,46.616-386.27,468.91-444,517,104.52,198.69,205,415.76,298,628q49.995,119.985,100,240c-2,.67-4,1.33-6,2-68.09-73.45-510.24-761.8-495-848,5.72-32.32,20.28-79.64,37.13-120.762C1709.02,825.265,1949.36,586.969,2063,541Zm-501,46c36.87,34.573,24.64,151.656,15,206-95.9,540.64-274.85,959.57-592,1278-33.83,33.97-90.112,126.13-148,128h-1l-1-7c193.75-242.19,329.91-553.72,455-869,53.02-133.63,58.07-278.07,98-426q19.005-109.49,38-219Q1494,632.5,1562,587Zm15,32h0ZM1230,812c48.97,125.077,93.95,224.49,105.53,263.29-4.94,37.35-14.74,64.3-25,120.18C1247.34,1095.34,1182.66,989.656,1118,884Zm39,88h0Zm284,57h0Zm-348,84h0Zm-445,75q-2.5,10.005-5,20c-50.317,105.1-190.957,476.81-262,523-1.333-.67-2.667-1.33-4-2-12.363-33.55,104.854-433.04,130-466Q689.493,1153.5,760,1116Zm121,992h0Z" transform="translate(-488.094 -366.469)" />
                            </svg>
                        </div>
                        <Menu theme="dark" mode='inline' selectedKeys={location.pathname}>
                            {/* <Menu.Item key={'/dashboard/post'} onClick={() => { navigate('/dashboard/post') }} icon={<FileAddOutlined />}>
                                Publicaciones
                            </Menu.Item> */}
                            <Menu.Item key={'/dashboard/material'} onClick={() => { navigate('/dashboard/material') }} icon={<FileDoneOutlined />}>
                                Materiales
                            </Menu.Item>
                            {/* <Menu.SubMenu key={'/dashboard/settings'} title={
                                <>
                                    <SettingOutlined />
                                    <span>Ajustes</span>
                                </>
                            }>
                                <Menu.Item icon={<IdcardOutlined />} key={'/dashboard/settings/role'} onClick={() => { navigate('/dashboard/settings/role') }}>
                                    Roles
                                </Menu.Item>
                                <Menu.Item icon={<UserOutlined />} key={'/dashboard/settings/user'} onClick={() => { navigate('/dashboard/settings/user') }}>
                                    Usuarios
                                </Menu.Item>
                            </Menu.SubMenu> */}
                        </Menu>
                        <Menu theme="dark" className='menu-user'>
                            <Menu.SubMenu theme="light" icon={<Avatar size="small" src={context.user.img} />} title={ context.user.user }>
                                <Menu.Item icon={<UserOutlined />}>
                                    Perfil
                                </Menu.Item>
                                <Menu.Item icon={<LoginOutlined />} onClick={() => {context.logOut()}}>
                                    Cerrar session
                                </Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    </Sider>}
                    <Content style={{}}>
                        <Drawer
                            id="dash-draw"
                            placement='left'
                            onClose={() => { setDrawer(false) }}
                            visible={drawer}
                        >
                            <Menu theme="dark" selectedKeys={location.pathname}>
                                {/* <Menu.Item key={'/dashboard/post'} onClick={() => { navigate('/dashboard/post') }}>
                                    Publicaciones
                                </Menu.Item> */}
                                <Menu.Item key={'/dashboard/material'} onClick={() => { navigate('/dashboard/material') }}>
                                    Materiales
                                </Menu.Item>
                            </Menu>
                            <Dropdown overlay={<Menu
                                items={[
                                    {
                                        key: '1',
                                        label: (
                                            <Button icon={<LoginOutlined />} type="text">
                                                Cerrar sessión
                                            </Button>
                                        ),
                                    }
                                ]}
                            />} trigger={['click']}>
                                <Space className='menu-user' align="center">
                                    <Avatar size="large" src="https://scontent.fgua9-2.fna.fbcdn.net/v/t39.30808-6/292188653_570004798165319_1072215799761153795_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=In3gOsRMsU4AX8q4nC6&_nc_ht=scontent.fgua9-2.fna&oh=00_AT-rvJkNzaYys74rHELdXfBT32RI69sTdBDztP5T0BmRjQ&oe=63225B4F" />
                                    <span className='mock-block' style={{ color: 'white' }}>DeividAG</span>
                                </Space>
                            </Dropdown>
                        </Drawer>
                        <Outlet />
                    </Content>
                </Layout>
            </DashboardContext.Provider>
        );
    }
    else {
        return (
            <Navigate to={'/authenticate'} />
        )
    }
}

export default Dashboard;