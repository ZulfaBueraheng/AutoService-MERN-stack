import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceManagement.scss';
import Modal from 'react-bootstrap/Modal';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');

  const [editingServiceId, setEditingServiceId] = useState(null);
  const [message, setMessage] = useState('');

  const [showAddEditServiceModal, setShowAddEditServiceModal] = useState('');

  const [searchText, setSearchText] = useState('');

  const filteredServices = services.filter((service) => {
    return service.serviceName.toLowerCase().includes(searchText.toLowerCase())
  });

  const sortByService = (data) => {
    return data.sort((a, b) => {
      if (a.serviceName.toLowerCase() < b.serviceName.toLowerCase()) return -1;
      if (a.serviceName.toLowerCase() > b.serviceName.toLowerCase()) return 1;
      return 0;
    });
  };

  const sortedServices = sortByService(filteredServices);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await axios.get('https://autoservice-k7ez.onrender.com/services');
      setServices(response.data);
      setMessage('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลบริการ:', error);
      setMessage('เกิดข้อผิดพลาดในการดึงข้อมูลบริการ');
    }
  };

  const handleAddService = (service) => {
    setShowAddEditServiceModal(true);

    setServiceName(service.serviceName);
    setEditingServiceId(service._id);
  };

  const handlePushService = async () => {
    if (!serviceName || !serviceName.trim()) {
      setMessage('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบริการ');
      return;
    }

    try {
      await axios.post('https://autoservice-k7ez.onrender.com/services', {
        serviceName,
      });

      setShowAddEditServiceModal(false);
      loadServices();
      clearForm();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลบริการ:', error);
      setMessage(error.response.data.message);
    }
  };

  const handleEditService = (service) => {
    setShowAddEditServiceModal(true);
    setServiceName(service.serviceName);
    setEditingServiceId(service._id);
  };

  const handleUpdateService = async () => {
    if (!serviceName.trim()) {
      setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูลบริการ');
      return;
    }

    try {
      await axios.put(`https://autoservice-k7ez.onrender.com/services/${editingServiceId}`, {
        serviceName,
      });

      setShowAddEditServiceModal(false);
      loadServices();
      clearForm();
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูลบริการ:', error);
      setMessage(error.response.data.message);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`https://autoservice-k7ez.onrender.com/services/${id}`);
      loadServices();
      setMessage(error.response.data.message);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูลบริการ:', error);
      setMessage(error.response.data.message);
    }
  };

  const clearForm = () => {
    setServiceName('');
    setEditingServiceId(null);
    setMessage('');
  };

  const handleAddEditServiceModalClose = () => {
    setShowAddEditServiceModal(false)
    clearForm();
  };

  return (
    <div className='service-management'>
      <div className='servicemanagement-data'>
        <div className='search-title'>
          ค้นหาบริการ
        </div>

        <div className='row'>
          <div className='col-10 input-search'>
            <input
              type="text"
              class='form-control'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ค้นหาบริการ"
            />
          </div>

          <div className='col-2 add-button' onClick={handleAddService}>
            เพิ่มอะไหล่
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ชื่อบริการ</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {sortedServices.map((service) => (
              <tr key={service._id}>
                <td>{service.serviceName}</td>
                <td>
                  <div className='edit-button' onClick={() => handleEditService(service)}>แก้ไข</div>
                  <div className='delete-button' onClick={() => handleDeleteService(service._id)}>ลบ</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        className='addeditservicemodal'
        show={showAddEditServiceModal}
        onHide={handleAddEditServiceModalClose}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div>
              {editingServiceId ? 'แก้ไขชื่อบริการ' : 'เพิ่มบริการ'}
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>
            ชื่อบริการ: <span style={{ color: 'red', fontSize: '18px' }}>*</span>
          </label>
          <input
            type='text'
            class="form-control"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />

          {message &&
            <div className='error-form'>
              {message}
            </div>
          }
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleAddEditServiceModalClose}>
            ยกเลิก
          </div>
          <div className='button-yes'
            onClick={editingServiceId ? () =>
              handleUpdateService(editingServiceId) : handlePushService}>
            {editingServiceId ? 'แก้ไข' : 'เพิ่ม'}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServiceManagement;
