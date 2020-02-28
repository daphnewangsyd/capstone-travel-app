import {getDateDifference} from "../app";

describe('Test app.js', ()=>{
    test('The difference between 26 Feb 2020 and 28 Feb 2020 is 2 days', () => {
        const dateFrom = new Date("2020-02-26");
        const dateTo = new Date("2020-02-28");
        expect(getDateDifference(dateFrom, dateTo)).toBe(2);
    });
});
