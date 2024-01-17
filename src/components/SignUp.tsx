import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Copyright from "./Copyright";
import api from "../api/notes";
import {
  alphabetRegex,
  emailRegex,
  passwordRegex,
  toastSignUpParams,
  toastPromiseOptions,
  toastErrorOptions,
} from "../utils/constants";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [nameIsValid, setNameIsValid] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => event.preventDefault();

  const navigate = useNavigate();

  const validateName = (name: string) => {
    let isValid;

    if (name === "") {
      setNameError("This is required.");
      setNameIsValid(true);
      isValid = false;
    } else if (!alphabetRegex.test(name)) {
      setNameError("Your name should not contain numbers.");
      setNameIsValid(true);
      isValid = false;
    } else if (name.trim().length < 3) {
      setNameError("Enter at least three characters.");
      setNameIsValid(true);
      isValid = false;
    } else {
      setNameError("");
      setNameIsValid(false);
      isValid = true;
    }

    return isValid;
  };

  const validateEmail = (email: string) => {
    let isValid;

    if (email === "") {
      setEmailError("This is required.");
      setEmailIsValid(true);
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter valid email address.");
      setEmailIsValid(true);
      isValid = false;
    } else {
      setEmailError("");
      setEmailIsValid(false);
      isValid = true;
    }

    return isValid;
  };

  const validatePassword = (password: string) => {
    let isValid;

    if (password === "") {
      setPasswordError("This is required.");
      setPasswordIsValid(true);
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password requires at least 8 characters. Must contain at least 1 uppercase letter, 1 lowercase letter and 1 number."
      );
      setPasswordIsValid(true);
      isValid = false;
    } else {
      setPasswordError("");
      setPasswordIsValid(false);
      isValid = true;
    }

    return isValid;
  };

  const validateForm = () => {
    return (
      validateName(name) && validateEmail(email) && validatePassword(password)
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === "name") {
      setName(event.target.value);
      validateName(event.target.value);
    } else if (event.target.id === "email") {
      setEmail(event.target.value);
      validateEmail(event.target.value);
    } else if (event.target.id === "password") {
      setPassword(event.target.value);
      validatePassword(event.target.value);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = { name, email, password };
    const formIsValid = validateForm();

    if (formIsValid) {
      const promise = api.post("auth/signup", data).then((res) => {
        console.log(res.status);

        setName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          toast.loading("Redirecting to login page...", {
            position: toast.POSITION.TOP_CENTER,
          });
        }, 3000);

        setTimeout(() => {
          navigate("/login");
        }, 5000);
      });

      toast
        .promise(promise, toastSignUpParams, toastPromiseOptions)
        .catch((err) => {
          const errorMessage = err.response
            ? err.response.data.message
            : err.message;

          toast.error(errorMessage, toastErrorOptions);
        });
    }
  };

  return (
    <>
      <ToastContainer hideProgressBar />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            padding: 2,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <NotesOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create an account
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  autoComplete="name"
                  id="name"
                  name="name"
                  label="Name"
                  onChange={handleChange}
                  onBlur={() => validateName(name)}
                  value={name}
                  helperText={nameError}
                  error={nameIsValid}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  margin="dense"
                  autoComplete="email"
                  id="email"
                  name="email"
                  label="Email Address"
                  onChange={handleChange}
                  onBlur={() => validateEmail(email)}
                  value={email}
                  helperText={emailError}
                  error={emailIsValid}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  error={passwordIsValid}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    autoComplete="password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    onBlur={() => validatePassword(password)}
                    value={password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText id="error">{passwordError}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  sx={{ fontWeight: "bold", textDecoration: "none" }}
                  onClick={() => navigate("/login")}
                >
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </>
  );
};

export default SignUp;
