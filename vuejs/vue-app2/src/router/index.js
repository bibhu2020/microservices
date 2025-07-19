import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import JobsView from '@/views/job/JobsView.vue';
import PageNotFoundView from '@/views/PageNotFoundView.vue';
import JobView from '@/views/job/JobView.vue';
import AddJobView from '@/views/job/AddJobView.vue';
import EditJobView from '@/views/job/EditJobView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/jobs',
            name: 'jobs',
            component: JobsView
        },
        {
            path: '/jobs/:id',
            name: 'job',
            component: JobView
        },
        {
            path: '/jobs/add',
            name: 'add-job',
            component: AddJobView,
        },
        {
            path: '/jobs/edit/:id',
            name: 'edit-job',
            component: EditJobView,
        },
        {
            path: '/:catchAll(.*)',
            name: 'notfound',
            component: PageNotFoundView
        }
    ]
});

export default router;