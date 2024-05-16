import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Report.scss";
import moment from "moment";
import DonutChart from "./DonutChart";
import BarChartPerMonth from "./BarChartPerMonth";
import BarChartPerDay from "./BarChartPerDay";
import TextField from "@mui/material/TextField";

function Report() {
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [dayOn, setDayOn] = useState([]);
  const [weekOn, setWeekOn] = useState([]);
  const [monthOn, setMonthOn] = useState([]);
  const [yearOn, setYearOn] = useState([]);
  const [date, setDate] = useState([]);
  const [week, setWeek] = useState(moment().format("YYYY-[W]WW"));
  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);
  const [showServiceDetails, setShowServiceDetails] = useState({});
  const [showServiceDetailsByMechanic, setShowServiceDetailsByMechanic] =
    useState({});
  const [
    showServiceDetailsByMechanicDate,
    setShowServiceDetailsByMechanicDate,
  ] = useState({});

  useEffect(() => {
    loadCustomers();
    loadServices();
    loadMechanics();
    handleDayClick();
  }, []);

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

  const loadMechanics = async () => {
    try {
      const response = await axios.get("https://autoservice-k7ez.onrender.com/employees");
      setMechanics(response.data);
    } catch (error) {
      console.error("Error loading mechanics:", error);
    }
  };

  const handleDayClick = () => {
    const currentDate = moment().format("YYYY-MM-DD");
    setDate(currentDate);
    setDayOn(true);
    setWeekOn(false);
    setMonthOn(false);
    setYearOn(false);
  };

  const handleWeekClick = () => {
    const currentWeek = moment().startOf("isoWeek").format("YYYY-[W]WW");
    setWeek(currentWeek);

    setDayOn(false);
    setWeekOn(true);
    setMonthOn(false);
    setYearOn(false);
  };

  const handleMonthClick = () => {
    const currentMonth = moment().format("YYYY-MM");
    setMonth(currentMonth);
    setDayOn(false);
    setWeekOn(false);
    setMonthOn(true);
    setYearOn(false);
  };

  const handleYearClick = () => {
    const currentYear = moment().format("YYYY");
    setYear(currentYear);
    setDayOn(false);
    setWeekOn(false);
    setMonthOn(false);
    setYearOn(true);
  };

  //********************-----------DAY-----------********************//
  //CAR-DAY
  const handlePreviousDateClick = () => {
    const previousDate = moment(date).subtract(1, "day").format("YYYY-MM-DD");
    setDate(previousDate);
    setShowServiceDetails(false);
  };

  const handleNextDateClick = () => {
    const nextDate = moment(date).add(1, "day").format("YYYY-MM-DD");
    setDate(nextDate);
    setShowServiceDetails(false);
  };

  const countCarsWithStartDateDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carsWithStartDatePerDay = {};
    customers.forEach((customer) => {
      const customerStartDate = moment(customer.startdate);
      if (customerStartDate >= start && customerStartDate <= end) {
        const dateString = customerStartDate;
        if (carsWithStartDatePerDay[dateString]) {
          carsWithStartDatePerDay[dateString]++;
        } else {
          carsWithStartDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithStartDatePerDay;
  };

  const carsWithStartDateDate = countCarsWithStartDateDate();
  const sumCarsWithStartDateDate = Object.values(carsWithStartDateDate).reduce(
    (sum, count) => sum + count,
    0
  );

  const countCarsWithOutEndDateDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carsWithOutEndDate = {};

    let currentDate = moment(start);
    while (currentDate <= end) {
      const dateString = currentDate.format("YYYY-MM-DD");

      const count = customers.reduce((accumulator, customer) => {
        const customerStartDate = moment(customer.startdate).startOf("day");
        const customerEndDate = customer.enddate
          ? moment(customer.enddate).startOf("day")
          : null;

        if (
          customerStartDate.isSameOrBefore(currentDate, "day") &&
          (!customerEndDate || customerEndDate.isAfter(currentDate, "day"))
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDate[dateString] = count;

      currentDate.add(1, "day");

      if (currentDate.isAfter(moment(), "day") || currentDate > end) {
        break;
      }
    }

    return carsWithOutEndDate;
  };

  const carsWithOutEndDateDate = countCarsWithOutEndDateDate();

  const lastDateDate = Object.keys(carsWithOutEndDateDate).pop();
  const lastValueDate = carsWithOutEndDateDate[lastDateDate];

  const countCarsWithEndDateDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carsWithEndDatePerDay = {};
    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (customerEndDate >= start && customerEndDate <= end) {
        const dateString = customerEndDate;
        if (carsWithEndDatePerDay[dateString]) {
          carsWithEndDatePerDay[dateString]++;
        } else {
          carsWithEndDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithEndDatePerDay;
  };

  const carsWithEndDateDate = countCarsWithEndDateDate();
  const sumCarsWithEndDateDate = Object.values(carsWithEndDateDate).reduce(
    (sum, count) => sum + count,
    0
  );

  //COST-DAY

  const countTotalCostDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filteredCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalCostPerDay = {};

    filteredCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalCostPerDay[dateString]) {
        totalCostPerDay[dateString] += customer.totalCost;
      } else {
        totalCostPerDay[dateString] = customer.totalCost;
      }
    });

    return totalCostPerDay;
  };

  const totalCostPerDayDate = countTotalCostDate();

  const countTotalFeeDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalFeePerDay[dateString]) {
        totalFeePerDay[dateString] += customer.serviceFee;
      } else {
        totalFeePerDay[dateString] = customer.serviceFee;
      }
    });

    return totalFeePerDay;
  };

  const totalFeePerDayDate = countTotalFeeDate();

  const countTotalSpareDate = () => {
    const totalSparePerDay = {};

    Object.keys(totalCostPerDayDate).forEach((date) => {
      if (totalFeePerDayDate[date]) {
        totalSparePerDay[date] =
          totalCostPerDayDate[date] - totalFeePerDayDate[date];
      }
    });

    return totalSparePerDay;
  };

  const totalSparePerDayDate = countTotalSpareDate();

  const sumTotalCostDate = Object.values(totalCostPerDayDate).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalSpareDate = Object.values(totalSparePerDayDate).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalFeeDate = Object.values(totalFeePerDayDate).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const countServiceDate = () => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const servicesUsed = {};

    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      ) {
        customer.services.forEach((service) => {
          const serviceName = service.serviceName;
          if (!servicesUsed[serviceName]) {
            servicesUsed[serviceName] = [];
          }
          servicesUsed[serviceName].push({
            carBrand: customer.car.brand,
            selectedModel: customer.car.selectedModel,
          });
        });
      }
    });

    return servicesUsed;
  };

  const servicesUsedDate = countServiceDate();

  const getServiceDate = (serviceName) => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const carModelCounts = {};
    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = moment(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  //MECHANIC-DAY
  const countServicesByMechanicDate = (mechanicId) => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );

    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = service.serviceName;
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName]++;
        } else {
          serviceCounts[serviceName] = 1;
        }
      });
    });

    return serviceCounts;
  };

  const getServiceCountsByCarModelDate = (mechanicId, serviceName) => {
    const start = moment(`${date}T00:00:00`);
    const end = moment(`${date}T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });
    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  const toggleServiceDetailsByMechanicDate = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanicDate((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };

  //********************-----------WEEK-----------********************//
  //CAR-WEEK
  const handlePreviousWeekClick = () => {
    const previousWeek = moment(week, "YYYY-WW").subtract(1, "week");
    const previousYear = previousWeek.isoWeekYear();
    const previousWeekNumber = previousWeek
      .isoWeek()
      .toString()
      .padStart(2, "0");
    const previousYearWeek = `${previousYear}-W${previousWeekNumber}`;

    setWeek(previousYearWeek);
    setShowServiceDetails(false);
  };

  const handleNextWeekClick = () => {
    const nextWeek = moment(week, "YYYY-WW").add(1, "week");
    const nextYear = nextWeek.isoWeekYear();
    const nextWeekNumber = nextWeek.isoWeek().toString().padStart(2, "0");
    const nextYearWeek = `${nextYear}-W${nextWeekNumber}`;

    setWeek(nextYearWeek);
    setShowServiceDetails(false);
  };

  const countCarsWithStartDateWeek = () => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const carsWithStartDatePerDay = {};
    customers.forEach((customer) => {
      const customerStartDate = moment(customer.startdate);
      if (customerStartDate >= start && customerStartDate <= end) {
        const dateString = customerStartDate.toISOString().split("T")[0];
        if (carsWithStartDatePerDay[dateString]) {
          carsWithStartDatePerDay[dateString]++;
        } else {
          carsWithStartDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithStartDatePerDay;
  };

  const carsWithStartDateWeek = countCarsWithStartDateWeek();
  const sumCarsWithStartDateWeek = Object.values(carsWithStartDateWeek).reduce(
    (sum, count) => sum + count,
    0
  );

  const countCarsWithOutEndDateWeek = () => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const carsWithOutEndDate = {};

    let currentDate = moment(start);
    while (currentDate <= end) {
      const dateString = currentDate.format("YYYY-MM-DD");

      const count = customers.reduce((accumulator, customer) => {
        const customerStartDate = moment(customer.startdate).startOf("day");
        const customerEndDate = customer.enddate
          ? moment(customer.enddate).startOf("day")
          : null;

        if (
          customerStartDate.isSameOrBefore(currentDate, "day") &&
          (!customerEndDate || customerEndDate.isAfter(currentDate, "day"))
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDate[dateString] = count;

      currentDate.add(1, "day");

      if (currentDate.isAfter(moment(), "day") || currentDate > end) {
        break;
      }
    }

    return carsWithOutEndDate;
  };

  const carsWithOutEndDateWeek = countCarsWithOutEndDateWeek();

  const countCarsWithEndDateWeek = () => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const carsWithEndDatePerDay = {};

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (customerEndDate >= start && customerEndDate <= end) {
        const dateString = customerEndDate.toISOString().split("T")[0];
        if (carsWithEndDatePerDay[dateString]) {
          carsWithEndDatePerDay[dateString]++;
        } else {
          carsWithEndDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithEndDatePerDay;
  };

  const carsWithEndDateWeek = countCarsWithEndDateWeek();
  const sumCarsWithEndDateWeek = Object.values(carsWithEndDateWeek).reduce(
    (sum, count) => sum + count,
    0
  );

  const lastDateWeek = Object.keys(carsWithOutEndDateWeek).pop();
  const lastValueWeek = carsWithOutEndDateWeek[lastDateWeek];

  //COST-WEEK

  const countTotalCostWeek = () => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const filteredCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalCostPerDay = {};

    filteredCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalCostPerDay[dateString]) {
        totalCostPerDay[dateString] += customer.totalCost;
      } else {
        totalCostPerDay[dateString] = customer.totalCost;
      }
    });

    return totalCostPerDay;
  };

  const totalCostPerDayWeek = countTotalCostWeek();

  const countTotalFeeWeek = () => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalFeePerDay[dateString]) {
        totalFeePerDay[dateString] += customer.serviceFee;
      } else {
        totalFeePerDay[dateString] = customer.serviceFee;
      }
    });

    return totalFeePerDay;
  };

  const totalFeePerDayWeek = countTotalFeeWeek();

  const countTotalSpareWeek = () => {
    const totalSparePerDay = {};

    Object.keys(totalCostPerDayWeek).forEach((date) => {
      if (totalFeePerDayWeek[date]) {
        totalSparePerDay[date] =
          totalCostPerDayWeek[date] - totalFeePerDayWeek[date];
      }
    });

    return totalSparePerDay;
  };

  const totalSparePerDayWeek = countTotalSpareWeek();
  const sumTotalCostWeek = Object.values(totalCostPerDayWeek).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalSpareWeek = Object.values(totalSparePerDayWeek).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalFeeWeek = Object.values(totalFeePerDayWeek).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  //SERVICE-WEEK
  const countServiceWeek = () => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const servicesUsed = {};

    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      ) {
        customer.services.forEach((service) => {
          const serviceName = service.serviceName;
          if (!servicesUsed[serviceName]) {
            servicesUsed[serviceName] = [];
          }
          servicesUsed[serviceName].push({
            carBrand: customer.car.brand,
            selectedModel: customer.car.selectedModel,
          });
        });
      }
    });

    return servicesUsed;
  };

  const servicesUsedWeek = countServiceWeek();

  const toggleServiceDetailsWeek = (serviceName) => {
    setShowServiceDetails({
      ...showServiceDetails,
      [serviceName]: !showServiceDetails[serviceName],
    });
  };

  const getServiceWeek = (serviceName) => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();
    const carModelCounts = {};

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  //MECHANIC-WEEK
  const countServicesByMechanicWeek = (mechanicId) => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = service.serviceName;
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName]++;
        } else {
          serviceCounts[serviceName] = 1;
        }
      });
    });

    return serviceCounts;
  };

  const getServiceCountsByCarModelWeek = (mechanicId, serviceName) => {
    const start = moment(week).startOf("week").add(1, "day").toDate();
    const end = moment(week).endOf("week").add(1, "day").toDate();

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });
    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  const toggleServiceDetailsByMechanicWeek = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanic((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };

  //********************-----------MONTH-----------********************//
  //CAR-MONTH
  const previousMonth = moment(month).subtract(1, "month").format("YYYY-MM");
  const handlePreviousMonthClick = () => {
    setMonth(previousMonth);
    setShowServiceDetails(false);
  };

  const nextMonth = moment(month).add(1, "month").format("YYYY-MM");
  const handleNextMonthClick = () => {
    setMonth(nextMonth);
    setShowServiceDetails(false);
  };

  const countCarsWithStartDate = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = start
      .clone()
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    const carsWithStartDatePerDay = {};
    customers.forEach((customer) => {
      const customerStartDate = moment(customer.startdate);
      if (customerStartDate >= start && customerStartDate <= end) {
        const dateString = customerStartDate.toISOString().split("T")[0];
        if (carsWithStartDatePerDay[dateString]) {
          carsWithStartDatePerDay[dateString]++;
        } else {
          carsWithStartDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithStartDatePerDay;
  };

  const carsWithStartDate = countCarsWithStartDate();
  const sumCarsWithStartDate = Object.values(carsWithStartDate).reduce(
    (sum, count) => sum + count,
    0
  );

  const countCarsWithOutEndDate = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const carsWithOutEndDate = {};

    let currentDate = moment(start);
    while (currentDate <= end) {
      const dateString = currentDate.format("YYYY-MM-DD");

      const count = customers.reduce((accumulator, customer) => {
        const customerStartDate = moment(customer.startdate).startOf("day");
        const customerEndDate = customer.enddate
          ? moment(customer.enddate).startOf("day")
          : null;

        if (
          customerStartDate.isSameOrBefore(currentDate, "day") &&
          (!customerEndDate || customerEndDate.isAfter(currentDate, "day"))
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDate[dateString] = count;

      currentDate.add(1, "day");

      if (currentDate.isAfter(moment(), "day") || currentDate > end) {
        break;
      }
    }

    return carsWithOutEndDate;
  };

  const carsWithOutEndDate = countCarsWithOutEndDate();

  const lastDate = Object.keys(carsWithOutEndDate).pop();
  const lastValue = carsWithOutEndDate[lastDate];

  const countCarsWithEndDate = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const carsWithEndDatePerDay = {};

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (customerEndDate >= start && customerEndDate <= end) {
        const dateString = customerEndDate.toISOString().split("T")[0];
        if (carsWithEndDatePerDay[dateString]) {
          carsWithEndDatePerDay[dateString]++;
        } else {
          carsWithEndDatePerDay[dateString] = 1;
        }
      }
    });

    return carsWithEndDatePerDay;
  };

  const carsWithEndDate = countCarsWithEndDate();

  const sumCarsWithEndDate = Object.values(carsWithEndDate).reduce(
    (sum, count) => sum + count,
    0
  );

  //COST-MONTH
  const countTotalCost = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const filteredCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalCostPerDay = {};

    filteredCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalCostPerDay[dateString]) {
        totalCostPerDay[dateString] += customer.totalCost;
      } else {
        totalCostPerDay[dateString] = customer.totalCost;
      }
    });

    return totalCostPerDay;
  };

  const totalCostPerDay = countTotalCost();

  const countTotalFee = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerDay = {};

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM-DD");

      if (totalFeePerDay[dateString]) {
        totalFeePerDay[dateString] += customer.serviceFee;
      } else {
        totalFeePerDay[dateString] = customer.serviceFee;
      }
    });

    return totalFeePerDay;
  };

  const totalFeePerDay = countTotalFee();

  const countTotalSpare = () => {
    const totalSparePerDay = {};

    Object.keys(totalCostPerDay).forEach((date) => {
      if (totalFeePerDay[date]) {
        totalSparePerDay[date] = totalCostPerDay[date] - totalFeePerDay[date];
      }
    });

    return totalSparePerDay;
  };

  const totalSparePerDay = countTotalSpare();

  const sumTotalCost = Object.values(totalCostPerDay).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalSpare = Object.values(totalSparePerDay).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalFee = Object.values(totalFeePerDay).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const countService = () => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const servicesUsed = {};

    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      ) {
        customer.services.forEach((service) => {
          const serviceName = service.serviceName;
          if (!servicesUsed[serviceName]) {
            servicesUsed[serviceName] = [];
          }
          servicesUsed[serviceName].push({
            carBrand: customer.car.brand,
            selectedModel: customer.car.selectedModel,
          });
        });
      }
    });

    return servicesUsed;
  };

  const servicesUsed = countService();

  const toggleServiceDetails = (serviceName) => {
    setShowServiceDetails({
      ...showServiceDetails,
      [serviceName]: !showServiceDetails[serviceName],
    });
  };

  const getService = (serviceName) => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const carModelCounts = {};

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  //MECHANIC-MONTH
  const countServicesByMechanic = (mechanicId) => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = service.serviceName;
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName]++;
        } else {
          serviceCounts[serviceName] = 1;
        }
      });
    });

    return serviceCounts;
  };

  const getServiceCountsByCarModel = (mechanicId, serviceName) => {
    const start = moment(`${month}-01T00:00:00`);
    const end = moment(start).endOf("month");

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });
    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  const toggleServiceDetailsByMechanic = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanic((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };

  //********************-----------YEAR-----------********************//
  //CAR-YEAR
  const previousYear = moment(year).subtract(1, "year").format("YYYY");
  const handlePreviousYearClick = () => {
    setYear(previousYear);
    setShowServiceDetails(false);
  };

  const nextYear = moment(year).add(1, "year").format("YYYY");
  const handleNextYearClick = () => {
    setYear(nextYear);
    setShowServiceDetails(false);
  };

  const countCarsWithStartDateYear = () => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const carsWithStartDatePerMonth = {};
    customers.forEach((customer) => {
      const customerStartDate = moment(customer.startdate);
      if (customerStartDate >= start && customerStartDate <= end) {
        const dateString = customerStartDate.format("YYYY-MM");
        if (carsWithStartDatePerMonth[dateString]) {
          carsWithStartDatePerMonth[dateString]++;
        } else {
          carsWithStartDatePerMonth[dateString] = 1;
        }
      }
    });

    return carsWithStartDatePerMonth;
  };

  const carsWithStartDateYear = countCarsWithStartDateYear();

  const sumCarsWithStartDateYear = Object.values(carsWithStartDateYear).reduce(
    (sum, count) => sum + count,
    0
  );

  const countCarsWithOutEndDateYear = () => {
    const start = moment(`${year}-01-01T00:00:00`);
    let end = moment(`${year}-12-31T23:59:59`);

    if (moment() < end) {
      end = moment();
    }

    const carsWithOutEndDate = {};

    let currentMonth = moment(start).startOf("month");
    while (currentMonth.isSameOrBefore(end, "month")) {
      const monthString = currentMonth.format("YYYY-MM");

      const count = customers.reduce((accumulator, customer) => {
        const customerStartDate = moment(customer.startdate).startOf("day");
        const customerEndDate = customer.enddate
          ? moment(customer.enddate).startOf("day")
          : null;

        if (
          customerStartDate.isSameOrBefore(
            currentMonth.endOf("month"),
            "day"
          ) &&
          (!customerEndDate ||
            customerEndDate.isAfter(currentMonth.endOf("month"), "day"))
        ) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);

      carsWithOutEndDate[monthString] = count;

      currentMonth.add(1, "month");
    }

    return carsWithOutEndDate;
  };

  const carsWithOutEndDateYear = countCarsWithOutEndDateYear();

  const lastDateYear = Object.keys(carsWithOutEndDateYear).pop();
  const lastValueYear = carsWithOutEndDateYear[lastDateYear];

  const countCarsWithEndDateYear = () => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const carsWithEndDatePerMonth = {};

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (customerEndDate >= start && customerEndDate <= end) {
        const dateString = customerEndDate.format("YYYY-MM");
        if (carsWithEndDatePerMonth[dateString]) {
          carsWithEndDatePerMonth[dateString]++;
        } else {
          carsWithEndDatePerMonth[dateString] = 1;
        }
      }
    });

    return carsWithEndDatePerMonth;
  };

  const carsWithEndDateYear = countCarsWithEndDateYear();

  const sumCarsWithEndDateYear = Object.values(carsWithEndDateYear).reduce(
    (sum, count) => sum + count,
    0
  );

  //COST-YEAR

  const countTotalCostYear = () => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const filteredCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalCostPerMonth = {};

    filteredCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM");

      if (totalCostPerMonth[dateString]) {
        totalCostPerMonth[dateString] += customer.totalCost;
      } else {
        totalCostPerMonth[dateString] = customer.totalCost;
      }
    });

    return totalCostPerMonth;
  };

  const totalCostPerMonthYear = countTotalCostYear();

  const countTotalFeeYear = () => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const totalFeePerMonth = {};

    filterCustomers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);

      const dateString = customerEndDate.format("YYYY-MM");

      if (totalFeePerMonth[dateString]) {
        totalFeePerMonth[dateString] += customer.serviceFee;
      } else {
        totalFeePerMonth[dateString] = customer.serviceFee;
      }
    });

    return totalFeePerMonth;
  };

  const totalFeePerMonthYear = countTotalFeeYear();

  const countTotalSpareYear = () => {
    const totalSparePerMonthYear = {};

    Object.keys(totalCostPerMonthYear).forEach((date) => {
      if (totalFeePerMonthYear[date]) {
        totalSparePerMonthYear[date] =
          totalCostPerMonthYear[date] - totalFeePerMonthYear[date];
      }
    });

    return totalSparePerMonthYear;
  };

  const totalSparePerMonthYear = countTotalSpareYear();

  const sumTotalCostYear = Object.values(totalCostPerMonthYear).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalSpareYear = Object.values(totalSparePerMonthYear).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const sumTotalFeeYear = Object.values(totalFeePerMonthYear).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const countServiceYear = () => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const servicesUsed = {};

    customers.forEach((customer) => {
      const customerEndDate = moment(customer.enddate);
      if (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      ) {
        customer.services.forEach((service) => {
          const serviceName = service.serviceName;
          if (!servicesUsed[serviceName]) {
            servicesUsed[serviceName] = [];
          }
          servicesUsed[serviceName].push({
            carBrand: customer.car.brand,
            selectedModel: customer.car.selectedModel,
          });
        });
      }
    });

    return servicesUsed;
  };

  const servicesUsedYear = countServiceYear();

  const toggleServiceDetailsYear = (serviceName) => {
    setShowServiceDetails({
      ...showServiceDetails,
      [serviceName]: !showServiceDetails[serviceName],
    });
  };

  const getServiceYear = (serviceName) => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const carModelCounts = {};

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    filterCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  //MECHANIC-MONTH
  const countServicesByMechanicYear = (mechanicId) => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });

    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const serviceCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceName = service.serviceName;
        if (serviceCounts[serviceName]) {
          serviceCounts[serviceName]++;
        } else {
          serviceCounts[serviceName] = 1;
        }
      });
    });

    return serviceCounts;
  };

  const getServiceCountsByCarModelYear = (mechanicId, serviceName) => {
    const start = moment(`${year}-01-01T00:00:00`);
    const end = moment(`${year}-12-31T23:59:59`);

    const filterCustomers = customers.filter((customer) => {
      const customerEndDate = new Date(customer.enddate);
      return (
        customerEndDate >= start &&
        customerEndDate <= end &&
        customer.status.state5
      );
    });
    const mechanicCustomers = filterCustomers.filter((customer) =>
      customer.mechanics.includes(mechanicId)
    );
    const carModelCounts = {};

    mechanicCustomers.forEach((customer) => {
      customer.services.forEach((service) => {
        const serviceInfo = service.serviceName;
        const carInfo = `${customer.car.brand} ${customer.car.selectedModel}`;
        if (serviceInfo === serviceName) {
          if (carModelCounts[carInfo]) {
            carModelCounts[carInfo]++;
          } else {
            carModelCounts[carInfo] = 1;
          }
        }
      });
    });

    return carModelCounts;
  };

  const toggleServiceDetailsByMechanicYear = (mechanicId, serviceName) => {
    setShowServiceDetailsByMechanic((prevDetails) => ({
      ...prevDetails,
      [mechanicId]: {
        ...prevDetails[mechanicId],
        [serviceName]: !prevDetails[mechanicId]?.[serviceName],
      },
    }));
  };

  const allMonths = Array.from({ length: 12 }, (_, i) =>
    moment().month(i).year(year).format("YYYY-MM")
  );

  return (
    <div className="report">
      <div className="report-head-container">
        <div className="report-head">รายงานสรุป</div>
      </div>

      <div className="report-filter">
        <div
          className={`report-daily ${dayOn ? "active" : ""}`}
          onClick={handleDayClick}
        >
          วัน
        </div>
        <div
          className={`report-weekly ${weekOn ? "active" : ""}`}
          onClick={handleWeekClick}
        >
          สัปดาห์
        </div>
        <div
          className={`report-monthly ${monthOn ? "active" : ""}`}
          onClick={handleMonthClick}
        >
          เดือน
        </div>
        <div
          className={`report-yearly ${yearOn ? "active" : ""}`}
          onClick={handleYearClick}
        >
          ปี
        </div>
      </div>

      <div>
        {dayOn ? (
          <div>
            <div className="report-filtered-input">
              <div className="previous-arrow" onClick={handlePreviousDateClick}>
                <img src="./assets/image/previous.png" />
              </div>
              <TextField
                id="dateSelect"
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div className="next-arrow" onClick={handleNextDateClick}>
                <img src="./assets/image/next.png" />
              </div>
            </div>

            <div className="row">
              <div className="col-container">
                <div className="in-col-container">
                  <div className="title">สรุปจำนวนรถตลอดทั้งวัน</div>
                  <div className="car-container">
                    <div className="carWstart">
                      รถที่รับเข้ามา: {sumCarsWithStartDateDate}
                    </div>
                    <div className="carWend">
                      รถที่ส่งออก: {sumCarsWithEndDateDate}
                    </div>
                    <div className="carWOend">
                      รถที่ยังอยู่ในอู่: {lastValueDate}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-container">
                <div className="in-col-container">
                  <div className="title">สรุปรายได้ตลอดทั้งวัน</div>
                  <div className="total-flex">
                    <div className="totalcost">
                      รายได้ทั้งหมด : {sumTotalCostDate}
                    </div>
                    <div className="totalspare">
                      ค่าอะไหล่ : {sumTotalSpareDate}
                    </div>
                    <div className="totalfee">
                      ค่าบริการ : {sumTotalFeeDate}
                    </div>
                    <div className="donut">
                      <DonutChart
                        data={[
                          {
                            name: `ค่าอะไหล่ทั้งหมด`,
                            value: sumTotalSpareDate,
                            color: "#ac1c1b",
                          },
                          {
                            name: `ค่าบริการทั้งหมด`,
                            value: sumTotalFeeDate,
                            color: "#17395c",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <br></br>
            </div>
            <div className="row">
              <div className="col-container">
                <div className="reportrepair-table-container">
                  <div className="title">สรุปรายการซ่อมตลอดทั้งวัน</div>
                  <div className="table-container">
                    <table className="reportrepair-table">
                      <thead>
                        <tr>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(servicesUsedDate)
                          .sort((a, b) => b[1].length - a[1].length)
                          .map(([serviceName, index]) => (
                            <React.Fragment key={serviceName}>
                              <tr>
                                <td style={{ paddingLeft: "15px" }}>
                                  {serviceName}
                                  <img
                                    onClick={() =>
                                      toggleServiceDetails(serviceName)
                                    }
                                    src="./assets/image/down-arrow.png"
                                  />
                                </td>
                                <td>{servicesUsedDate[serviceName].length}</td>
                              </tr>
                              {showServiceDetails[serviceName] && (
                                <tr>
                                  <td colSpan={2}>
                                    {Object.entries(getServiceDate(serviceName))
                                      .sort((a, b) => b[1] - a[1])
                                      .map(([carModel, carModelCount]) => (
                                        <div key={carModel}>
                                          <table className="reportrepair-subrow">
                                            <tr>
                                              <td>{carModel}</td>
                                              <td style={{ width: "20%" }}>
                                                {carModelCount}
                                              </td>
                                              <td></td>
                                            </tr>
                                          </table>
                                        </div>
                                      ))}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-container">
                <div className="reportmechanic-table-container">
                  <div className="title">สรุปการซ่อมของช่างตลอดทั้งวัน</div>
                  <div className="table-container">
                    <table className="reportmechanic-table">
                      <thead>
                        <tr>
                          <th>ช่าง</th>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mechanics.map((mechanic) => {
                          const services = countServicesByMechanicDate(
                            mechanic.name
                          );

                          return (
                            <React.Fragment key={mechanic._id}>
                              {Object.keys(services)
                                .sort((a, b) => services[b] - services[a])
                                .map((serviceName, index) => {
                                  const carModelCounts = Object.entries(
                                    getServiceCountsByCarModelDate(
                                      mechanic.name,
                                      serviceName
                                    )
                                  );
                                  const serviceTotal = carModelCounts.reduce(
                                    (acc, [carModel, carModelCount]) =>
                                      acc + carModelCount,
                                    0
                                  );

                                  return (
                                    <tr key={`${mechanic._id}-${serviceName}`}>
                                      {index === 0 && (
                                        <td
                                          rowSpan={Object.keys(services).length}
                                        >
                                          {mechanic.name}
                                        </td>
                                      )}
                                      <td style={{ textAlign: "left" }}>
                                        {serviceName}
                                        <img
                                          onClick={() =>
                                            toggleServiceDetailsByMechanicDate(
                                              mechanic.name,
                                              serviceName
                                            )
                                          }
                                          src="./assets/image/down-arrow.png"
                                        />
                                        {showServiceDetailsByMechanicDate[
                                          mechanic.name
                                        ]?.[serviceName] && (
                                            <div>
                                              {carModelCounts
                                                .sort((a, b) => b[1] - a[1])
                                                .map(
                                                  ([carModel, carModelCount]) => (
                                                    <table className="reportmechanic-subrow">
                                                      <tr key={carModel}>
                                                        <td
                                                          style={{
                                                            paddingLeft: "20px",
                                                          }}
                                                        >
                                                          {carModel}
                                                        </td>
                                                        <td
                                                          style={{ width: "10%" }}
                                                        >
                                                          {carModelCount}
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  )
                                                )}
                                            </div>
                                          )}
                                      </td>
                                      <td>{serviceTotal}</td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div>
        {weekOn ? (
          <div>
            <div className="report-filtered-input">
              <div className="previous-arrow" onClick={handlePreviousWeekClick}>
                <img src="./assets/image/previous.png" />
              </div>
              <TextField
                id="weekSelect"
                label="Week"
                type="week"
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div className="next-arrow" onClick={handleNextWeekClick}>
                <img src="./assets/image/next.png" />
              </div>
            </div>
            <div className="row">
              <div className="col-container">
                <div className="in-col-container">
                  <div className="title">สรุปจำนวนรถตลอดทั้งสัปดาห์</div>
                  <div className="car-container">
                    <div className="carWstart">
                      รถที่รับเข้ามา: {sumCarsWithStartDateWeek}
                    </div>
                    <div className="carWend">
                      รถที่ส่งออก: {sumCarsWithEndDateWeek}
                    </div>
                    <div className="carWOend">
                      รถที่ยังอยู่ในอู่: {lastValueWeek}
                    </div>
                  </div>
                  <div>
                    <div className="title">
                      สรุปจำนวนรถแต่ละวันตลอดทั้งสัปดาห์
                    </div>
                    <div className="bar-container">
                      <BarChartPerDay
                        data1={{
                          name: "รถที่รับเข้ามา",
                          fill: "#ec407a",
                          ...carsWithStartDateWeek,
                        }}
                        data2={{
                          name: "รถที่ส่งออก",
                          fill: "#29b6f6",
                          ...carsWithEndDateWeek,
                        }}
                        data3={{
                          name: "รถที่ยังอยู่ในอู่",
                          fill: "#d7a421",
                          ...carsWithOutEndDateWeek,
                        }}
                        data4={carsWithOutEndDateWeek}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-container">
                <div className="in-col-container">
                  <div className="title">สรุปรายได้ตลอดทั้งสัปดาห์</div>
                  <div className="total-flex">
                    <div className="totalcost">
                      รายได้ทั้งหมด : {sumTotalCostWeek}
                    </div>
                    <div className="totalspare">
                      ค่าอะไหล่ : {sumTotalSpareWeek}
                    </div>
                    <div className="totalfee">
                      ค่าบริการ : {sumTotalFeeWeek}
                    </div>
                    <div className="donut">
                      <DonutChart
                        data={[
                          {
                            name: `ค่าอะไหล่ทั้งหมด`,
                            value: sumTotalSpareWeek,
                            color: "#ac1c1b",
                          },
                          {
                            name: `ค่าบริการทั้งหมด`,
                            value: sumTotalFeeWeek,
                            color: "#17395c",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="title">
                      สรุปรายได้แต่ละวันตลอดทั้งสัปดาห์
                    </div>
                    <div className="bar-container">
                      <BarChartPerDay
                        data1={{
                          name: "รายได้ทั้งหมด",
                          fill: "#688f4e",
                          ...totalCostPerDayWeek,
                        }}
                        data2={{
                          name: "ค่าอะไหล่",
                          fill: "#ac1c1b",
                          ...totalFeePerDayWeek,
                        }}
                        data3={{
                          name: "ค่าบริการ",
                          fill: "#17395c",
                          ...totalSparePerDayWeek,
                        }}
                        data4={carsWithOutEndDateWeek}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-container">
                <div className="reportrepair-table-container">
                  <div className="title">สรุปรายการซ่อมตลอดทั้งสัปดาห์</div>
                  <div className="table-container">
                    <table className="reportrepair-table">
                      <thead>
                        <tr>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(servicesUsedWeek)
                          .sort((a, b) => b[1].length - a[1].length)
                          .map(([serviceName, index]) => (
                            <React.Fragment key={serviceName}>
                              <tr>
                                <td style={{ paddingLeft: "15px" }}>
                                  {serviceName}
                                  <img
                                    onClick={() =>
                                      toggleServiceDetailsWeek(serviceName)
                                    }
                                    src="./assets/image/down-arrow.png"
                                  />
                                </td>
                                <td>{servicesUsedWeek[serviceName].length}</td>
                              </tr>
                              {showServiceDetails[serviceName] && (
                                <tr>
                                  <td colSpan={2}>
                                    {Object.entries(getServiceWeek(serviceName))
                                      .sort((a, b) => b[1] - a[1])
                                      .map(([carModel, carModelCount]) => (
                                        <div key={carModel}>
                                          <table className="reportrepair-subrow">
                                            <tr>
                                              <td>{carModel}</td>
                                              <td style={{ width: "20%" }}>
                                                {carModelCount}
                                              </td>
                                              <td></td>
                                            </tr>
                                          </table>
                                        </div>
                                      ))}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-container">
                <div className="reportmechanic-table-container">
                  <div className="title">สรุปการซ่อมของช่างตลอดทั้งสัปดาห์</div>
                  <div className="table-container">
                    <table className="reportmechanic-table">
                      <thead>
                        <tr>
                          <th>ช่าง</th>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mechanics.map((mechanic) => {
                          const services = countServicesByMechanicWeek(
                            mechanic.name
                          );

                          return (
                            <React.Fragment key={mechanic._id}>
                              {Object.keys(services)
                                .sort((a, b) => services[b] - services[a])
                                .map((serviceName, index) => {
                                  const carModelCounts = Object.entries(
                                    getServiceCountsByCarModelWeek(
                                      mechanic.name,
                                      serviceName
                                    )
                                  );
                                  const serviceTotal = carModelCounts.reduce(
                                    (acc, [carModel, carModelCount]) =>
                                      acc + carModelCount,
                                    0
                                  );

                                  return (
                                    <tr key={`${mechanic._id}-${serviceName}`}>
                                      {index === 0 && (
                                        <td
                                          rowSpan={Object.keys(services).length}
                                        >
                                          {mechanic.name}
                                        </td>
                                      )}
                                      <td style={{ textAlign: "left" }}>
                                        {serviceName}
                                        <img
                                          onClick={() =>
                                            toggleServiceDetailsByMechanicWeek(
                                              mechanic.name,
                                              serviceName
                                            )
                                          }
                                          src="./assets/image/down-arrow.png"
                                        />
                                        {showServiceDetailsByMechanic[
                                          mechanic.name
                                        ]?.[serviceName] && (
                                            <div>
                                              {carModelCounts
                                                .sort((a, b) => b[1] - a[1])
                                                .map(
                                                  ([carModel, carModelCount]) => (
                                                    <table className="reportmechanic-subrow">
                                                      <tr key={carModel}>
                                                        <td
                                                          style={{
                                                            paddingLeft: "20px",
                                                          }}
                                                        >
                                                          {carModel}
                                                        </td>
                                                        <td
                                                          style={{ width: "10%" }}
                                                        >
                                                          {carModelCount}
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  )
                                                )}
                                            </div>
                                          )}
                                      </td>
                                      <td>{serviceTotal}</td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div>
        {monthOn ? (
          <div>
            <div className="report-filtered-input">
              <div
                className="previous-arrow"
                onClick={handlePreviousMonthClick}
              >
                <img src="./assets/image/previous.png" />
              </div>
              <TextField
                id="monthSelect"
                label="Month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div className="next-arrow" onClick={handleNextMonthClick}>
                <img src="./assets/image/next.png" />
              </div>
            </div>
            <div className="row">
              <div className="col-container">
                <div className="in-col-container">
                  <div>
                    <div className="title">สรุปจำนวนรถตลอดทั้งเดือน</div>
                    <div className="car-container">
                      <div className="carWstart">
                        รถที่รับเข้ามา: {sumCarsWithStartDate}
                      </div>
                      <div className="carWend">
                        รถที่ส่งออก: {sumCarsWithEndDate}
                      </div>
                      <div className="carWOend">
                        รถที่ยังอยู่ในอู่: {lastValue}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="title">
                      สรุปจำนวนรถแต่ละวันตลอดทั้งเดือน
                    </div>
                    <div className="bar-container">
                      <BarChartPerDay
                        data1={{
                          name: "รถที่รับเข้ามา",
                          fill: "#ec407a",
                          ...carsWithStartDate,
                        }}
                        data2={{
                          name: "รถที่ส่งออก",
                          fill: "#29b6f6",
                          ...carsWithEndDate,
                        }}
                        data3={{
                          name: "รถที่ยังอยู่ในอู่",
                          fill: "#d7a421",
                          ...carsWithOutEndDate,
                        }}
                        data4={carsWithOutEndDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-container">
                <div className="in-col-container">
                  <div className="title">สรุปรายได้ตลอดทั้งเดือน</div>
                  <div className="total-flex">
                    <div className="totalcost">
                      รายได้ทั้งหมด : {sumTotalCost}
                    </div>
                    <div className="totalspare">
                      ค่าอะไหล่ : {sumTotalSpare}
                    </div>
                    <div className="totalfee">ค่าบริการ : {sumTotalFee}</div>
                    <div className="donut">
                      <DonutChart
                        data={[
                          {
                            name: `ค่าอะไหล่ทั้งหมด`,
                            value: sumTotalSpare,
                            color: "#ac1c1b",
                          },
                          {
                            name: `ค่าบริการทั้งหมด`,
                            value: sumTotalFee,
                            color: "#17395c",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="title">สรุปรายได้แต่ละวันตลอดทั้งเดือน</div>
                    <div className="bar-container">
                      <BarChartPerDay
                        data1={{
                          name: "รายได้ทั้งหมด",
                          fill: "#688f4e",
                          ...totalCostPerDay,
                        }}
                        data2={{
                          name: "ค่าอะไหล่",
                          fill: "#ac1c1b",
                          ...totalFeePerDay,
                        }}
                        data3={{
                          name: "ค่าบริการ",
                          fill: "#17395c",
                          ...totalSparePerDay,
                        }}
                        data4={carsWithOutEndDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-container">
                <div className="reportrepair-table-container">
                  <div className="title">สรุปรายการซ่อมตลอดทั้งเดือน</div>
                  <div className="table-container">
                    <table className="reportrepair-table">
                      <thead>
                        <tr>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(servicesUsed)
                          .sort((a, b) => b[1].length - a[1].length)
                          .map(([serviceName, index]) => (
                            <React.Fragment key={serviceName}>
                              <tr>
                                <td style={{ paddingLeft: "15px" }}>
                                  {serviceName}
                                  <img
                                    onClick={() =>
                                      toggleServiceDetails(serviceName)
                                    }
                                    src="./assets/image/down-arrow.png"
                                  />
                                </td>
                                <td>{servicesUsed[serviceName].length}</td>
                              </tr>
                              {showServiceDetails[serviceName] && (
                                <tr>
                                  <td colSpan={2}>
                                    {Object.entries(getService(serviceName))
                                      .sort((a, b) => b[1] - a[1])
                                      .map(([carModel, carModelCount]) => (
                                        <div key={carModel}>
                                          <table className="reportrepair-subrow">
                                            <tr>
                                              <td>{carModel}</td>
                                              <td style={{ width: "20%" }}>
                                                {carModelCount}
                                              </td>
                                              <td></td>
                                            </tr>
                                          </table>
                                        </div>
                                      ))}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-container">
                <div className="reportmechanic-table-container">
                  <div className="title">สรุปการซ่อมของช่างตลอดทั้งเดือน</div>
                  <div className="table-container">
                    <table className="reportmechanic-table">
                      <thead>
                        <tr>
                          <th>ช่าง</th>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mechanics.map((mechanic) => {
                          const services = countServicesByMechanic(
                            mechanic.name
                          );

                          return (
                            <React.Fragment key={mechanic._id}>
                              {Object.keys(services)
                                .sort((a, b) => services[b] - services[a])
                                .map((serviceName, index) => {
                                  const carModelCounts = Object.entries(
                                    getServiceCountsByCarModel(
                                      mechanic.name,
                                      serviceName
                                    )
                                  );
                                  const serviceTotal = carModelCounts.reduce(
                                    (acc, [carModel, carModelCount]) =>
                                      acc + carModelCount,
                                    0
                                  );

                                  return (
                                    <tr key={`${mechanic._id}-${serviceName}`}>
                                      {index === 0 && (
                                        <td
                                          rowSpan={Object.keys(services).length}
                                        >
                                          {mechanic.name}
                                        </td>
                                      )}
                                      <td style={{ textAlign: "left" }}>
                                        {serviceName}
                                        <img
                                          onClick={() =>
                                            toggleServiceDetailsByMechanic(
                                              mechanic.name,
                                              serviceName
                                            )
                                          }
                                          src="./assets/image/down-arrow.png"
                                        />
                                        {showServiceDetailsByMechanic[
                                          mechanic.name
                                        ]?.[serviceName] && (
                                            <div>
                                              {carModelCounts
                                                .sort((a, b) => b[1] - a[1])
                                                .map(
                                                  ([carModel, carModelCount]) => (
                                                    <table className="reportmechanic-subrow">
                                                      <tr key={carModel}>
                                                        <td
                                                          style={{
                                                            paddingLeft: "20px",
                                                          }}
                                                        >
                                                          {carModel}
                                                        </td>
                                                        <td
                                                          style={{ width: "10%" }}
                                                        >
                                                          {carModelCount}
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  )
                                                )}
                                            </div>
                                          )}
                                      </td>
                                      <td>{serviceTotal}</td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div>
        {yearOn ? (
          <div>
            <div className="report-filtered-input">
              <div className="previous-arrow" onClick={handlePreviousYearClick}>
                <img src="./assets/image/previous.png" />
              </div>
              <TextField
                id="yearSelect"
                label="Year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <div className="next-arrow" onClick={handleNextYearClick}>
                <img src="./assets/image/next.png" />
              </div>
            </div>
            <div className="row">
              <div className="col-container">
                <div className="in-col-container">
                  <div>
                    <div className="title">สรุปจำนวนรถตลอดทั้งปี</div>
                    <div className="car-container">
                      <div className="carWstart">
                        รถที่รับเข้ามา: {sumCarsWithStartDateYear}
                      </div>
                      <div className="carWend">
                        รถที่ส่งออก: {sumCarsWithEndDateYear}
                      </div>
                      <div className="carWOend">
                        รถที่ยังอยู่ในอู่: {lastValueYear}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="title">สรุปจำนวนรถแต่ละเดือนตลอดทั้งปี</div>
                    <div className="bar-container">
                      <BarChartPerMonth
                        data1={{
                          data: carsWithStartDateYear,
                          name: "รถที่รับเข้ามา",
                          fill: "#ec407a",
                        }}
                        data2={{
                          data: carsWithEndDateYear,
                          name: "รถที่ส่งออก",
                          fill: "#29b6f6",
                        }}
                        data3={{
                          data: carsWithOutEndDateYear,
                          name: "รถที่ยังอยู่ในอู่",
                          fill: "#d7a421",
                        }}
                        allMonths={allMonths}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-container">
                <div className="in-col-container">
                  <div className="title">สรุปรายได้ตลอดทั้งปี</div>
                  <div className="total-flex">
                    <div className="totalcost">
                      รายได้ทั้งหมด : {sumTotalCostYear}
                    </div>
                    <div className="totalspare">
                      ค่าอะไหล่ : {sumTotalSpareYear}
                    </div>
                    <div className="totalfee">
                      ค่าบริการ : {sumTotalFeeYear}
                    </div>
                    <div className="donut">
                      <DonutChart
                        data={[
                          {
                            name: `ค่าอะไหล่ทั้งหมด`,
                            value: sumTotalSpareYear,
                            color: "#ac1c1b",
                          },
                          {
                            name: `ค่าบริการทั้งหมด`,
                            value: sumTotalFeeYear,
                            color: "#17395c",
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="title">สรุปรายได้แต่ละเดือนตลอดทั้งปี</div>
                    <div className="bar-container">
                      <BarChartPerMonth
                        data1={{
                          data: totalCostPerMonthYear,
                          name: "รายได้ทั้งหมด",
                          fill: "#688f4e",
                        }}
                        data2={{
                          data: totalSparePerMonthYear,
                          name: "ค่าอะไหล่",
                          fill: "#ac1c1b",
                        }}
                        data3={{
                          data: totalFeePerMonthYear,
                          name: "ค่าบริการ",
                          fill: "#17395c",
                        }}
                        allMonths={allMonths}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-container">
                <div className="reportrepair-table-container">
                  <div className="title">สรุปรายการซ่อมตลอดทั้งปี</div>
                  <div className="table-container">
                    <table className="reportrepair-table">
                      <thead>
                        <tr>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(servicesUsedYear)
                          .sort((a, b) => b[1].length - a[1].length)
                          .map(([serviceName, index]) => (
                            <React.Fragment key={serviceName}>
                              <tr>
                                <td style={{ paddingLeft: "15px" }}>
                                  {serviceName}
                                  <img
                                    onClick={() =>
                                      toggleServiceDetailsYear(serviceName)
                                    }
                                    src="./assets/image/down-arrow.png"
                                  />
                                </td>
                                <td>{servicesUsedYear[serviceName].length}</td>
                              </tr>
                              {showServiceDetails[serviceName] && (
                                <tr>
                                  <td colSpan={2}>
                                    {Object.entries(getServiceYear(serviceName))
                                      .sort((a, b) => b[1] - a[1])
                                      .map(([carModel, carModelCount]) => (
                                        <div key={carModel}>
                                          <table className="reportrepair-subrow">
                                            <tr>
                                              <td>{carModel}</td>
                                              <td style={{ width: "20%" }}>
                                                {carModelCount}
                                              </td>
                                              <td></td>
                                            </tr>
                                          </table>
                                        </div>
                                      ))}
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-container col-6">
                <div className="reportmechanic-table-container">
                  <div className="title">สรุปการซ่อมของช่างตลอดทั้งปี</div>
                  <div className="table-container">
                    <table className="reportmechanic-table">
                      <thead>
                        <tr>
                          <th>ช่าง</th>
                          <th>รายการซ่อม</th>
                          <th>จำนวน</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mechanics.map((mechanic) => {
                          const services = countServicesByMechanicYear(
                            mechanic.name
                          );

                          return (
                            <React.Fragment key={mechanic._id}>
                              {Object.keys(services)
                                .sort((a, b) => services[b] - services[a])
                                .map((serviceName, index) => {
                                  const carModelCounts = Object.entries(
                                    getServiceCountsByCarModelYear(
                                      mechanic.name,
                                      serviceName
                                    )
                                  );
                                  const serviceTotal = carModelCounts.reduce(
                                    (acc, [carModel, carModelCount]) =>
                                      acc + carModelCount,
                                    0
                                  );

                                  return (
                                    <tr key={`${mechanic._id}-${serviceName}`}>
                                      {index === 0 && (
                                        <td
                                          rowSpan={Object.keys(services).length}
                                        >
                                          {mechanic.name}
                                        </td>
                                      )}
                                      <td style={{ textAlign: "left" }}>
                                        {serviceName}
                                        <img
                                          onClick={() =>
                                            toggleServiceDetailsByMechanicYear(
                                              mechanic.name,
                                              serviceName
                                            )
                                          }
                                          src="./assets/image/down-arrow.png"
                                        />
                                        {showServiceDetailsByMechanic[
                                          mechanic.name
                                        ]?.[serviceName] && (
                                            <div>
                                              {carModelCounts
                                                .sort((a, b) => b[1] - a[1])
                                                .map(
                                                  ([carModel, carModelCount]) => (
                                                    <table className="reportmechanic-subrow">
                                                      <tr key={carModel}>
                                                        <td
                                                          style={{
                                                            paddingLeft: "20px",
                                                          }}
                                                        >
                                                          {carModel}
                                                        </td>
                                                        <td
                                                          style={{ width: "10%" }}
                                                        >
                                                          {carModelCount}
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  )
                                                )}
                                            </div>
                                          )}
                                      </td>
                                      <td>{serviceTotal}</td>
                                    </tr>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Report;