import Assignment from "./Assignment.js"
import AssignmentTags from "./AssignmentTags.js"
import Panel from "./Panel.js";


export default {
    components: {
        'assignment': Assignment,
        'assignment-tags': AssignmentTags,
        'panel': Panel
    },
    template: `
    <panel v-show="show && assignments.length" class="w-70"  theme="light">
        <div class="flex justify-between items-start">
            <h2 class="font-bold mb-2">
                {{title}}
                <span>({{assignments.length}})</span>
            </h2>
            <button v-show="canToggle" @click="$emit('toggle')"> &times;</button>
        </div>
        <assignment-tags
            :initial-tags="assignments.map(a => a.tag)" 
            v-model:current-tag="currentTag"
            />
        <ul class="border border-gray-600 divide-y divide-gray-600 mt-6">
            <assignment v-for="assignment in filteredAssignemnts"
                        :assignment="assignment" 
                        :key="assignment.id">
            </assignment>
        </ul>
        <slot></slot>
        <template v-slot:footer >
            my footer goes here
        </template>
    </panel>
    `,
    props: {
        assignments: Array,
        title: String,
        canToggle: {type: Boolean, default: false}
    },

    computed: {
        filteredAssignemnts() {
            if(this.currentTag == 'all') {
                return this.assignments;
            }
            return this.assignments.filter(a => a.tag == this.currentTag);
        },
    },
    data() {
        return {
            currentTag: 'all',
            show: true
        }
    }
}