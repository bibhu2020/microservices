export default {
    template: `
        <form @submit.prevent="add">
            <div class="border border-gray-600 text-black flex">
                <input placeholder="New assignment..." class="p-2" v-model="newAssignment"/>
                <button type="submit" class="bg-white p-2 border-l">Add</button>
            </div>
        </form>
    `,
    props: {
        assignments: Array
    },
    data () {
        return {
            newAssignment: ''
        }
    },
    methods: {
        add(){
            //raise an event back to the parent
            this.$emit('add', this.newAssignment);
            this.newAssignment = '';
        }
    }
}