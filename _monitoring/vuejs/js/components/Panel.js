export default {
    template: `
        <div :class="{
            'p-4 rounded-lg': true,
            'bg-gray-700 border-gray-600 text-white': theme == 'dark',
            'bg-white border-gray-300 text-black': theme == 'light'
        
            }">
            <h2 v-if="$slots.heading" class="font-bold">
                <slot name="heading"/>
            </h2>
            <!-- default slot-->
            <div>
                <slot />
            </div>
            <div v-if="$slots.footer">
                <slot name="footer"/>
            </div>
        </div>
    `,

    props: {
        theme: {type: String, default: 'dark'}
    }
   
}

