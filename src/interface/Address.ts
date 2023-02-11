export interface Province {
    code: string,
    name: string
};

export interface City {
    code: string,
    name: string
    pCode: string
};

export interface Area {
    code: string,
    name: string
    pCode: string
    cCode: string
};

export interface Street {
    code: string,
    name: string
    pCode: string
    cCode: string
    aCode: string
};
