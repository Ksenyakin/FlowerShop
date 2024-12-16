import React, {useState} from 'react';
import './AuthForm.css';
import {useNavigate} from 'react-router-dom';
import {SmartCaptcha} from '@yandex/smart-captcha';

const RegisterForm: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        console.log('Отправка данных на сервер...');
        if (!captchaToken) {
            setError('Пожалуйста, подтвердите капчу.');
            setLoading(false);
            return;
        }
        const userData = {name, password, address, phone, email, captchaToken};
        console.log('Данные пользователя:', userData);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify(userData),
            });
            console.log('Ответ от сервера:', response.status);
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка регистрации:', errorData);
                setError(errorData.message || 'Ошибка при регистрации');
                return;
            }
            const data = await response.json();
            console.log('Ответ от сервера:', data);
            setSuccessMessage('Регистрация прошла успешно!');
            navigate('/login');
        } catch (err) {
            console.error('Ошибка при регистрации:', err);
            setError('Произошла ошибка. Пожалуйста, попробуйте снова.');
        }
    };
    return (<div className="form-container"><h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group"><label className="label" htmlFor="name">Имя пользователя:</label> <input
                type="text" id="name" className="input" value={name} onChange={(e) => setName(e.target.value)}
                required/></div>
            <div className="form-group"><label className="label" htmlFor="password">Пароль:</label> <input
                type="password" id="password" className="input" value={password}
                onChange={(e) => setPassword(e.target.value)} required/></div>
            <div className="form-group"><label className="label" htmlFor="address">Адрес:</label> <input type="text"
                                                                                                         id="address"
                                                                                                         className="input"
                                                                                                         value={address}
                                                                                                         onChange={(e) => setAddress(e.target.value)}
                                                                                                         required/>
            </div>
            <div className="form-group"><label className="label" htmlFor="phone">Телефон:</label> <input type="tel"
                                                                                                         id="phone"
                                                                                                         className="input"
                                                                                                         value={phone}
                                                                                                         onChange={(e) => setPhone(e.target.value)}
                                                                                                         required/>
            </div>
            <div className="form-group"><label className="label" htmlFor="email">Электронная почта:</label> <input
                type="email" id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)}
                required/></div>
            <div className="form-group"><label className="label">Капча:</label> <SmartCaptcha
                sitekey="ysc1_FnSemp2tf4wSb2BqTDqunLLWKl12cUJJB8cfSEOuf60e361d" // Ваш siteKey
                onSuccess={setCaptchaToken}
            /></div>
            <button type="submit" className="button">Зарегистрироваться</button>
            {/* Отображение сообщений об ошибке и успехе */}
            {error && <p className="error-message">{error}</p>} {successMessage &&
            <p className="success-message">{successMessage}</p>}
        </form>
    </div>);
};
export default RegisterForm;