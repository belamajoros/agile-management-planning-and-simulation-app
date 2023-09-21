import React from 'react'
import '../../api/userApi';
import {registerUser} from "../../api/authApi";
import User from "../../classes/user";
import {useNavigate} from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {IconButton, InputAdornment, Modal} from "@mui/material";
import {FieldValues, useForm} from 'react-hook-form';
import {Visibility, VisibilityOff} from "@mui/icons-material";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 10,
    boxShadow: 24,
    p: 4,
};

type FormData = {
    email: string;
    username: string;
    password: string;
    password2: string;
};

export default function Register() {
    const [isValid, setIsValid] = React.useState(false);

    const [errorMessage, setErrorMessage] = React.useState<string>("");
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openDenied, setOpenDenied] = React.useState(false);
    const handleOpenSuccessModal = () => setOpenSuccess(true);
    const handleOpenDeniedModal = () => setOpenDenied(true);
    const handleCloseSuccessModal = () => setOpenSuccess(false);
    const handleCloseDeniedModal = () => setOpenDenied(false);

    const [values, setValues] = React.useState({
        showPassword1: false,
        showPassword2: false
    });

    const { register, watch, handleSubmit, formState: { errors } } = useForm<FormData>({
        mode: "onBlur"
    });

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const handleClickShowPassword1 = () => {
        setValues({
            ...values,
            showPassword1: !values.showPassword1
        });
    };
    const handleClickShowPassword2 = () => {
        setValues({
            ...values,
            showPassword2: !values.showPassword2
        });
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    let navigate = useNavigate();
    const navigateToPage = (path: string) => {
        navigate(path);
    }

    const onSubmit = async (data: FormData) => {
        const target = data;
        const user = new User(target.email, target.username, target.password, []);

        await registerUser(user).then((res) => {
            console.log(res)
            if (res.status === 201) {
                handleOpenSuccessModal();
            } else if (res.status === 401) {
                setErrorMessage("Email address is already in use! Please choose another one.");
                handleOpenDeniedModal();
            } else {
                setErrorMessage("Please review entered details or try later!");
                handleOpenDeniedModal();
            }
        });
    };
    const theme = createTheme();

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{m: 1, bgcolor: 'primary.main'}}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Register Form
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 3}}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        {...register("username", {maxLength: 45})}
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        autoFocus
                                        error={errors.username != undefined}
                                        helperText={errors.username != undefined  ? "Username is too long (max 45)!" : ''}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        placeholder="Email"
                                        {...register("email", { pattern: emailRegex})}
                                        id="email"
                                        label="Email Address"
                                        autoComplete="email"
                                        error={errors.email != undefined}
                                        helperText={errors.email != undefined ? 'Invalid Email format!' : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        {...register("password", {minLength: 8})}
                                        label="Password"
                                        type={values.showPassword1 ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="new-password"
                                        InputProps={{
                                            endAdornment :
                                            <InputAdornment position="end">
                                            <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword1}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            >
                                        {values.showPassword1 ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                            </InputAdornment>

                                        }}
                                        error={errors.password != undefined}
                                        helperText={errors.password != undefined  ? "Password is too short (min 8)!" : ''}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        {...register("password2",
                                            {
                                                validate: (val: string) => {
                                                    if (watch('password') != val) {
                                                        return "Passwords does not match !";
                                                    }
                                                },})}
                                        label="Password Again"
                                        type={values.showPassword2 ? 'text' : 'password'}
                                        id="password2"
                                        autoComplete="new-password"
                                        InputProps={{
                                            endAdornment :
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword2}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {values.showPassword2 ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>

                                        }}
                                        error={errors.password2 != undefined}
                                        helperText={errors.password2 != undefined  ? errors.password2.message : ''}

                                    />
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                            >
                                Register
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        Already have an account? Log-in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
            <Modal
                open={openSuccess}
                onClose={handleCloseSuccessModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{margin: '2%', textAlign: "center"}} id="modal-modal-title" variant="h5"
                                component="h2">
                        User has been successfully created!
                    </Typography>
                    <div style={{display: "flex", marginTop: '5%'}}>
                        <Button style={{display: "block", margin: "auto"}} size={"large"} variant="contained"
                                onClick={() => navigateToPage(`/login`)}>
                            Login
                        </Button>

                    </div>
                </Box>
            </Modal>
            <Modal
                open={openDenied}
                onClose={handleOpenDeniedModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography style={{margin: '2%', textAlign: "center"}} id="modal-modal-title" variant="h5"
                                component="h2">
                        {errorMessage}
                    </Typography>
                    <div style={{display: "flex", marginTop: '5%'}}>
                        <Button style={{display: "block", margin: "auto"}} size={"large"} variant="contained"
                                onClick={handleCloseDeniedModal}>
                            Close
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
        ;
}
