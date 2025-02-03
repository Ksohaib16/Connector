import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { AuthHeader } from '../components/AuthHeader';
import { AuthForm } from '../components/AuthForm';
import { AuthWrapper } from '../components/wrapper/AuthWrapper';
import { useState } from 'react';
import { validateLoginForm } from '../utility/validateForm';
import { app } from '../config/Firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { MainWrapper } from '../components/wrapper/MainWrapper';
import { ContentWrapper } from '../components/wrapper/ContentWrapper';
import { config } from '../config/api.config';

const auth = getAuth(app);

const authDetails = {
    heading: 'Connector',
    subHeading: 'Please confirm you email and password',
};

const inputDetails = [
    { type: 'text', placeholder: 'Email', name: 'email', icon: Mail },
    { type: 'password', placeholder: 'Password', name: 'password', icon: Lock },
];

interface FormErrors {
    [key: string]: string;
}

//function
export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((currData) => {
            return { ...currData, [e.target.name]: e.target.value };
        });
        setErrors({});
    };

    const loginUser = async (email: string) => {
        const user = auth.currentUser;
        const token = await user?.getIdToken();

        const response = await axios.post(
            `${config.API_URL}/api/v1/auth/login`,
            {
                email,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        const userData = response.data;
        setFormData({
            email: '',
            password: '',
        });
        return userData;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateLoginForm(formData);
        console.log('newError', newErrors);
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            try {
                setIsLoggingIn(true);
                await signInWithEmailAndPassword(auth, formData.email, formData.password);

                const userData = await loginUser(formData.email);
                if (!userData) {
                    return;
                }
                console.log(userData, userData.status);
                dispatch(setUser(userData.data.user));
                navigate('/home');
            } catch {
                setErrors((prev) => ({
                    ...prev,
                    password: 'Invalid email or password',
                }));
            } finally {
                setIsLoggingIn(false);
            }
        }
    };

    return (
        <MainWrapper>
            <ContentWrapper>
                <AuthWrapper>
                    <AuthHeader heading={authDetails.heading} subHeading={authDetails.subHeading} />
                    <AuthForm
                        errors={errors}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        values={formData}
                        inputDetails={inputDetails}
                        button={'LOG IN'}
                        isLoggin={isLoggingIn}
                    />
                    <div className="text-[#AAAAAA]">
                        Don't have an account? &nbsp;{' '}
                        <b className="text-[#3874c9]">
                            <Link to="/signup">Sign up</Link>
                        </b>
                    </div>
                </AuthWrapper>
            </ContentWrapper>
        </MainWrapper>
    );
};
