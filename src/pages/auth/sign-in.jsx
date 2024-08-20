import React, { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { Input, Button, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "@/configs/firebase";
import { getDoc, doc } from "firebase/firestore";


export function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setErrorMessage("");  
    try {
      
      const userDocRef = doc(db, "users", username);
      const userDoc = await getDoc(userDocRef);

      if(!userDoc.exists()){
        alert("Username not found.");
        return;
      }

  
      const userData = userDoc.data();

      const email = userData.email;

      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard/home");

    } catch (error) {
      console.error("Error signing in:", error.message);
      setError("Failed to sign in. Please check your credentials and try again.");

      // Logging full error object
      console.log("Full error object:", error);

      // Handling different error cases
      switch (error.code) {
        case 'auth/invalid-credential':
          setErrorMessage("Invalid credentials. Please try again.");
          break;
        default:
          setErrorMessage("An error occurred. Please try again.");
      }
    }
  };
  
  return (
    <section className="m-8 flex">
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your Username and Password to sign in.</Typography>
        </div>
        <form onSubmit={handleSignIn} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            {errorMessage && (
              <Typography variant="small" color="red" className="mb-4">
                {errorMessage}
              </Typography>
            )}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Username
            </Typography>
            <Input
              size="lg"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            required/>
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            required/>
          </div>
          {error && <Typography color="red">{error}</Typography>}
          <Button className="mt-6" fullWidth type="submit">
            Sign In
          </Button>
        </form>
        <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Do not have an account?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">Register</Link>
          </Typography>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
