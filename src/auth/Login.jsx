import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast, { Toaster } from 'react-hot-toast';
import { auth, signInWithGooglePopup, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import GoogleIcon from '@mui/icons-material/Google';
import {
    collection,
    doc,
    setDoc,
} from "firebase/firestore";

const schema = yup.object().shape({
    email: yup.string().email().required('Please enter email address'),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .max(20, 'Password must not exceed 20 characters')
        .notOneOf([yup.ref('email'), null], 'Password must not be the same as your email address')
        .required('Please enter password'),
});

export default function Login() {
    const navigate = useNavigate();
    const usersCollectionRef = collection(db, "users");

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmitNew = async (data) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, data?.email, data?.password);
            const user = userCredential.user;

            const customDocumentId = user.email;
            const userDocRef = doc(usersCollectionRef, customDocumentId);

            await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                loginMethod: 'Email',
                createdAt: String(new Date()),
            });

            navigate('/');
        } catch (err) {
            toast.error(err.message || 'Something went wrong');
        }
    };

    const handleGoogleSignIn = async () => {
        const response = await signInWithGooglePopup();
        const user = response.user;

        const customDocumentId = user.email;
        const userDocRef = doc(usersCollectionRef, customDocumentId);

        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            loginMethod: 'Google',
            createdAt: String(new Date()),
        });

        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <Toaster />
            <form onSubmit={handleSubmit(onSubmitNew)} className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold mb-7 text-center mt-3 text-blue-900">Login</h2>

                <div className="mt-5">
                    <label htmlFor="email" className="text-sm font-semibold mb-1">Email</label>
                    <input
                        className="w-full px-3 py-2 border rounded"
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                    />
                    {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>}
                </div>

                <div className="mt-5">
                    <label htmlFor="password" className="text-sm font-semibold mb-1">Password</label>
                    <input
                        className="w-full px-3 py-2 border rounded"
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                    />
                    {errors?.password && <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>}
                </div>

                <div className="mt-8">
                    <button className="w-full px-3 py-2 text-white bg-blue-950 hover:bg-blue-900 rounded-md" type="submit">
                        <span className="text-sm">LOGIN</span>
                    </button>
                </div>

                <div className="mt-4">
                    <button
                        className="w-full px-3 py-2 text-slate-800 bg-white border border-slate-800 rounded-md"
                        type="button"
                        onClick={handleGoogleSignIn}
                    >
                        <span className="text-sm">SIGN IN WITH GOOGLE</span>
                        <span className="text-sm ml-3 text-blue-500"><GoogleIcon /></span>
                    </button>
                </div>

                <div className="mt-5 text-center">
                    <p className="text-[13px] text-slate-400 mt-1">
                        Don't have an account?
                        <button
                            type="button"
                            className="ml-1 font-semibold hover:text-blue-900 text-slate-700"
                            onClick={() => navigate('/auth/register')}
                        >
                            Register
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
