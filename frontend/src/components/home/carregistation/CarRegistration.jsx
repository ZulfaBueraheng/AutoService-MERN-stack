import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./CarRegistration.scss";
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';

const CarRegistration = () => {

    const [brandmodels, setBrandModels] = useState([]);
    const [colors, setColors] = useState([]);

    const [numPlate, setNumPlate] = useState('');
    const [brand, setBrand] = useState('');
    const [customBrand, setCustomBrand] = useState('');
    const [lineId, setLineId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [customModel, setCustomModel] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [customColor, setCustomColor] = useState('');
    const [startdate, setStartDate] = useState('');

    const [isFormEdited, setIsFormEdited] = useState(false);

    const [uniqueCustomerNumplates, setUniqueCustomerNumplates] = useState([]);
    const [uniqueCustomerLineId, setUniqueCustomerLineId] = useState([]);
    const [uniqueCustomerNames, setUniqueCustomerNames] = useState([]);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [showConfirmBackModal, setShowConfirmBackModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadCustomers();
        loadCarCustomers();
        loadBrandModels();
        loadColors();
        setStartDate(moment().format('YYYY-MM-DDTHH:mm'));
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/repairs');

            const uniqueNumplates = [...new Set(response.data.map((customer) => customer.car.numPlate))];
            setUniqueCustomerNumplates(uniqueNumplates);

            const uniqueLinId = [...new Set(response.data.map((customer) => customer.customer.lineId))];
            setUniqueCustomerLineId(uniqueLinId);

            const uniqueNames = [...new Set(response.data.map((customer) => customer.customer.customerName))];
            setUniqueCustomerNames(uniqueNames);

            setMessage('');

        } catch (error) {
            console.error('Error loading customer data:', error);
            setMessage('Error loading customer data');
        }
    };

    const loadCarCustomers = async (selectedNumPlate) => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/repairs');

            const customersData = response.data;

            const selectedCustomers = customersData
                .filter(customer => customer.car.numPlate === selectedNumPlate)
                .sort((a, b) => {
                    const hasEndDateA = a.enddate !== null && a.enddate !== undefined;
                    const hasEndDateB = b.enddate !== null && b.enddate !== undefined;

                    if (!hasEndDateA && !hasEndDateB) {
                        return 0;
                    } else if (!hasEndDateA) {
                        return -1;
                    } else if (!hasEndDateB) {
                        return 1;
                    } else {
                        return new Date(b.enddate) - new Date(a.enddate);
                    }
                });

            if (selectedCustomers.length > 0) {
                const selectedCustomer = selectedCustomers[0];
                return selectedCustomer || null;
            } else {
                return null;
            }

        } catch (error) {
            console.error('Error loading customer data:', error);
        }
    };

    const loadBrandModels = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/brandmodels');
            setBrandModels(response.data);
        } catch (error) {
            console.error('Error loading brand models:', error);
        }
    };

    const loadColors = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/colors');
            setColors(response.data);
        } catch (error) {
            console.error('Error loading colors:', error);
            setMessage('Error loading colors');
        }
    };

    const handleAddCustomer = async () => {
        const phonePattern = /^[0]{1}[0-9]{9}$/;

        if (!phonePattern.test(phoneNumber)) {
            setError('เบอร์โทรศัพท์ไม่ตรงตามรูปแบบที่ถูกต้อง');
            setMessage('ลงทะเบียนรถไม่สำเร็จ');
            return;
        }

        if (!numPlate.trim() || !customerName.trim() || !brand.trim() || !selectedModel.trim() || !selectedColor.trim() || !startdate.trim()) {
            setMessage('ลงทะเบียนรถไม่สำเร็จ');
            return;
        }

        console.log(numPlate);

        const CustomerCar = await loadCarCustomers(numPlate);

        if (CustomerCar && CustomerCar.status && CustomerCar.status.state5 === false) {
            setMessage('รถคันนี้ถูกเพิ่มแล้ว');
            return;
        }

        try {
            await axios.post('https://autoservice-k7ez.onrender.com/repairs', {
                numPlate,
                lineId,
                brand: customBrand || brand,
                customerName,
                phoneNumber,
                selectedModel: customModel || selectedModel,
                selectedColor: customColor || selectedColor,
                startdate,
                services: [],
                mechanics: [],
            });

            if (customColor) {
                await axios.post('https://autoservice-k7ez.onrender.com/colors', {
                    colorname: customColor,
                });
            }

            if (customModel) {
                await axios.post('https://autoservice-k7ez.onrender.com/brandmodels', {
                    brand: customBrand || brand,
                    model: customModel,
                });
            }

            navigate('/home');
        } catch (error) {
            console.error('Error adding customer:', error);
            setMessage('ลงทะเบียนรถไม่สำเร็จ');
        }
    };

    const handleNumPlateChange = async ({ value, isFormEdited }) => {
        setNumPlate(value);

        if (isFormEdited) {
            setIsFormEdited(true);
        }

        const selectedData = await loadCarCustomers(value);

        if (selectedData) {
            setLineId(selectedData.customer.lineId);
            setCustomerName(selectedData.customer.customerName);
            setPhoneNumber(selectedData.customer.phoneNumber);
            setBrand(selectedData.car.brand);
            setSelectedModel(selectedData.car.selectedModel);
            setSelectedColor(selectedData.car.selectedColor);
        } else {
            setLineId('');
            setCustomerName('');
            setPhoneNumber('');
            setBrand('');
            setSelectedModel('');
            setSelectedColor('');
        }
    };

    const handleBrandChange = (e) => {
        setBrand(e.target.value);
        setSelectedModel('');
        setCustomBrand('');
        setCustomModel('');

        setIsFormEdited(true);
    };

    const handleModelChange = (e) => {
        setSelectedModel(e.target.value);
        if (e.target.value === 'custom-model') {
            setCustomModel('');
        }

        setIsFormEdited(true);
    };

    const handleColorChange = (e) => {
        setSelectedColor(e.target.value);
        if (e.target.value === 'custom-color') {
            setCustomColor('');
        }

        setIsFormEdited(true);
    };

    const handleConfirmBackModal = () => {
        if (isFormEdited) {
            setShowConfirmBackModal(true);
        } else {
            navigate('/home');
        }
    };

    const handleConfirmBackModalClose = () => {
        setShowConfirmBackModal(false);
    };

    return (
        <div className='carregis'>
            <div className='carregis-head'>
                <div className='carregis-title'>
                    ลงทะเบียนรถ
                </div>
            </div>

            {message &&
                <div className="message">
                    {message}
                </div>
            }

            <form className='customer-form'>
                <div className='row'>
                    <div className='col col-6'>
                        <label>
                            ป้ายทะเบียน เช่น XX 0000 NARATHIWAT <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={numPlate}
                            onChange={(e) => {
                                handleNumPlateChange({
                                    value: e.target.value,
                                    isFormEdited: e.target.value !== numPlate,
                                });
                            }}
                            list='customerNumplatesList'
                        />
                        <datalist id="customerNumplatesList">
                            {uniqueCustomerNumplates.map((numPlate, index) => (
                                <option key={index} value={numPlate} />
                            ))}
                        </datalist>
                    </div>
                    <div className='col col-6'>
                        <label>LINE ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={lineId}
                            onChange={(e) => {
                                setLineId(e.target.value)
                                if (e.target.value !== lineId) {
                                    setIsFormEdited(true);
                                }
                            }}
                            list='customerLineIdList'
                        />
                        <datalist id="customerLineIdList">
                            {uniqueCustomerLineId.map((lineId, index) => (
                                <option key={index} value={lineId} />
                            ))}
                        </datalist>
                    </div>
                </div>
                <div className='row'>
                    <div className='col col-6'>
                        <label>
                            ยี่ห้อรถ: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <select className="form-control" value={brand} onChange={handleBrandChange}>
                            <option value="">กรุณาเลือก</option>
                            {Array.from(new Set(brandmodels.map((brandmodel) => brandmodel.brand))).map((uniqueBrand) => (
                                <option key={uniqueBrand} value={uniqueBrand}>
                                    {uniqueBrand}
                                </option>
                            ))}
                            <option value="other">อื่นๆ</option>
                        </select>
                        {brand === 'other' && (
                            <input
                                type="text"
                                className='form-other'
                                value={customBrand}
                                onChange={(e) => setCustomBrand(e.target.value)}
                                placeholder="กรอกยี่ห้อรถ"
                            />
                        )}
                    </div>
                    <div className='col col-6'>
                        <label>
                            ชื่อลูกค้า: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={customerName}
                            onChange={(e) => {
                                setCustomerName(e.target.value)
                                if (e.target.value !== customerName) {
                                    setIsFormEdited(true);
                                }
                            }}
                            list='customerNamesList'
                        />
                        <datalist id="customerNamesList">
                            {uniqueCustomerNames.map((customerName, index) => (
                                <option key={index} value={customerName} />
                            ))}
                        </datalist>
                    </div>
                </div>
                <div className='row'>
                    <div className='col col-6'>
                        <label>
                            รุ่นรถ: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <select className="form-control" value={selectedModel} onChange={handleModelChange}>
                            <option value="">กรุณาเลือก</option>
                            {brandmodels
                                .filter((brandmodel) => brandmodel.brand === brand)
                                .map((brandmodel) => (
                                    <option key={brandmodel._id} value={brandmodel.model}>
                                        {brandmodel.model}
                                    </option>
                                ))}
                            <option value="custom-model">
                                {customModel ? customModel : 'กรุณากรอกรุ่นรถ'}
                            </option>
                        </select>
                        {selectedModel === 'custom-model' && (
                            <>
                                <input
                                    type="text"
                                    className='form-other'
                                    value={customModel}
                                    onChange={(e) => setCustomModel(e.target.value)}
                                    placeholder="กรอกรุ่นรถ"
                                />
                            </>
                        )}
                    </div>
                    <div className='col col-6'>
                        <label>
                            เบอร์โทรศัพท์ (0812345678): <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            pattern="[0]{1}[0-9]{9}"
                            value={phoneNumber}
                            onChange={(e) => {
                                setPhoneNumber(e.target.value)
                                if (e.target.value !== phoneNumber) {
                                    setIsFormEdited(true);
                                }
                            }}
                        />
                        {error &&
                            <div className="danger">
                                {error}
                            </div>
                        }
                    </div>
                </div>
                <div className='row'>
                    <div className='col col-6'>
                        <label>
                            สี: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <select
                            className="form-control"
                            value={selectedColor}
                            onChange={handleColorChange}>
                            <option value="">กรุณาเลือก</option>
                            {colors
                                .map((color) => (
                                    <option key={color._id} value={color.colorname}>
                                        {color.colorname}
                                    </option>
                                ))}
                            <option value="custom-color">
                                {customColor ? customColor : 'กรุณากรอกสีรถ'}
                            </option>
                        </select>
                        {selectedColor === 'custom-color' && (
                            <>
                                <input
                                    type="text"
                                    className='form-other'
                                    value={customColor}
                                    onChange={(e) => setCustomColor(e.target.value)}
                                    placeholder="กรอกสีรถ"
                                />
                            </>
                        )}
                    </div>
                    <div className='col col-6'>
                        <label>
                            วันที่: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={startdate}
                            onChange={(e) => {
                                setStartDate(e.target.value)
                                if (e.target.value !== startdate) {
                                    setIsFormEdited(true);
                                }
                            }}
                        />
                    </div>
                </div>
            </form>
            <div className='button-carregis'>
                <span className='button-regis' onClick={handleConfirmBackModal}>
                    CANCEL
                </span>

                <span className='button-regis' onClick={handleAddCustomer}>
                    SAVE
                </span>
            </div>

            <Modal className='confirmbackmodal' show={showConfirmBackModal} onHide={handleConfirmBackModalClose} backdrop="static" size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>ยกเลิกการลงทะเบียนรถ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ยืนยันการออกจากหน้าลงทะเบียนรถ
                </Modal.Body>
                <Modal.Footer>
                    <div className='button-no' onClick={handleConfirmBackModalClose}>
                        NO
                    </div>

                    <Link to="/home">
                        <div className='button-yes'>
                            YES
                        </div>
                    </Link>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default CarRegistration;