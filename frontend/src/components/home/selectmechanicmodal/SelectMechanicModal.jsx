import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import "./SelectMechanicModal.scss";

const SelectMechanicModal = ({
  showSelectMechanicModal,
  handleSelectMechanicModalClose,
  mechanics,
  selectedMechanics,
  handleSelectMechanic,
  handleAddMechanic,
  editingCustomerId,
  loadMechanics,
  isFormEdited,
  setIsFormEdited,
  searchMechanic,
  setSearchMechanic,
  name,
  setName
}) => {

  const [showConfirmCancelEditMechanicModal, setShowConfirmCancelEditMechanicModal] = useState(false);

  const filteredMechanics = mechanics.filter((mechanic) => {
    return mechanic.name.toLowerCase().includes(searchMechanic.toLowerCase())
  });

  const selectedChoice = filteredMechanics.filter(mechanic => selectedMechanics.includes(mechanic.name));
  const unselectedChoice = filteredMechanics.filter(mechanic => !selectedMechanics.includes(mechanic.name));

  const reorderedMechanics = [...selectedChoice, ...unselectedChoice];

  const handleConfirmCancelEditMechanicModalClose = () => {
    setShowConfirmCancelEditMechanicModal(false);
  }

  const handleCancelUpdateMechanic = () => {
    handleConfirmCancelEditMechanicModalClose();
    handleSelectMechanicModalClose();
    setIsFormEdited(false);
  };

  const handleAddOptionMechanic = async () => {
    try {
      await axios.post('https://autoservice-k7ez.onrender.com/employees', {
        name,
        nickname: '',
        phone: '',
        subdistrict: '',
        district: '',
        province: '',
      });

      loadMechanics();
      setName('');
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลช่าง:', error);
    }
  };

  const handleConfirmBackModal = () => {
    if (isFormEdited) {
      setShowConfirmCancelEditMechanicModal(true);
    } else {
      handleSelectMechanicModalClose();
    }
  };

  return (
    <div>
      <Modal
        className='selectmechanicmodal'
        show={showSelectMechanicModal}
        onHide={handleSelectMechanicModalClose}
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ช่างที่ทำการซ่อม</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className='mechanic-searchbox'>
              <input
                type="text"
                id="input-with-icon-adornment"
                value={searchMechanic}
                onChange={(e) => setSearchMechanic(e.target.value)}
                placeholder="ค้นหาช่าง"
              />
            </div>

            <ul className='mechanic-choice'>
              {reorderedMechanics.map((mechanic) => (
                <div key={mechanic._id} value={mechanic.name}>
                  <span className='input-checkbox'>
                    <input
                      type="checkbox"
                      checked={selectedMechanics.includes(mechanic.name)}
                      onChange={() => handleSelectMechanic(mechanic.name)}
                    />
                  </span>
                  <span className="mechanic-label">
                    <div className={`mechanic-name ${selectedMechanics.includes(mechanic.name) ? 'selected' : 'not-selected'}`}>
                      {mechanic.name}
                    </div>
                  </span>
                </div>
              ))}

              <div className='addoption'>
                <input
                  type='text'
                  placeholder='เพิ่มตัวเลือกช่าง'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div
                  onClick={handleAddOptionMechanic}
                  className='addoption-button'
                >
                  เพิ่ม
                </div>
              </div>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmBackModal}>
            CANCEL
          </div>
          <div className='button-yes' onClick={() => handleAddMechanic(editingCustomerId)}>
            SAVE
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        className='confirmcanceleditmechanicmodal'
        show={showConfirmCancelEditMechanicModal}
        onHide={handleConfirmCancelEditMechanicModalClose}
        backdrop="static"
        size="lg"
        centered
        style={{ backgroundColor: "#7b7b7ba7" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>ยกเลิกการแก้ไข</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ยืนยันการยกเลิกแก้ไขข้อมูลพนักงาานที่ทำการซ่อม
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmCancelEditMechanicModalClose}>
            NO
          </div>

          <div className='button-yes' onClick={handleCancelUpdateMechanic}>
            YES
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SelectMechanicModal;
