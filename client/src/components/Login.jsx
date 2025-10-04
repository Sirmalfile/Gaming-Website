import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        try {
            if (state === "forget") {
                // 🔹 call forget password API
                const { data } = await axios.post("/api/user/forget", {
                    email,
                    newPassword: password,
                });

                if (data.success) {
                    toast.success(data.message);
                    setState("login"); // go back to login after reset
                } else {
                    toast.error(data.message);
                }
                return;
            }

            // 🔹 normal login/register
            const { data } = await axios.post(`/api/user/${state}`, {
                name,
                email,
                password,
            });

            if (data.success) {
                navigate("/");
                setUser(data.user);
                setShowUserLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div
            onClick={() => setShowUserLogin(false)}
            className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
        >
            <form
                onSubmit={onSubmitHandler}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span>{" "}
                    {state === "login"
                        ? "Login"
                        : state === "register"
                            ? "Sign Up"
                            : "Forgot Password"}
                </p>

                {/* 🔹 Register shows name */}
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="type here"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                            type="text"
                            required
                        />
                    </div>
                )}

                {/* 🔹 Email input always required */}
                <div className="w-full ">
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="email"
                        required
                    />
                </div>

                {/* 🔹 Password shown for login, register, and forget (as "new password") */}
                <div className="w-full ">
                    <p>{state === "forget" ? "New Password" : "Password"}</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="type here"
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                        type="password"
                        required
                    />
                </div>

                {/* 🔹 Switch links */}
                {state === "register" && (
                    <p>
                        Already have an account?{" "}
                        <span
                            onClick={() => setState("login")}
                            className="text-primary cursor-pointer"
                        >
                            Click here
                        </span>
                    </p>
                )}

                {state === "login" && (
                    <p>
                        Create an account?{" "}
                        <span
                            onClick={() => setState("register")}
                            className="text-primary cursor-pointer"
                        >
                            Click here
                        </span>{" "}
                        |{" "}
                        <span
                            onClick={() => setState("forget")}
                            className="text-primary cursor-pointer"
                        >
                            Forgot Password?
                        </span>
                    </p>
                )}

                {state === "forget" && (
                    <p>
                        Remembered your password?{" "}
                        <span
                            onClick={() => setState("login")}
                            className="text-primary cursor-pointer"
                        >
                            Back to login
                        </span>
                    </p>
                )}

                <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register"
                        ? "Create Account"
                        : state === "login"
                            ? "Login"
                            : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default Login;
