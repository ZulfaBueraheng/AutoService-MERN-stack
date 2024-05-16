import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal"; // Import Modal component
import "./Startpage.scss";
import '@fortawesome/fontawesome-free/css/all.css';

const StartPage = () => {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsWOEnd, setSearchResultsWOEnd] = useState([]);
  const [searchResultsAll, setSearchResultsAll] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.length === 10) {
      try {
        const response = await axios.get(`https://autoservice-k7ez.onrender.com/repairs`);
        setCustomers(response.data);

        const updatedResultsWOEnd = response.data.filter(
          (customer) =>
            customer.customer.phoneNumber.includes(searchQuery) &&
            !customer.status.state5
        );
        setSearchResultsWOEnd(updatedResultsWOEnd);

        const updatedResults = response.data.filter(
          (customer) =>
            customer.customer.phoneNumber.includes(searchQuery) &&
            customer.status.state5
        );
        setSearchResults(updatedResults);

        const updatedResultsAll = response.data.filter((customer) =>
          customer.customer.phoneNumber.includes(searchQuery)
        );
        setSearchResultsAll(updatedResultsAll);
      } catch (error) {
        console.error("Error loading customer data:", error);
      }
    } else {
      setSearchResults([]);
    }
  };
  const loadServices = async () => {
    try {
      const response = await axios.get("https://autoservice-k7ez.onrender.com/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };
  const sortedResultsWOEnd = searchResultsWOEnd.sort((a, b) => {
    return new Date(b.startdate) - new Date(a.startdate);
  });

  const sortedResults = searchResults.sort((a, b) => {
    return new Date(b.startdate) - new Date(a.startdate);
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="startpage">
      <div className="search-bar">
        <input
          type="text"
          placeholder="ป้อนเบอร์โทรศัพท์"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <span className="search-button" onClick={handleSearch}>
          ค้นหา
        </span>
      </div>

      {searchResultsAll.length > 0 ? (
        <div>
          <div className="startpage-alldone-container">
            <div className="startpage-alldone-button">
              <div className="startpage-alldone" onClick={handleShowModal}>
                ประวัติการซ่อม  <i className="fas fa-history"></i>
              </div></div>
            <Modal
              className="startpagemodal"
              show={showModal}
              onHide={handleCloseModal}
              backdrop="static"
              size="xl"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>ประวัติการซ่อม</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {sortedResults.map((customer, index) => (
                  <div className="status-history row" key={index}>
                    <div className="status-detail-container">
                      <div className="status-detail">
                        <div className="status-detail1">{customer.car.brand} {customer.car.selectedModel}</div>
                        <div className="status-detail2">{customer.car.color} {customer.car.numPlate}</div>
                      </div>
                      <div className="">
                        รายการซ่อม :
                        {customer.services.map((service, serviceIndex) => (
                          <div className="status-repair" key={serviceIndex}>
                            {service.serviceName}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="status-date">
                      <div>วันที่รับรถ {customer.startdate}</div>
                      <div>วันที่ส่งมอบ {customer.enddate}</div>
                    </div>
                  </div>
                ))}
              </Modal.Body>
            </Modal>
          </div>

          <div>
            {searchResultsWOEnd.length > 0 ? (
              sortedResultsWOEnd.map((customer, index) => (
                <div className="startpage-card" key={index}>
                  <div className="status-header-container">
                    <div className="status-header">
                      <div className="status-header1">
                        {customer.car.brand} {customer.car.selectedModel}
                      </div>
                      <div className="status-header2">
                        {customer.car.color} {customer.car.numPlate}
                      </div>
                    </div>
                  </div>

                  <div className="status-container">
                    <div className="row">
                      <div className="state">
                        <div className="status-image-container">
                          <div
                            className={`state ${customer.status.state1
                                ? "status-active"
                                : "status"
                              }`}
                          >
                            <div className="state-circle1"></div>
                            <div className="state-circle2">
                              <img src="./assets/image/car.png"></img>
                            </div>
                          </div>
                        </div>
                        <div className="status-state-container">
                          <div className="state-label">รับรถ</div>
                          <div className="statebutton-container">
                            <div
                              className={`state ${customer.status.state1
                                  ? "button-true"
                                  : "button-false"
                                }`}
                            >
                              เรียบร้อย
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="state">
                        <div className="status-image-container">
                          <div
                            className={`state ${customer.status.state2
                                ? "status-active"
                                : "status"
                              }`}
                          >
                            <div className="state-circle1"></div>
                            <div className="state-circle2">
                              <img src="./assets/image/state2.png"></img>
                            </div>
                          </div>
                        </div>
                        <div className="status-state-container">
                          <div className="state-label">ตรวจสภาพรถ</div>
                          <div className="statebutton-container">
                            <div
                              className={`state ${customer.status.state2
                                  ? "button-true"
                                  : "button-false"
                                }`}
                            >
                              {customer.status.state2 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="state">
                        <div className="status-image-container">
                          <div
                            className={`state ${customer.status.state3
                                ? "status-active"
                                : "status"
                              }`}
                          >
                            <div className="state-circle1"></div>
                            <div className="state-circle2">
                              <img src="./assets/image/state3.png"></img>
                            </div>
                          </div>
                        </div>
                        <div className="status-state-container">
                          <div className="state-label">หาอะไหล่</div>
                          <div className="statebutton-container">
                            <div
                              className={`state ${customer.status.state3
                                  ? "button-true"
                                  : "button-false"
                                }`}
                            >
                              {customer.status.state3 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="state">
                        <div className="status-image-container">
                          <div
                            className={`state ${customer.status.state4
                                ? "status-active"
                                : "status"
                              }`}
                          >
                            <div className="state-circle1"></div>
                            <div className="state-circle2">
                              <img src="./assets/image/state4.png"></img>
                            </div>
                          </div>
                        </div>
                        <div className="status-state-container">
                          <div className="state-label">ดำเนินการซ่อม</div>
                          <div className="statebutton-container">
                            <div
                              className={`state ${customer.status.state4
                                  ? "button-true"
                                  : "button-false"
                                }`}
                            >
                              {customer.status.state4 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="state">
                        <div className="status-image-container">
                          <div
                            className={`state ${customer.status.state5
                                ? "status-active"
                                : "status"
                              }`}
                          >
                            <div className="state-circle1"></div>
                            <div className="state-circle2">
                              <img src="./assets/image/state5.png"></img>
                            </div>
                          </div>
                        </div>
                        <div className="status-state-container">
                          <div className="state-label">ส่งมอบรถ</div>
                          <div className="statebutton-container">
                            <div
                              className={`state ${customer.status.state5
                                  ? "button-true"
                                  : "button-false"
                                }`}
                            >
                              {customer.status.state5 ? "เรียบร้อย" : "ไม่เรียบร้อย"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="status-price-container">
                    <div className="">
                      ราคาโดยประมาณ {customer.totalCost} บาท
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="all-done">
                <div className="all-done1">ส่งมอบรถเรียบร้อย</div>
                <div className="all-done2">
                  สามารถดูรายละเอียดที่ประวัติการซ่อม
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-result">
          {searchQuery.trim() === ""
            ? "กรุณาป้อนเบอร์โทรศัพท์"
            : "กรุณาป้อนเบอร์โทรศัพท์ให้ถูกต้อง"}
        </div>
      )}
    </div>
  );
};

export default StartPage;