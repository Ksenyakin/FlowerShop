import React, { useState } from "react";
import "./styles/DeliveryInfo.css";

interface DeliveryInfoProps {
    onSubmit: (deliveryData: {
        address: string;
        phone: string;
        deliveryDate: string;
        timeSlot: string;
    }) => void;
}

const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ onSubmit }) => {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("09:00-12:00");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ address, phone, deliveryDate, timeSlot });
    };

    return (
        <div className="cart-container-order">
            <h3>Информация о доставке</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="address">Адрес доставки:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Телефон получателя:</label>
                    <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deliveryDate">Дата доставки:</label>
                    <input
                        type="date"
                        id="deliveryDate"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="timeSlot">Временной промежуток:</label>
                    <select
                        id="timeSlot"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        required
                    >
                        <option value="09:00-12:00">09:00 - 12:00</option>
                        <option value="12:00-15:00">12:00 - 15:00</option>
                        <option value="15:00-18:00">15:00 - 18:00</option>
                        <option value="18:00-21:00">18:00 - 21:00</option>
                    </select>
                </div>
                <button type="submit" className="save-button">
                    Сохранить
                </button>
            </form>
        </div>
    );
};

export default DeliveryInfo;
