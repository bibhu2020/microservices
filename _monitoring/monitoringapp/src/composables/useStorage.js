import {ref, watch} from 'vue';

export function useStorage (key, val = null) {

    let storedValue = read();
    if (storedValue) {
        val = ref(storedValue);
    }
    else {
        val = ref(val);
        write();
    }

    watch(val, write);

    function read() {
        return localStorage.getItem(key);
    }

    function write () {

        if(val.value == null || val.value == '' || val.value == 'null') {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, val.value);
        }
    }

    return val;
}

