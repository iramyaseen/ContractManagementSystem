import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosInstance from "../../axiosConfig";
import { authUser } from "../redux/userSlice";
import { emailRegex } from "../utils/regex-validations";
import { useAppDispatch } from "../hooks/redux-hooks";
function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState("");
    const [loginFields, setLoginFields] = useState({
        email: '',
        password: '',
    });

    const onChangeInputs = (e: any) => {
        setLoginFields({ ...loginFields, [e.target.name]: e.target.value });
    }
// AbCdEfG123
    const onSubmit = async (e: any) => {
        e.preventDefault();
        setAuthError("");
        if (emailRegex.test(loginFields.email)) {
            setLoading(true);
            try {
                const res = await AxiosInstance.post("/api/user/login", loginFields);
                console.log(res.data, 'login data here...');
                
                if (res.status === 200) {
                    dispatch(authUser(res.data));
                    navigate("/dashboard");
                }
                setLoading(false);
            } catch (error: any) {
                setAuthError(error.response.data.message);
                setLoading(false);
            }

        } else {
            setAuthError("Email is not valid");
        }
    }

    return (
        <main>
            
            <div className="wrapper">
                
                <h1 className="title">LOGIN</h1>
                
                <br />
                <span className="text-danger fw-bold">{authError}</span>
                
                <form>
                    <div className="field">
                        <input type="email" className='auth-input' name="email" value={loginFields.email} placeholder='Enter Your Email' onChange={onChangeInputs} />    
                    </div>
                    <div className="field">
                        <input type="password" className='auth-input' name="password" value={loginFields.password} placeholder='Enter Password' onChange={onChangeInputs} />                            
                    </div>
                    <br />
                    <br />
                    <div className="field">
                        <button className="auth-btn" disabled={loading} onClick={onSubmit}> {loading ? "loading..." : "Login"}</button>
                    </div>
                    <br />
                    <div className="signup-link">
                        If you are not registered <Link to={'/signup'}>Singup now</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Login;