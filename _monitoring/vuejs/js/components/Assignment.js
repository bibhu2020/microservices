export default {
    template: `
    <li class="p-2 flex justify-between items-center ">
        <label>{{ assignment.name }}</label>
        <input type="checkbox" v-model="assignment.complete" class="ml-3">
    </li>
    `,
    props: {
        assignment: Object
    }
}