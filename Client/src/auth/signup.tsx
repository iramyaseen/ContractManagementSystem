import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailRegex, passwrodRegex } from "../utils/regex-validations";
import AxiosInstance from "../../axiosConfig";
import { authUser } from "../redux/userSlice";
import { useAppDispatch } from "../hooks/redux-hooks";
function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [signupFields, setSignupFields] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  });

  const onChangeInputs = (e: any) => {
    setSignupFields({ ...signupFields, [e.target.name]: e.target.value });
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setAuthError("");
    if (emailRegex.test(signupFields.email)) {
      if (passwrodRegex.test(signupFields.password)) {
        setLoading(true);
        try {
          const res = await AxiosInstance.post("/api/user/register", signupFields);
          console.log(res.data, 'signup data here...');
          
          if (res.status === 201) {
            dispatch(authUser(res.data));
            navigate("/");
          }
          setLoading(false);
        } catch (error: any) {
          setAuthError(error.response.data.message);
          setLoading(false);
        }

      } else {
        setAuthError("Password must contain alphabets and numerics \n Max length of password is 10 character");
      }

    } else {
      setAuthError("Email is not valid");
    }
  }

  return (
    <main>
      
      <div className="wrapper">
        
        <h1 className="title">SIGNUP</h1>
        
        <br />
        <span className="text-danger fw-bold">{authError}</span>
        
        <form>
          <div className="field">
            <input type="text" className='auth-input' name="name" value={signupFields.name} placeholder='Enter Your Name' onChange={onChangeInputs} />
          </div>
          <div className="field">
            <input type="email" className='auth-input' name="email" value={signupFields.email} placeholder='Enter Your Email' onChange={onChangeInputs} />
          </div>
          <div className="field">
            <input type="password" className='auth-input' name="password" value={signupFields.password} placeholder='Enter Password' onChange={onChangeInputs} />
          </div>
          <div className="field">
            <input type="password" className='auth-input' name="cpassword" value={signupFields.cpassword} placeholder='Confirm Password' onChange={onChangeInputs} />
          </div>
          <br />
          <br />
          <div className="field">
            <button className="auth-btn" disabled={loading} onClick={onSubmit}> {loading ? "loading..." : "Signup"}</button>
          </div>
          <br />
          <div className="signup-link">
            Already registered  <Link to={'/login'}>Login now</Link>
          </div>
        </form>
        
      </div>
      
    </main>
  );
}

export default Signup;