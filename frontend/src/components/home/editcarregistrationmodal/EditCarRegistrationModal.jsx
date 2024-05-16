import React from 'react';
import Modal from 'react-bootstrap/Modal';
import "./EditCarRegistrationModal.scss";

const EditCarRegistrationModal = ({
  showCarRigisterModal,
  handleAddCustomerModalClose,
  message,
  error,
  numPlate,
  lineId,
  brand,
  customBrand,
  setCustomBrand,
  brandmodels,
  customerName,
  selectedModel,
  customModel,
  phoneNumber,
  selectedColor,
  customColor,
  startdate,
  handleBrandChange,
  uniqueCustomerNumplates,
  uniqueCustomerNames,
  uniqueCustomerLineId,
  handleModelChange,
  handleColorChange,
  colors,
  setStartDate,
  handleUpdateCustomer,
  editingCustomerId,
  setNumPlate,
  setLineId,
  setCustomerName,
  setCustomModel,
  setPhoneNumber,
  setCustomColor,
  setShowConfirmBackModal,
  showConfirmBackModal,
  handleConfirmBackModalClose,
  isFormEdited,
  setIsFormEdited
}) => {

  const handleCancelUpdateCustomer = () => {
    handleConfirmBackModalClose();
    handleAddCustomerModalClose();
    setIsFormEdited(false);
  };

  const handleConfirmBackModal = () => {
    if (isFormEdited) {
      setShowConfirmBackModal(true);
    } else {
      handleAddCustomerModalClose();
    }
  };

  return (
    <div className='editcarregis'>
      <Modal
        show={showCarRigisterModal}
        onHide={handleAddCustomerModalClose}
        className='editcarregismodal'
        backdrop="static"
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลลูกค้า</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>

            {message &&
              <div className="message">
                {message}
              </div>
            }

            <form className='editcustomer-form'>
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
                      setNumPlate(e.target.value)
                      if (e.target.value !== numPlate) {
                        setIsFormEdited(true);
                      }
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
                    ชื่อลูกค้า: <span style={{ color: 'red', fontSize: '18px' }}>*</span></label>
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
                  <select
                    className="form-control"
                    value={selectedModel}
                    onChange={handleModelChange}
                  >
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
                    onChange={handleColorChange}
                  >
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
                    value={startdate}
                    onChange={(e) => {
                      setStartDate(e.target.value)
                      if (e.target.value !== startdate) {
                        setIsFormEdited(true);
                      }
                    }}
                    className="form-control"
                  />
                </div>
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmBackModal}>
            CANCEL
          </div>
          <div className='button-yes' onClick={() => handleUpdateCustomer(editingCustomerId)}>
            UPDATE
          </div>
        </Modal.Footer>
      </Modal>

      <Modal
        className='confirmbackmodal'
        show={showConfirmBackModal}
        onHide={handleConfirmBackModalClose}
        backdrop="static"
        size="lg"
        centered
        style={{ backgroundColor: "#7b7b7ba7" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>ยกเลิกการแก้ไข</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ยืนยันการยกเลิกแก้ไขข้อมูลลูกค้า
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmBackModalClose}>
            NO
          </div>

          <div className='button-yes' onClick={handleCancelUpdateCustomer}>
            YES
          </div>
        </Modal.Footer>
      </Modal>
    </div>

  )
};

export default EditCarRegistrationModal;
