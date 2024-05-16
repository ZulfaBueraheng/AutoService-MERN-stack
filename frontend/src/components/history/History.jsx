import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pagination } from "@mui/material";
import "./History.scss";
import TextField from "@mui/material/TextField";

function History() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [numPlate, setNumPlate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadCustomers();
    loadServices();
    toggleShowAll();
  }, []);

  useEffect(() => {
    toggleShowAll();
  }, [customers]);

  const loadCustomers = async () => {
    try {
      const response = await axios.get("https://autoservice-k7ez.onrender.com/repairs");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customer data:", error);
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

  const navigateToReceipt = (customerId) => {
    const receiptUrl = `/receipt/${customerId}`;
    window.location.href = receiptUrl;
  };

  const getServiceNameById = (serviceId) => {
    const matchedService = services.find(
      (service) => service.serviceName === serviceId
    );
    return matchedService ? matchedService.serviceName : "ไม่พบบริการ";
  };

  const startDateObject = new Date("${startDate}T00:00:00");
  const endDateObject = new Date("${endDate}T23:59:59");

  const filterAndSortCustomers = () => {
    const startDateObject = startDate
      ? new Date(`${startDate}T00:00:00`)
      : null;
    const endDateObject = endDate ? new Date(`${endDate}T23:59:59`) : null;

    const filteredAndSortedCustomers = customers
      .filter((customer) => {
        const customerEndDate = new Date(customer.enddate);
        const currentDate = new Date();

        const isWithinDateRange =
          (!startDate || customerEndDate >= startDateObject) &&
          (!endDate || customerEndDate <= endDateObject);

        return (
          isWithinDateRange &&
          (!numPlate || customer.car.numPlate.includes(numPlate)) &&
          customer.status.state5
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.enddate);
        const dateB = new Date(b.enddate);
        return dateB - dateA;
      });

    setSearchResults(filteredAndSortedCustomers);
    setTotalItems(filteredAndSortedCustomers.length);
    setCurrentPage(1);
  };

  const toggleShowAll = () => {
    setStartDate("");
    setEndDate("");
    setNumPlate("");
    filterAndSortCustomers();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      filterAndSortCustomers();
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (event, pageNumber) => setCurrentPage(pageNumber);

  const handlePaginationChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="history">
      <div className="history-head">
        <div className="history-history">ประวัติการซ่อม</div>
      </div>

      <div className="history-filter">
        <div className="history-filter-sub-con row">
          <div className="col1">
            <label htmlFor="numPlateInput">ค้นหาด้วยป้ายทะเบียน : </label>
            <TextField
              id="numPlateInput"
              type="text"
              value={numPlate}
              onChange={(e) => setNumPlate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="col2">
            <label htmlFor="startDateSelect">วันเริ่มต้น : </label>
            <TextField
              id="startDateSelect"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="col2">
            <label htmlFor="endDateSelect">วันสิ้นสุด : </label>
            <TextField
              id="endDateSelect"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div
            className="history-filterbutton"
            onClick={filterAndSortCustomers}
          >
            ค้นหา
          </div>
          <div className="history-filterbutton" onClick={toggleShowAll}>
            ทั้งหมด
          </div>
        </div>
      </div>
      <div className="history-result">
        ผลลัพธ์ที่ได้: {searchResults.length} รายการ
      </div>

      <div className="history-item">
        {currentItems.map((customer) => (
          <div
            className="history-customer row"
            onClick={() => navigateToReceipt(customer._id)}
            key={customer._id}
          >
            <div className="col-containner">
              <div className="history-detail">
                {customer.car.brand} {customer.car.selectedModel}{" "}
                {customer.car.color} {customer.car.numPlate}
              </div>
              <div>
                รายการซ่อม :
                {customer.services.map((service, serviceIndex) => (
                  <div className="history-repair" key={serviceIndex}>
                    {getServiceNameById(service.serviceName)}
                  </div>
                ))}
              </div>
            </div>
            <div className="history-date col">
              <div>วันที่รับรถ : {customer.startdate}</div>
              <div>วันที่ส่งมอบรถ : {customer.enddate}</div>
              <div>ชื่อลูกค้า : {customer.customer.customerName}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <Pagination
          count={Math.ceil(searchResults.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePaginationChange}
        />
        <div className="history-pagination-detail">
          Showing {indexOfFirstItem + 1} to{" "}
          {indexOfLastItem > totalItems ? totalItems : indexOfLastItem} of{" "}
          {totalItems} items
        </div>
      </div>
    </div>
  );
}

export default History;