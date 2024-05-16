import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpareManagement.scss';
import Modal from 'react-bootstrap/Modal';

const SpareManagement = () => {
    const [spares, setSpares] = useState([]);
    const [spareName, setSpareName] = useState('');
    const [spareType, setSpareType] = useState('');
    const [sparePrice, setSparePrice] = useState('');

    const [editingSpareId, setEditingSpareId] = useState(null);
    const [message, setMessage] = useState('');

    const [showAddEditSpareModal, setShowAddEditSpareModal] = useState('');

    const [searchText, setSearchText] = useState('');

    const filteredSpares = spares.filter((spare) => {
        const spareNameLowerCase = spare && spare.spareName ? spare.spareName.toLowerCase() : '';
        const spareTypeLowerCase = spare && spare.spareType ? spare.spareType.toLowerCase() : '';

        return spareNameLowerCase.includes(searchText.toLowerCase()) ||
            spareTypeLowerCase.includes(searchText.toLowerCase());
    });

    const sortBySpare = (data) => {
        return data.sort((a, b) => {
            if (!a.spareType && !b.spareType) return a.spareName.localeCompare(b.spareName);
            if (!a.spareType) return 1;
            if (!b.spareType) return -1;

            if (a.spareType.toLowerCase() < b.spareType.toLowerCase()) return -1;
            if (a.spareType.toLowerCase() > b.spareType.toLowerCase()) return 1;

            if (a.spareName.toLowerCase() < b.spareName.toLowerCase()) return -1;
            if (a.spareName.toLowerCase() > b.spareName.toLowerCase()) return 1;
            return 0;
        });
    };

    const sortedSpares = sortBySpare(filteredSpares);

    useEffect(() => {
        loadSpares();
    }, []);

    const loadSpares = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/spares');
            setSpares(response.data);
            setMessage('');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลอะไหล่:', error);
            setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลอะไหล่');
        }
    };

    const handleAddSpare = (spare) => {
        setShowAddEditSpareModal(true);

        setSpareName(spare.spareName);
        setSpareType(spare.spareType)
        setSparePrice(spare.sparePrice);
        setEditingSpareId(spare._id);
    };

    const handlePushSpare = async () => {
        if (!spareName || !spareName.trim() || !sparePrice) {
            setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลอะไหล่');
            return;
        }

        try {
            await axios.post('https://autoservice-k7ez.onrender.com/spares', {
                spareName,
                spareType,
                sparePrice,
            });

            setShowAddEditSpareModal(false);
            loadSpares();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลอะไหล่:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleEditSpare = (spare) => {
        setShowAddEditSpareModal(true);
        setSpareName(spare.spareName);
        setSpareType(spare.spareType)
        setSparePrice(spare.sparePrice);
        setEditingSpareId(spare._id);
    };

    const handleUpdateSpare = async (id) => {
        if (!spareName.trim() || !sparePrice) {
            setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่');
            return;
        }

        try {
            await axios.put(`https://autoservice-k7ez.onrender.com/spares/${id}`, {
                spareName,
                spareType,
                sparePrice,
            });

            setShowAddEditSpareModal(false);
            loadSpares();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลอะไหล่:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleDeleteSpare = async (id) => {
        try {
            await axios.delete(`https://autoservice-k7ez.onrender.com/spares/${id}`);
            loadSpares();
            setMessage(error.response.data.message);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูลอะไหล่:', error);
            setMessage(error.response.data.message);
        }
    };

    const clearForm = () => {
        setSpareName('');
        setSpareType('');
        setSparePrice('');
        setEditingSpareId(null);
        setMessage('');
    };

    const handleAddEditSpareModalClose = () => {
        setShowAddEditSpareModal(false)
        clearForm();
    };

    return (
        <div className='spare-management'>
            <div className='sparemanagement-data'>
                <div className='search-title'>
                    ค้นหาอะไหล่
                </div>

                <div className='row'>
                    <div className='col-10 input-search'>
                        <input
                            type="text"
                            class='form-control'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="ค้นหาอะไหล่"
                        />
                    </div>

                    <div className='col-2 add-button' onClick={handleAddSpare}>
                        เพิ่มอะไหล่
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ชื่ออะไหล่</th>
                            <th>ประเภท</th>
                            <th>ราคา</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedSpares.map((spare) => (
                            <tr key={spare._id}>
                                <td>{spare.spareName}</td>
                                <td>{spare.spareType}</td>
                                <td>{spare.sparePrice}</td>
                                <td>
                                    <div className='edit-button' onClick={() => handleEditSpare(spare)}>แก้ไข</div>
                                    <div className='delete-button' onClick={() => handleDeleteSpare(spare._id)}>ลบ</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                className='addeditsparemodal'
                show={showAddEditSpareModal}
                onHide={handleAddEditSpareModalClose}
                backdrop="static"
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            {editingSpareId ? 'แก้ไขอะไหล่' : 'เพิ่มอะไหล่'}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>
                            ชื่ออะไหล่: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <input
                            type="text"
                            class="form-control"
                            value={spareName}
                            onChange={(e) => setSpareName(e.target.value)}
                        />
                        <label>ประเภท:</label>
                        <input
                            type="text"
                            class="form-control"
                            value={spareType}
                            onChange={(e) => setSpareType(e.target.value)}
                        />
                        <label>
                            ราคา: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                        </label>
                        <input
                            type="number"
                            class="form-control"
                            value={sparePrice}
                            onChange={(e) => setSparePrice(e.target.value)}
                        />
                    </div>
                    {message &&
                        <div className='error-form'>
                            {message}
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className='button-no' onClick={handleAddEditSpareModalClose}>
                        ยกเลิก
                    </div>
                    <div className='button-yes'
                        onClick={editingSpareId ? () =>
                            handleUpdateSpare(editingSpareId) : handlePushSpare}>
                        {editingSpareId ? 'แก้ไข' : 'เพิ่ม'}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SpareManagement;