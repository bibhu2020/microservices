export default {
    template: `
    <div class="flex gap-2">
        <button 
            class="border rounded text-xs py-1 px-1" 
            :class="{
                'border-blue-500 text-blue-500': tag == currentTag
            }"
            v-for="tag in tags" 
            @click="$emit('update:currentTag', tag)"
            >{{ tag }}
        </button>
    </div>
    `,
    props: {
        initialTags: Array,
        currentTag: String
    },
    computed: {
        tags() {
            return ['all', ...new Set(this.initialTags)];
        }
    },
}