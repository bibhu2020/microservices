import AssignmentList from "./AssignmentList.js";
import AssignmentCreate from "./AssignmentCreate.js";

export default {
    components: {
        'assignment-list': AssignmentList,
        'assignment-create': AssignmentCreate
    },
    template: `
        <section class="flex gap-8">
            <assignment-list 
                title="In Progress" 
                :assignments="filters.inProgress">
                    <assignment-create @add="add"></assignment-create>
            </assignment-list>

            <assignment-list 
                v-if="showCompleted"
                title="Completed"
                @emit="show = false" 
                :assignments="filters.completed" 
                @toggle="showCompleted = !showCompleted"
                can-toggle>
            </assignment-list>
        </section>
    `,
    data() {
        return {
            assignments: [],
            showCompleted: true
        }
    },
    computed: {
        filters(){
            return {
                inProgress: this.assignments.filter(a => !a.complete),
                completed: this.assignments.filter(a => a.complete)
            }
        },
    },
    //lifecycle event hook
    created() {
        fetch('https://monitoringapi-f2e7htfsfre5gzft.b01.azurefd.net/api/assignments')
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            this.assignments = data.assignments;
        });
    },
    methods: {
        add (newvalue) {
            this.assignments.push({
                id: this.assignments.length +1,
                name: newvalue,
                complete: false,
                tag: 'english' 
            });
        }
    }
}