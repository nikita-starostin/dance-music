let setLocation: (location: string) => void;

export function initSetLocation(setLocationFn: (location: string) => void) {
    setLocation = setLocationFn;
}

export function navigate(location: string) {
    setLocation(location);
}

