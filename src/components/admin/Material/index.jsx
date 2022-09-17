import { DeleteFilled, DeleteOutlined, DownloadOutlined, InboxOutlined, EditOutlined, MenuFoldOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Carousel, Col, Form, Image, Input, List, Modal, Pagination, Result, Row, Upload } from "antd";
import Meta from "antd/lib/card/Meta";
import axios from "axios";
import env from '../../../env'
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataWebContext } from "../../../context/Context";
import FlipMove from 'react-flip-move';
import { toast, ToastContainer } from "react-toastify"
import fileDownload from 'js-file-download'
import { getMaterials, postMaterial } from '../../../Api/API/Material'

import './index.css'
import { useEffect } from "react";
import { DashboardContext } from "../Dashboard";

const data = Array.from({
    length: 50,
}).map((_, i) => ({
    id: i,
    title: `ant design part ${i}`,
    imgs: [{
        name: '',
        key: '',
        url: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
    }, {
        name: '',
        key: '',
        url: "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
    }],
    description: 'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

function FormModal({ visible, onOk, onCancel, init }) {

    const [form] = Form.useForm()
    const [image, setImage] = useState([]);
    const [isUpload, setIsUpload] = useState(false);

    const checkValue = () => {
        setIsUpload(true)
        if (init) {

        } else {
            form.validateFields().then(resp => {

                postMaterial({
                    nombre: resp.title,
                    descripcion: resp.description,
                    imagenes: image.map((i) => ({
                        name: i.name,
                        url: i.url,
                        key: i.id
                    }))
                }).then((res) => {
                    setImage([])
                    setIsUpload(false)
                    onOk(res.data)
                }).catch(err => {
                    console.error(err)
                    Modal.error({
                        title: 'Error al subir la imagen',
                        content: err
                    })
                    setIsUpload(false)
                })
            }).catch(error => {
                console.error(error)
            })
        }
    }

    const checkCancel = () => {
        if (image.length > 0) {
            form.resetFields()
            image.forEach((img) => {
                axios.post(`${env.API}/api/delete/image`, { public_id: img.id }).then(resp => {
                }).catch(error => {
                    console.error('')
                })
            })
            onCancel()
        }
        else {
            form.resetFields()
            onCancel()
        }
    }

    const uploadimage = async (options) => {


        const { onSuccess, file, onError, onProgress } = options
        const data = new FormData()

        data.append('file', file)
        data.append('cloud_name', env.CLOUD_NAME)
        data.append('upload_preset', env.UPLOAD_PRESET)
        axios.post(`${env.API_CLOUDIMARY}/image/upload`, data).then(({ data }) => {
            setImage(prev => [...prev, { id: data.public_id, name: file.name, url: data.secure_url, uid: file.uid }])
            onSuccess("ok")
            setIsUpload(false)
        }).catch(err => {
            console.error(err)
            onError(err)
        })
    }

    const delImage = (e) => {
        return new Promise((resolve, reject) => {
            const f = image.find(i => i.uid == e.uid)
            axios.post(`${env.API}/api/delete/image`, { public_id: f.id }).then(resp => {
                setImage(image.filter(i => i.uid != e.uid))
                resolve(resp)
            }).catch(error => {
                console.error(error)
                reject(error)
            })
        })
    }

    return (
        <Modal visible={visible} title="Materiales" onOk={checkValue} onCancel={checkCancel} confirmLoading={isUpload}>
            <Form form={form} layout="vertical" initialValues={init ? init : {}}>
                <Form.Item
                    name="title"
                    label="Titulo"
                    rules={[{ required: true, message: 'Se necesita un titulo para la imagen' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Se necesita una descripcion para la imagen' }]}>
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Material para subir">
                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={(e) => {


                    }} noStyle>
                        <Upload.Dragger fileList={image} listType="picture" multiple={true} name="files" accept="image/png, image/jpeg" customRequest={uploadimage} progress={{
                            strokeColor: {
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            },
                            strokeWidth: 3,
                            format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
                        }} onRemove={delImage}>
                            {(!image.url || !isUpload) &&
                                <>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click o arrastra el archivo para subirlo</p>
                                </>
                            }
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
            </Form>
        </Modal>
    )
}

function Index(props) {

    const context = useContext(DataWebContext)
    const contextDash = useContext(DashboardContext)

    const [page, setPage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [materiales, setMateriales] = useState([]);
    const [getMaterial, setGetMaterial] = useState(true);
    const [isDownload, setIsDownload] = useState(false);
    const [maxEle, setMaxEle] = useState(10);
    const [pages, setPages] = useState(0);


    const submitdata = (value) => {
        if (edit) {
        }
        else {
            setMateriales(prev => [...materiales, value])
            toast.success('Material agregado correctamente', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })

        }
        setShowModal(false)
    }

    const canceldata = () => {
        setShowModal(false)
    }

    const downLoadData = async (urls, title) => {
        for (var i = 0; i < urls.length; i++) {
            const resp = await axios.get(urls[i].url, { responseType: "blob" })
            fileDownload(resp.data, urls[i].name)
        }
        setIsDownload(false)
    }

    useEffect(() => {
        getMaterials().then(({ data }) => {
            setPages(Math.ceil(data.length / maxEle))
            setMateriales(data)
            setGetMaterial(false)
        }).catch(err => {
            console.error(err)
        })
    }, [])

    return (
        <div className="index-material">
            <ToastContainer />
            <div className="header">
                <div className="header-title">
                    <Button className="menu-collapse" icon={<MenuFoldOutlined />} onClick={() => contextDash.setDrawer(true)} />
                    <h2>Materiales</h2>
                </div>
                {context.permisos.add && <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)} />}
            </div>
            <div>
                {/* <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginRight: 'auto', marginLeft: 'auto' }}> */}
                {getMaterial ?
                    <>
                        <Result
                            icon={<LoadingOutlined />}
                            title="Cargando material..."
                        />
                    </>
                    :
                    materiales.length > 0 ?
                        <>
                            <div className="row">
                                {materiales.slice(page * maxEle, (page * maxEle) + maxEle).map(element => (
                                    <Card
                                        hoverable
                                        cover={
                                            <Carousel autoplay>
                                                {element.imagenes.map((img) => (
                                                    <div>
                                                        <Image src={img.url} />
                                                    </div>
                                                ))}
                                            </Carousel>
                                        }
                                        actions={[
                                            isDownload ? <LoadingOutlined /> : <DownloadOutlined onClick={() => {
                                                setIsDownload(true)
                                                downLoadData(element.imagenes, element.title)
                                            }} />,
                                            context.permisos.edit && <EditOutlined />,
                                            context.permisos.delete && <DeleteOutlined />
                                        ]}
                                    >
                                        <Meta title={element.nombre} description={element.descripcion} />
                                    </Card>
                                ))}
                            </div>
                            <div style={{ paddingRight: '25px', paddingBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <Pagination showSizeChanger current={page + 1} total={pages} onShowSizeChange={(current, size) => {
                                    setPage(current - 1)
                                    setMaxEle(size)
                                    setPages(Math.ceil(materiales.length / size))
                                }} onChange={(current) => {
                                    setPage(current - 1)
                                }} />
                            </div>
                        </>
                        :
                        <>
                            <Result
                            title="Vacio"
                            icon={<InboxOutlined />}
                            />
                        </>
                }
            </div>
            <FormModal onOk={submitdata} onCancel={canceldata} visible={showModal} />
        </div >
    );
}

export default Index;