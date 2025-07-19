export default {
    template: `
        <button 
            :class="{
            'boder rounded px-5 py-2 disabled:cursor-not-allowed': true, 
            'bg-blue-200 hover:bg-gray-400': type == 'primary',  
            'bg-purple-200 hover:bg-gray-400': type == 'secondary',  
            'bg-gray-200 hover:bg-gray-400': type == 'muted',
            'is-processing': processing == true  
            }"
            :disabled="processing">
            <slot />
        </button>
    `
    ,
    data () {
        return {
           // processing: true 
        }
    },
    props: {
        type: {
            type: String,
            default: "primary"
        },
        processing: {
            type: Boolean,
            default: false  
        } 
    },
    mounted() {
        //alert('hellow')
    },
    methods () {

    },
    computed () {

    },
}