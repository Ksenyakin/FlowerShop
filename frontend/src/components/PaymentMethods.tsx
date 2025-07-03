// src/components/PaymentMethods.tsx
import React from "react";
import './styles/PaymentMethods.css';

const methods = [
  { id: 'sbp', label: 'СБП' },
  { id: 'card', label: 'Visa/Mastercard/МИР' },
  { id: 'cod', label: 'Оплата при получении' },
];

const PaymentMethods: React.FC = () => (
  <div className="payment-methods">
    <h3>Способы оплаты</h3>
    {methods.map(method => {
      const enabled = method.id === 'cod';
      return (
        <label
          key={method.id}
          className={`payment-method ${enabled ? 'enabled' : 'disabled'}`}
        >
          <input
            type="checkbox"
            disabled={!enabled}
          />
          <span className="method-label">{method.label}</span>
          {!enabled && (
            <span className="tooltip">
              К сожалению, выбранный метод сейчас не доступен. Приносим извинения.
            </span>
          )}
        </label>
      );
    })}
  </div>
);

export default PaymentMethods;
