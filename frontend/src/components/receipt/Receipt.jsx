import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactToPrint from 'react-to-print';
import "./Receipt.scss";

const Receipt = () => {
    const { customerId } = useParams();

    const componentRef = useRef();

    const [customers, setCustomers] = useState([]);
    const [spareParts, setSpareParts] = useState([]);

    const [message, setMessage] = useState('');

    useEffect(() => {
        loadCustomers();
        loadSpareParts();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/repairs');
            setCustomers(response.data);

            setMessage('');
        } catch (error) {
            console.error('Error loading customer data:', error);
            setMessage('Error loading customer data');
        }
    };

    const loadSpareParts = async () => {
        try {
            const response = await axios.get('https://autoservice-k7ez.onrender.com/spares');
            setSpareParts(response.data);
        } catch (error) {
            console.error('Error loading spare parts:', error);
        }
    }

    const getPartPriceFromId = (sparePartId) => {
        const sparePart = spareParts.find(
            (sparePart) => sparePart.spareName === sparePartId
        );

        return sparePart
            ? `${sparePart.sparePrice}`
            : "ไม่พบราคา";
    };

    const customer = customers.find((c) => c._id === customerId);

    if (!customer) {
        return <div>ไม่พบข้อมูลลูกค้า</div>;
    }

    return (
        <div className='receipt'>
            <ReactToPrint
                trigger={() =>
                    <div className='receipt-print'>
                        <div className='receipt-printbutton'>
                            พิมพ์ใบเรียกเก็บเงิน
                        </div>
                    </div>
                }
                content={() => componentRef.current}
            />

            <div className='receipt-paper' ref={componentRef}>
                <div className='receipt-title'>ใบเรียกเก็บเงิน</div>

                <div className='row'>
                    <div className='col col-6 receipt-company'>
                        <div>ร้านเอ็มอะไหล่ยนต์</div>
                        <div>43/1 หมู่ 1 ตำบลยี่งอ อำเภอยี่งอ จังหวัดนราธิวาส 96180</div>
                        <div>ติดต่อ 080541xxxx</div>
                    </div>
                    <div className='col col-6'>
                        <div>คุณ{customer.customer.customerName}</div>
                        <div>เบอร์โทรศัพท์ : {customer.customer.phoneNumber}</div>
                        <div>Line ID : {customer.customer.lineId}</div>
                        <div>{customer.car.numPlate}</div>
                        <div>{customer.car.brand} {customer.car.selectedModel} {customer.car.selectedColor}</div>
                    </div>
                </div>

                <div className='row dateandmecha-row'>
                    <div className='col col-6'>
                        <div>เวลารับรถ : {customer.startdate}</div>
                        <div>เวลาส่งมอบ : {customer.enddate}</div>
                    </div>
                    <div className='col col-6'>
                        <div>ช่างที่เกี่ยวข้อง : </div>
                        {customer.mechanics.map((mechanicId) => (
                            <div className='receipt-mechanic' key={mechanicId}>
                                {mechanicId}
                            </div>
                        ))}
                    </div>
                </div>

                <table className='receipt-table'>
                    <thead>
                        <tr className='receipt-tablehead'>
                            <th>รายการ</th>
                            <th>จำนวน</th>
                            <th>หน่วยละ</th>
                            <th>จำนวนเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customer.services.map((service) => (
                            service.spareParts.map((sparePart) => (
                                <tr className='sparelast' key={sparePart.sparePartId}>
                                    <td>{sparePart.sparePartId}</td>
                                    <td>{sparePart.quantity}</td>
                                    <td>{getPartPriceFromId(sparePart.sparePartId)}</td>
                                    <td>{sparePart.partCost}</td>
                                </tr>
                            ))
                        ))}
                        <tr className='serviceFee-row'>
                            <td colSpan={3}>ค่าบริการ</td>
                            <td>{customer.serviceFee}</td>
                        </tr>
                        <tr>
                            <td colSpan={3}>รวม</td>
                            <td>{customer.totalCost}</td>
                        </tr>
                    </tbody>
                </table>

                <div className='receipt-thx'>
                    ----- ขอบคุณที่ใช้บริการ -----
                </div>
            </div>
        </div>
    );
};

export default Receipt;