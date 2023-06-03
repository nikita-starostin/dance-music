import {IProfile, useProfile, useProfiles} from "../api/hooks/useProfile";
import {useIsAuth} from "../state/auth.state";
import {useForm} from "react-hook-form";
import {useLocalization} from "../state/localization.state";
import {useEffect, useRef, useState} from "react";
import {FaArrowLeft, FaCheck} from "react-icons/all";
import {ClientRoutes, goToHome} from "../appRouting";
import {Link} from "wouter";

function useShowSavedForAWhile() {
    const [savedVisible, setSavedVisible] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const setVisibileTrueForAWhile = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setSavedVisible(true);
        timeoutRef.current = setTimeout(() => {
            setSavedVisible(false)
            timeoutRef.current = null;
        }, 3000);
    }
    return {savedVisible, setVisibileTrueForAWhile};
}

function ProfileInfo() {
    const {profile, setProfile} = useProfile();
    const [avatarLoaded, setAvatarLoaded] = useState(false);
    const {savedVisible, setVisibileTrueForAWhile} = useShowSavedForAWhile();
    const {l} = useLocalization();
    const {logout} = useIsAuth();
    const {register, getValues, handleSubmit} = useForm<IProfile>({
        defaultValues: profile,
    });

    const updateProfile = (data: IProfile) => {
        setVisibileTrueForAWhile();
        setProfile(data);
    };

    return <div data-visible={avatarLoaded}
                className="fixed-layout-container data-[visible=false]:hidden data-[visible=true]:visible">
        <div className="flex gap-2 flex-col">
            <Link to={ClientRoutes.Home}>
                <div role="button" className="cursor-pointer text-2xl">
                    <FaArrowLeft/>
                </div>
            </Link>
            <form onSubmit={handleSubmit(updateProfile)} className="flex flex-col gap-2 app-attract p-5">
                <div className="form-field">
                    <label>{l('Name')}</label>
                    <input className="text-black px-4 py-2" type="text" {...register('name')} />
                </div>
                <div className="form-field">
                    <label>{l('Email')}</label>
                    <input className="text-black px-4 py-2" type="text" {...register('email')} />
                </div>
                <div className="form-field">
                    <label>{l('Avatar')}</label>
                    <input className="text-black px-4 py-2" type="text" {...register('avatar')} />
                </div>
                <img src={getValues('avatar')} onLoad={() => {
                    setAvatarLoaded(true);
                }} alt={'Avatar image not found'}/>
                <div className="flex gap-2 items-start">
                    <div className="flex flex-col gap-2">
                        <button className="btn-primary">{l('Save')}</button>
                        {savedVisible && <div className="flex gap-2 items-center text-success animate-fadeOut">
                            <span>{l('Saved')}</span>
                            <FaCheck/>
                        </div>}
                    </div>
                    <button className="btn-secondary" type="button" onClick={logout}>{l('Logout')}</button>
                </div>
            </form>
        </div>
    </div>
}

interface ISignIn {
    email: string;
    password: string;
}

function SignInForm() {
    const {l} = useLocalization();
    const {login} = useIsAuth();
    const {setProfile} = useProfile();
    const {getProfileByEmail} = useProfiles();
    const {register, handleSubmit} = useForm<ISignIn>();
    const signIn = (values: ISignIn) => {
        const profile = getProfileByEmail(values.email);
        if (profile) {
            setProfile(profile)
            login();
            goToHome();
        }
    }
    return <form onSubmit={handleSubmit(signIn)} className="p-5 pt-0 flex flex-col gap-2">
        <div className="form-field">
            <label>{l('Email')}</label>
            <input className="text-black px-4 py-2" {...register('email')} type="text"/>
        </div>
        <div className="form-field">
            <label>{l('Password')}</label>
            <input className="text-black px-4 py-2" {...register('password')} type="password"/>
        </div>
        <button className="btn-primary py-1 mt-2">{l('SignIn')}</button>
    </form>
}

interface ISignUpFormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function SignUpForm() {
    const {l} = useLocalization();
    const {login} = useIsAuth();
    const {setProfile} = useProfile();
    const {addProfile} = useProfiles();
    const {register, handleSubmit} = useForm<ISignUpFormValues>();
    const signUp = (values: ISignUpFormValues) => {
        const profile = {
            name: values.name,
            email: values.email,
            password: values.password,
            avatar: '',
        }
        addProfile(profile);
        setProfile(profile);
        login();
        goToHome();
    }

    return <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit(signUp)} className="p-5 pt-0 flex flex-col gap-2">
            <div className="form-field">
                <label>{l('Name')}</label>
                <input className="text-black px-4 py-2" {...register('name')} type="text"/>
            </div>
            <div className="form-field">
                <label>{l('Email')}</label>
                <input className="text-black px-4 py-2" {...register('email')} type="text"/>
            </div>
            <div className="form-field">
                <label>{l('Password')}</label>
                <input className="text-black px-4 py-2" {...register('password')} type="password"/>
            </div>
            <div className="form-field">
                <label>{l('ConfirmPassword')}</label>
                <input className="text-black px-4 py-2" {...register('confirmPassword')} type="password"/>
            </div>
            <button className="btn-primary py-1 mt-2">{l('SignUp')}</button>
        </form>
    </div>
}

function SignInUpForm() {
    const {l} = useLocalization();
    const [tab, setTab] = useState<'signIn' | 'signUp'>('signIn');

    return <div
        className="fixed-layout-container">
        <div className="flex gap-2 flex-col">
            <Link to={ClientRoutes.Home}>
                <div role="button" className="cursor-pointer text-2xl">
                    <FaArrowLeft/>
                </div>
            </Link>
            <div className="app-attract w-[400px] mx-auto flex flex-col gap-5">
                <div className="flex border-b-white border-b-2 border-b-solid">
                    <button
                        className="p-3 text-center w-[50%] data-[active=true]:underline data-[active=true]:app-attract cursor-pointer"
                        data-active={tab === 'signIn'} onClick={() => setTab('signIn')}>{l('SignIn')}</button>
                    <button
                        className="p-3 text-center w-[50%] data-[active=true]:underline data-[active=true]:app-attract cursor-pointer"
                        data-active={tab === 'signUp'} onClick={() => setTab('signUp')}>{l('SignUp')}</button>
                </div>
                {tab === 'signIn' && <SignInForm/>}
                {tab === 'signUp' && <SignUpForm/>}
            </div>
        </div>
    </div>
}

export default function Profile() {
    const {isAuth} = useIsAuth();

    // on backspace go home
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Backspace') {
                goToHome();
            }
        }
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    });

    return isAuth ? <ProfileInfo/> : <SignInUpForm/>;
}
