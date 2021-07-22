import moment from "moment";

const getFormattedDateTime = (pattern: string) => {
    if (!pattern) {
        throw new Error("Format is required!");
    }
    return moment().format(pattern)
}

export {
    getFormattedDateTime
}