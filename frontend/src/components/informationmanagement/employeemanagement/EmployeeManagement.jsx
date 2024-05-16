import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EmployeeManagement.scss';
import Modal from 'react-bootstrap/Modal';

const EmployeeManagement = () => {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [subdistrict, setSubdistrict] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');

    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [message, setMessage] = useState('');

    const [showAddEditEmployeeModal, setShowAddEditEmployeeModal] = useState('');

    const [searchText, setSearchText] = useState('');

    const filteredEmployees = employees.filter((employee) => {
        const employeeNameLowerCase = employee && employee.name ? employee.name.toLowerCase() : '';
        const employeeNicknameLowerCase = employee && employee.nickname ? employee.nickname.toLowerCase() : '';

        return employeeNameLowerCase.includes(searchText.toLowerCase()) ||
            employeeNicknameLowerCase.includes(searchText.toLowerCase());
    });


    const sortByEmployee = (data) => {
        return data.sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    };

    const sortedEmployees = sortByEmployee(filteredEmployees);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/employees');
            setEmployees(response.data);
            setMessage('');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลพนักงาน:', error);
            setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน');
        }
    };

    const handleAddEmployee = (employee) => {
        setShowAddEditEmployeeModal(true);

        setName(employee.name);
        setNickname(employee.nickname)
        setPhone(employee.phone);
        setSubdistrict(employee.address.subdistrict);
        setDistrict(employee.address.district);
        setProvince(employee.address.province);
        setEditingEmployeeId(employee._id);
    };

    const handlePushEmployee = async () => {
        if (!name || !name.trim()) {
            setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลพนักงาน');
            return;
        }

        try {
            await axios.post('https://autoservice-k7ez.onrender.com/employees', {
                name,
                nickname,
                phone,
                subdistrict,
                district,
                province,
            });

            setShowAddEditEmployeeModal(false);
            loadEmployees();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลพนักงาน:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleEditEmployee = (employee) => {
        setShowAddEditEmployeeModal(true);
        setName(employee.name);
        setNickname(employee.nickname)
        setPhone(employee.phone);
        setSubdistrict(employee.address.subdistrict);
        setDistrict(employee.address.district);
        setProvince(employee.address.province);
        setEditingEmployeeId(employee._id);
    };

    const handleUpdateEmployee = async (id) => {
        if (!name.trim()) {
            setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลพนักงาน');
            return;
        }

        try {
            await axios.put(`https://autoservice-k7ez.onrender.com/employees/${id}`, {
                name,
                nickname,
                phone,
                subdistrict,
                district,
                province,
            });

            setShowAddEditEmployeeModal(false);
            loadEmployees();
            clearForm();
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลพนักงาน:', error);
            setMessage(error.response.data.message);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`https://autoservice-k7ez.onrender.com/employees/${id}`);
            loadEmployees();
            setMessage('ลบข้อมูลพนักงานเรียบร้อยแล้ว');
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน:', error);
            setMessage('เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน');
        }
    };

    const clearForm = () => {
        setName('');
        setNickname('');
        setPhone('');
        setSubdistrict('');
        setDistrict('');
        setProvince('');
        setEditingEmployeeId(null);
        setMessage('');
    };

    const handleAddEditEmployeeModalClose = () => {
        setShowAddEditEmployeeModal(false)
        clearForm();
    }

    return (
        <div className='employee-management'>
            <div className='employeemanagement-data'>
                <div className='search-title'>
                    ค้นหาพนักงาน
                </div>

                <div className='row'>
                    <div className='col-10 input-search'>
                        <input
                            type="text"
                            class="form-control"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="ค้นหาชื่อพนักงาน"
                        />
                    </div>

                    <div className='col-2 add-button' onClick={handleAddEmployee}>
                        เพิ่มพนักงาน
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ชื่อ-นามสกุล</th>
                            <th>ชื่อเล่น</th>
                            <th>เบอร์โทร</th>
                            <th>ที่อยู่</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEmployees.map((employee) => (
                            <tr key={employee._id}>
                                <td>{employee.name}</td>
                                <td>{employee.nickname}</td>
                                <td>{employee.phone}</td>
                                <td>
                                    {employee.address.subdistrict}, {employee.address.district}, {employee.address.province}
                                </td>
                                <td>
                                    <div className='edit-button' onClick={() => handleEditEmployee(employee)}>
                                        แก้ไข
                                    </div>
                                    <div className='delete-button' onClick={() => handleDeleteEmployee(employee._id)}>
                                        ลบ
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                className='addeditemployeemodal'
                show={showAddEditEmployeeModal}
                onHide={handleAddEditEmployeeModalClose}
                backdrop="static"
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            {editingEmployeeId ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มข้อมูลพนักงาน'}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='row'>
                        <div className='col col-12'>
                            <label>
                                ชื่อ-นามสกุล: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
                            </label>
                            <input
                                type="text"
                                class="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col col-6'>
                            <label>ชื่อเล่น:</label>
                            <input
                                type="text"
                                class="form-control"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                            />
                        </div>
                        <div className='col col-6'>
                            <label>เบอร์โทร:</label>
                            <input
                                type="number"
                                class="form-control"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col'>
                            <label>ตำบล:</label>
                            <input
                                type="text"
                                class="form-control"
                                value={subdistrict}
                                onChange={(e) => setSubdistrict(e.target.value)}
                            />
                        </div>
                        <div className='col'>
                            <label>อำเภอ:</label>
                            <input
                                type="text"
                                class="form-control"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            />
                        </div>
                        <div className='col'>
                            <label>จังหวัด:</label>
                            <input
                                type="text"
                                class="form-control"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            />
                        </div>
                    </div>

                    {message &&
                        <div className='error-form'>
                            {message}
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <div className='button-no' onClick={handleAddEditEmployeeModalClose}>
                        ยกเลิก
                    </div>
                    <div className='button-yes'
                        onClick={editingEmployeeId ? () =>
                            handleUpdateEmployee(editingEmployeeId) : handlePushEmployee}>

                        {editingEmployeeId ? 'แก้ไข' : 'เพิ่ม'}
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeManagement;
