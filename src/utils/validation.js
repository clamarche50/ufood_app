export default {
    isEmptyOrBlank(str) {
        return !str || /^\s*$/.test(str);
    }
}