import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "./Home.scss";
import Modal from 'react-bootstrap/Modal';
import SelectMechanicModal from './selectmechanicmodal/SelectMechanicModal';
import StatusModal from './statusmodal/StatusModal';
import SelectSpareModal from './selectsparemodal/SelectSpareModal';
import SelectServiceModal from './selectservicemodal/SelectServiceModal';
import EditCarRegistrationModal from './editcarregistrationmodal/EditCarRegistrationModal';

const Repair = () => {
  const navigate = useNavigate();

  const [brandmodels, setBrandModels] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [colors, setColors] = useState([]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [editingCustomerId, setEditingCustomerId] = useState(null);

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
  const [enddate, setEndDate] = useState('');

  const [isFormEdited, setIsFormEdited] = useState(false);

  const [serviceFee, setServiceFee] = useState(0);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedSpareParts, setSelectedSpareParts] = useState([]);
  const [selectedSparePartsByService, setSelectedSparePartsByService] = useState({});
  const [selectedSparePartsForService, setSelectedSparePartsForService] = useState({});
  const [selectedMechanics, setSelectedMechanics] = useState([]);

  const [searchService, setSearchService] = useState('');
  const [serviceName, setServiceName] = useState('');

  const [searchSpare, setSearchSpare] = useState('');
  const [spareName, setSpareName] = useState('');
  const [sparePrice, setSparePrice] = useState('');

  const [searchMechanic, setSearchMechanic] = useState('');
  const [name, setName] = useState('');

  const [state1, setState1] = useState(true);
  const [state2, setState2] = useState(false);
  const [state3, setState3] = useState(false);
  const [state4, setState4] = useState(false);
  const [state5, setState5] = useState(false);

  const [showCarRigisterModal, setShowCarRigisterModal] = useState(false);
  const [showSelectServiceModal, setShowSelectServiceModal] = useState(false);
  const [showSparePartsModal, setShowSparePartsModal] = useState(false);
  const [showSelectMechanicModal, setShowSelectMechanicModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showConfirmBackModal, setShowConfirmBackModal] = useState(false);
  const [showConfirmDeleteCarModal, setShowConfirmDeleteCarModal] = useState(false);

  const [currentStepServiceId, setCurrentStepServiceId] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [uniqueCustomerNumplates, setUniqueCustomerNumplates] = useState([]);
  const [uniqueCustomerLineId, setUniqueCustomerLineId] = useState([]);
  const [uniqueCustomerNames, setUniqueCustomerNames] = useState([]);


  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState(null);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const [searchCar, setSearchCar] = useState('');

  const filteredCars = customers.filter((customer) => {
    return customer.car.numPlate.toLowerCase().includes(searchCar.toLowerCase()) ||
      customer.car.brand.toLowerCase().includes(searchCar.toLowerCase()) ||
      customer.car.selectedModel.toLowerCase().includes(searchCar.toLowerCase()) ||
      customer.car.selectedColor.toLowerCase().includes(searchCar.toLowerCase())
  });

  const handleToReceipt = (customerId) => {
    navigate(`/receipt/${customerId}`);
  };

  useEffect(() => {
    loadBrandModels();
    loadCustomers();
    loadServices();
    loadSpareParts();
    loadMechanics();
    loadColors();
  }, []);

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

  const loadCustomers = async () => {
    try {
      const response = await axios.get('https://autoservice-k7ez.onrender.com/repairs');
      setCustomers(response.data);

      const uniqueNumplates = [...new Set(response.data.map((customer) => customer.car.numPlate))];
      setUniqueCustomerNumplates(uniqueNumplates);

      const uniqueLinId = [...new Set(response.data.map((customer) => customer.customer.lineId))];
      setUniqueCustomerLineId(uniqueLinId);

      const uniqueNames = [...new Set(response.data.map((customer) => customer.customer.customerName))];
      setUniqueCustomerNames(uniqueNames);

      const selectedSparePartsByServiceInitial = {};
      response.data.forEach((customer) => {
        customer.services.forEach((service) => {
          const sparePartsData = service.spareParts.map((sparePart) => {
            return {
              sparePartId: sparePart.sparePartId,
              quantity: sparePart.quantity,
            };
          });
          selectedSparePartsByServiceInitial[service.serviceName] = sparePartsData;
        });
      });

      setSelectedSparePartsForService(selectedSparePartsByServiceInitial);

      setMessage('');
    } catch (error) {
      console.error('Error loading customer data:', error);
      setMessage('Error loading customer data');
    }
  };

  const loadServices = async () => {
    try {
      const response = await axios.get('https://autoservice-k7ez.onrender.com/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadSpareParts = async () => {
    try {
      const response = await axios.get('https://autoservice-k7ez.onrender.com/spares');
      setSpareParts(response.data);
    } catch (error) {
      console.error('Error loading spare parts:', error);
    }
  };

  const loadMechanics = async () => {
    try {
      const response = await axios.get('https://autoservice-k7ez.onrender.com/employees');
      setMechanics(response.data);
    } catch (error) {
      console.error('Error loading mechanics:', error);
    }
  };

  const handleSetDataCustomer = (customer) => {
    setNumPlate(customer.car.numPlate);
    setLineId(customer.customer.lineId);
    setBrand(customer.car.brand);
    setCustomerName(customer.customer.customerName);
    setPhoneNumber(customer.customer.phoneNumber);
    setSelectedModel(customer.car.selectedModel);
    setSelectedColor(customer.car.selectedColor);
    setStartDate(customer.startdate);
    setEndDate(customer.enddate);
    setServiceFee(customer.serviceFee)
    setState1(customer.status.state1);
    setState2(customer.status.state2);
    setState3(customer.status.state3);
    setState4(customer.status.state4);
    setState5(customer.status.state5);
  }

  const handleAddCustomerModalClose = () => {
    setShowCarRigisterModal(false);
    setIsFormEdited(false);
  };

  const handleUpdateCustomer = async (id) => {
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

    try {
      await axios.put(`https://autoservice-k7ez.onrender.com/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        enddate,
        services: selectedServices,
        state1,
        state2,
        state3,
        state4,
        state5,
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

      setShowCarRigisterModal(false);
      loadCustomers();
      window.location.reload();
    } catch (error) {
      console.error('Error updating customer:', error);
      setMessage('เกิดข้อผิดพลาดในการแก้ไขข้อมูล customer');
    }
  };

  const handleEditCustomer = (customer) => {
    handleSetDataCustomer(customer);
    setSelectedServices(customer.services);
    setEditingCustomerId(customer._id);
    setShowCarRigisterModal(true);
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

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(`https://autoservice-k7ez.onrender.com/repairs/${id}`);

      setShowConfirmDeleteCarModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      setMessage('เกิดข้อผิดพลาดในการลบข้อมูลลูกค้า');
    }
  };

  const handleEditRepairCar = (customer) => {
    handleSetDataCustomer(customer);
    setSelectedServices(customer.services.map(service => service.serviceName));

    const selectedSparePartsByServiceInitial = {};
    customer.services.forEach((service) => {
      selectedSparePartsByServiceInitial[service.serviceName] = service.spareParts;
    });

    setSelectedSparePartsForService(selectedSparePartsByServiceInitial);
    setSelectedSparePartsByService(selectedSparePartsByServiceInitial);
    setEditingCustomerId(customer._id);
    setShowSelectServiceModal(true);
  };

  const handleSelectServiceModalClose = () => {
    setCurrentStep(1);
    setShowSelectServiceModal(false);
    setSelectedSparePartsForService(selectedSparePartsForService);
    setSearchService('');
    setServiceName('');
    setIsFormEdited(false);
  };

  const handleSelectService = (serviceId) => {
    if (editingCustomerId) {
      const updatedSelectedServices = [...selectedServices];

      if (updatedSelectedServices.includes(serviceId)) {
        updatedSelectedServices.splice(updatedSelectedServices.indexOf(serviceId), 1);
      } else {
        updatedSelectedServices.push(serviceId);
      }

      setSelectedServices(updatedSelectedServices);
      setIsFormEdited(true);
    }
  };

  const handleAddService = async (id) => {
    try {
      const serviceCost = selectedServices.reduce((acc, serviceId) => {
        const sparePartsData = selectedSparePartsForService[serviceId]?.map((selectedSparePart) => {
          const sparePart = spareParts.find((sp) => sp.spareName === selectedSparePart.sparePartId);
          if (sparePart) {
            const quantity = selectedSparePart.quantity;
            const partCost = sparePart.sparePrice * quantity;
            return partCost;
          }
          return 0;
        }) || [];

        const serviceTotal = sparePartsData.reduce((sum, partCost) => sum + partCost, 0);

        return acc + serviceTotal;
      }, 0);

      let totalCost = parseFloat(serviceFee) + parseFloat(serviceCost);

      await axios.put(`https://autoservice-k7ez.onrender.com/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        enddate,
        services: selectedServices.map((serviceId) => {
          const sparePartsData = selectedSparePartsForService[serviceId]?.map((selectedSparePart) => {
            const sparePart = spareParts.find((sp) => sp.spareName === selectedSparePart.sparePartId);
            if (sparePart) {
              const quantity = selectedSparePart.quantity;
              const partCost = sparePart.sparePrice * quantity;
              const sparePartName = sparePart.spareName;
              return {
                sparePartId: sparePartName,
                quantity: selectedSparePart.quantity,
                partCost: partCost
              };
            }
            return null;
          }) || [];
          return {
            serviceName: serviceId,
            spareParts: sparePartsData.filter((part) => part !== null),
          };
        }),
        state1,
        state2,
        state3,
        state4,
        state5,
        serviceFee,
        totalCost,
      });

      setCurrentStep(1);
      setShowSelectServiceModal(false);
      loadCustomers();
    } catch (error) {
      console.error('Error adding service:', error);
      setMessage('เกิดข้อผิดพลาดในการเพิ่มบริการ');
    }
  };

  const handleSelectSparePartModalClose = () => {
    setShowSparePartsModal(false);
    setSelectedSparePartsByService(selectedSparePartsForService);
    setSearchSpare('');
    setSpareName('');
    setSparePrice('');
    setIsFormEdited(false);
  };

  const handleEditSpareParts = (service) => {
    const initialSelectedSpareParts = selectedSparePartsByService[service.serviceName] || [];
    setCurrentStepServiceId(service.serviceName);
    setSelectedSpareParts(initialSelectedSpareParts);
    setShowSparePartsModal(true);
  };

  const handleSelectSparePart = (sparepartId) => {
    if (currentStepServiceId) {
      const updatedSelectedSpareParts = [...selectedSpareParts];

      if (updatedSelectedSpareParts.some(sparePart => sparePart.sparePartId.toString() === sparepartId.toString())) {
        updatedSelectedSpareParts.splice(updatedSelectedSpareParts.findIndex(sparePart => sparePart.sparePartId.toString() === sparepartId.toString()), 1);
      } else {
        updatedSelectedSpareParts.push({ sparePartId: sparepartId, quantity: 1 });
      }

      setSelectedSpareParts(updatedSelectedSpareParts);

      setIsFormEdited(true);

      const updatedSelectedSparePartsByService = { ...selectedSparePartsByService };
      updatedSelectedSparePartsByService[currentStepServiceId] = updatedSelectedSpareParts;

      setSelectedSparePartsByService(updatedSelectedSparePartsByService);
    }
  };

  const handleSaveSpareParts = () => {
    setShowSparePartsModal(false);
    setCurrentStepServiceId(null);
    setSelectedSparePartsForService(selectedSparePartsByService);
    setSelectedSpareParts(selectedSpareParts);
  };

  const handleDeleteSparePart = (serviceId, sparePartId) => {
    const updatedSparePartsForService = { ...selectedSparePartsForService };
    const sparePartIndex = updatedSparePartsForService[serviceId]?.findIndex((sp) => sp.sparePartId === sparePartId);

    if (sparePartIndex !== -1) {
      updatedSparePartsForService[serviceId].splice(sparePartIndex, 1);
      setSelectedSparePartsForService(updatedSparePartsForService);
    }
  };

  const handleQuantityChange = (serviceId, sparePartId, newQuantity) => {
    const updatedSparePartsForService = { ...selectedSparePartsForService };
    const sparePartIndex = updatedSparePartsForService[serviceId]?.findIndex((sp) => sp.sparePartId === sparePartId);

    if (sparePartIndex !== -1) {
      updatedSparePartsForService[serviceId][sparePartIndex].quantity = parseInt(newQuantity, 10);
      setSelectedSparePartsForService(updatedSparePartsForService);
    }
  };

  const handleSelectMechanicModalClose = () => {
    setShowSelectMechanicModal(false);
    setSearchMechanic('');
    setName('');
    setIsFormEdited(false);
  };

  const handleEditMecanics = (customer) => {
    handleSetDataCustomer(customer);
    setSelectedServices(customer.services);
    setSelectedMechanics(customer.mechanics);
    setEditingCustomerId(customer._id);
    setShowSelectMechanicModal(true);
  };

  const handleSelectMechanic = (mechanicId) => {
    if (selectedMechanics.includes(mechanicId)) {
      setSelectedMechanics(selectedMechanics.filter(id => id !== mechanicId));
    } else {
      setSelectedMechanics([...selectedMechanics, mechanicId]);
    }

    setIsFormEdited(true);
  };

  const handleAddMechanic = async (id) => {
    try {
      await axios.put(`https://autoservice-k7ez.onrender.com/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        services: selectedServices,
        mechanics: selectedMechanics,
        state1,
        state2,
        state3,
        state4,
        state5,
      });
      setShowSelectMechanicModal(false);
      window.location.reload();
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการเพิ่มช่าง');
    }
  };

  const handleStatusModalClose = () => {
    setShowStatusModal(false);
  };

  const handleUpdateStatus = async (id) => {
    try {
      await axios.put(`https://autoservice-k7ez.onrender.com/repairs/${id}`, {
        numPlate,
        lineId,
        brand: customBrand || brand,
        customerName,
        phoneNumber,
        selectedModel: customModel || selectedModel,
        selectedColor: customColor || selectedColor,
        startdate,
        enddate,
        state1,
        state2,
        state3,
        state4,
        state5,
      });

      const repairResponse = await axios.get(`https://autoservice-k7ez.onrender.com/repairs/${id}`);
      const repairData = repairResponse.data.customer.lineId;
      const totalCost = repairResponse.data.totalCost !== null ? repairResponse.data.totalCost : '-';

      const lineIdResponse = await axios.get(`https://autoservice-k7ez.onrender.com/webhook`);
      const lineIdData = lineIdResponse.data;

      const filteredUserLineIds = lineIdData
        .filter(item => item.lineId === repairData)
        .map(item => item.userId);

      if (state1 && !state2) {
        const flexMessage = createFlexMessage('กำลังดำเนินการตรวจสภาพรถ 🔎🚗', numPlate, totalCost);

        filteredUserLineIds.forEach(async (userId) => {
          await sendFlexMessageToBackend(userId, flexMessage);
        });
      }

      if (state2 && !state3) {
        const flexMessage = createFlexMessage('กำลังดำเนินการหาอะไหล่ 🔩🔋', numPlate, totalCost);

        filteredUserLineIds.forEach(async (userId) => {
          await sendFlexMessageToBackend(userId, flexMessage);
        });
      }

      if (state3 && !state4) {
        const flexMessage = createFlexMessage('กำลังดำเนินการซ่อม 🔧⚙️🚗', numPlate, totalCost);

        filteredUserLineIds.forEach(async (userId) => {
          await sendFlexMessageToBackend(userId, flexMessage);
        });
      }

      if (state4 && !state5) {
        const flexMessage = createFlexMessage('ซ่อมเสร็จเรียบร้อย พร้อมส่งมอบรถ 🚘✨', numPlate, totalCost);

        filteredUserLineIds.forEach(async (userId) => {
          await sendFlexMessageToBackend(userId, flexMessage);
        });
      }

      if (state5) {
        const flexMessage = createFlexMessage('ส่งมอบรถสำเร็จ 📦✅', numPlate, totalCost);

        filteredUserLineIds.forEach(async (userId) => {
          await sendFlexMessageToBackend(userId, flexMessage);
        });
      }

      setShowStatusModal(false);
      loadCustomers();
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("เกิดข้อผิดพลาดในการแก้ไขสถานะ");
    }
  };

  const sendFlexMessageToBackend = async (userId, flexMessage) => {
    try {
      await axios.post('https://autoservice-k7ez.onrender.com/send-message', {
        userId,
        flexMessage,
      });
    } catch (error) {
      console.error('Error sending Flex Message to backend:', error);
    }
  };

  const createFlexMessage = (message, numPlate, totalCost) => {
    const flexMessage = {
      "type": "bubble",
      "direction": "ltr",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "M AUTO SERVICE",
            "weight": "bold",
            "color": "#000000",
            "wrap": true
          },
          {
            "type": "text",
            "text": numPlate,
            "color": "#000000",
            "wrap": true
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": message,
            "weight": "bold",
            "color": "#33cc00",
            "wrap": true
          },
          {
            "type": "text",
            "text": "ราคาโดยประมาณ " + totalCost + " บาท",
            "color": "#000000",
            "wrap": true
          }
        ]
      }
    };

    return flexMessage;
  };

  const handleEditStatus = (customer) => {
    handleSetDataCustomer(customer);
    setEditingCustomerId(customer._id);
    setSelectedCustomerStatus(customer);
    setShowStatusModal(true);
  };

  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  currentDate.setMinutes(currentDate.getMinutes() - offset);
  const formattedDate = currentDate.toISOString().slice(0, 16);

  const handleToggleState = (stateName) => {
    switch (stateName) {
      case "state2":
        setState2(!state2);
        break;
      case "state3":
        setState3(!state3);
        break;
      case "state4":
        setState4(!state4);
        break;
      case "state5":
        setState5(!state5);
        setEndDate(formattedDate);
        break;
      default:
        break;
    }
  };

  const handleConfirmBackModalClose = () => {
    setShowConfirmBackModal(false);
  };

  const handleConfirmDeleteCarModalClose = () => {
    setShowConfirmDeleteCarModal(false);
  };

  const handleShowConfirmDeleteCarModal = (customer) => {
    setEditingCustomerId(customer._id);
    setShowConfirmDeleteCarModal(true);
  }

  return (
    <div className="home-container">
      <div className='car-searchbox'>
        <input
          type="text"
          id="input-with-icon-adornment"
          value={searchCar}
          onChange={(e) => setSearchCar(e.target.value)}
          placeholder="ค้นหารถ"
        />
      </div>

      <div className='row'>
        <div className='col-8 repair-title-container'>
          <div className=" repair-title">
            รายการรถที่อยู่ในอู่ ณ ขณะนี้
          </div>
        </div>

        <div className='col-4 carregis-result'>
          ผลลัพธ์ที่ได้ {filteredCars.filter((customer) => !customer.status.state5).length} รายการ
        </div>
      </div>

      <table className="repair-table">
        <tbody>
          {filteredCars
            .filter((customer) => !customer.status.state5)
            .map((customer, index) => (
              <tr key={index}>
                <td className="repair-car" onClick={() => handleEditStatus(customer)}>
                  <div>
                    {customer.car.numPlate}
                  </div>
                  <div className='repair-car-detail'>
                    {customer.car.brand} {customer.car.selectedModel} {customer.car.selectedColor}
                  </div>
                </td>
                <td className="repait-edit">
                  <img onClick={() => handleEditCustomer(customer)} src='./assets/image/edit.png' />
                </td>
                <td className="repait-service" onClick={() => handleEditRepairCar(customer)}>
                  รายการซ่อม
                </td>
                <td className="repair-pay" onClick={() => handleToReceipt(customer._id)}>
                  ใบเสร็จ
                </td>
                <td className='repair-mechanic' onClick={() => handleEditMecanics(customer)}>
                  ช่าง
                </td>
                <td className='delete-carregis' onClick={() => handleShowConfirmDeleteCarModal(customer)}>
                  <img src='./assets/image/bin.png' />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Link className='carregis-button' to="/carregis">
        <div>
          เพิ่มรถ
        </div>
      </Link>


      <Modal
        className='confirmdeletecarmodal'
        show={showConfirmDeleteCarModal}
        onHide={handleConfirmDeleteCarModalClose}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ยืนยันการลบรถคันนี้ออกจากระบบ
        </Modal.Body>
        <Modal.Footer>
          <div className='button-no' onClick={handleConfirmDeleteCarModalClose}>
            NO
          </div>
          <div className='button-yes' onClick={() => handleDeleteCustomer(editingCustomerId)}>
            YES
          </div>
        </Modal.Footer>
      </Modal>

      <EditCarRegistrationModal
        showCarRigisterModal={showCarRigisterModal}
        handleAddCustomerModalClose={handleAddCustomerModalClose}
        message={message}
        error={error}
        numPlate={numPlate}
        lineId={lineId}
        brand={brand}
        customBrand={customBrand}
        setCustomBrand={setCustomBrand}
        brandmodels={brandmodels}
        customerName={customerName}
        selectedModel={selectedModel}
        customModel={customModel}
        phoneNumber={phoneNumber}
        selectedColor={selectedColor}
        customColor={customColor}
        startdate={startdate}
        handleBrandChange={handleBrandChange}
        uniqueCustomerNumplates={uniqueCustomerNumplates}
        uniqueCustomerNames={uniqueCustomerNames}
        uniqueCustomerLineId={uniqueCustomerLineId}
        handleModelChange={handleModelChange}
        handleColorChange={handleColorChange}
        colors={colors}
        setStartDate={setStartDate}
        handleUpdateCustomer={handleUpdateCustomer}
        editingCustomerId={editingCustomerId}
        setNumPlate={setNumPlate}
        setLineId={setLineId}
        setCustomerName={setCustomerName}
        setCustomModel={setCustomModel}
        setPhoneNumber={setPhoneNumber}
        setCustomColor={setCustomColor}
        setShowConfirmBackModal={setShowConfirmBackModal}
        showConfirmBackModal={showConfirmBackModal}
        handleConfirmBackModalClose={handleConfirmBackModalClose}
        isFormEdited={isFormEdited}
        setIsFormEdited={setIsFormEdited}
      />

      <SelectServiceModal
        showSelectServiceModal={showSelectServiceModal}
        handleSelectServiceModalClose={handleSelectServiceModalClose}
        currentStep={currentStep}
        services={services}
        handleNextStep={handleNextStep}
        selectedServices={selectedServices}
        handleSelectService={handleSelectService}
        selectedSparePartsForService={selectedSparePartsForService}
        serviceFee={serviceFee}
        handlePreviousStep={handlePreviousStep}
        handleEditSpareParts={handleEditSpareParts}
        spareParts={spareParts}
        handleQuantityChange={handleQuantityChange}
        handleDeleteSparePart={handleDeleteSparePart}
        setServiceFee={setServiceFee}
        handleAddService={handleAddService}
        editingCustomerId={editingCustomerId}
        loadServices={loadServices}
        isFormEdited={isFormEdited}
        setIsFormEdited={setIsFormEdited}
        searchService={searchService}
        setSearchService={setSearchService}
        serviceName={serviceName}
        setServiceName={setServiceName}
      />

      <SelectSpareModal
        showSparePartsModal={showSparePartsModal}
        handleSelectSparePartModalClose={handleSelectSparePartModalClose}
        spareParts={spareParts}
        handleSaveSpareParts={handleSaveSpareParts}
        selectedSparePartsByService={selectedSparePartsByService}
        currentStepServiceId={currentStepServiceId}
        handleSelectSparePart={handleSelectSparePart}
        loadSpareParts={loadSpareParts}
        isFormEdited={isFormEdited}
        setIsFormEdited={setIsFormEdited}
        searchSpare={searchSpare}
        setSearchSpare={setSearchSpare}
        spareName={spareName}
        setSpareName={setSpareName}
        sparePrice={sparePrice}
        setSparePrice={setSparePrice}
      />

      <SelectMechanicModal
        showSelectMechanicModal={showSelectMechanicModal}
        handleSelectMechanicModalClose={handleSelectMechanicModalClose}
        mechanics={mechanics}
        selectedMechanics={selectedMechanics}
        handleSelectMechanic={handleSelectMechanic}
        handleAddMechanic={handleAddMechanic}
        editingCustomerId={editingCustomerId}
        loadMechanics={loadMechanics}
        isFormEdited={isFormEdited}
        setIsFormEdited={setIsFormEdited}
        searchMechanic={searchMechanic}
        setSearchMechanic={setSearchMechanic}
        name={name}
        setName={setName}
      />

      <StatusModal
        showStatusModal={showStatusModal}
        handleStatusModalClose={handleStatusModalClose}
        selectedCustomerStatus={selectedCustomerStatus}
        state1={state1}
        state2={state2}
        state3={state3}
        state4={state4}
        state5={state5}
        setState2={setState2}
        setState3={setState3}
        setState4={setState4}
        setState5={setState5}
        handleToggleState={handleToggleState}
        handleUpdateStatus={handleUpdateStatus}
        editingCustomerId={editingCustomerId}
      />
    </div>
  );
};

export default Repair;