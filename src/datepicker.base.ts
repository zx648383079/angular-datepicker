interface IDay {
    disable: boolean,
    selected: boolean,
    val: number
};

enum DayMode {
    Day = 0,
    Year = 1,
    Hour = 2
};

export {
    IDay,
    DayMode
};
