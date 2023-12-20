import { Avatar as MUIAvatar, Badge, Button, IconButton, Stack, TextField, Typography, useTheme } from '@mui/material';
import { GoChevronLeft } from 'react-icons/go';
import { IoCameraOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { stateType } from '../../store/interface';
import { useState } from 'react';
import { EditAvatarDialog } from '../../components/dialog/EditAvatarDialog';
import { useFormik } from 'formik';
import { editProfileSchema } from '../../schemas/Scheme';
const initialErrors = {
    displayName: '',
    about: '',
};
export default function Profile() {
    const navigate = useNavigate();
    const theme = useTheme();
    const { displayName, avatar } = useSelector((state: stateType) => state.auth);
    //
    const [openEditAvatar, setOpenEditAvatar] = useState(false);
    // validate formik
    const { values, errors, handleBlur, handleChange } = useFormik({
        initialValues: {
            displayName: displayName,
            about: '',
        },
        initialErrors: initialErrors,
        validationSchema: editProfileSchema,
        onSubmit: undefined,
    });
    const [displayNameError, setDisplayNameError] = useState('');
    // handle edit profile

    const handleEditProfile = () => {
        if (errors.displayName) {
            setDisplayNameError(errors.displayName);
            return;
        }
        alert('hello');
    };
    const handleBlurCustom = (e: React.FocusEvent<HTMLInputElement>) => {
        setDisplayNameError(errors.displayName);
        handleBlur(e);
    };
    const handleChangeCustom = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayNameError('');
        handleChange(e);
    };
    // handle edit avatar
    const handleCloseEditAvatar = () => {
        setOpenEditAvatar(false);
    };

    return (
        <Stack direction="row" width="100%">
            <Stack
                sx={{
                    height: '100vh',
                    width: 320,
                    backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.default,
                    boxShadow: '0px 0px 2px rgba(0,0,0,.25)',
                }}
            >
                {/* Header  */}
                <Stack p={1} direction="row" alignItems="center" spacing={0.4}>
                    <IconButton
                        onClick={() => {
                            navigate('/app');
                        }}
                    >
                        <GoChevronLeft />
                    </IconButton>
                    <Typography variant="h6">Profile</Typography>
                </Stack>
                <Stack p={3.2} spacing={5}>
                    {/* Profile  */}
                    <Stack direction="row" justifyContent="center">
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        width: 22,
                                        height: 22,
                                        bgcolor: theme.palette.background.paper,
                                        borderRadius: '50%',

                                        cursor: 'pointer',
                                        boxShadow:
                                            'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                                    }}
                                    onClick={() => {
                                        setOpenEditAvatar(true);
                                    }}
                                >
                                    <IoCameraOutline size={16} />
                                </Stack>
                            }
                        >
                            <MUIAvatar alt="Travis Howard" src={avatar} sx={{ width: 84, height: 84 }} />
                        </Badge>
                    </Stack>
                    <TextField
                        fullWidth
                        label="Name"
                        id="fullWidth"
                        defaultValue={values.displayName}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            handleBlurCustom(e);
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            handleChangeCustom(e);
                        }}
                    />

                    <Typography
                        variant="body1"
                        fontSize={15}
                        color={displayNameError ? '#eb1e1e' : '#333'}
                        sx={{ m: '15px 0 0 0!important' }}
                    >
                        {displayNameError ? displayNameError : 'This name is visible to your contacts'}
                    </Typography>
                    <TextField fullWidth label="About" id="fullWidth" defaultValue={values.about} multiline rows={4} />
                    <Stack direction="row" justifyContent="end" width="100%">
                        <Button variant="outlined" sx={{ width: '40%' }} onClick={handleEditProfile}>
                            Save
                        </Button>
                    </Stack>
                </Stack>
            </Stack>

            {openEditAvatar && <EditAvatarDialog open={openEditAvatar} handleClose={handleCloseEditAvatar} />}
        </Stack>
    );
}
