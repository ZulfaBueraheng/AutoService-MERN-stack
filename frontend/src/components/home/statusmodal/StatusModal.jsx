import React from 'react';
import Modal from 'react-bootstrap/Modal';
import "./StatusModal.scss";

const StatusModal = ({
  showStatusModal,
  handleStatusModalClose,
  selectedCustomerStatus,
  state1,
  state2,
  state3,
  state4,
  state5,
  setState2,
  setState3,
  setState4,
  setState5,
  handleToggleState,
  handleUpdateStatus,
  editingCustomerId
}) => {

  return (
    <Modal
      className='statusmodal'
      show={showStatusModal}
      onHide={handleStatusModalClose}
      backdrop="static"
      size="xl"
      centered
    >
      <Modal.Body>
        <div className="status-header-container">
          {selectedCustomerStatus && (
            <div className="status-header">
              {selectedCustomerStatus.car.brand}{" "}
              {selectedCustomerStatus.car.selectedModel}{" "}
              {selectedCustomerStatus.car.color}{" "}
              {selectedCustomerStatus.car.numPlate}
            </div>
          )}
        </div>

        <div className="status-container">
          <div className='row'>
            <div className="state col col-2">
              <div className={`state ${state1 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/car.png'></img>
                </div>
              </div>
              <div className='state-label'>รับรถ</div>
              <div className='statebutton-container'>
                <div className="button-true">เรียบร้อย</div>
              </div>
            </div>
            <div className="state col col-2">
              <div className={`state ${state2 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state2.png'></img>
                </div>
              </div>
              <div className='state-label'>ตรวจสภาพรถ</div>
              <div className='statebutton-container'>
                <div
                  onClick={() => {
                    if (state1) {
                      handleToggleState("state2");
                    }
                    if (state3 || state4 || state5) {
                      setState2(false);
                      setState3(false);
                      setState4(false);
                      setState5(false);
                    }
                  }}
                  className={state2 ? "button-true" : "button-false"}
                >
                  {state2 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                </div>
              </div>
            </div>
            <div className="state col col-2">
              <div className={`state ${state3 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state3.png'></img>
                </div>
              </div>
              <div className='state-label'>หาอะไหล่</div>
              <div className='statebutton-container'>
                <div
                  onClick={() => {
                    if (state2) {
                      handleToggleState("state3");
                    }
                    if (state4 || state5) {
                      setState3(false);
                      setState4(false);
                      setState5(false);
                    }
                  }}
                  className={state3 ? "button-true" : "button-false"}
                >
                  {state3 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                </div>
              </div>
            </div>
            <div className="state col col-2">
              <div className={`state ${state4 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state4.png'></img>
                </div>
              </div>
              <div className='state-label'>ดำเนินการซ่อม</div>
              <div className='statebutton-container'>
                <div
                  onClick={() => {
                    if (state3) {
                      handleToggleState("state4");
                    }
                    if (state5) {
                      setState4(false);
                      setState5(false);
                    }
                  }}
                  className={state4 ? "button-true" : "button-false"}
                >
                  {state4 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                </div>
              </div>
            </div>
            <div className="state col col-2">
              <div className={`state ${state5 ? "status-active" : "status"}`}>
                <div className="state-circle1"></div>
                <div className="state-circle2">
                  <img src='./assets/image/state5.png'></img>
                </div>
              </div>
              <div className='state-label'>ส่งมอบรถ</div>
              <div className='statebutton-container'>
                <div
                  onClick={() => {
                    if (state4) {
                      handleToggleState("state5");
                    }
                  }}
                  className={state5 ? "button-true" : "button-false"}
                >
                  {state5 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="status-price-container">
          {selectedCustomerStatus && (
            <div className="">
              ราคาโดยประมาณ {selectedCustomerStatus.totalCost} บาท
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div
          onClick={handleStatusModalClose}
          className="button-no"
        >
          CANCEL
        </div>
        <div
          onClick={() => handleUpdateStatus(editingCustomerId)}
          className="button-yes"
        >
          SAVE
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default StatusModal;
