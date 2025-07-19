import Assignments from "./Assignments.js"

//register the components
export default {
    components: {
        'assignments': Assignments,
    },
    template: `
        <div class="grid gap-6">
            <assignments></assignments>
        </div>
    `
}