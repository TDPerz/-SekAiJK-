import { CheckCircleFilled, CloseCircleFilled, DeleteFilled, EditFilled, MenuFoldOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, List, Space, Table, Tag, Typography } from "antd";
import { useEffect } from "react";
//Api
import { getRoles } from "../../../../Api/Auth/role"
//Context
import { useContext } from "react";
import { DataWebContext } from "../../../../context/Context";
import { DashboardContext } from "../../Dashboard";
//CSS
import './Role.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Role(prop) {

    const contextDash = useContext(DashboardContext)
    const context = useContext(DataWebContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [maxEl, setMaxEl] = useState(10);
    const [roles, setRoles] = useState([]);

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre'
        },
        {
            title: 'Permisos',
            dataIndex: 'permisos',
            key: 'permisos',
            render: (_, { permisos }) => {
                return Object.entries(permisos).map(([key, value]) => {
                    var label = ''
                    switch (key) {
                        case 'add':
                            label = 'Agregar'
                            break
                        case 'edit':
                            label = 'Editar'
                            break
                        case 'delete':
                            label = 'Eliminar'
                            break
                    }
                    return (
                        <Tag icon={value ? <CheckCircleFilled /> : <CloseCircleFilled/>} color={value ? 'success' : 'error'}>
                            {label}
                        </Tag>
                    )
                })
            }
        },
        Table.EXPAND_COLUMN,
        {
            title: 'Accesos',
            dataIndex: 'accesos',
            key: 'accesos',
            render: (_, { accesos }) => (
                accesos.length > 1 ?
                    <Typography.Text>Ver {accesos.length} rutas</Typography.Text>
                    :
                    <Typography.Text>Ruta unica: {accesos[0]}</Typography.Text>
            )
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (_, { _id }) => (
                <Space size={[8, 16]} wrap style={{ display: 'flex', justifyContent: "end" }}>
                    <Button icon={<EditFilled />} type="primary" shape="circle" />
                    <Button icon={<DeleteFilled />} type="primary" danger shape="circle" />
                </Space>
            )
        }
    ]

    const expandRender = ({ accesos }) => {
        return (<List
            header={<h4>Rutas</h4>}
            dataSource={accesos}
            renderItem={(item) => (
                <List.Item style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <Typography.Text>Ruta: {item}</Typography.Text>
                </List.Item>
            )}
        />)
    }

    useEffect(() => {
        getRoles().then(({ data }) => {
            setRoles(data.map(d => ({ ...d, key: d._id, nombre: d.nombre })))
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }, [])

    return (
        <div className="index-role">
            <div className="header">
                <div className="header-title">
                    <Button className="menu-collapse" icon={<MenuFoldOutlined />} onClick={() => contextDash.setDrawer(true)} />
                    <h2>Roles</h2>
                </div>
                {context.permisos.add && <Button type="primary" icon={<PlusOutlined />} onClick={()=>navigate('create')} />}
            </div>
            <div className="body">
                <div className="rol-bg">
                    <Input.Search className="search" placeholder="Buscar rol"/>
                    <Table pagination={{
                        defaultPageSize: maxEl, onChange: (p, ps) => {
                            setMaxEl(ps)
                        }
                    }} columns={columns} dataSource={roles} loading={loading} sticky={true} scroll={(maxEl > 10 && roles.length > 10) ? { y: '100%' } : {}}
                        expandable={{
                            expandedRowRender: expandRender,
                            rowExpandable: record => record.accesos.length > 1,
                        }} />
                </div>
            </div>
        </div>
    );
}

export default Role;