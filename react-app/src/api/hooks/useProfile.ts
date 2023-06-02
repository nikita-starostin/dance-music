import {useAtom} from "jotai";
import {atomWithStorage} from "jotai/utils";
import {LocalStorageKeys} from "../../constants";

export interface IProfile {
    name: string;
    email: string;
    avatar: string;
    password: string;
}

const initialProfile = {
    name: 'John Doe',
    email: 'john@gmail.com',
    avatar: 'https://i.pravatar.cc/300',
    password: '111',
};

const profileAtom = atomWithStorage(LocalStorageKeys.Profile, initialProfile);

const profilesAtom = atomWithStorage(LocalStorageKeys.Profiles, [
    initialProfile,
]);

export function useProfile() {
    const [profile, setProfile] = useAtom(profileAtom);

    return {
        profile,
        setProfile,
    }
}

export function useProfiles() {
    const [profiles, setProfiles] = useAtom(profilesAtom);

    return {
        getProfileByEmail: (email: string) => profiles.find(p => p.email === email),
        addProfile: (profile: IProfile) => setProfiles([...profiles, profile]),
    }
}
